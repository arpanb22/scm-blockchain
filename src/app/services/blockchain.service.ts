import { Injectable } from '@angular/core';
//import { Blockchain } from './blockchain'
const { Blockchain } = require('./blockchain');
import EC from "elliptic";
@Injectable({
  providedIn: 'root'
})
export class BlockchainService {

  public blockchainInstance = new Blockchain();
  public walletKeys = [];

  constructor() {
    this.blockchainInstance.difficulty = 1;
    this.generateWalletKeys();
    this.generateWalletKeys();
    this.generateWalletKeys();
    this.generateWalletKeys();
    this.generateWalletKeys();
   }

   getBlocks(){
     return this.blockchainInstance.chain;
   }

   getBalance(userId){
    debugger
    if(userId.trim().toLowerCase().startsWith('cust'))
      return this.blockchainInstance.getBalanceOfAddress(userId);
    else
      return this.blockchainInstance.getBalanceOfAddress(this.walletKeys[Number(userId)-1].publicKey);

   }

   addTransaction(tx){
     this.blockchainInstance.addTransaction(tx);    
   }

   confirmTransaction(tx) {
     this.blockchainInstance.transactionStatus(tx);     
     
    }

    getPendingTransactions(){
     return this.blockchainInstance.pendingTransactions;
    }

    getConfirmTransactions(){
     return this.blockchainInstance.confirmTransactions;
    }

    getSuspendedTransactions(){
      return this.blockchainInstance.suspendedTransactions; 
    }

    getProductFlow(productId){
      return this.blockchainInstance.showProductFlow(productId);
    }


   mineConfirmTransactions(){
    return this.blockchainInstance.mineConfirmTransactions();
    }


   generateWalletKeys(){
     const ec = new EC.ec('secp256k1');
     const key = ec.genKeyPair();
     this.walletKeys.push({
       keyObj: key,
       publicKey: key.getPublic('hex'),
       privateKey: key.getPrivate('hex'),
     });
   }
}
