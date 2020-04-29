import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { registerLocaleData } from '@angular/common';
import { formatCurrency, getCurrencySymbol } from '@angular/common';

export interface LocaleData {
  localId: string;
  currencyCode: string;
  currencyDisplayName: string;
  isUseTLACode: boolean; // three-letter alphabetic code (ISO 4217)
}

@Injectable({
  providedIn: 'root'
})
export class LocaleConfigService {
  // (France, Germany, Spain, Italy countries) di kanan

  //Stream and reactive
  _localInfoChanged = new BehaviorSubject<LocaleData>({ localId: 'id', currencyCode: 'IDR', currencyDisplayName: 'Rupiah', isUseTLACode: false });

  get localInfoChanged() {
    return this._localInfoChanged.asObservable();
  }

  changeLocale(value: LocaleData) {
    this.localeInitializer(value.localId).then(() => {
      // todo : send to server

      this._localInfoChanged.next(value);
    });
  }

  // Non Stream and non observable
  private _locale: LocaleData = { localId: 'id', currencyCode: 'IDR', currencyDisplayName: 'Rupiah', isUseTLACode: false };

  set locale(value: LocaleData) {
    this._locale = value;
  }
  get locale(): LocaleData {
    return this._locale;
  }

  // Lazy Import Locale
  // Locale data need to be imported so the angular locale function will works
  localeInitializer(localeId: string): Promise<any> {
    return import(
      `@angular/common/locales/${localeId}.js`
    ).then(module => registerLocaleData(module.default));
  }
}
