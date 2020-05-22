import {
  WalletClient,
  BeaconMessageType,
  OperationRequest as AirgapOperationRequest,
  PermissionRequest as AirgapPermissionRequest,
  OperationResponseInput,
  PermissionResponseInput,
} from "@airgap/beacon-sdk";
import { Injectable } from "@angular/core";
import { defer, NEVER, Observable, ReplaySubject } from "rxjs";
import {
  filter,
  first,
  shareReplay,
  switchMap,
  withLatestFrom,
} from "rxjs/operators";
import { OperationRequest } from "../../models/operation";
import { PermissionRequest } from "../../models/permission-request";
import { AccountService } from "../account.service";
import { OperationFactoryService } from "../operation-factory.service";
import { WalletInteractionStandard } from "../operation-listener.service";

@Injectable({
  providedIn: "root",
})
export class WalletInteractionService implements WalletInteractionStandard {
  constructor(
    private accounts: AccountService,
    private factory: OperationFactoryService,
  ) {}

  private paired = new ReplaySubject(1);
  public message$ = new ReplaySubject(1);

  private client$ = defer(async () => {
    const client = new WalletClient({ name: "test" });
    await client.init();
    await client.connect(async (message: AirgapPermissionRequest) => {
      if (message.type === BeaconMessageType.PermissionRequest) {
        const account = await this.accounts.getCurrentAccount();
        const response: PermissionResponseInput = {
          id: message.id,
          type: BeaconMessageType.PermissionResponse,
          pubkey: await account.getPK(),
          network: message.network,
          scopes: message.scopes,
        };
        await client.respond(response);
      }
      this.message$.next(message);
    });
    return client;
  }).pipe(shareReplay());

  permissions$: Observable<PermissionRequest> = NEVER;

  request$: Observable<OperationRequest> = this.message$.pipe(
    filter((x: any) => x.type === BeaconMessageType.OperationRequest),
    withLatestFrom(this.client$),
    switchMap(async ([x, client]: [AirgapOperationRequest, WalletClient]) => {
      const op = await this.factory.create(x.operationDetails as any, "test");
      op.response$.subscribe(async ({ hash }) => {
        const response: OperationResponseInput = {
          id: x.id,
          type: BeaconMessageType.OperationResponse,
          transactionHash: hash,
        };
        await client.respond(response);
      });
      return op;
    }),
  );

  public pair(pairingStr: string) {
    return this.client$
      .pipe(
        switchMap(async (client) => {
          await client.addPeer(
            {
              name: "test",
              pubKey: pairingStr,
              relayServer: "matrix.papers.tech",
            } as any,
          );
          this.paired.next(true);
        }),
        first(),
      )
      .toPromise();
  }
}
