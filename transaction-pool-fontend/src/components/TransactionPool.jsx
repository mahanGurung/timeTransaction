import { ethers } from 'ethers';
import React from 'react';
import ABI from '../constrants/ABI.json';
// import { contractAddress } from '../constrants/ContractAdd';
import { useEffect, useState } from 'react';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contractAddress = '0xe3Da69444b7F1f9e6910Fbf4fdA654835ACE9762';
const contract = new ethers.Contract(contractAddress, ABI, signer);

const TransactionPool = () => {
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        await provider.send('eth_requestAccounts', []);
        const signer = provider.getSigner();
        const connectedContract = contract.connect(signer);
        const allTransactions = await connectedContract.getAllTransactions();
        console.log(allTransactions);

        setTransactions(
          allTransactions.map(tx => ({
            creator: tx.creator,
            recipient: tx.recipient,
            amount: ethers.utils.formatEther(tx.amount),
            createdAt: new Date(tx.createdAt * 1000).toLocaleString(),
            executionTime: new Date(tx.executionTime * 1000).toLocaleString(),
            tip: ethers.utils.formatEther(tx.tip),
            status: tx.status,
          })),
        );
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };
    fetchTransactions();
  }, []);

  //   const onClick = async transactionId => {
  //     await provider.send('eth_requestAccounts', []);
  //     const signer = provider.getSigner();
  //     const connectedContract = contract.connect(signer);
  //     const id = transactionId;

  //     const revertTransactions = await connectedContract.RevertTransaction(id);

  //     await revertTransactions.wait();
  //   };

  const handleRevertClick = async transactionId => {
    try {
      //   await provider.send('eth_requestAccounts', []);
      //   const signer = provider.getSigner();
      //   const connectedContract = contract.connect(signer);
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const revertTransaction = await contract.RevertTransaction(transactionId);
      console.log('transaction id:', transactionId);

      await revertTransaction.wait();
      // Optionally, refetch transactions to update the UI
    } catch (error) {
      console.error('Error reverting transaction:', error);
    }
  };

  const handleExecuteClick = async transactionId => {
    try {
      //   await provider.send('eth_requestAccounts', []);
      //   const signer = provider.getSigner();
      //   const connectedContract = contract.connect(signer);
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      console.log('transaction id:', transactionId);

      const executeTransaction =
        await contract.ExecuteTransaction(transactionId);
      await executeTransaction.wait();
      // Optionally, refetch transactions to update the UI
    } catch (error) {
      console.error('Error execute transaction:', error);
    }
  };

  return (
    <div>
      <h1>Transactions</h1>
      <table>
        <thead>
          <tr>
            <th>Index</th>
            <th>Creator</th> <th>Recipient</th> <th>Amount</th>
            <th>Created At</th> <th>Execution Time</th> <th>Tip</th>
            <th>Status</th>
            <th>Revert</th>
            <th>Execute</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{tx.creator}</td> <td>{tx.recipient}</td>
              <td>{tx.amount} ETH</td> <td>{tx.createdAt}</td>
              <td>{tx.executionTime}</td> <td>{tx.tip} ETH</td>
              <td>{tx.status}</td>
              <td>
                <button onClick={() => handleRevertClick(index)}>Yes</button>
              </td>
              <td>
                <button onClick={() => handleExecuteClick(index)}>Yes</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionPool;
