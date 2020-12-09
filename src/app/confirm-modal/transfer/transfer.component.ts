import { Component, OnInit, Input } from '@angular/core';
import { OperationRequest } from 'src/app/models/operation';
import { TezosToolkit } from '@taquito/taquito';
import { Parser, emitMicheline } from '@taquito/michel-codec';
import { OperationHandlerService } from 'src/app/services/operation-handler.service';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss'],
})
export class TransferComponent implements OnInit {

  @Input()
  operation: any;

  constructor(
    private op: OperationHandlerService,
    ) { }

  async ngOnInit() {
  }

  format(amount: string) {
    const Tezos = new TezosToolkit('https://api.tez.ie/rpc/delphinet');
    return Tezos.format('mutez', 'tz', amount);
  }

  prettyPrint(parameter: any){
    return JSON.stringify(parameter);
  }

}
