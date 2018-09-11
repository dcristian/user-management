import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { UserService } from './services/user.service';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserModalComponent } from './components/user-modal/user-modal.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    UserFormComponent,
    UserModalComponent,
    ConfirmationModalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    UserService
  ],
  entryComponents: [
    UserModalComponent,
    ConfirmationModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
