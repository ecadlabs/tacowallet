import { Component, Inject, OnInit } from '@angular/core';
import { TezosToolkit } from '@taquito/taquito';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public destination = 'tz1PirboZKFVqkfE45hVLpkpXaZtLk3mqC17';
  public amount = '1';

  ngOnInit() {
  }

  constructor(
    @Inject('Taquito')
    private taquito: Promise<TezosToolkit>,
    @Inject('SummaryFunc')
    private summaryFunc: any
  ) {
  }

  async send() {
    const taquito = await this.taquito;
    const op = await taquito.wallet.transfer({ amount: Number(this.amount), to: this.destination }).send();
  }

}
