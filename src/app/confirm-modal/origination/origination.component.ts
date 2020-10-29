import { Component, OnInit, Input } from '@angular/core';
import { OperationHandlerService } from 'src/app/services/operation-handler.service';
import { TezosToolkit } from '@taquito/taquito';
import { Parser, emitMicheline } from '@taquito/michel-codec';

@Component({
  selector: 'app-origination',
  templateUrl: './origination.component.html',
  styleUrls: ['./origination.component.scss'],
})
export class OriginationComponent implements OnInit {

  @Input()
  operation: any;

  constructor(
    private op: OperationHandlerService,
    ) { }

  async ngOnInit() {
  }

  format(amount: string) {
    const Tezos = new TezosToolkit('https://api.tez.ie/rpc/carthagenet');
    return Tezos.format('mutez', 'tz', amount)
  }

  prettyPrint(param : any) {
    const p = new Parser()
    const storageParsed = p.parseJSON(param)
    return emitMicheline(storageParsed, {indent:"    ", newline: "\n",})
  }
}
