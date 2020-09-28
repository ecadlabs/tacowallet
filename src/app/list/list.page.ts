import { Component, OnInit } from "@angular/core";
import { Tezos } from "@taquito/taquito";
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";
import { OperationRequest } from "../models/operation";
import { AccountService } from "../services/account.service";
import { OperationApproverService } from "../services/operation-approver.service";
import { SummaryService } from "../apps-services/summary.service";
import { Apollo, gql } from "apollo-angular";
import { formatDate } from "@angular/common";

@Component({
  selector: "app-list",
  templateUrl: "list.page.html",
  styleUrls: ["list.page.scss"],
})
export class ListPage implements OnInit {
  transactions: any[];
  currentPKH: any;

  todayDate: Date = new Date();

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
    private summaryService: SummaryService,
    private apollo: Apollo
  ) {}

  public getStrTemplate(op: any) {
    console.log("oop", op);
    return `${op.kind} To: ${op.destination} Amount: ${Tezos.format(
      "mutez",
      "tz",
      op.amount
    ).toString()} tz`;
  }

  public getTransactionAmount(amount) {
    return `${Tezos.format("mutez", "tz", amount).toString()} tz`;
  }

  public currentAccountPKH$ = this.account.currentAccount$.pipe(
    switchMap((account) => {
      return account.getPKH();
    })
  );

  getFormatedDate(date) {
    return formatDate(date, "MMM d, y, h:mm:ss a", "en-US");
  }

  async showSummary(op: OperationRequest) {
    this.summaryService.call(op.appID, op.tx);
  }

  hasSummary(op: OperationRequest) {
    return this.summaryService.hasSummary(op.appID);
  }

  async approve(op: OperationRequest) {
    await this.operationApprover.approve(op);
  }

  ngOnInit() {
    this.currentAccountPKH$.subscribe((pkh) => {
      this.currentPKH = pkh;
      this.apollo
        .watchQuery({
          query: gql`
        {
          account(account: "${pkh}") {
            transactions(limit: 10,  order_by: {field: "timestamp", direction: "desc"}) {
              source
              destination
              amount
              timestamp
              gas
              hash
            }
          }
        }
      `,
        })
        .valueChanges.subscribe((result: any) => {
          this.transactions = result?.data?.account?.transactions;
        });
    });
  }
  // add back when alpha.4 is out
  // navigate(item) {
  //   this.router.navigate(['/list', JSON.stringify(item)]);
  // }
}
