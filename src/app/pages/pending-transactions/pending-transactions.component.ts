import { Component, OnInit } from '@angular/core';
import { BlockchainService } from 'src/app/services/blockchain.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pending-transactions',
  templateUrl: './pending-transactions.component.html',
  styleUrls: ['./pending-transactions.component.scss']
})
export class PendingTransactionsComponent implements OnInit {

  public pendingTransactions = [];
  public confirmTransactions = [];
  public suspendedTransactions = [];
  public miningInProgress = false;
  public justAddedTx = false;

  constructor(private blockchainService: BlockchainService, private router: Router, private route: ActivatedRoute) {
    this.pendingTransactions = blockchainService.getPendingTransactions();
    this.confirmTransactions = blockchainService.getConfirmTransactions();
    this.suspendedTransactions = blockchainService.getSuspendedTransactions();
  }


  ngOnInit() {
   /* if (this.route.snapshot.paramMap.get('addedTx')) {
      this.justAddedTx = true;

      setTimeout(() => {
        this.justAddedTx = false;
      }, 4000);
    }*/
  }



  mineConfirmTransactions() {
    this.miningInProgress = true;
    this.blockchainService.mineConfirmTransactions();
    this.miningInProgress = false;
    this.router.navigate(['/']);
  }
}