import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SolCurrencyMaskDirective } from './directive/sol-currency-mask.directive';
import { SolCurrencyDirective } from './directive/sol-currency.directive';

// add indonesia locale
import localeID from '@angular/common/locales/id';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeID);

@NgModule({
  declarations: [
    AppComponent,
    SolCurrencyMaskDirective,
    SolCurrencyDirective
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
