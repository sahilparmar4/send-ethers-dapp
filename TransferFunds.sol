// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract TransferFunds {

    function sendEthers (address payable _to, uint256 _amount) public payable {
        require(_to != msg.sender, "You can not pay yourself");
        require(_amount >= address(this).balance, "Insufficient funds");
        _to.transfer(_amount);
    }

    function checkBalance() public view returns (uint256){
        return msg.sender.balance;
    }
}

// Goerli ETH Address (Verified by Goerli Etherscan) 0x4C0d372875A850eFCa05f391ED88c8b5D74509E4
// Link: https://goerli.etherscan.io/address/0x4C0d372875A850eFCa05f391ED88c8b5D74509E4