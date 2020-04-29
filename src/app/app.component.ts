import { Component } from '@angular/core';
import { LocaleConfigService } from './service/locale-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  isTla = false;
  locale = 'id';

  uang = 1234567.23124125;
  uang2 = 6;

  // Later only use service from currency config
  constructor(private localeConfigService: LocaleConfigService) { }

  // Will later called from currency config
  changeLocale(local: string): void {
    console.log(this.isTla);

    // Nanti pakai json
    if (local == 'en') {
      this.localeConfigService.changeLocale({ localId: local, currencyCode: 'USD', currencyDisplayName: 'Dollar', isUseTLACode: this.isTla });
    }
    else if (local == 'id') {
      this.localeConfigService.changeLocale({ localId: local, currencyCode: 'IDR', currencyDisplayName: 'Rupiah', isUseTLACode: this.isTla });
    }
    else if (local == 'fr') {
      this.localeConfigService.changeLocale({ localId: local, currencyCode: 'EUR', currencyDisplayName: 'Euro', isUseTLACode: this.isTla });
    }

    this.locale = local;
  }

  checkTla() {
    this.changeLocale(this.locale);
  }

  changeValueModel(): void {
    this.uang = 123;
    this.uang2 = 123;
  }
}
