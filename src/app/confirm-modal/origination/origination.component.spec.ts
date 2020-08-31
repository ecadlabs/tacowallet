import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OriginationComponent } from './origination.component';

describe('OriginationComponent', () => {
  let component: OriginationComponent;
  let fixture: ComponentFixture<OriginationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OriginationComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OriginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
