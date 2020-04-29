import { formatCurrency, getCurrencySymbol } from '@angular/common';
import { LocaleData } from '../service/locale-config.service';

export function isCurrency(value: string): boolean {
    if (value) {
        // if contain comma, <space>, or char then it is currency, but not with only whitespace
        return !/^[\d.-]+$/.test(value) && !!value.trim().length; // \d means [0-9]
    } else {
        return false;
    }
}

export function isValidNumber(value: string): boolean {
    if (value) {
        // digit, dot, and leading minus only
        return /^[\d.-]+$/.test(value) && !isNaN(+value);
    } else {
        return false;
    }
}

// Assumption string already valid, not "", "  ", null etc (see: isValidNumber)
export function hasLeadingZero(value: string): boolean {
    return String(+value) != value;
}

export function parseCurrency(value: string): Number {
    // if not accurate need thousand and decimal data based on locale
    // or use unformat and locale data

    // Remove Rp, $, dll
    let removedSymbol = ''
    if (isCurrency(value)) {
        removedSymbol = value.replace(/[^\d.,-]/g, '');
    }

    let result = 0;
    try {
        if (removedSymbol.length >= 4) {
            // Assumption always use 2-digit fraction and already forced in currency mask(may wrong for some countries)
            const decimalSymbol = removedSymbol[removedSymbol.length - 3]; // 2-digit, then should be check nan to find right decimal(2 or 1 or 0)
            // const decimalSymbol = removedSymbol[removedSymbol.length - 2]; // 1-digit
            // const decimalSymbol = '.'; // 0-digit

            // ref : https://en.wikipedia.org/wiki/Decimal_separator
            if (isNaN(+decimalSymbol)) {
                // 1.000,00(non-english country) atau 1 000,0(maybe)
                if (decimalSymbol === ',') {
                    const usVal = removedSymbol.replace(/[. ]/g, '').replace(/,/g, '.'); // To 1000.00
                    result = +usVal;
                    if (!isNaN(result)) {
                        return result;
                    } else {
                        throw "pc:fail:" + result;
                    }
                    // 1,000.00(english country) atau 1 000.0(international std)
                } else if (decimalSymbol === '.') {
                    const usVal = removedSymbol.replace(/[, ]/g, '');
                    result = +usVal;
                    if (!isNaN(result)) {
                        return result;
                    } else {
                        throw "pc:fail:" + result;
                    }
                } else {
                    throw "pc:fail:unknowndecsym";
                }
            }
            else {
                throw "pc:fail:nodecsym";
            }
        } else {
            // No decimal yet (e.g. 0(unformated) or undefined or null or string empty)
            return isNaN(+value) ? 0 : +value;
        }
    }
    catch (err) {
        console.error(err);
        return 0;
    }
}

export function formatLocaleCurrency(money, localData: LocaleData): string {
    let value = +money;
    if (isNaN(value)) { value = 0; }

    // Formatting the money $$$
    let formattedCurrency: string = '';
    try {
        let sym: string
        if (!localData.isUseTLACode) {
            sym = getCurrencySymbol(localData.currencyCode, 'narrow');// + ' ';
        } else { sym = localData.currencyCode; }

        // if(sym === 'Rp ') { sym = 'Rp. ' }

        formattedCurrency = formatCurrency(value, localData.localId, sym, undefined, '.2-2'); // forcing digitinfo
    }
    catch (e) {
        let sym: string = '';
        if (localData) {
            if (!localData.isUseTLACode) {
                sym = getCurrencySymbol('IDR', 'narrow');// + ' ';
            } else { sym = localData.currencyCode; }
        } else { sym = 'Rp'; } // Rp.
        formattedCurrency = formatCurrency(value, 'id', sym, undefined, '.2-2');
    }

    return formattedCurrency;
}

// console.log(parseCurrency('Rp1.123,67'));
    // console.log(parseCurrency('$1,123.67'));
    // console.log(parseCurrency('&1 123.67'));
    // console.log(parseCurrency('^1 123,67'));
    // console.log(parseCurrency('^1,67 ^'));
    // console.log(parseCurrency('^9,99'));