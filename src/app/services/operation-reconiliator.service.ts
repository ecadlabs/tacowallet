import { Injectable } from '@angular/core';
import { OperationRequest, OperationRequestStatus } from '../models/operation';
import { TezosToolkit } from '@taquito/taquito';

const provider = 'https://api.tez.ie/rpc/carthagenet';

@Injectable({
  providedIn: 'root',
})
export class OperationReconiliatorService {
  private taquito = new TezosToolkit(provider);

  public async reconcile(op: OperationRequest) {
    if (op.status === OperationRequestStatus.PENDING) {
      let found = false;

      // Pending operation should have a response
      if (!op.response) {
        return op;
      }

      const { hash } = op.response;

      // TODO: Add caching to call
      const currentBlock = await this.taquito.rpc.getBlock();
      for (
        let i = op.emittedAt;
        i < Math.min(op.emittedAt + 10, currentBlock.header.level);
        i++
      ) {
        const block = await this.taquito.rpc.getBlock({ block: String(i) });
        if (
          block.operations.some((group) => group.some((op) => op.hash === hash))
        ) {
          found = true;
        }
      }

      if (found) {
        op.setStatus(OperationRequestStatus.COMPLETED);
      } else {
        const opTx = this.taquito.operation.createOperation(hash);
        op.setResponse(op.response, opTx);
      }
    }
    return op;
  }
}
