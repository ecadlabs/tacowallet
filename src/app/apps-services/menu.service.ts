import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { AccountService } from '../services/account.service';

export interface MenuItem {
  title: string;
  url: string;
  icon: string;
  amount?: string;
}

export interface IMenuService {
  getMenu(address: string): Promise<MenuItem[]>
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private map = new Map<string, IMenuService>();

  private _menu$ = new BehaviorSubject<IMenuService[]>([]);
  public menuItems$: Observable<MenuItem[]> =
    this.account.currentAccount$.pipe(switchMap((account) => {
      return this._menu$.pipe(switchMap((menu) => {
        return Promise.all((menu.map(async (x) => x.getMenu(await account.getPKH()))))
      }), map((results) => {
        return results.reduce((prev, c) => {
          return [...prev, ...c];
        }, [])
      }))
    }))


  constructor(private account: AccountService) { }

  registerService(id: string, service: IMenuService) {
    this.map.set(id, service);
    this._menu$.next(Array.from(this.map.values()))
  }

  // getMenus() {
  //   const menus = [];
  //   for (const menuService of Array.from(this.map.values())) {
  //     menus.push(menuService.getMenu())
  //   }
  // }
}
