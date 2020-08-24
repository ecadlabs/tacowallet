import { Injectable } from '@angular/core';
import { Observable, Subject, defer, from, ReplaySubject } from 'rxjs';
import { Account, FaucetKey } from '../models/account';
import { OperationFactoryService } from './operation-factory.service';
import { OperationRequest } from '../models/operation';
import { OperationReconiliatorService } from './operation-reconiliator.service';
import { first, shareReplay, switchMap } from 'rxjs/operators';
import {  ModalController, LoadingController } from '@ionic/angular';
import { FaucetKeyModalComponent } from './../faucet-key-modal/faucet-key-modal.component';

@Injectable({
  providedIn: 'root'
})
export class OperationStoreService {

  private _accounts$?: Subject<Account[]>;

  public accounts$: Observable<Account[]> = defer(() => {
    return from(this.loadInitialState());
  }).pipe(shareReplay(), switchMap(() => this._accounts$));

  private createAccount(faucetKey: FaucetKey) {
    return Account.createFromFaucet(faucetKey);
  }

  constructor(
    private factory: OperationFactoryService,
    private reconciliator: OperationReconiliatorService,
    private modalController: ModalController,
    private loadingCtrl: LoadingController
  ) {

  }

  private async loadInitialState() {
    const accounts = localStorage.getItem('accounts');
    if (!accounts) {
      this._accounts$ = new ReplaySubject(); 
      const modal = await this.modalController.create({
        component: FaucetKeyModalComponent,
      });
      await modal.present();
      const {data} = await modal.onDidDismiss();
      const loading = await this.loadingCtrl.create({
        message: 'Activating faucet key'
      });
      loading.present();
      try {
        const accountFromFaucet = await this.createAccount(JSON.parse(data));
        this._accounts$.next([accountFromFaucet]);
        this.persists(accountFromFaucet);
    } catch (ex) {
    } finally {
      loading.dismiss();
    }
    } else {
      const accountSubject = new ReplaySubject<Account[]>(1);
      this._accounts$ = accountSubject;

      // tslint:disable-next-line: no-floating-promises
      (async () => {
        const realAccount: any[] = JSON.parse(accounts);
        const accs = [];
        for (const ac of realAccount) {
          const opReqs: OperationRequest[] = [];
          for (const op of ac.operationRequest) {
            const opReq = await this.factory.fromSerialized(op);
            await this.reconciliator.reconcile(opReq)
            opReqs.push(opReq);
          }
          accs.push(await Account.createFromFaucet(ac.faucetKey, opReqs, ac.operationResponse));
        }
        accountSubject.next(accs);
      })();
    }
  }

  persists(account: Account) {
    this.accounts$.pipe(first()).subscribe(() => {
      localStorage.setItem('accounts', JSON.stringify([account.serialize()]));
      // this._accounts.set(account.id, account);
      this._accounts$!.next([account]);
    });
  }

  replaceAccount(account: Account) {
    this.persists(account);
  }

  async importFaucet() {
    const modal = await this.modalController.create({
      component: FaucetKeyModalComponent,
    });
    await modal.present();
    const {data} = await modal.onDidDismiss();
    const loading = await this.loadingCtrl.create({
      message: 'Activating faucet key'
    });
    loading.present();
    try {
      this.replaceAccount(await Account.createFromFaucet(JSON.parse(data)));
  } catch (ex) {
    console.log(ex)
  } finally {
    loading.dismiss();
  }
  }

}
