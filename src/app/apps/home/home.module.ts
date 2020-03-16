import { NgModule, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { SummaryModalComponent } from './summary-modal/summary-modal.component';
import { SummaryService } from '../../apps-services/summary.service';
import { TaquitoService } from '../../apps-services/taquito.service';
import { MenuService } from '../../apps-services/menu.service';
import { MenuService as ChildMenu } from './menu.service';

const APP_ID = 'test'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  providers: [
    {
      provide: 'APP_ID', useValue: APP_ID
    },
    {
      provide: 'Taquito', useFactory: (taquito: TaquitoService, APP_ID: string) => {
        return taquito.getTaquito(APP_ID)
      }, deps: [TaquitoService, 'APP_ID']
    },
    {
      provide: 'SummaryFunc', useFactory: (modalController: ModalController) => async (op: any) => {
        const modal = await modalController.create({
          component: SummaryModalComponent,
          componentProps: {
            op
          }
        });
        return modal.present();
      },
      deps: [ModalController]
    },
    ChildMenu
  ],
  entryComponents: [SummaryModalComponent],
  declarations: [HomePage, SummaryModalComponent]
})
export class HomePageModule {
  constructor(
    summary: SummaryService,
    rootMenu: MenuService,
    menu: ChildMenu,
    @Inject('SummaryFunc') summaryFunc: any,
    @Inject('APP_ID') APP_ID: string
  ) {
    summary.registerCb(APP_ID, summaryFunc)
    rootMenu.registerService(APP_ID, menu);
  }
}
