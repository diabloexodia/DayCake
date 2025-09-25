import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountOnMeComponent } from './count-on-me.component';

describe('CountOnMeComponent', () => {
  let component: CountOnMeComponent;
  let fixture: ComponentFixture<CountOnMeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CountOnMeComponent]
    });
    fixture = TestBed.createComponent(CountOnMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
