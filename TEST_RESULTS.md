# TEST RESULTS — land-measure-bd (2026-10-31, 14:00 slot)

- Node unit tests: **37/37 passed** (`node tests/test.js`) — conversion
  factors (decimal 435.6, katha 720, bigha 14400, acre 43560 sq ft),
  1 acre = 100 decimal, 1 bigha = 20 katha, round-trips for all 8 units,
  plot 60×40 ft = 2,400 sq ft, price math incl. cross-unit
  (1 bigha @ ৳100,000/katha = ৳2,000,000), validation rejections
  (zero/negative/NaN/unknown unit), number + Bengali-digit formatting.
  0 app bugs, 0 repairs.
- Headless-Chrome smoke: **15/15 passed** (`node tests/smoke.js`, raw CDP,
  file://) — title, 8 unit options, 8 reference rows, 1 acre → 100
  decimal, negative-input error + results hidden, plot 60×40 → 2,400 sq ft,
  price 10 decimal @ ৳500,000 → ৳5,000,000, BN title + Bengali digits
  (১০০), 390px no horizontal overflow, 0 console/page errors.
