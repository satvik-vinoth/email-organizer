import { TestBed } from '@angular/core/testing';

import { Gmail } from './gmail';

describe('Gmail', () => {
  let service: Gmail;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Gmail);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
