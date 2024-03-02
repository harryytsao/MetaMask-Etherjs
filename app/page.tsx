"use client"
import { useState } from 'react';
import { ethers } from 'ethers';

export default function Home() {

  const [walletAddress, setWalletAddress] = useState("");

  async function requestAccount() {
    console.log('Requesting account...')
    if (window.ethereum) {
      console.log('detected');

      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.log("Error connecting...")
      }
    } else {
      console.log('MetaMask not detected');
    }
  }

  async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.BrowserProvider(window.ethereum);
    }
  }
  return (
      <div className="flex flex-col items-center justify-center h-screen">
          <button className="bg-blue-500 text-white hover:bg-blue-700 font-bold py-2 px-4 mt-3 rounded" onClick={requestAccount}>Connect Wallet</button>
          <h3 className="mt-3">Wallet Address: {walletAddress}</h3>
      </div>
  );
}
