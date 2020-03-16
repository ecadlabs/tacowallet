import { WalletClient } from '@airgap/beacon-sdk/dist/clients/WalletClient';
import { MessageTypes, OperationRequest as AirgapOperationRequest, OperationResponse, PermissionResponse, PermissionScope } from '@airgap/beacon-sdk/dist/messages/Messages';
import { Injectable } from '@angular/core';
import { encode } from 'bs58check';
import { defer, NEVER, Observable, ReplaySubject } from 'rxjs';
import { filter, first, shareReplay, switchMap, withLatestFrom } from 'rxjs/operators';
import { Network } from '../../../../../demo/src/app/models/network.model';
import { OperationRequest } from '../../models/operation';
import { PermissionRequest } from '../../models/permission-request';
import { AccountService } from '../account.service';
import { OperationFactoryService } from '../operation-factory.service';
import { WalletInteractionStandard } from '../operation-listener.service';

@Injectable({
  providedIn: 'root'
})
export class WalletInteractionService implements WalletInteractionStandard {


  constructor(
    private accounts: AccountService,
    private factory: OperationFactoryService
  ) { }

  private paired = new ReplaySubject(1);
  public message$ = new ReplaySubject(1);

  private client$ = defer(async () => {
    const client = new WalletClient('test');
    await client.init();
    const account = await this.accounts.getCurrentAccount();
    await client.connect(async (message) => {
      if (message.type === MessageTypes.PermissionRequest) {
        const response: PermissionResponse = {
          id: message.id,
          // senderId: message.senderId,
          type: MessageTypes.PermissionResponse,
          permissions: {
            pubkey: await account.getPK(),
            networks: [Network.Babylonnet],
            scopes: ['operation_request', 'read_address', 'sign', 'threshold'] as PermissionScope[]
          }
        };
        await client.respond(message.id, encode(Buffer.from(JSON.stringify(response))));
      }
      this.message$.next(message);
    });
    console.log('Init');
    return client;
  }).pipe(shareReplay());

  permissions$: Observable<PermissionRequest> = NEVER; // this.message$ as any;
  request$: Observable<OperationRequest> = this.message$.pipe(
    filter((x: any) => x.type === MessageTypes.OperationRequest),
    withLatestFrom(this.client$),
    switchMap(async ([x, client]: [AirgapOperationRequest, WalletClient]) => {
      const op = await this.factory.create(x.operationDetails as any, 'test')
      op.response$.subscribe(async ({ hash }) => {
        const response: OperationResponse = {
          id: x.id,
          // senderId: x.senderId,
          type: MessageTypes.OperationResponse,
          transactionHashes: [hash]
        };
        await client.respond(x.id, encode(Buffer.from(JSON.stringify(response))))
      });
      return op;
    }));

  public pair(pairingStr: string) {
    return this.client$.pipe(switchMap(async (client) => {
      // await client.removeAllPeers();
      await client.addPeer({ name: 'test', pubKey: pairingStr, relayServer: 'matrix.papers.tech' } as any);
      this.paired.next(true);
      // setTimeout(() => {
      //   this.permissions$.subscribe();
      // }, 1000)
    }), first()).toPromise();
  }
}
