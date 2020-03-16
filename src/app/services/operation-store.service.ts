import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, defer, from, ReplaySubject } from 'rxjs';
import { Account, FaucetKey } from '../models/account';
import { OperationFactoryService } from './operation-factory.service';
import { OperationRequest } from '../models/operation';
import { OperationReconiliatorService } from './operation-reconiliator.service';
import { first, switchMapTo, shareReplay, switchMap } from 'rxjs/operators';

const defaultFaucet = {
  "mnemonic": [
    "choose",
    "gravity",
    "enough",
    "noble",
    "license",
    "video",
    "rate",
    "soul",
    "mansion",
    "moment",
    "fruit",
    "runway",
    "cousin",
    "script",
    "helmet"
  ],
  "secret": "6f054c9a91a6a44a7913d95a334bf81a8eef996b",
  "amount": "49132958262",
  "pkh": "tz1ZgmtH7SbhWmrSk6cpywkwh2uhncn9YgeA",
  "password": "6qfyf2ZtW6",
  "email": "ivscxswy.kntpubez@tezos.example.org"
}

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
    private reconciliator: OperationReconiliatorService
  ) {

  }

  private async loadInitialState() {
    const accounts = localStorage.getItem('accounts');
    if (!accounts) {
      this._accounts$ = new BehaviorSubject([await this.createAccount(defaultFaucet)]);
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

}
