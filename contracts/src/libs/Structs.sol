// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library Structs {
    struct PaymentRequest {
        uint256 requestId;
        address sender;
        address tokenAddress;
        bool isNativeToken;
        uint256 startDate;
        uint256 paymentAmount;
        uint256 remainingBalance;
        uint8 prepaidPercentage;
        uint256 unlockAmountPerTime;
        uint256 unlockEvery;
        uint256 numberOfUnlocks;
        address recipient;
        uint8 whoCanCancel;
        uint8 whoCanTransfer;
        uint8 status;
    }

    struct RecurringRecipient {
        address recipient;
        uint256 unlockEvery;
        uint256 unlockAmountPerTime;
        uint256 numberOfUnlocks;
        uint8 prepaidPercentage;
    }

    struct RecurringSetting {
        address tokenAddress;
        bool isNativeToken;
        uint256 startDate;
        uint8 whoCanCancel;
        uint8 whoCanTransfer;
    }

    struct OneTimeSetting {
        address tokenAddress;
        bool isNativeToken;
        uint256 startDate;
        bool isPayNow;
    }

    struct OneTimeRecipient {
        address recipient;
        uint256 amount;
    }

    struct Balance {
        address tokenAddress;
        uint256 balance;
        uint256 lockedAmount;
    }
}