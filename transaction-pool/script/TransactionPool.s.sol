// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {TransactionPool} from "../src/TransactionPool.sol";

contract TransactionPoolScript is Script {
    TransactionPool public transactionPool;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        transactionPool = new TransactionPool();

        vm.stopBroadcast();
    }
}
