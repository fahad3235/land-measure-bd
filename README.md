# Land Measure BD 🏡

Offline, bilingual (English / বাংলা) Bangladesh land-measurement tool:
convert between the land units used in Bangladeshi deeds and records,
calculate a rectangular plot's area, and estimate land prices.

## Features

1. **Unit converter** — convert any value between 8 units: square feet,
   decimal (shotangsho), katha, bigha, acre, hectare, square metres,
   square yards. All conversions shown at once.
2. **Plot area calculator** — length × width in feet, reported in all
   8 units.
3. **Land price estimator** — area × rate across different units
   (e.g. 10 decimal at ৳500,000 per decimal), with price per sq ft.
4. **Standard relations reference** — the conversion factors in one table.
5. **Bilingual UI** — EN/বাংলা toggle, persisted, with Bengali digits.
6. **Fully offline** — no network requests, no data leaves the device.

## Standard units used

| Unit | Square feet |
|---|---|
| Square foot | 1 |
| Decimal (shotangsho) | 435.6 |
| Katha | 720 |
| Bigha | 14,400 (20 katha) |
| Acre | 43,560 (100 decimal) |
| Hectare | 107,639.104 (10,000 sq m) |
| Square metre | 10.7639104 |
| Square yard | 9 |

Local practice can vary (katha size differs in some areas), so verify
against your deed before a transaction. Figures are demo estimates only —
not legal or valuation advice.

## Stack

Vanilla HTML + CSS + JavaScript. No build step, no dependencies.
Pure conversion logic lives in `js/land.js` (UMD: browser + Node);
UI in `js/app.js`.

## Run locally

Open `index.html` in any browser, or serve the folder:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Testing

```sh
node tests/test.js    # 37 unit tests (conversion factors, round-trips,
                      # plot math, price math, validation, formatting)
node tests/smoke.js   # 15 headless-Chrome (CDP) smoke tests:
                      # converter, validation errors, plot, price,
                      # EN/বাংলা toggle + Bengali digits, 390px layout
```

## Deployment

Static site — GitHub Pages (`main` branch, root) or any static host.

## Limitations

- Rectangular plots only; irregular plots need surveyor measurement.
- Standard factors only; regional katha/bigha variations are not modelled.
- Price estimator is arithmetic only — it knows nothing about real
  market rates.

## Status

MVP complete. See `TEST_RESULTS.md` for the verified test run.
