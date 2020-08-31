import { Injectable } from '@angular/core';
import { OperationRequest } from '../models/operation';
import { AccountService } from './account.service';
import { OperationStoreService } from './operation-store.service';
import { RPCOperation } from '@taquito/taquito/dist/types/operations/types';

@Injectable({
  providedIn: 'root',
})
export class OperationHandlerService {
  constructor(
    private store: OperationStoreService,
    private accounts: AccountService
  ) {}

  async process(op: OperationRequest) {
    const account = await this.accounts.getCurrentAccount();
    op.onStatusChanged$.subscribe(() => {
      this.store.persists(account);
    });
    await account.process(op);
  }

  async estimateOperation(op: OperationRequest) {
    const account = await this.accounts.getCurrentAccount();
    return await account.estimateOperation(op);
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
