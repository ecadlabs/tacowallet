import { Component, OnInit } from '@angular/core';
import { WalletInteractionService } from '../services/operation-request-source/wallet-interaction.service';

@Component({
  selector: 'app-pair',
  templateUrl: './pair.page.html',
  styleUrls: ['./pair.page.scss'],
})
export class PairPage implements OnInit {

  public pairingStr: string;

  constructor(
    private walletInteraction: WalletInteractionService
  ) { }

  ngOnInit() {
  }

  pair() {
    this.walletInteraction.pair(this.pairingStr);
  }
}
