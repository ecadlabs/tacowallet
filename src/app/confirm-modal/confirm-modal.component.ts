import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OperationHandlerService } from '../services/operation-handler.service';
import { OperationRequest } from '../models/operation';
import { Tezos } from '@taquito/taquito';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
})
export class ConfirmModalComponent implements OnInit {

  @Input()
  opRequest: any;

  constructor(private modalCtrl: ModalController, private op: OperationHandlerService) { }

  ngOnInit() {
    console.log(this.opRequest)
  }

  async confirm() {
    if (this.opRequest) {
      await this.modalCtrl.dismiss({
        'dismissed': true
      });
      await this.op.process(this.opRequest);
    }
  }

  format(amount: string) {
    return Tezos.format('mutez', 'tz', amount)
  }
}
