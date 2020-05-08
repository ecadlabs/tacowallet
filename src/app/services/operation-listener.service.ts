import { Inject, Injectable } from '@angular/core';
import { merge, Observable } from 'rxjs';
import { OperationRequest } from '../models/operation';
import { PermissionRequest } from '../models/permission-request';
import { OperationHandlerService } from './operation-handler.service';
import { OperationApproverService } from './operation-approver.service';

export interface WalletInteractionStandard {
  permissions$: Observable<PermissionRequest>;
  request$: Observable<OperationRequest>;
}

@Injectable({
  providedIn: 'root',
})
export class OperationListenerService {
  constructor(
    @Inject('TEST')
    private operationRequest: WalletInteractionStandard[],
    private operationHandler: OperationHandlerService,
    private operationApprover: OperationApproverService
  ) {}

  opRequest = merge(...this.operationRequest.map((x) => x.request$));
  permissionRequest = merge(
    ...this.operationRequest.map((x) => x.permissions$)
  );

  start() {
    this.opRequest.subscribe((op) => this.handleOperationRequest(op));
    this.permissionRequest.subscribe(() => this.handlePermissionRequest());
  }

  private async handleOperationRequest(op: OperationRequest) {
    await this.operationHandler.addOperationRequest(op);
    await this.operationApprover.approve(op);
  }

  private async handlePermissionRequest() {}
}
