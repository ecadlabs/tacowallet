import { Component, OnInit } from '@angular/core';
import { Tezos } from '@taquito/taquito';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { OperationRequest } from '../models/operation';
import { AccountService } from '../services/account.service';
import { OperationApproverService } from '../services/operation-approver.service';
import { SummaryService } from '../apps-services/summary.service';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss'],
})
export class ListPage implements OnInit {
  public txList$: Observable<
    OperationRequest[]
  > = this.account.currentAccount$.pipe(
    switchMap((ac) => {
      return ac.operationRequest$;
    })
  );

  constructor(
    private account: AccountService,
    private operationApprover: OperationApproverService,
    private summaryService: SummaryService
  ) {}

  public getStrTemplate(op: any) {
    return `${op.kind} To: ${op.destination} Amount: ${Tezos.format(
      'mutez',
      'tz',
      op.amount
    ).toString()} tz`;
  }

  async showSummary(op: OperationRequest) {
    this.summaryService.call(op.appID, op);
  }

  hasSummary(op: OperationRequest) {
    return this.summaryService.hasSummary(op.appID);
  }

  async approve(op: OperationRequest) {
    await this.operationApprover.approve(op);
  }

  ngOnInit() {}
  // add back when alpha.4 is out
  // navigate(item) {
  //   this.router.navigate(['/list', JSON.stringify(item)]);
  // }
}
