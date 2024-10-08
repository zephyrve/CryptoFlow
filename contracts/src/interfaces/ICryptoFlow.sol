// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../libs/Structs.sol";

interface ICryptoFlow {
    function getSenderRequests() external view returns (Structs.PaymentRequest[] memory);

    function getRecipientRequests() external view returns (Structs.PaymentRequest[] memory);

    function getBlockTimestamp() external view returns (uint);
}