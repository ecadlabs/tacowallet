import { NgModule, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from './confirm-modal.component';
import { IonicModule, ModalController } from '@ionic/angular';
import { TransferComponent } from './transfer/transfer.component';
import { OriginationComponent } from './origination/origination.component';
import { SummaryModalComponent } from '../apps/home/summary-modal/summary-modal.component';
import { SummaryService } from '../apps-services/summary.service';

const APP_ID = 'test';

@NgModule({
  declarations: [ConfirmModalComponent, TransferComponent, OriginationComponent],
  entryComponents: [ConfirmModalComponent],
  imports: [
    IonicModule,
    CommonModule
  ]
})
export class ConfirmModalModule {
}