'use client';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState<bigint | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [latestBlock, setLatestBlock] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function requestAccount() {
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
  }

  async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await requestAccount();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const balance = await provider.getBalance(walletAddress);
        console.log(ethers.formatEther(balance));
        setBalance(balance);

        await fetchBlockchainData(provider);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        toast.error('MetaMask not detected.', {
          position: "top-right"
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function fetchBlockchainData(provider: ethers.BrowserProvider) {
    setIsLoading(true);
    try {
      const block = await provider.getBlock('latest');
      setLatestBlock(block);

      if (walletAddress) {
        const history = await provider.getTransactionHistory(walletAddress, {
          fromBlock: latestBlock.number - 10000n // Look back ~10000 blocks
        });
        setTransactions(history?.slice(0, 5) ?? []);
      }
    } catch (error) {
      console.error('Error fetching blockchain data:', error);
      toast.error('Error fetching blockchain data');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (walletAddress) {
      connectWallet();
    }
  }, [walletAddress])

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-green-700 font-bold py-2 px-4 mt-3">Demystifying Web3</h1>
        <button className="bg-blue-500 text-white hover:bg-blue-700 active:opacity-50 transition-all font-bold py-2 px-4 mt-3 rounded" onClick={connectWallet}>Connect Wallet</button>

        {showInfo && (
          <div className="w-full max-w-2xl mt-6">
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <h3 className="font-bold mb-2">Wallet Information</h3>
              <p>Address: {walletAddress}</p>
              <p>Balance: {balance !== null ? ethers.formatEther(balance) + " ETH" : 'Loading...'}</p>
            </div>

            {latestBlock && (
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <h3 className="font-bold mb-2">Latest Block Information</h3>
                <p>Block Number: {latestBlock.number}</p>
                <p>Timestamp: {new Date(Number(latestBlock.timestamp) * 1000).toLocaleString()}</p>
                <p>Transactions: {latestBlock.transactions?.length || 0}</p>
              </div>
            )}

            {transactions.length > 0 && (
              <div className="bg-gray-100 rounded-lg p-4">
                <h3 className="font-bold mb-2">Recent Transactions</h3>
                <div className="space-y-2">
                  {transactions.map((tx, index) => (
                    <div key={index} className="border-b border-gray-300 pb-2">
                      <p className="text-sm">Hash: {tx.hash}</p>
                      <p className="text-sm">From: {tx.from}</p>
                      <p className="text-sm">To: {tx.to}</p>
                      <p className="text-sm">Value: {ethers.formatEther(tx.value)} ETH</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isLoading && (
              <div className="text-center mt-4">
                <p>Loading blockchain data...</p>
              </div>
            )}
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
}
