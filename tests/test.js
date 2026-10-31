// Node unit tests for land.js. Run: node tests/test.js
'use strict';
const assert = require('assert');
const L = require('../js/land.js');
let n = 0;
function eq(actual, expected, name) {
  n++;
  assert.strictEqual(actual, expected, name + ' (got ' + actual + ')');
  console.log('ok - ' + name);
}
function near(actual, expected, tol, name) {
  n++;
  assert.ok(Math.abs(actual - expected) <= tol, name + ' (got ' + actual + ', want ' + expected + ')');
  console.log('ok - ' + name);
}
// Conversion factors
eq(L.SQFT.decimal, 435.6, 'decimal sqft');
eq(L.SQFT.katha, 720, 'katha sqft');
eq(L.SQFT.bigha, 14400, 'bigha sqft');
eq(L.SQFT.acre, 43560, 'acre sqft');
// 1 acre = 100 decimal
near(L.convertAll(1, 'acre').decimal, 100, 1e-9, '1 acre = 100 decimal');
// 1 bigha = 20 katha
near(L.convertAll(1, 'bigha').katha, 20, 1e-9, '1 bigha = 20 katha');
// 1 katha in decimal
near(L.convertAll(1, 'katha').decimal, 720 / 435.6, 1e-9, '1 katha in decimal');
// 5 decimal -> sqft
near(L.convertAll(5, 'decimal').sqft, 2178, 1e-9, '5 decimal = 2178 sqft');
// hectare
near(L.convertAll(1, 'hectare').acre, 2.47105, 1e-4, '1 hectare in acres');
// sqm / sqyd
near(L.convertAll(1, 'sqm').sqft, 10.7639104, 1e-6, '1 sqm in sqft');
near(L.convertAll(1, 'sqyd').sqft, 9, 1e-9, '1 sqyd = 9 sqft');
// Round-trip every unit
L.ORDER.forEach(function (u) {
  near(L.convertAll(L.convertAll(3.25, u).sqft, 'sqft')[u], 3.25, 1e-9, 'round-trip ' + u);
});
// Plot area: 60 x 40 ft = 2400 sqft
near(L.plotArea(60, 40).sqft, 2400, 1e-9, 'plot 60x40 sqft');
near(L.plotArea(60, 40).katha, 2400 / 720, 1e-9, 'plot 60x40 katha');
// Price: 10 decimal @ 500,000 BDT/decimal = 5,000,000
near(L.priceEstimate(10, 'decimal', 500000, 'decimal').total, 5000000, 1e-6, 'price same-unit total');
near(L.priceEstimate(10, 'decimal', 500000, 'decimal').perSqft, 500000 / 435.6, 1e-6, 'price per sqft');
// Price across units: 1 bigha @ 100,000/katha = 2,000,000
near(L.priceEstimate(1, 'bigha', 100000, 'katha').total, 2000000, 1e-6, 'price cross-unit total');
// Invalid inputs
eq(L.convertAll(0, 'decimal'), null, 'zero rejected');
eq(L.convertAll(-5, 'decimal'), null, 'negative rejected');
eq(L.convertAll(NaN, 'decimal'), null, 'NaN rejected');
eq(L.convertAll(5, 'nope'), null, 'unknown unit rejected');
eq(L.plotArea(0, 40), null, 'plot zero length rejected');
eq(L.plotArea(60, -1), null, 'plot negative width rejected');
eq(L.priceEstimate(10, 'decimal', 0, 'decimal'), null, 'price zero rate rejected');
eq(L.priceEstimate(10, 'decimal', 500000, 'nope'), null, 'price unknown unit rejected');
// Formatting
eq(L.fmt(2178), '2,178', 'fmt thousands');
eq(L.fmt(1.65289), '1.6529', 'fmt 4 decimals');
eq(L.fmt(100), '100', 'fmt integer');
eq(L.toBnDigits('123'), '১২৩', 'Bengali digits');
eq(L.toBnDigits('2,178'), '২,১৭৮', 'Bengali digits keep comma');
console.log('\n' + n + '/' + n + ' unit tests passed');
