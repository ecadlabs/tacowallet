import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WalletInteractionService } from './services/operation-request-source/wallet-interaction.service';
import { OperationRequestService } from './services/operation-request-source/operation-request.service';
import { FaucetKeyModalComponent } from './faucet-key-modal/faucet-key-modal.component';
import { FormsModule } from '@angular/forms';
import { ConfirmModalModule } from './confirm-modal/confirm-modal.module';

@NgModule({
  declarations: [AppComponent, FaucetKeyModalComponent],
  entryComponents: [FaucetKeyModalComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ConfirmModalModule,
    FormsModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: 'TEST', multi: true, useExisting: WalletInteractionService },
    { provide: 'TEST', multi: true, useExisting: OperationRequestService },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
