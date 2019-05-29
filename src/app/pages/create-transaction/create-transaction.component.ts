import { Component, OnInit } from '@angular/core';
import { BlockchainService } from 'src/app/services/blockchain.service';
import { Router } from '@angular/router';
const { Transaction } = require('src/app/services/blockchain')


@Component({
  selector: 'app-create-transaction',
  templateUrl: './create-transaction.component.html',
  styleUrls: ['./create-transaction.component.scss']
})

export class CreateTransactionComponent implements OnInit {

  public newTx;
  public walletKey;
  public blockchain;
  public chain;
  public size;
  public senderid;
  public receiverid;

  constructor(private blockchainService: BlockchainService, private router: Router) {
    this.walletKey = this.blockchainService.walletKeys[0];
    this.newTx = new Transaction();
    this.blockchainService.blockchainInstance.producers.push(this.walletKey.publicKey.toString());
  }

  ngOnInit() {
  }

  createTransaction(){

    try { 
    this.newTx.productWeight = Number(this.newTx.productWeight);

    this.newTx.fromAddress = this.senderid.trim().toLowerCase();
    this.newTx.participantId = this.receiverid.trim().toLowerCase();

    if(this.newTx.fromAddress === "null" || this.newTx.fromAddress === "0"){
      this.newTx.fromAddress = null;
    }
    else if(Number(this.senderid) <= this.blockchainService.walletKeys.length){
      this.newTx.fromAddress = this.blockchainService.walletKeys[Number(this.senderid)-1].publicKey;
      this.walletKey = this.blockchainService.walletKeys[Number(this.senderid)-1];
    }
    else if(this.senderid.trim().toLowerCase().startsWith('cust')){
      this.newTx.fromAddress = this.senderid;
    }
    else{
      alert("This user doesn't exist!");
      return;
    }
    
    
    if(this.newTx.participantId === "null" || this.newTx.participantId === "0"){
      this.newTx.participantId = null;
    }
    else if(Number(this.receiverid) <= this.blockchainService.walletKeys.length){
      this.newTx.participantId = this.blockchainService.walletKeys[Number(this.receiverid)-1].publicKey;
    }
    else if(this.receiverid.trim().toLowerCase().startsWith('cust')){
      this.newTx.participantId = this.receiverid;
    }
    else{
      alert("This user doesn't exist!");
      return;
    }
    

    if(this.newTx.fromAddress !== null ){
      this.newTx.signTransaction(this.walletKey.keyObj);
    }

    this.blockchainService.addTransaction(this.newTx);
    } catch (e) {
      alert(e);
    }

    this.router.navigate(['/new/transaction/pending', { addedTx: true }]);
    this.newTx = new Transaction();
  }
  confirmTransaction(){

    this.newTx.productWeight = Number(this.newTx.productWeight);

    this.newTx.fromAddress = this.senderid.trim().toLowerCase();
    this.newTx.participantId = this.receiverid.trim().toLowerCase();

    if(this.newTx.fromAddress === "null" || this.newTx.fromAddress === "0"){
      this.newTx.fromAddress = null;
    }
    else if(Number(this.senderid) <= this.blockchainService.walletKeys.length){
      this.newTx.fromAddress = this.blockchainService.walletKeys[Number(this.senderid)-1].publicKey;
    }
    else if(this.senderid.trim().toLowerCase().startsWith('cust')){
      this.newTx.fromAddress = this.senderid;
    }
    else{
      alert("This user doesn't exist!");
      return;
    }
    

    if(this.newTx.participantId === "null"|| this.newTx.participantId === "0"){
      this.newTx.participantId = null;
    }
    else if(Number(this.receiverid) <= this.blockchainService.walletKeys.length){
      this.newTx.participantId = this.blockchainService.walletKeys[Number(this.receiverid)-1].publicKey;
      this.walletKey = this.blockchainService.walletKeys[Number(this.receiverid)-1];
    }
    else if(this.receiverid.trim().toLowerCase().startsWith('cust')){
      this.newTx.participantId = this.receiverid;
    }
    else{
      alert("This user doesn't exist!");
      return;
    }
    

    this.newTx.status = this.newTx.status.trim().toLowerCase();
    if(this.newTx.status === "t")
      this.newTx.status = "true";
    if(this.newTx.status === "f")
      this.newTx.status = "false";
    if(!(this.newTx.status === "true" || this.newTx.status === "false")){
      alert("Enter TRUE or FALSE in Transaction Status");
      return;
    }
    this.newTx.signStatus(this.walletKey.keyObj);
    try {
      this.blockchainService.confirmTransaction(this.newTx);
    } catch (e) {
      alert(e);
    }
    this.newTx = new Transaction();
    this.router.navigate(['/new/transaction/pending', { addedTx: true }]);

  }

  addUser(){
    this.blockchainService.generateWalletKeys();
  }
}