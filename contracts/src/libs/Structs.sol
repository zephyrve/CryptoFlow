// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library Structs {
    struct PaymentRequest {
        uint requestId;
        address sender;
        address tokenAddress;
        bool isNativeToken;
        uint startDate;
        uint paymentAmount;
        uint remainingBalance;
        uint8 prepaidPercentage;
        uint unlockAmountPerTime;
        uint unlockEvery;
        uint numberOfUnlocks;
        address recipient;
        uint8 whoCanCancel;
        uint8 whoCanTransfer;
        uint8 status;
    }

    struct RecurringRecipient {
        address recipient;
        uint unlockEvery;
        uint unlockAmountPerTime;
        uint numberOfUnlocks;
        uint8 prepaidPercentage;
    }

    struct RecurringSetting {
        address tokenAddress;
        bool isNativeToken;
        uint startDate;
        uint8 whoCanCancel;
        uint8 whoCanTransfer;
    }

    struct OneTimeSetting {
        address tokenAddress;
        bool isNativeToken;
        uint startDate;
        bool isPayNow;
    }

    struct OneTimeRecipient {
        address recipient;
        uint amount;
    }

    struct Balance {
        address tokenAddress;
        uint balance;
        uint lockedAmount;
    }
}