import { Directive, ElementRef, Renderer2, OnInit, OnDestroy, Input, HostListener, AfterViewInit, Output, EventEmitter, ChangeDetectorRef, OnChanges, SimpleChanges, AfterContentChecked, AfterViewChecked } from '@angular/core';
import { formatCurrency, getCurrencySymbol } from '@angular/common';
import { LocaleConfigService, LocaleData } from '../service/locale-config.service';
import { Subscription } from 'rxjs';
import { parseCurrency, formatLocaleCurrency, isCurrency, isValidNumber, hasLeadingZero } from '../helper/currency-helper';

//alt derive from ngx-currency
@Directive({
  selector: '[appSolCurrencyMask]'
})
export class SolCurrencyMaskDirective implements OnInit, OnDestroy, OnChanges, AfterContentChecked { //, AfterViewChecked

  @Input() ngModel;
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter(false);

  private localeData: LocaleData;
  private subs: Subscription;

  constructor(private elementRef: ElementRef,
    private renderer: Renderer2,
    private cdRef: ChangeDetectorRef,
    private localeConfigService: LocaleConfigService) {
  }

  // avoid el.value replaced by ngmodel raw value
  ngAfterContentChecked(): void {
    // console.log('before change in ngAfterContentChecked', this.ngModel, this.elementRef.nativeElement.value);
    if (document.activeElement != this.elementRef.nativeElement && !isCurrency(this.elementRef.nativeElement.value)) {
      this.renderLocaleCurrency(this.ngModel);
      // console.log('change in ngAfterContentChecked', this.ngModel, this.elementRef.nativeElement.value);
    }
    // console.log('after change in ngAfterContentChecked', this.ngModel, this.elementRef.nativeElement.value);
  }

  // // avoid el.value replaced by ngmodel raw value
  // ngAfterViewChecked(): void {
  //   console.log('ngAfterViewChecked', this.ngModel);
  //   console.log('ngAfterViewChecked', this.elementRef.nativeElement.value);
  //   if (document.activeElement != this.elementRef.nativeElement) {
  //     this.renderLocaleCurrency(this.ngModel, true);
  //   }
  // }

  ngOnInit(): void {
    this.subs = this.localeConfigService.localInfoChanged.subscribe((localeData) => {
      this.localeData = localeData;
      this.renderLocalePlaceholder();
      // this.notifyNgModelInCurrency();
      this.renderLocaleCurrency(this.ngModel);
    })
  }

  // Detect ngmodel change from outside directive
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (document.activeElement != this.elementRef.nativeElement) {
      // this.notifyNgModelInCurrency();
      this.renderLocaleCurrency(this.ngModel);
    }
  }

  @HostListener("focus", ["$event.target.value"])
  onFocus(value) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'value', parseCurrency(value));
  }

  @HostListener("blur", ["$event.target.value"])
  onBlur(value) {

    // for Invalid Input force to 0, e.g. '', '  ', '11e'
    if (!isValidNumber(value)) { value = 0; this.notifyNgModel(value); }
    else if (hasLeadingZero(value)) { this.notifyNgModel(+value); }

    this.renderLocaleCurrency(value);
  }

  // @HostListener("input", ["$event.target.value"])
  // handleInput(value) {
  // }

  // this listener not catching update ngmodel triggered from the component, only detect from user input
  // @HostListener("ngModelChange", ["$event"]) onNgModelChange(value) {
  //   //when value changes dynamically
  //   console.log('ngModelChange : ', value);
  //   if (document.activeElement != this.elementRef.nativeElement) {
  //     this.renderLocaleCurrency(value);
  //   }
  // }

  // Render only from user input trigger, changing el.nativeElement.value not changing ngModel
  renderLocaleCurrency(value, parse?: boolean) {

    // Parse if the input is currency
    let amount = value;
    if (parse) {
      amount = parseCurrency(amount);
    }
    this.renderer.setProperty(this.elementRef.nativeElement, 'value', formatLocaleCurrency(value, this.localeData));
  }

  // force changing ngModel value to currency format
  notifyNgModelInCurrency() {
    const rawAmount = parseCurrency(this.ngModel);
    this.ngModelChange.emit(formatLocaleCurrency(rawAmount, this.localeData));
    // ref candidJ : https://stackoverflow.com/questions/39787038/how-to-manage-angular2-expression-has-changed-after-it-was-checked-exception-w
    // avoid error in ngOnViewChecked because the model has changed
    this.cdRef.detectChanges();
  }

  // force changing ngModel value
  notifyNgModel(value: Number) {
    this.ngModelChange.emit(value);
    this.cdRef.detectChanges();
  }

  renderLocalePlaceholder() {
    this.renderer.setProperty(this.elementRef.nativeElement, 'placeholder', formatLocaleCurrency(0, this.localeData));
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }
}
