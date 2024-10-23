// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../libs/Structs.sol";

interface IUser {
    event Receive(address indexed _sender, uint256 _amount);
    event Deposit(address indexed _sender, address indexed _tokenAddress, uint256 _amount);
    event CreateRecurringPayment(address indexed _sender);
    event CreateOneTimePayment(address indexed _sender);
    event WithdrawFromPaymentRequest(address indexed _caller, uint256 indexed _requestId, uint256 _amount);
    event CancelPaymentRequest(address indexed _caller, uint256 indexed _requestId);
    event TransferPaymentRequest(address indexed _caller, uint256 indexed _requestId, address indexed to);
    event WithdrawBalance(address indexed _caller, address indexed _tokenAddress, uint256 amount);

    function deposit(address _tokenAddress, uint256 _amount) external payable;

    function createRecurringPayments(Structs.RecurringSetting memory _settings, Structs.RecurringRecipient[] memory _recipients) external;

    function createOneTimePayment(Structs.OneTimeSetting memory _settings, Structs.OneTimeRecipient[] memory _recipients) external;

    function withdrawFromPaymentRequest(uint256 _requestId, uint256 _amount) external;

    function cancelPaymentRequest(uint256 _requestId, bool sendToEmitter) external;

    function transferPaymentRequest(uint256 _requestId, address _to, bool sendToOldRecipient) external;

    function getUserTokensBalance() external view returns (Structs.Balance[] memory);

    function withdrawBalance(address _tokenAddress, uint256 _amount) external;
}