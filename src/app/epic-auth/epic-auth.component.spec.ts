import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpicAuthComponent } from './epic-auth.component';

describe('EpicAuthComponent', () => {
  let component: EpicAuthComponent;
  let fixture: ComponentFixture<EpicAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpicAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpicAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
