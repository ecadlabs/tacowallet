import { TezosToolkit } from '@taquito/taquito';
import { BehaviorSubject } from 'rxjs';
import { OperationRequest, OperationResponse } from './operation';

const provider = 'https://api.tez.ie/rpc/babylonnet';

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
    operationResponse: OperationResponse[] = [],
  ) {
    const { email, password, mnemonic, secret } = faucet;
    const taquito = new TezosToolkit();
    taquito.setProvider({ rpc: provider });
    await taquito.importKey(email, password, mnemonic.join(" "), secret);
    return new Account(taquito, faucet);
  }

  private constructor(
    private taquito: TezosToolkit,
    private faucet: FaucetKey,
    private operationRequest: OperationRequest[] = [],
    private operationResponse: OperationResponse[] = [],
  ) {
  }

  async getPKH() {
    return this.taquito.signer.publicKeyHash();
  }

  async getPK() {
    return this.taquito.signer.publicKey();
  }

  async process(op: OperationRequest): Promise<OperationResponse> {
    // tslint:disable-next-line: no-string-literal no-non-null-assertion
    console.log(op);

    const rpcOps: any = [];// ParamsWithKind[] = [];

    for (const operation of op.ops) {
      if (operation.kind === 'transaction') {
        rpcOps.push({ kind: 'transaction', to: operation.destination, amount: Number(operation.amount), mutez: true, parameter: operation.parameters })
      }
    }

    const opTx = await (await this.taquito).batch(rpcOps).send();
    const opRes = { id: op.id, hash: opTx.hash };
    this.operationResponse.push(opRes);
    op.setResponse(opRes, opTx);
    return opRes;
  }

  addOperationRequest(op: OperationRequest) {
    this.operationRequest.push(op);
    this.operationRequest$.next(this.operationRequest);
  }

  addOperationResponse(op: OperationResponse) {
    this.operationResponse.push(op);
  }

  addPermissionRequest(permission: PermissionRequest) {
    permission.allow()
    this.permissionRequest.get(permission as any)
  }

  serialize() {
    return {
      faucetKey: this.faucet,
      operationRequest: this.operationRequest.map((x) => x.serialize())
    }
  }
}
