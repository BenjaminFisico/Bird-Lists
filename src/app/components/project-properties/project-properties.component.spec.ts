import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPropertiesComponent } from './project-properties.component';

describe('ProjectPropertiesComponent', () => {
  let component: ProjectPropertiesComponent;
  let fixture: ComponentFixture<ProjectPropertiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectPropertiesComponent]
    });
    fixture = TestBed.createComponent(ProjectPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
