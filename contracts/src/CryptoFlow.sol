// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import './interfaces/ICryptoFlow.sol';
import './interfaces/IUser.sol';
import './libs/Structs.sol';

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/utils/Pausable.sol';
import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';

contract CryptoFlow is ICryptoFlow, IUser, Pausable, ReentrancyGuard, Ownable {
    uint256 private _requestCount;
    mapping(uint256 => Structs.PaymentRequest) private _paymentRequests;
    mapping(address => uint256[]) private _senderToRequests;
    mapping(address => uint256[]) private _recipientToRequests;
    mapping(address => address[]) private _usersTokens;
    mapping(address => mapping(address => uint256)) private _usersBalance;
    mapping(address => mapping(address => uint256)) private _usersLockedAmount;

    constructor() Pausable() ReentrancyGuard() Ownable(msg.sender) {}

    receive() external payable {
        address addressThis = address(this);
        address sender = msg.sender;
        address[] memory userTokens = _usersTokens[sender];
        bool isFoundToken = false;
        for (uint256 i = 0; i < userTokens.length; i++) {
            if (userTokens[i] == addressThis) {
                isFoundToken = true;
                break;
            }
        }

        if (!isFoundToken) {
            _usersTokens[sender].push(addressThis);
        }

        _usersBalance[sender][addressThis] += msg.value;
        emit Receive(sender, msg.value);
    }

    function deposit(address _tokenAddress, uint256 _amount) external payable override whenNotPaused nonReentrant {
        require(_amount > 0, '_amount<=0');
        address sender = msg.sender;
        address[] memory userTokens = _usersTokens[sender];
        bool isFoundToken = false;
        for (uint256 i = 0; i < userTokens.length; i++) {
            if (userTokens[i] == _tokenAddress) {
                isFoundToken = true;
                break;
            }
        }

        if (!isFoundToken) {
            _usersTokens[sender].push(_tokenAddress);
        }

        if (_tokenAddress == address(this)) {
            _usersBalance[sender][_tokenAddress] += msg.value;
        } else {
            _usersBalance[sender][_tokenAddress] += _amount;
            IERC20(_tokenAddress).transferFrom(sender, address(this), _amount);
        }

        emit Deposit(sender, _tokenAddress, _amount);
    }

    function getSenderRequests() external view override returns (Structs.PaymentRequest[] memory) {
        uint256[] memory pr = _senderToRequests[msg.sender];
        Structs.PaymentRequest[] memory prArr = new Structs.PaymentRequest[](pr.length);
        for (uint256 i = 0; i < pr.length; i++) {
            prArr[i] = _paymentRequests[pr[i]];
        }

        return prArr;
    }

    function getRecipientRequests() external view override returns (Structs.PaymentRequest[] memory) {
        uint256[] memory pr = _recipientToRequests[msg.sender];
        Structs.PaymentRequest[] memory prArr = new Structs.PaymentRequest[](pr.length);
        for (uint256 i = 0; i < pr.length; i++) {
            prArr[i] = _paymentRequests[pr[i]];
        }

        return prArr;
    }

    function createRecurringPayments(
        Structs.RecurringSetting memory _settings,
        Structs.RecurringRecipient[] memory _recipients
    ) external override whenNotPaused nonReentrant {
        require(_settings.startDate >= block.timestamp, 'startDate<block.timestamp');
        uint256 count = _requestCount;
        address sender = msg.sender;
        uint256 totalAmount = 0;
        uint256 tokenBalance = _usersBalance[sender][_settings.tokenAddress];
        uint256 lockedAmount = _usersLockedAmount[sender][_settings.tokenAddress];
        uint256 payAmount = 0;
        Structs.RecurringRecipient memory recipient;

        for (uint256 i = 0; i < _recipients.length; i++) {
            recipient = _recipients[i];
            payAmount = recipient.unlockAmountPerTime * recipient.numberOfUnlocks;

            if (recipient.prepaidPercentage > 0) {
                payAmount = _getAmountWithPrepaid(payAmount, recipient.prepaidPercentage);
            }
            totalAmount += payAmount;
        }

        require(tokenBalance - lockedAmount >= totalAmount, 'totalAmount<balance');

        Structs.PaymentRequest memory pr;

        for (uint256 i = 0; i < _recipients.length; i++) {
            recipient = _recipients[i];
            payAmount = recipient.unlockAmountPerTime * recipient.numberOfUnlocks;
            if (recipient.prepaidPercentage > 0) {
                payAmount = _getAmountWithPrepaid(payAmount, recipient.prepaidPercentage);
            }
            uint256 requestId = count + i;
            pr = Structs.PaymentRequest(
                requestId,
                sender,
                _settings.tokenAddress,
                _settings.isNativeToken,
                _settings.startDate,
                payAmount,
                payAmount,
                recipient.prepaidPercentage,
                recipient.unlockAmountPerTime,
                recipient.unlockEvery,
                recipient.numberOfUnlocks,
                recipient.recipient,
                _settings.whoCanCancel,
                _settings.whoCanTransfer,
                1
            );
            _paymentRequests[requestId] = pr;
            _senderToRequests[sender].push(requestId);
            _recipientToRequests[recipient.recipient].push(requestId);
        }

        _requestCount += _recipients.length;
        lockedAmount += totalAmount;
        _usersLockedAmount[sender][_settings.tokenAddress] = lockedAmount;

        emit CreateRecurringPayment(sender);
    }

    function createOneTimePayment(
        Structs.OneTimeSetting memory _settings,
        Structs.OneTimeRecipient[] memory _recipients
    ) external override whenNotPaused nonReentrant {
        address sender = msg.sender;
        uint256 count = _requestCount;

        uint256 totalAmount = 0;

        uint256 tokenBalance = _usersBalance[sender][_settings.tokenAddress];
        uint256 lockedAmount = _usersLockedAmount[sender][_settings.tokenAddress];

        Structs.OneTimeRecipient memory recipient;

        for (uint256 i = 0; i < _recipients.length; i++) {
            recipient = _recipients[i];
            totalAmount += recipient.amount;
        }

        require(tokenBalance - lockedAmount >= totalAmount, 'totalAmount>balance');

        if (_settings.isPayNow) {
            _usersBalance[sender][_settings.tokenAddress] -= totalAmount;

            for (uint256 i = 0; i < _recipients.length; i++) {
                recipient = _recipients[i];
                if (_settings.isNativeToken || _settings.tokenAddress == address(this)) {
                    payable(recipient.recipient).transfer(recipient.amount);
                } else {
                    IERC20(_settings.tokenAddress).transferFrom(address(this), recipient.recipient, recipient.amount);
                }
            }
        } else {
            require(_settings.startDate >= block.timestamp, 'startDate<timestamp');

            Structs.PaymentRequest memory pr;

            for (uint256 i = 0; i < _recipients.length; i++) {
                recipient = _recipients[i];

                uint256 requestId = count + i;

                pr = Structs.PaymentRequest(
                    requestId,
                    sender,
                    _settings.tokenAddress,
                    _settings.isNativeToken,
                    _settings.startDate,
                    recipient.amount,
                    recipient.amount,
                    0,
                    recipient.amount,
                    1,
                    1,
                    recipient.recipient,
                    3,
                    3,
                    1
                );

                _senderToRequests[sender].push(requestId);
                _recipientToRequests[recipient.recipient].push(requestId);
                _paymentRequests[requestId] = pr;
            }

            _requestCount += _recipients.length;
            lockedAmount += totalAmount;
            _usersLockedAmount[sender][_settings.tokenAddress] = lockedAmount;
        }

        emit CreateOneTimePayment(sender);
    }

    function withdrawFromPaymentRequest(uint256 _requestId, uint256 _amount) external override whenNotPaused nonReentrant {
        require(_amount > 0, 'amount<=0');
        Structs.PaymentRequest memory pr = _paymentRequests[_requestId];
        require(pr.sender != address(0), '!pr');
        require(msg.sender == pr.recipient, 'sender!=recipient');

        uint256 unlockedAmount = _getRecipientUnlockedAmount(pr);

        uint256 withdrewAmount = pr.paymentAmount - pr.remainingBalance;

        require(unlockedAmount - withdrewAmount >= _amount, 'amount>balance');

        uint256 remainingBalance = pr.remainingBalance;
        remainingBalance -= _amount;

        if (remainingBalance == 0) {
            _paymentRequests[_requestId].status = 3;
        }
        _paymentRequests[_requestId].remainingBalance = remainingBalance;
        _usersBalance[pr.sender][pr.tokenAddress] -= _amount;
        _usersLockedAmount[pr.sender][pr.tokenAddress] -= _amount;

        if (pr.isNativeToken) {
            payable(pr.recipient).transfer(_amount);
        } else {
            IERC20(pr.tokenAddress).transfer(pr.recipient, _amount);
        }

        emit WithdrawFromPaymentRequest(msg.sender, _requestId, _amount);
    }

    function cancelPaymentRequest(uint256 _requestId, bool sendToEmitter) external override whenNotPaused nonReentrant {
        Structs.PaymentRequest memory paymentRequest = _paymentRequests[_requestId];
        require(paymentRequest.sender != address(0), '!requestId');
        require(paymentRequest.status == 1, '!active');

        bool checkPermission = _checkPermission(paymentRequest, true);

        require(checkPermission, '!permission');
        uint256 unlockedAmount = _getRecipientUnlockedAmount(paymentRequest);
        uint256 availableBalance = unlockedAmount - (paymentRequest.paymentAmount - paymentRequest.remainingBalance);

        _paymentRequests[_requestId].status = 2;
        _paymentRequests[_requestId].remainingBalance = 0;

        _usersBalance[paymentRequest.sender][paymentRequest.tokenAddress] -= availableBalance;
        _usersLockedAmount[paymentRequest.sender][paymentRequest.tokenAddress] -= paymentRequest.remainingBalance;

        address recipientAddress = msg.sender == paymentRequest.sender
            ? paymentRequest.recipient
            : sendToEmitter ? paymentRequest.sender : paymentRequest.recipient;

        if (paymentRequest.isNativeToken) {
            payable(recipientAddress).transfer(availableBalance);
        } else {
            IERC20(paymentRequest.tokenAddress).transfer(recipientAddress, availableBalance);
        }

        emit CancelPaymentRequest(msg.sender, _requestId);
    }

    function transferPaymentRequest(
        uint256 _requestId,
        address _to,
        bool sendToOldRecipient
    ) external override whenNotPaused nonReentrant {
        Structs.PaymentRequest memory paymentRequest = _paymentRequests[_requestId];
        require(paymentRequest.sender != address(0), '!requestId');
        require(paymentRequest.status == 1, '!active');
        require(paymentRequest.recipient != _to, 'old=new');
        bool checkPermission = _checkPermission(paymentRequest, false);
        require(checkPermission, '!permission');

        uint256 unlockedAmount = _getRecipientUnlockedAmount(paymentRequest);
        uint256 availableBalance = unlockedAmount - (paymentRequest.paymentAmount - paymentRequest.remainingBalance);

        _paymentRequests[_requestId].remainingBalance = paymentRequest.paymentAmount - unlockedAmount;
        _usersBalance[paymentRequest.sender][paymentRequest.tokenAddress] -= availableBalance;
        _usersLockedAmount[paymentRequest.sender][paymentRequest.tokenAddress] -= availableBalance;

        uint256 index = 0;
        uint256[] memory requestIds = _recipientToRequests[paymentRequest.recipient];
        for (uint256 i = 0; i < requestIds.length; i++) {
            if (requestIds[i] == _requestId) {
                index = i;
                break;
            }
        }

        _recipientToRequests[paymentRequest.recipient][index] = requestIds[requestIds.length - 1];

        _recipientToRequests[paymentRequest.recipient].pop();

        _recipientToRequests[_to].push(_requestId);

        _paymentRequests[_requestId].recipient = _to;

        address recipientAddress = msg.sender == paymentRequest.sender
            ? paymentRequest.recipient
            : sendToOldRecipient ? paymentRequest.recipient : _to;

        if (paymentRequest.isNativeToken) {
            payable(recipientAddress).transfer(availableBalance);
        } else {
            IERC20(paymentRequest.tokenAddress).transfer(recipientAddress, availableBalance);
        }

        emit TransferPaymentRequest(msg.sender, _requestId, _to);
    }

    function getUserTokensBalance() external view override returns (Structs.Balance[] memory) {
        address sender = msg.sender;
        address[] memory tokens = _usersTokens[sender];
        Structs.Balance[] memory balances = new Structs.Balance[](tokens.length);
        Structs.Balance memory balance;
        for (uint256 i = 0; i < tokens.length; i++) {
            balance = Structs.Balance(tokens[i], _usersBalance[sender][tokens[i]], _usersLockedAmount[sender][tokens[i]]);
            balances[i] = balance;
        }
        return balances;
    }

    function withdrawBalance(address _tokenAddress, uint256 _amount) external override whenNotPaused nonReentrant {
        require(_amount > 0, 'amount<=0');
        address sender = msg.sender;
        uint256 balance = _usersBalance[sender][_tokenAddress];
        uint256 lockedAmount = _usersLockedAmount[sender][_tokenAddress];

        require(balance - lockedAmount >= _amount, 'amount>balance');

        _usersBalance[sender][_tokenAddress] -= _amount;

        if (_tokenAddress == address(this)) {
            payable(sender).transfer(_amount);
        } else {
            IERC20(_tokenAddress).transfer(sender, _amount);
        }

        emit WithdrawBalance(sender, _tokenAddress, _amount);
    }

    function _getAmountWithPrepaid(uint256 _recurringAmount, uint8 _prepaidPercentage) private pure returns (uint256) {
        uint256 prepaidAmount = (_recurringAmount * _prepaidPercentage) / 10_000;
        return (_recurringAmount + prepaidAmount);
    }

    function _getRecipientUnlockedAmount(Structs.PaymentRequest memory _paymentRequest) private view returns (uint256) {
        uint256 unlockedAmount = 0;
        if (block.timestamp < _paymentRequest.startDate) {
            return unlockedAmount;
        }

        uint256 diffTime = block.timestamp - _paymentRequest.startDate;

        uint256 numberOfUnlock = diffTime / _paymentRequest.unlockEvery;

        if (numberOfUnlock > _paymentRequest.numberOfUnlocks) {
            return _paymentRequest.paymentAmount;
        } else {
            unlockedAmount = numberOfUnlock * _paymentRequest.unlockAmountPerTime;
        }

        if (_paymentRequest.prepaidPercentage > 0) {
            unlockedAmount += (
                _paymentRequest.numberOfUnlocks * _paymentRequest.unlockAmountPerTime * _paymentRequest.prepaidPercentage
            ) / 10_000;
        }

        return unlockedAmount;
    }

    function _checkPermission(
        Structs.PaymentRequest memory _paymentRequest,
        bool _cancelOrTransfer
    ) private view returns (bool) {
        bool flag = false;
        uint8 checkedValue = _cancelOrTransfer ? _paymentRequest.whoCanCancel : _paymentRequest.whoCanTransfer;

        if (checkedValue == 0) {
            if (_paymentRequest.sender == msg.sender) {
                flag = true;
            }
        } else if (checkedValue == 1) {
            if (_paymentRequest.recipient == msg.sender) {
                flag = true;
            }
        } else if (checkedValue == 2) {
            flag = true;
        }
        return flag;
    }

    function getBlockTimestamp() external view override returns (uint256) {
        return block.timestamp;
    }
}
