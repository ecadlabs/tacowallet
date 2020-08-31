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
  ],
  providers: [
    {
      provide: 'SummaryFunc',
      useFactory: (modalController: ModalController) => async (op: any) => {
        const modal = await modalController.create({
          component: SummaryModalComponent,
          componentProps: {
            op,
          },
        });
        return modal.present();
      },
      deps: [ModalController],
    },
  ]
})
export class ConfirmModalModule {
constructor(
  summary: SummaryService,
  @Inject('SummaryFunc') summaryFunc: any
  ){
    summary.registerCb(APP_ID, summaryFunc);
  }
}