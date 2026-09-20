import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SurplusFood } from './surplus-food';

describe('SurplusFood', () => {
  let component: SurplusFood;
  let fixture: ComponentFixture<SurplusFood>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurplusFood],
    }).compileComponents();

    fixture = TestBed.createComponent(SurplusFood);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
