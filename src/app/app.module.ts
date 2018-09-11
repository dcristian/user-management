import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { UserService } from './services/user.service';
import { UserFormModalComponent } from './components/user-form-modal/user-form-modal.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    UserFormModalComponent,
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
    UserFormModalComponent,
    ConfirmationModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
