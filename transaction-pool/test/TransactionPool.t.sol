// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {TransactionPool} from "../src/TransactionPool.sol";

contract TransactionPoolTest is Test {
    TransactionPool public transactionPool;
    address user1;
    address user2;

    function setUp() public {
        user1 = vm.addr(1);
        user2 = vm.addr(2);

        vm.deal(user1, 100 ether);
        vm.deal(user2, 100 ether);

        transactionPool = new TransactionPool();
    }

    function testCreateTransaction() public {
        vm.prank(user1);
        transactionPool.createTransaction{value: 2 ether}(user2, block.timestamp + 1 minutes, 1 ether, 1 ether);

        TransactionPool.Transaction memory txn = transactionPool.getTransaction(0);

        assertEq(txn.sender, user1);
        assertEq(txn.recipient, user2);
        assertEq(txn.executionTime, block.timestamp + 1 minutes);
        assertEq(txn.amount, 1 ether);
        assertEq(txn.tip, 1 ether);
        assertEq(uint256(txn.status), uint256(TransactionPool.Status.Pending));
    }

    function testRevertTransaction() public {
        vm.prank(user1);
        transactionPool.createTransaction{value: 2 ether}(user2, block.timestamp + 1 minutes, 1 ether, 1 ether);

        vm.prank(user1);
        // vm.warp(block.timestamp + 1 minutes);
        console.log("user1 balance", user1.balance);
        transactionPool.revertedTransaction(0);
        console.log("user1 balance", user1.balance);

    }

    function testExecuteTransaction() public {
        vm.prank(user1);
        transactionPool.createTransaction{value: 2 ether}(user2, block.timestamp + 1 minutes, 1 ether, 1 ether);
        vm.prank(user1);
        vm.warp(block.timestamp + 1 minutes);
        console.log("user1 balance", user1.balance);
        transactionPool.executedTransaction(0);
        console.log("user1 balance", user2.balance);
        
    }
}
