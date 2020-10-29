import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { OperationRequest } from 'src/app/models/operation';
// import { Operation } from '../../../../../packages/taquito/dist/types/operations/operations';

@Component({
  selector: 'app-summary-modal',
  templateUrl: './summary-modal.component.html',
  styleUrls: ['./summary-modal.component.scss'],
})
export class SummaryModalComponent implements OnInit {

  @Input()
  op: OperationRequest;

  loading: Observable<boolean>;

  constructor() { }

  async ngOnInit() {
    this.loading = this.op.onStatusChanged$.pipe(
      map(() => {
        return this.op.status !== 'completed'
      }),
      startWith(true)
      )
  }

}
