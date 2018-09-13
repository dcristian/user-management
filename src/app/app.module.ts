import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { UserService } from './services/user.service';
import { UserFormModalComponent } from './components/user-form-modal/user-form-modal.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserPermissionsFormModalComponent } from './components/user-permissions-form-modal/user-permissions-form-modal.component';
import { SortableColumnComponent } from './components/sortable-column/sortable-column.component';

@NgModule({
  declarations: [
    AppComponent,
    UserFormModalComponent,
    ConfirmationModalComponent,
    UserListComponent,
    UserPermissionsFormModalComponent,
    SortableColumnComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [
    UserService
  ],
  entryComponents: [
    UserFormModalComponent,
    ConfirmationModalComponent,
    UserPermissionsFormModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
