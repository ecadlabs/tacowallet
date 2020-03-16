import { Injectable } from '@angular/core';
import { Subject, Observable, NEVER } from 'rxjs';
import { OperationRequest, OperationResponse } from '../../models/operation';
import { WalletInteractionStandard } from '../operation-listener.service';
import { RPCOperation } from '@taquito/taquito/dist/types/operations/types';
import { OperationFactoryService } from '../operation-factory.service';

@Injectable({
  providedIn: 'root'
})
export class OperationRequestService implements WalletInteractionStandard {

  constructor(
    private factory: OperationFactoryService
  ) { }

  request$: Subject<OperationRequest> = new Subject();

  // Internal request do not require permissions
  permissions$ = NEVER;

  async sendOperationRequest(op: RPCOperation[], appID: string): Promise<Observable<OperationResponse>> {
    const opRequest = await this.factory.create(op, appID);
    this.request$.next(opRequest);
    return opRequest.response$;
  }
}
