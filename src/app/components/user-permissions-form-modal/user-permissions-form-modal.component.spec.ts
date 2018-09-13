import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPermissionsFormModalComponent } from './user-permissions-form-modal.component';

describe('UserPermissionsFormModalComponent', () => {
  let component: UserPermissionsFormModalComponent;
  let fixture: ComponentFixture<UserPermissionsFormModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPermissionsFormModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPermissionsFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
