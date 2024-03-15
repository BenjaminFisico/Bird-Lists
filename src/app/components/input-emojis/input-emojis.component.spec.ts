import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputEmojisComponent } from './input-emojis.component';

describe('InputEmojisComponent', () => {
  let component: InputEmojisComponent;
  let fixture: ComponentFixture<InputEmojisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputEmojisComponent]
    });
    fixture = TestBed.createComponent(InputEmojisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
