import { Component, OnInit } from '@angular/core';
import { BlockchainService } from 'src/app/services/blockchain.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-flow',
  templateUrl: './product-flow.component.html',
  styleUrls: ['./product-flow.component.scss']
})
export class ProductFlowComponent implements OnInit {

  public productId;
  public flow;
  public userId;
  public balance;

  constructor(private blockchainService: BlockchainService, private router: Router, private route: ActivatedRoute) {
    this.flow = [];
  }

  ngOnInit() {
  }

  showProductFlow(){
    this.flow = [];
    this.flow = this.blockchainService.getProductFlow(this.productId);
  }
  
  showBalance(){
    debugger
    this.balance = 0;
    this.balance = this.blockchainService.getBalance(this.userId);
  }

}
