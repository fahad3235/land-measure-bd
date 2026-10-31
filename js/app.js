/* Land Measure BD — bilingual EN/বাংলা UI. Depends on window.LandMeasure. */
(function () {
  'use strict';
  var L = window.LandMeasure;
  var UNITS = [
    { key: 'sqft', en: 'Square feet', bn: 'বর্গফুট' },
    { key: 'decimal', en: 'Decimal (Shotangsho)', bn: 'শতাংশ (ডেসিমাল)' },
    { key: 'katha', en: 'Katha', bn: 'কাঠা' },
    { key: 'bigha', en: 'Bigha', bn: 'বিঘা' },
    { key: 'acre', en: 'Acre', bn: 'একর' },
    { key: 'hectare', en: 'Hectare', bn: 'হেক্টর' },
    { key: 'sqm', en: 'Square metres', bn: 'বর্গমিটার' },
    { key: 'sqyd', en: 'Square yards', bn: 'বর্গগজ' }
  ];
  var STR = {
    en: {
      title: '🏡 Land Measure BD', subtitle: 'Bangladesh land units — decimal, katha, bigha, acre & more',
      convH: '1 · Unit Converter', amount: 'Amount', unit: 'Unit', convert: 'Convert',
      convHint: 'Enter a positive number and pick a unit.',
      convErr: 'Please enter a positive number.',
      plotH: '2 · Plot Area Calculator', length: 'Length (feet)', width: 'Width (feet)', calc: 'Calculate',
      plotHint: 'A rectangular plot: area = length × width.',
      plotErr: 'Please enter positive length and width.',
      priceH: '3 · Land Price Estimator', area: 'Area', areaUnit: 'Area unit',
      rate: 'Price per unit (৳)', rateUnit: 'Price unit', estimate: 'Estimate',
      priceHint: 'Total = area × rate, converted through square feet.',
      priceErr: 'Please enter a positive area and a positive rate.',
      refH: '4 · Standard Relations', refUnit: 'Unit', refSqft: 'Square feet', refNote: 'Note',
      total: 'Estimated total price', perSqft: 'Price per sq ft',
      copy: 'Copy results', copied: 'Copied!',
      foot: 'Fully offline — no data leaves your device. Standard Bangladesh units as commonly used in deeds and land records; local practice can vary (e.g. katha size differs in some areas), so verify against your deed before a transaction. Demo figures only — not legal or valuation advice.'
    },
    bn: {
      title: '🏡 জমি পরিমাপ বিডি', subtitle: 'বাংলাদেশের জমির একক — শতাংশ, কাঠা, বিঘা, একর ও আরও অনেক',
      convH: '১ · একক রূপান্তর', amount: 'পরিমাণ', unit: 'একক', convert: 'রূপান্তর করুন',
      convHint: 'একটি ধনাত্মক সংখ্যা দিন এবং একক বেছে নিন।',
      convErr: 'অনুগ্রহ করে একটি ধনাত্মক সংখ্যা দিন।',
      plotH: '২ · প্লটের ক্ষেত্রফল', length: 'দৈর্ঘ্য (ফুট)', width: 'প্রস্থ (ফুট)', calc: 'হিসাব করুন',
      plotHint: 'আয়তক্ষেত্রাকার প্লট: ক্ষেত্রফল = দৈর্ঘ্য × প্রস্থ।',
      plotErr: 'অনুগ্রহ করে ধনাত্মক দৈর্ঘ্য ও প্রস্থ দিন।',
      priceH: '৩ · জমির দাম অনুমান', area: 'জমির পরিমাণ', areaUnit: 'জমির একক',
      rate: 'প্রতি একক দাম (৳)', rateUnit: 'দামের একক', estimate: 'অনুমান করুন',
      priceHint: 'মোট = জমি × দর, বর্গফুটের মাধ্যমে রূপান্তর করে।',
      priceErr: 'অনুগ্রহ করে ধনাত্মক জমি ও ধনাত্মক দর দিন।',
      refH: '৪ · প্রমিত সম্পর্ক', refUnit: 'একক', refSqft: 'বর্গফুট', refNote: 'মন্তব্য',
      total: 'আনুমানিক মোট দাম', perSqft: 'প্রতি বর্গফুট দাম',
      copy: 'ফলাফল কপি করুন', copied: 'কপি হয়েছে!',
      foot: 'সম্পূর্ণ অফলাইন — আপনার কোনো তথ্য ডিভাইসের বাইরে যায় না। দলিল ও ভূমি রেকর্ডে প্রচলিত বাংলাদেশের প্রমিত একক; স্থানীয় প্রথা ভিন্ন হতে পারে (যেমন কিছু এলাকায় কাঠার আকার আলাদা), তাই লেনদেনের আগে দলিল মিলিয়ে নিন। শুধু ডেমো হিসাব — আইনি বা মূল্যায়ন পরামর্শ নয়।'
    }
  };
  var NOTES = {
    sqft: { en: 'Base unit', bn: 'মূল একক' },
    decimal: { en: '1 decimal = 435.6 sq ft', bn: '১ শতাংশ = ৪৩৫.৬ বর্গফুট' },
    katha: { en: '1 katha = 720 sq ft', bn: '১ কাঠা = ৭২০ বর্গফুট' },
    bigha: { en: '1 bigha = 20 katha', bn: '১ বিঘা = ২০ কাঠা' },
    acre: { en: '1 acre = 100 decimal', bn: '১ একর = ১০০ শতাংশ' },
    hectare: { en: '1 hectare = 10,000 sq m', bn: '১ হেক্টর = ১০,০০০ বর্গমিটার' },
    sqm: { en: '1 sq m = 10.7639 sq ft', bn: '১ বর্গমিটার = ১০.৭৬৩৯ বর্গফুট' },
    sqyd: { en: '1 sq yd = 9 sq ft', bn: '১ বর্গগজ = ৯ বর্গফুট' }
  };

  var lang = 'en';
  try { lang = localStorage.getItem('lmbd-lang') || 'en'; } catch (e) { /* private mode */ }
  if (lang !== 'bn') lang = 'en';

  function $(id) { return document.getElementById(id); }
  function unitName(key) {
    var u = UNITS.filter(function (x) { return x.key === key; })[0];
    return lang === 'bn' ? u.bn : u.en;
  }
  function num(n) {
    var s = L.fmt(n);
    return lang === 'bn' ? L.toBnDigits(s) : s;
  }
  function money(n) {
    var s = '৳' + L.fmt(Math.round(n * 100) / 100);
    return lang === 'bn' ? L.toBnDigits(s) : s;
  }
  function showErr(id, msg) {
    var el = $(id);
    el.textContent = msg;
    el.hidden = false;
  }
  function hideErr(id) { $(id).hidden = true; }

  function renderResults(elId, rows) {
    var box = $(elId);
    box.innerHTML = '';
    rows.forEach(function (r) {
      var div = document.createElement('div');
      div.className = 'res-row';
      var k = document.createElement('span');
      k.textContent = r[0];
      var v = document.createElement('strong');
      v.textContent = r[1];
      div.appendChild(k);
      div.appendChild(v);
      box.appendChild(div);
    });
    box.hidden = false;
  }
  function resultRows(obj) {
    return L.ORDER.map(function (u) { return [unitName(u), num(obj[u])]; });
  }

  function fillSelects() {
    ['convUnit', 'priceAreaUnit', 'priceRateUnit'].forEach(function (id) {
      var sel = $(id);
      var cur = sel.value;
      sel.innerHTML = '';
      UNITS.forEach(function (u) {
        var o = document.createElement('option');
        o.value = u.key;
        o.textContent = lang === 'bn' ? u.bn : u.en;
        sel.appendChild(o);
      });
      if (cur) sel.value = cur;
    });
    if (!$('convUnit').value) $('convUnit').value = 'decimal';
    if (!$('priceAreaUnit').value) $('priceAreaUnit').value = 'decimal';
    if (!$('priceRateUnit').value) $('priceRateUnit').value = 'decimal';
  }

  function renderRef() {
    var body = $('refBody');
    body.innerHTML = '';
    UNITS.forEach(function (u) {
      var tr = document.createElement('tr');
      var td1 = document.createElement('td'); td1.textContent = unitName(u.key);
      var td2 = document.createElement('td'); td2.textContent = num(L.SQFT[u.key]);
      var td3 = document.createElement('td'); td3.textContent = NOTES[u.key][lang];
      tr.appendChild(td1); tr.appendChild(td2); tr.appendChild(td3);
      body.appendChild(tr);
    });
  }

  function applyLang() {
    var s = STR[lang];
    var map = {
      't-title': s.title, 't-subtitle': s.subtitle, 't-conv-h': s.convH,
      't-amount': s.amount, 't-unit': s.unit, 't-convert': s.convert,
      't-conv-hint': s.convHint, 't-plot-h': s.plotH, 't-length': s.length,
      't-width': s.width, 't-calc': s.calc, 't-plot-hint': s.plotHint,
      't-price-h': s.priceH, 't-area': s.area, 't-area-unit': s.areaUnit,
      't-rate': s.rate, 't-rate-unit': s.rateUnit, 't-estimate': s.estimate,
      't-price-hint': s.priceHint, 't-ref-h': s.refH, 't-ref-unit': s.refUnit,
      't-ref-sqft': s.refSqft, 't-ref-note': s.refNote, 't-foot': s.foot
    };
    Object.keys(map).forEach(function (id) { $(id).textContent = map[id]; });
    $('langBtn').textContent = lang === 'bn' ? 'English' : 'বাংলা';
    document.documentElement.lang = lang === 'bn' ? 'bn' : 'en';
    fillSelects();
    renderRef();
  }

  $('langBtn').addEventListener('click', function () {
    lang = lang === 'bn' ? 'en' : 'bn';
    try { localStorage.setItem('lmbd-lang', lang); } catch (e) { /* ignore */ }
    applyLang();
  });

  $('convBtn').addEventListener('click', function () {
    hideErr('convErr');
    var v = parseFloat($('convValue').value);
    var out = L.convertAll(v, $('convUnit').value);
    if (out === null) {
      $('convResults').hidden = true;
      showErr('convErr', STR[lang].convErr);
      return;
    }
    renderResults('convResults', resultRows(out));
  });

  $('plotBtn').addEventListener('click', function () {
    hideErr('plotErr');
    var out = L.plotArea(parseFloat($('plotLength').value), parseFloat($('plotWidth').value));
    if (out === null) {
      $('plotResults').hidden = true;
      showErr('plotErr', STR[lang].plotErr);
      return;
    }
    renderResults('plotResults', resultRows(out));
  });

  $('priceBtn').addEventListener('click', function () {
    hideErr('priceErr');
    var est = L.priceEstimate(
      parseFloat($('priceArea').value), $('priceAreaUnit').value,
      parseFloat($('priceRate').value), $('priceRateUnit').value);
    if (est === null) {
      $('priceResults').hidden = true;
      showErr('priceErr', STR[lang].priceErr);
      return;
    }
    renderResults('priceResults', [
      [STR[lang].total, money(est.total)],
      [STR[lang].perSqft, money(est.perSqft)]
    ]);
  });

  applyLang();
})();
