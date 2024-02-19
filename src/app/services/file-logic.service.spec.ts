import { TestBed } from '@angular/core/testing';

import { FileLogicService } from './file-logic.service';

describe('FileLogicService', () => {
  let service: FileLogicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileLogicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
