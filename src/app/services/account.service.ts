import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Account, FaucetKey } from '../models/account';
import { OperationStoreService } from './operation-store.service';


const mapToFirst = <T>() => map<T[], T>((list: T[]) => {
  return list[0];
})

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private store: OperationStoreService
  ) { }

  accounts$: Observable<Account[]> = this.store.accounts$;

  currentAccount$: Observable<Account> = this.accounts$.pipe(
    mapToFirst()
  );

  async getCurrentAccount() {
    return this.currentAccount$.pipe(first()).toPromise();
  }

  async createAccount(faucetKey: FaucetKey) {
    this.store.replaceAccount(await Account.createFromFaucet(faucetKey));
  }

  async importFaucet() {
    this.store.importFaucet();
  }
}

