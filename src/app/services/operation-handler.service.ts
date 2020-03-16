import { Injectable } from '@angular/core';
import { OperationRequest } from '../models/operation';
import { AccountService } from './account.service';
import { OperationStoreService } from './operation-store.service';

@Injectable({
  providedIn: 'root'
})
export class OperationHandlerService {
  constructor(
    private store: OperationStoreService,
    private accounts: AccountService,
  ) { }

  async process(op: OperationRequest) {
    const account = await this.accounts.getCurrentAccount();
    op.onStatusChanged$.subscribe(() => {
      this.store.persists(account);
    });
    await account.process(op);
  }

  async addOperationRequest(op: OperationRequest) {
    const account = await this.accounts.getCurrentAccount();
    account.addOperationRequest(op);
    this.store.persists(account);
  }

  async addPermissionRequest(permission: PermissionRequest) {
    const account = await this.accounts.getCurrentAccount();
  }
}
