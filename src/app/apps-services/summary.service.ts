import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SummaryService {

  private map = new Map();

  constructor() { }

  registerCb(id: string, cb: any) {
    this.map.set(id, cb);
  }

  call(id: string, op: any) {
    this.map.get(id)(op);
  }

  hasSummary(id: string) {
    return this.map.has(id);
  }
}
