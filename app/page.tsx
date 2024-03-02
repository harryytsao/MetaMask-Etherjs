"use client"
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function Home() {

  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState<bigint | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  async function requestAccount() {
    console.log('Requesting account...')
    if (window.ethereum) {
      console.log('detected');

      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        setShowInfo(true);
      } catch (error) {
        console.log("Error connecting...")
      }
    } else {
      console.log('MetaMask not detected');
    }
  }

  async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await requestAccount();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const balance = await provider.getBalance(walletAddress);
        console.log(ethers.formatEther(balance));
        setBalance(balance);
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    if (walletAddress) {
      connectWallet();
    }
  }, [walletAddress])
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <button className="bg-blue-500 text-white hover:bg-blue-700 font-bold py-2 px-4 mt-3 rounded" onClick={connectWallet}>Connect Wallet</button>
      {showInfo && <h3 className="mt-3">Wallet Address: {walletAddress}</h3>}
      {showInfo && <h3 className="mt-3">Ethereum Balance: {balance !== null ? balance.toString() + " ETH": 'Loading...'}</h3>}
    </div>
  );
}
