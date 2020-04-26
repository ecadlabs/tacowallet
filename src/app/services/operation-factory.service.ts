import { Injectable } from '@angular/core';
import { RPCOperation } from '@taquito/taquito/src/operations/types';
import { OperationRequest } from '../models/operation';
import { TezosToolkit } from '@taquito/taquito';
import { Tezos } from '@taquito/taquito/src/taquito';

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const provider = 'https://api.tez.ie/rpc/carthagenet';

@Injectable({
  providedIn: 'root',
})
export class OperationFactoryService {
  private taquito = new TezosToolkit();
  constructor() {
    this.taquito.setProvider({ rpc: provider });
  }

  async create(op: RPCOperation[], appID: string): Promise<OperationRequest> {
    const block = await this.taquito.rpc.getBlockHeader();
    return new OperationRequest(uuidv4(), op, appID, block.level);
  }

  async fromSerialized({ id, appID, ops, emittedAt, status, response }: any) {
    if (status === 'completed' || status === 'pending') {
      return new OperationRequest(id, ops, appID, emittedAt, status, response);
      // } else if (status === 'pending') {
      // // TODO: Need reconciliation (Extracting this into a reconciliation service)
      // let found = false;
      // const { hash, forgedBytes, opResponse } = response;
      // // TODO: Add caching to call
      // const currentBlock = await this.taquito.rpc.getBlock();
      // for (let i = emittedAt; i < Math.min(emittedAt + 10, currentBlock.header.level); i++) {
      //   const block = await this.taquito.rpc.getBlock({ block: i });
      //   if (block.operations.some((group) => group.some((op) => op.hash === hash))) {
      //     found = true;
      //   }
      // }

      // if (found) {
      //   return new OperationRequest(id, ops, appID, emittedAt, 'completed', response);
      // } else {
      //   const op = new OperationRequest(id, ops, appID, emittedAt, status, response);
      //   const opTx = new Operation(hash, forgedBytes, opResponse, this.taquito['_context'].clone());
      //   op.setResponse(response, opTx);
      //   return op;
      // }
    } else {
      return new OperationRequest(id, ops, appID, emittedAt, status);
    }
  }
}
