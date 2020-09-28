import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { WalletInteractionService } from "./services/operation-request-source/wallet-interaction.service";
import { OperationRequestService } from "./services/operation-request-source/operation-request.service";
import { FaucetKeyModalComponent } from "./faucet-key-modal/faucet-key-modal.component";
import { FormsModule } from "@angular/forms";
import { ConfirmModalModule } from "./confirm-modal/confirm-modal.module";

import { HttpClientModule } from "@angular/common/http";
import { APOLLO_OPTIONS } from "apollo-angular";
import { HttpLink } from "apollo-angular/http";
import { InMemoryCache } from "@apollo/client/core";

@NgModule({
  declarations: [AppComponent, FaucetKeyModalComponent],
  entryComponents: [FaucetKeyModalComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ConfirmModalModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: "TEST", multi: true, useExisting: WalletInteractionService },
    { provide: "TEST", multi: true, useExisting: OperationRequestService },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: "https://carthagenet.idx.tez.ie/graphql",
          }),
        };
      },
      deps: [HttpLink],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
