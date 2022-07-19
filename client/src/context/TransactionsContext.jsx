import { ethers } from 'ethers'
import { contractABI, contractAddress } from '../utils/constants'
import { createContext } from 'react'
import { useEffect } from 'react';
import { useState } from 'react';


export const TransactionContext = createContext()
const { ethereum } = window;

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

    return transactionContract
}

export const TransactionProvider = ({ children }) => {

    const [currentAccount, setCurrentAccount] = useState('')
    const [formData, setFormData] = useState({ addressTo: '', amount: '', keyword: '', message: '' })
    const [isLoading, setIsLoading] = useState(false)
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'))

    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }))
    }

    const checkIfWalletIsConnected = async () => {
        try {
            if (!ethereum) return alert('please install metamask')

            const accounts = await ethereum.request({ method: 'eth_accounts' })

            if (accounts.length) {
                setCurrentAccount(accounts[0])

                //getAllTransactions()
            } else {
                console.log('No Accounts Found');
            }
        } catch (error) {
            console.log(error);
            throw new Error('No Ethereum Object')
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
    }, [])

    const connectWallet = async () => {
        try {
            if (!ethereum) return alert('please install metamask')
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
            setCurrentAccount(accounts[0])
        } catch (error) {
            console.log(error);
            throw new Error('No ethereum object')
        }
    }

    const sendTransactions = async () => {
        try {
            if (!ethereum) return alert('please install metamask')
            const { addressTo, amount, keyword, message } = formData
            const transactionContract =  getEthereumContract()
            const parseAmount = ethers.utils.parseUnits(amount)

            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208', //21000 GWEII OR 0.000021 ETH
                    value: parseAmount._hex,

                }]
            })

            const transactionHash = await transactionContract.addToBlockChain(addressTo, parseAmount, message, keyword)
            setIsLoading(true)
            console.log(`Loading  - ${transactionHash.hash}`);
            await transactionHash.wait()
            setIsLoading(false)
            console.log(`Success -  ${transactionHash.hash}`);

            const transactionCount  = await transactionContract.getTransactionCount()
            setTransactionCount(transactionCount.toNumber())
        } catch (error) {
            console.log(error);
            throw new Error('No ethereum object')
        }
    }

    return (
        <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, setFormData, handleChange, sendTransactions }}>
            {children}
        </TransactionContext.Provider>
    )
}

