import { Directive, ElementRef, Renderer2, OnInit, OnDestroy, Input, SimpleChanges, OnChanges } from '@angular/core';
import { formatCurrency, getCurrencySymbol } from '@angular/common';
import { LocaleConfigService, LocaleData } from '../service/locale-config.service';
import { Subscription } from 'rxjs';
import { formatLocaleCurrency } from '../helper/currency-helper';

@Directive({
  selector: '[appSolCurrency]'
})
export class SolCurrencyDirective implements OnInit, OnDestroy, OnChanges {

  @Input() money: string | number;
  private subs: Subscription;
  private localeData: LocaleData;

  constructor(private elementRef: ElementRef,
    private renderer: Renderer2,
    private localeConfigService: LocaleConfigService) {
  }

  ngOnInit(): void {
    this.subs = this.localeConfigService.localInfoChanged.subscribe((localeData) => {
      this.localeData = localeData;
      this.renderLocaleCurrency(this.money);
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    this.renderLocaleCurrency(this.money);
  }

  renderLocaleCurrency(value) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'innerHTML', formatLocaleCurrency(value, this.localeData));
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }
}
