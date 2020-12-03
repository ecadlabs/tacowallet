import { Component, OnInit } from '@angular/core';
import { WalletInteractionService } from '../services/operation-request-source/wallet-interaction.service';
import * as bs58check from 'bs58check';

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
    const decoded = JSON.parse(bs58check.decode(this.pairingStr).toString());
    this.walletInteraction.pair(decoded.publicKey);
  }
}
