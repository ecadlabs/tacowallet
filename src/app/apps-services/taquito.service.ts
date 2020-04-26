import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  createOriginationOperation,
  createSetDelegateOperation,
  createTransferOperation,
  TezosToolkit,
  WalletDelegateParams,
  WalletOriginateParams,
  WalletProvider,
  WalletTransferParams,
} from '@taquito/taquito';
import { first } from 'rxjs/operators';
import { AccountService } from '../services/account.service';
import { OperationRequestService } from '../services/operation-request-source/operation-request.service';

class InternalWallet implements WalletProvider {
  async getPKH() {
    return this.pkh;
  }
  async mapTransferParamsToWalletParams(params: WalletTransferParams) {
    return createTransferOperation(params);
  }

  async mapOriginateParamsToWalletParams(params: WalletOriginateParams) {
    return createOriginationOperation(params as any);
  }

  async mapDelegateParamsToWalletParams(params: WalletDelegateParams) {
    return createSetDelegateOperation(params as any);
  }

  async sendOperations(params: any[]) {
    const response$ = await this.opRequest.sendOperationRequest(params, 'test');
    const { hash } = await response$.pipe(first()).toPromise();
    return hash;
  }

  constructor(
    private pkh: string,
    private opRequest: OperationRequestService
  ) {}
}

@Injectable({
  providedIn: 'root',
})
export class TaquitoService {
  async getTaquito(appID: string) {
    const account = await this.account.currentAccount$
      .pipe(first())
      .toPromise();
    const taquito = new TezosToolkit();
    taquito.setProvider({
      rpc: 'https://api.tez.ie/rpc/carthagenet',
      wallet: new InternalWallet(await account.getPKH(), this.opRequest),
    });
    return taquito;
  }

  constructor(
    private opRequest: OperationRequestService,
    private account: AccountService,
    public modalController: ModalController
  ) {}
}
