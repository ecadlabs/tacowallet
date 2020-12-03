import { TezosToolkit } from '@taquito/taquito';
import { BehaviorSubject } from 'rxjs';
import { OperationRequest, OperationResponse } from './operation';
import { Estimate } from '@taquito/taquito/dist/types/contract/estimate';
import { RPCOperation } from '@taquito/taquito/dist/types/operations/types';
import { importKey } from "@taquito/signer";

const provider = 'https://api.tez.ie/rpc/carthagenet';
const TEZTOMUTEZ = 1000000;

export interface FaucetKey {
  email: string;
  password: string;
  mnemonic: string[];
  secret: string;
}

export class Account {
  public readonly id: string = '1';

  private permissionRequest = new Map<string, PermissionRequest[]>();

  public operationRequest$ = new BehaviorSubject(this.operationRequest);

  public static async createFromFaucet(
    faucet: FaucetKey,
    operationRequest: OperationRequest[] = [],
    operationResponse: OperationResponse[] = []
  ) {
    const { email, password, mnemonic, secret } = faucet;
    const taquito = new TezosToolkit(provider);
    await importKey(taquito, email, password, mnemonic.join(' '), secret);
    return new Account(taquito, faucet);
  }

  private constructor(
    private taquito: TezosToolkit,
    private faucet: FaucetKey,
    private operationRequest: OperationRequest[] = [],
    private operationResponse: OperationResponse[] = [],
  ) {}

  async getPKH() {
    return this.taquito.signer.publicKeyHash();
  }

  async getPK() {
    return this.taquito.signer.publicKey();
  }

  async process(op: OperationRequest): Promise<OperationResponse> {
    // tslint:disable-next-line: no-string-literal no-non-null-assertion

    let rpcOps: any = []; // ParamsWithKind[] = [];
    rpcOps = this.prepareOpByType(rpcOps, op);
    const opTx = await (await this.taquito).batch(rpcOps).send();
    const opRes = { id: op.id, hash: opTx.hash };
    this.operationResponse.push(opRes);
    op.setResponse(opRes, opTx);
    return opRes;
  }

  prepareOpByType(rpcOps: any, op: OperationRequest) {
    for (const operation of op.ops) {
      if (operation.kind === 'transaction') {
        rpcOps.push({
          kind: 'transaction',
          to: operation.destination,
          amount: Number(operation.amount),
          mutez: true,
          parameter: operation.parameters,
        });
      } else if (operation.kind === 'origination') {
        rpcOps.push({
          kind: 'origination',
          balance: Number(operation.balance)/TEZTOMUTEZ,
          init: operation.script.storage,
          code: operation.script.code
        })
      }
  }
    return rpcOps;
  }

  async estimateOperation(operation: OperationRequest): Promise<Estimate[]> {
    let rpcOps: any = [];
    rpcOps = this.prepareOpByType(rpcOps, operation);
    const estimate = await this.taquito.estimate.batch(rpcOps);
    return estimate
  }

  addOperationRequest(op: OperationRequest) {
    this.operationRequest.push(op);
    this.operationRequest$.next(this.operationRequest);
  }

  addOperationResponse(op: OperationResponse) {
    this.operationResponse.push(op);
  }

  addPermissionRequest(permission: PermissionRequest) {
    permission.allow();
    this.permissionRequest.get(permission as any);
  }

  serialize() {
    return {
      faucetKey: this.faucet,
      operationRequest: this.operationRequest.map((x) => x.serialize()),
    };
  }
}
