import { TezosToolkit } from '@taquito/taquito';
import { Observable, defer } from 'rxjs';
import {
  switchMap,
  first,
  publishReplay,
  refCount,
  filter,
  withLatestFrom,
  map,
} from 'rxjs/operators';
const sdk = require('matrix-js-sdk');
const taquitoUtil = require('@taquito/utils');
const toBuffer = require('typedarray-to-buffer');
const sodium = require('libsodium-wrappers');

export class MatrixMessage {
  constructor(public readonly data: any, private client: MatrixClient) {}

  private getEvent() {
    return this.data.event;
  }

  public getSender() {
    return this.data.event.sender || this.data.event.user_id;
  }

  isOfType(type: string) {
    return this.getEvent().type === type;
  }

  getBodyJSON() {
    return JSON.parse(this.getEvent().content.body || this.getEvent().content);
  }

  reply(data: any) {
    const roomId = this.getEvent().room_id;
    return this.client.sendMessage(roomId, JSON.stringify(data));
  }

  replyError(error: any) {
    const roomId = this.getEvent().room_id;
    return this.client.sendMessage(roomId, JSON.stringify(error));
  }
}

export class MatrixClient {
  public connect$: Observable<any> = defer(() => {
    let client = sdk.createClient('https://matrix.papers.tech');
    return new Observable<any>((sub) => {
      // tslint:disable-next-line: no-floating-promises
      (async () => {
        try {
          const response = await client.login('m.login.password', {
            user: await this.getUser(),
            password: await this.getPassword(),
          });
          client = sdk.createClient({
            baseUrl: 'https://matrix.papers.tech',
            accessToken: response.access_token,
            userId: await this.getUser(),
          });

          client.startClient();

          client.once('sync', () => {
            sub.next(client);
          });
        } catch (ex) {
          sub.error(ex);
        }
      })();

      return () => {
        client.stopClient();
      };
    });
  }).pipe(publishReplay(), refCount());

  public message$: Observable<MatrixMessage> = this.connect$.pipe(
    switchMap((client) => {
      return new Observable<MatrixMessage>((sub) => {
        const timelineListener = (event: any) => {
          sub.next(new MatrixMessage(event, this));
        };

        const errorListener = (event: any) => {
          sub.error(event);
        };

        client.on('Room.timeline', timelineListener);
        client.on('error', errorListener);

        return () => {
          client.off('Room.timeline', timelineListener);
          client.off('error', errorListener);
        };
      });
    }),
    withLatestFrom(this.getUser()),
    filter(([x, user]) => {
      return x.getSender() !== user;
    }),
    map(([x]) => x)
  );

  private createSigningMessage() {
    return Buffer.from(
      `login:${Math.floor(Date.now() / (5 * 60000))}`,
      'utf8'
    ).toString('hex');
  }

  private async getUser() {
    const hexPublicKey = taquitoUtil.b58cdecode(
      await this.taquito.signer.publicKey(),
      taquitoUtil.prefix.edpk
    );
    const hexPubkeyHash = taquitoUtil.buf2hex(
      toBuffer(sodium.crypto_generichash(32, hexPublicKey))
    );
    return `@${hexPubkeyHash}:matrix.papers.tech`;
  }

  private async getPassword() {
    // TODO: Allow passing now magic bytes
    const { sig } = await (this.taquito.signer as any).sign(
      this.createSigningMessage()
    );
    // tslint:disable-next-line: no-string-literal
    const decodedSig = taquitoUtil.b58cdecode(sig, taquitoUtil.prefix['sig']);
    const hexSig = taquitoUtil.buf2hex(toBuffer(decodedSig));
    // tslint:disable-next-line: no-string-literal
    const hexPublicKey = taquitoUtil.b58cdecode(
      await this.taquito.signer.publicKey(),
      taquitoUtil.prefix.edpk
    );
    const hexPubkey = taquitoUtil.buf2hex(toBuffer(hexPublicKey));
    return `:${hexSig}:${hexPubkey}`;
  }

  constructor(private taquito: TezosToolkit) {}

  async createRoom(userID: string) {
    const user = await this.getUser();
    return this.connect$
      .pipe(
        switchMap((client) => {
          return new Observable<string>((sub) => {
            client.createRoom(
              {
                visibility: 'public',
                invite: [userID],
              },
              (err: any, { room_id }: any) => {
                if (err) {
                  sub.error(err);
                  return;
                }

                setTimeout(() => {
                  client.sendTextMessage(
                    room_id,
                    '@channel-open:a0b28a06497f357ef7b27b60a0ceedb5e3fd7eeb029f669d5faef65ecff6a992',
                    console.log
                  );
                }, 5000);

                sub.next(room_id);
                // client.invite(room_id, userID, (err) => {
                //   if (err) {
                //     sub.error(err);
                //     return
                //   }

                // })
              }
            );
          });
        }),
        first()
      )
      .toPromise();
  }

  joinRoom(roomID: string) {
    return this.connect$.pipe(
      switchMap((client: any) => {
        return new Observable<any>((sub) => {
          client.joinRoom(roomID).done((_room: any, err: any) => {
            if (err) {
              sub.error(err);
              return;
            }

            sub.next(client);
          });
        });
      })
    );
  }

  async sendMessage(roomID: string, message: string) {
    const client = await this.connect$.pipe(first()).toPromise();
    client.sendTextMessage(roomID, message);
  }
}
