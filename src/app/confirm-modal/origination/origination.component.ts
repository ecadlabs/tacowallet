import { Component, OnInit, Input } from '@angular/core';
import { OperationHandlerService } from 'src/app/services/operation-handler.service';
import { Tezos } from '@taquito/taquito';
import { Parser, emitMicheline } from '@taquito/michel-codec';

@Component({
  selector: 'app-origination',
  templateUrl: './origination.component.html',
  styleUrls: ['./origination.component.scss'],
})
export class OriginationComponent implements OnInit {

  @Input()
  operation: any;

  //public fees: String = "Estimating fees...";

  constructor(
    private op: OperationHandlerService,
    ) { }

  async ngOnInit() {
    //this.estimateFee();
    
  }
/*   async estimateFee() {
    const estimate = await this.op.estimateOperation(this.operation)
    this.fees = estimate[0].suggestedFeeMutez.toString() + " mutez";
  } */

  format(amount: string) {
    return Tezos.format('mutez', 'tz', amount)
  }

  prettyPrint(param : any) {
    const p = new Parser()
    const storageParsed = p.parseJSON(param)
    return emitMicheline(storageParsed, {indent:"    ", newline: "\n",})
  }
}
