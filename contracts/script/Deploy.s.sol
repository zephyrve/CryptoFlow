// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from 'forge-std/Script.sol';
import "../src/CryptoFlow.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast();

        CryptoFlow cryptoFlow = new CryptoFlow();

        vm.stopBroadcast();
    }
}
