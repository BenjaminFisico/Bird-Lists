import { TestBed } from '@angular/core/testing';

import { DocumentClickService } from './document-click.service';

describe('DocumentClickService', () => {
  let service: DocumentClickService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentClickService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
