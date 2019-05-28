import { Component, OnInit } from '@angular/core';
import { BlockchainService } from 'src/app/services/blockchain.service';
import { Router } from '@angular/router';
//import { Transaction } from ;
//const { Transaction } = require('/home/arpan/Music/scmfront/src/blockchain');
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
    
    //this.newTx.fromAddress = null;
    //this.newTx.participantId = this.walletKey.publicKey ;
    this.newTx.productWeight = Number(this.newTx.productWeight);
    //console.log(this.newTx.fromAddress);
    //console.log(this.newTx.participantId);
    //this.newTx.productId="2";
    //this.newTx.productWeight=3;
    //this.newTx.transactionLocation="4";
  
    //this.newTx= new Transaction(this.walletKey.publicKey,"1","1","1","1");
    //this.newTx.signTransaction(this.walletKey.keyObj);
    //debugger;
    
    switch(this.senderid) { 
      case "null": { 
        this.newTx.fromAddress = null;
        break; 
      } 
      case "0": { 
        this.newTx.fromAddress = this.blockchainService.walletKeys[0].publicKey;
        this.walletKey = this.blockchainService.walletKeys[0];
        break;     
      } 
      case "1": {
        this.newTx.fromAddress = this.blockchainService.walletKeys[1].publicKey;
        this.walletKey = this.blockchainService.walletKeys[1];
        break;    
      } 
      case "2": { 
        this.newTx.fromAddress = this.blockchainService.walletKeys[2].publicKey;
        this.walletKey = this.blockchainService.walletKeys[2];
        break; 
      }  
      case "3": { 
        this.newTx.fromAddress = this.blockchainService.walletKeys[3].publicKey;
        this.walletKey = this.blockchainService.walletKeys[3];
        break; 
      }
      case "4": { 
        this.newTx.fromAddress = this.blockchainService.walletKeys[4].publicKey;
        this.walletKey = this.blockchainService.walletKeys[4];
        break; 
      }    
      default: { 
        alert("Invalid choice"); 
        break;              
   
      }
    }
    switch(this.receiverid) { 
      case "null": { 
        this.newTx.participantId = null;
        break; 
      } 
      case "0": { 
        this.newTx.participantId = this.blockchainService.walletKeys[0].publicKey;
        break;     
      } 
      case "1": {
        this.newTx.participantId = this.blockchainService.walletKeys[1].publicKey;
        break;    
      } 
      case "2": { 
        this.newTx.participantId = this.blockchainService.walletKeys[2].publicKey;
        break; 
      }  
      case "3": { 
        this.newTx.participantId = this.blockchainService.walletKeys[3].publicKey;
        break; 
      }
      case "4": { 
        this.newTx.participantId = this.blockchainService.walletKeys[4].publicKey;
        break; 
      }    
      default: { 
        alert("Invalid choice"); 
        break;              
   
      }
    }

    if(this.senderid !== "null"){
      this.newTx.signTransaction(this.walletKey.keyObj);
    }

    this.blockchainService.addTransaction(this.newTx);
    //this.chain = this.blockchainService.getPendingTransactions();
    //this.size = this.chain.length;
    } catch (e) {
      alert(e);
    }

    this.router.navigate(['/new/transaction/pending', { addedTx: true }]);
    this.newTx = new Transaction();
  }
  confirmTransaction(){
    //this.newTx.fromAddress = this.walletKey.publicKey;
    //this.newTx.fromAddress = null;
    //this.newTx.participantId = this.walletKey.publicKey;
    switch(this.senderid) { 
      case "null": { 
        this.newTx.fromAddress = null;
        break; 
      } 
      case "0": { 
        this.newTx.fromAddress = this.blockchainService.walletKeys[0].publicKey;
        break;     
      } 
      case "1": {
        this.newTx.fromAddress = this.blockchainService.walletKeys[1].publicKey;
        break;    
      } 
      case "2": { 
        this.newTx.fromAddress = this.blockchainService.walletKeys[2].publicKey;
        break; 
      }  
      case "3": { 
        this.newTx.fromAddress = this.blockchainService.walletKeys[3].publicKey;
        break; 
      }
      case "4": { 
        this.newTx.fromAddress = this.blockchainService.walletKeys[4].publicKey;
        break; 
      }    
      default: { 
        alert("Invalid choice"); 
        break;              
   
      }
    }
    switch(this.receiverid) { 
      case "null": { 
        this.newTx.participantId = null;
        this.walletKey = this.blockchainService.walletKeys[0];
        break; 
      } 
      case "0": { 
        this.newTx.participantId = this.blockchainService.walletKeys[0].publicKey;
        this.walletKey = this.blockchainService.walletKeys[0];
        break;     
      } 
      case "1": {
        this.newTx.participantId = this.blockchainService.walletKeys[1].publicKey;
        this.walletKey = this.blockchainService.walletKeys[1];
        break;    
      } 
      case "2": { 
        this.newTx.participantId = this.blockchainService.walletKeys[2].publicKey;
        this.walletKey = this.blockchainService.walletKeys[2];
        break; 
      }  
      case "3": { 
        this.newTx.participantId = this.blockchainService.walletKeys[3].publicKey;
        this.walletKey = this.blockchainService.walletKeys[3];
        break; 
      }
      case "4": { 
        this.newTx.participantId = this.blockchainService.walletKeys[4].publicKey;
        this.walletKey = this.blockchainService.walletKeys[4];
        break; 
      }    
      default: { 
        alert("Invalid choice"); 
        break;              
   
      }
    }
    this.newTx.productWeight = Number(this.newTx.productWeight);
    this.newTx.status = this.newTx.status.trim().toLowerCase();
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
}