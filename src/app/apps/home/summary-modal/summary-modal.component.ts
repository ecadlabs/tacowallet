import { Component, OnInit, Input } from '@angular/core';
// import { Operation } from '../../../../../packages/taquito/dist/types/operations/operations';

@Component({
  selector: 'app-summary-modal',
  templateUrl: './summary-modal.component.html',
  styleUrls: ['./summary-modal.component.scss'],
})
export class SummaryModalComponent implements OnInit {

  @Input()
  op: any;

  loading: boolean = true;

  constructor() { }

  async ngOnInit() {
    this.loading = true;
    this.op.onStatusChanged$.subscribe(() => {
      if( this.op.status === 'completed'){
        this.loading = false;
      }
    });
  }

}
