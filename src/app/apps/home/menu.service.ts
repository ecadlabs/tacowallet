import { Injectable, Inject } from '@angular/core';
import { MenuItem } from '../../apps-services/menu.service';
import { TezosToolkit } from '@taquito/taquito';

@Injectable()
export class MenuService {

  constructor(
    @Inject('Taquito')
    private taquito: Promise<TezosToolkit>,
  ) { }

  async getMenu(address: string): Promise<MenuItem[]> {
    const taquito = await this.taquito;
    const balance = await taquito.tz.getBalance(address)
    return Promise.resolve([{
      title: `Tezos`, url: '/home',
      amount: `${(taquito.format('mutez', 'tz', balance) as Number).toFixed(2)} tz`,
      icon: 'wallet'
    }])
  }
}
