// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract TransactionPool {

    uint256 public transactionsFee = 0;

    struct Transaction {
        address sender;
        address recipient;
        uint256 amount;
        uint256 tip;
        uint256 executionTime;
        Status status;
    }

    enum Status {
        Pending,
        Reverted,
        Executed
    }

    mapping(uint256 => Transaction) public transactions;
    uint256 public transactionCount;

    modifier onlyValidTransaction(uint256 _transactionId) {
        require(_transactionId < transactionCount);
        require(transactions[_transactionId].status == Status.Pending, "Transaction is not pending");
        _;
    }

    function createTransaction(address _recipient, uint256 _executionTime, uint256 _amount, uint256 _tip)
        external
        payable
    {
        require(msg.value >= _amount, "Insufficient funds");
        require(_executionTime > block.timestamp, "Execution time must be bigger than transaction created time");
        transactions[transactionCount] = Transaction({
            sender: msg.sender,
            recipient: _recipient,
            amount: _amount,
            tip: _tip,
            executionTime: _executionTime,
            status: Status.Pending
        });

        transactionCount++;
        // event
    }

    function revertedTransaction(uint256 _transactionId) external onlyValidTransaction(_transactionId) {
        Transaction storage currentTransaction = transactions[_transactionId];
        require(msg.sender == currentTransaction.sender, "Only sender can revert");
        require(block.timestamp < currentTransaction.executionTime, "Transaction time already passed");

        (bool success,) = currentTransaction.sender.call{value: currentTransaction.amount + currentTransaction.tip}("");
        require(success, "Revert failed");

        currentTransaction.status = Status.Reverted;

        //event
    }

    function executedTransaction(uint256 _transactionId) external onlyValidTransaction(_transactionId) {
        Transaction storage currentTransaction = transactions[_transactionId];
        require(block.timestamp >= currentTransaction.executionTime, "Transaction time not reached");
        require(msg.sender != currentTransaction.recipient, "Recipient can executed");

        (bool success,) =
            currentTransaction.recipient.call{value: currentTransaction.amount + currentTransaction.tip}("");
        require(success, "Execution failed");

        currentTransaction.status = Status.Executed;

        //event
    }

    function getTransaction(uint256 _transactionId) public view returns (Transaction memory) {
        require(_transactionId < transactionCount, "Invalid transaction Id");
        return transactions[_transactionId];
    }
}