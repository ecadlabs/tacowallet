import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { BehaviorSubject } from 'rxjs';
import { LoadingController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-faucet-key-modal',
  templateUrl: './faucet-key-modal.component.html',
  styleUrls: ['./faucet-key-modal.component.scss'],
})
export class FaucetKeyModalComponent implements OnInit {
  public faucetKey = '';

  constructor(
    private accounts: AccountService,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() { }


  async submit() {
    const loading = await this.loadingCtrl.create({
      message: 'Activating faucet key'
    });
    loading.present();
    try {
      await this.accounts.createAccount(JSON.parse(this.faucetKey));
    } catch (ex) {
    } finally {
      loading.dismiss();
      this.modalCtrl.dismiss();
    }
  }
}
