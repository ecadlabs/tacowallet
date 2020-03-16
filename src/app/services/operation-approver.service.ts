import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { OperationRequest } from '../models/operation';

@Injectable({
  providedIn: 'root'
})
export class OperationApproverService {
  constructor(
    private modalController: ModalController
  ) { }

  async approve(op: OperationRequest) {
    const modal = await this.modalController.create({
      component: ConfirmModalComponent,
      componentProps: {
        opRequest: op
      }
    });
    return modal.present();
  }
}
