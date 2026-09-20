import { TestBed } from '@angular/core/testing';
import { Demand } from './demand';

describe('Demand', () => {
  let service: Demand;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Demand);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
