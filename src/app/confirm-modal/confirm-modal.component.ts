import { Component, Input, OnInit, Inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OperationHandlerService } from '../services/operation-handler.service';
import { OperationRequest } from '../models/operation';
import { Estimate } from '@taquito/taquito/dist/types/contract/estimate';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
})
export class ConfirmModalComponent implements OnInit {

  @Input()
  opRequest: OperationRequest;

  public estimate: Estimate[];
  loading: boolean = true;
  
  constructor(
    private modalCtrl: ModalController, 
    private op: OperationHandlerService,
    @Inject('SummaryFunc')
    private summaryFunc: any
    ) { }

  async ngOnInit() {  
    this.loading = true;
    await this.estimateFee(); 
    this.loading = false;
  }

  async confirm() {
    if (this.opRequest) {
      await this.modalCtrl.dismiss({
        'dismissed': true
      });
      await this.op.process(this.opRequest);
      await this.summaryFunc(this.opRequest);
    }
  }

  getOpType(i : number) {
    return this.opRequest.ops[i].kind;
  }

  async estimateFee() {
    this.estimate = await this.op.estimateOperation(this.opRequest);
  }

  getEstimatedFee(x: number) {
    return this.estimate[x].suggestedFeeMutez.toString() + " mutez";
  }
}
