import { Component } from '@angular/core';

import { Platform, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { OperationListenerService } from './services/operation-listener.service';
import { MenuService, MenuItem } from './apps-services/menu.service';
import { map, filter, switchMap, withLatestFrom } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router, NavigationEnd, Event } from '@angular/router';
import { AccountService } from './services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages: Observable<MenuItem[]> = this.menu.menuItems$.pipe(
    map((x) => {
      return [...x];
    })
  );

  public appPages2 = [
    {
      title: 'History',
      url: '/list',
      icon: 'list',
    },
    {
      title: 'Pairing',
      url: '/pair',
      icon: 'cog',
    },
  ];

  public currentTitle$ = this.router.events.pipe(
    filter<Event, NavigationEnd>((x: Event): x is NavigationEnd => {
      return x instanceof NavigationEnd;
    }),
    withLatestFrom(this.appPages),
    map(([x, menu]: [NavigationEnd, MenuItem[]]) => {
      const item = [...menu, ...this.appPages2].find(
        (y: any) => y.url === x.url
      ) || { title: 'Unknown' };
      return item.title;
    })
  );

  public currentAccountPKH$ = this.accounts.currentAccount$.pipe(
    switchMap((account) => {
      return account.getPKH();
    })
  );

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private op: OperationListenerService,
    private menu: MenuService,
    private router: Router,
    private accounts: AccountService,
    private modalController: ModalController
  ) {
    this.initializeApp();
  }

  async showWalletModal() {
    this.accounts.importFaucet();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.op.start();
    });
  }
}
