import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-faucet-key-modal',
  templateUrl: './faucet-key-modal.component.html',
  styleUrls: ['./faucet-key-modal.component.scss'],
})
export class FaucetKeyModalComponent implements OnInit {
  public faucetKey = '';

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() { }


  async submit() {
      this.modalCtrl.dismiss(this.faucetKey);
  }
}
