import React, { useState } from 'react'

const BlockchainProvider = () => {

    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contractInstance, setContractInstance] = useState(null);

    const contractAddress = '0xe3Da69444b7F1f9e6910Fbf4fdA654835ACE9762';

    const initializeContract = async () => {

        if(window.ethereum){
          try{
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const initializeContract = new ethers.Contract(contractAddress, ABI, signer);

            setProvider(provider);
            setSigner(signer);
            setContractInstance(initializeContract);

            return true;
      
          }catch (error){
            console.error('Error in initializing contract', error);
            return false;
          }
        } else {
            console.log("Error in Ethereum");
            return false;
        }
         
    }

    const connectWallet = async () => {
        try {
          if (typeof window.ethereum === 'undefined')
            reportError('Please install MetaMask');
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
          });
    
        //   setGlobalState('connectedAccount', accounts[0].toLowerCase());
          window.location.reload();
        } catch (error) {
          reportError(error);
        }
      };




       
       




  
}

export default BlockchainProvider
