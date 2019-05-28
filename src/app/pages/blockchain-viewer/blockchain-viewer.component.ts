import { Component, OnInit } from '@angular/core';
import { BlockchainService } from 'src/app/services/blockchain.service';

@Component({
  selector: 'app-blockchain-viewer',
  templateUrl: './blockchain-viewer.component.html',
  styleUrls: ['./blockchain-viewer.component.scss']
})
export class BlockchainViewerComponent implements OnInit {

  public blocks = [];
  public selectedBlock = null;
  
  constructor(private blockchainService: BlockchainService) {
    this.blocks = blockchainService.getBlocks();
    /*blockchainService.blockchainInstance.addTransaction(null,"hi",1,100,"l1");
    const tx01 = new Transaction(null, node1Address, 'productId1', 500, 'location1');
    SCM.addTransaction(tx01);

    //Node 1 confirms the production 500 units of productId1
    var tx = new Transaction(null, node1Address, 'productId1', 500, 'location1', true);
    tx.signStatus(node1key);
    SCM.transactionStatus(tx);*/
    this.selectedBlock = this.blocks[0];
   
  }

  ngOnInit() {
  }

  showTransactions(block){
    this.selectedBlock = block;
  }

  isSupplyChainValid(){
    if(this.blockchainService.blockchainInstance.isSupplyChainValid())
      alert("Yes, the supply chain is valid!")
    else
      alert("The supply chain is invalid!")
  }

}
