import { Subject, Observable } from 'rxjs';
import { RPCOperation, ForgedBytes } from '@taquito/taquito/dist/types/operations/types';


export enum OperationRequestStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  NEED_APPROVAL = 'need_approval',
  ABORTED = 'need_approval'
}

export class OperationRequest {

  public tx?: any;
  public onStatusChanged$ = new Subject();

  constructor(
    public id: string,
    public ops: RPCOperation[],
    public appID: string,
    public emittedAt: number,
    public status: OperationRequestStatus = OperationRequestStatus.NEED_APPROVAL,
    public response?: OperationResponse
  ) { }

  private _response$ = new Subject<OperationResponse>();
  public response$: Observable<OperationResponse> = this._response$.asObservable();

  public setResponse(response: OperationResponse, tx: any) {
    this._response$.next(response);
    this.response = response;
    this.tx = tx;
    this.setStatus(OperationRequestStatus.PENDING);
    // tslint:disable-next-line: no-floating-promises
    tx.confirmation().then(() => {
      this.setStatus(OperationRequestStatus.COMPLETED);
    });
  }

  public setStatus(status: OperationRequestStatus) {
    this.status = status;
    this.onStatusChanged$.next();
  }

  public serialize() {
    return {
      id: this.id,
      appID: this.appID,
      ops: this.ops,
      emittedAt: this.emittedAt,
      status: this.status,
      response: this.response
    };
  }
}

export interface OperationResponse {
  id: string;
  hash: string;
  // forgedBytes: ForgedBytes;
  // opResponse: OperationContentsAndResult[];
}
