// Land Measure BD — pure conversion logic (no DOM). UMD: works in browser + node.
// Base unit: square feet. Standard Bangladesh land-unit relations:
//   1 acre = 100 decimal = 43,560 sq ft
//   1 decimal (= 1 shotangsho) = 435.6 sq ft
//   1 katha = 720 sq ft
//   1 bigha = 20 katha = 14,400 sq ft
//   1 hectare = 10,000 sq m = 107,639.104 sq ft
//   1 sq m = 10.7639104 sq ft ; 1 sq yd = 9 sq ft
(function (root) {
  'use strict';
  var SQFT = {
    sqft: 1,
    decimal: 435.6,
    katha: 720,
    bigha: 14400,
    acre: 43560,
    hectare: 107639.104,
    sqm: 10.7639104,
    sqyd: 9
  };
  var ORDER = ['sqft', 'decimal', 'katha', 'bigha', 'acre', 'hectare', 'sqm', 'sqyd'];

  function isValidNumber(v) {
    return typeof v === 'number' && isFinite(v) && v > 0;
  }
  function toSqft(value, unit) {
    if (!isValidNumber(value) || !SQFT[unit]) return null;
    return value * SQFT[unit];
  }
  function fromSqft(sqft, unit) {
    if (!isValidNumber(sqft) || !SQFT[unit]) return null;
    return sqft / SQFT[unit];
  }
  // Convert a value from one unit into every unit. Returns null on bad input.
  function convertAll(value, unit) {
    var sqft = toSqft(value, unit);
    if (sqft === null) return null;
    var out = {};
    ORDER.forEach(function (u) { out[u] = sqft / SQFT[u]; });
    return out;
  }
  // Rectangular plot: lengthFt x widthFt -> area in every unit. Null on bad input.
  function plotArea(lengthFt, widthFt) {
    if (!isValidNumber(lengthFt) || !isValidNumber(widthFt)) return null;
    var sqft = lengthFt * widthFt;
    var out = {};
    ORDER.forEach(function (u) { out[u] = sqft / SQFT[u]; });
    return out;
  }
  // Price estimate: area (in areaUnit) at pricePerUnit (BDT per priceUnit).
  // Returns { total, perSqft } or null on bad input.
  function priceEstimate(area, areaUnit, pricePerUnit, priceUnit) {
    if (!isValidNumber(area) || !isValidNumber(pricePerUnit)) return null;
    if (!SQFT[areaUnit] || !SQFT[priceUnit]) return null;
    var areaSqft = area * SQFT[areaUnit];
    var perSqft = pricePerUnit / SQFT[priceUnit];
    return { total: areaSqft * perSqft, perSqft: perSqft };
  }
  // Format a number: max 4 decimals, trailing zeros trimmed, thousands separators.
  function fmt(n) {
    if (n === null || n === undefined || !isFinite(n)) return '—';
    var rounded = Math.round(n * 10000) / 10000;
    var parts = String(rounded).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
  var BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  function toBnDigits(str) {
    return String(str).replace(/[0-9]/g, function (d) { return BN_DIGITS[+d]; });
  }
  var api = {
    SQFT: SQFT, ORDER: ORDER, isValidNumber: isValidNumber,
    toSqft: toSqft, fromSqft: fromSqft, convertAll: convertAll,
    plotArea: plotArea, priceEstimate: priceEstimate,
    fmt: fmt, toBnDigits: toBnDigits
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.LandMeasure = api;
})(typeof window !== 'undefined' ? window : this);
