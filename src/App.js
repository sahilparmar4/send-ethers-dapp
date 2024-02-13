import { useEffect, useState } from 'react';
import './App.css';
import { Web3 } from "web3";
import { ABI } from './contract/transferFunds';

function App() {

  const [currentAccount, setCurrentAccount] = useState();
  const [recepientAddress, setRecepientAddress] = useState("");
  const [value, setValue] = useState();
  const [currentAccountBalance, setCurrentAccountBalance] = useState(0);

  const web3 = new Web3(window.ethereum);

  const smartContractInstance = new web3.eth.Contract(ABI, process.env.REACT_APP_CONTRACT_ADDRESS);

  const onSubmitHandler = async()=>{
    try{

      if(!recepientAddress || recepientAddress === ""){
        alert("Please enter address")
      }else if( !value || value === undefined){
        alert("Please enter value");
      }else{
        const data = await smartContractInstance.methods.sendEthers(recepientAddress, value).send({from: currentAccount, value: value});
        return data;
      }
    }catch(e){
      alert(e);
    }
  }

  const getBalance = async()=>{
    let balance = await smartContractInstance.methods.checkBalance().call({from: currentAccount});
    balance = await web3.utils.fromWei(balance, "ether");
    setCurrentAccountBalance(balance);
  }

  const connectToMetaMask = async()=>{
    try{
      if (web3) {
        setCurrentAccountBalance(0);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        setCurrentAccount(accounts[0]);
        getBalance();
      } else {
        alert('Please download metamask');
      }
    }catch(e){
      console.log(e);
    }
  }

  useEffect(() => {
    connectToMetaMask();
  }, [currentAccount]);

  useEffect(()=>{
    getBalance();
  }, [currentAccount, currentAccountBalance]);
  
  return (
    <>
      <center>
        <h3 className='font-medium text-xl'>Welcome to the Decntralized Application</h3>
        <h6 className='mt-3 font-bold'>A platform from wich you can transfer the funds (in ETH) to your loved ones :)</h6>
        <div>
            <h3 className='font-medium mt-3'>Current Connected Account: </h3><span>{currentAccount}</span>
            <h3 className='font-medium mt-3'>Current Account Balance: </h3><span>{currentAccountBalance} ETH</span>
        </div>
        
        <input type='text' className='my-5 border p-2 rounded' size={50} pattern='/(?<!\w)0x\w+/g' value={recepientAddress} onChange={(e)=>setRecepientAddress(e.target.value)} placeholder='Enter Address 0x...' />
        <br />
        <input type='number' value={value} onChange={(e)=>setValue(e.target.value)} className='border p-2 w-96 rounded' size={100} min={0} placeholder='Enter Amount' />
        <br />
        <button
         type='submit'
         className='mt-5 rounded-full w-16 h-auto p-auto bg-green-500 text-white font-medium hover:cursor-pointer'
         onClick={()=>{onSubmitHandler()}}
        >Pay</button>
      </center>
    </>
  );
}

export default App;
