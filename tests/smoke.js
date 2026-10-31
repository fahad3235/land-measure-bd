// Headless-Chrome smoke tests via raw CDP. Run: node tests/smoke.js
'use strict';
const { spawn } = require('child_process');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const PORT = 9341;
const PAGE = 'file://' + path.resolve(__dirname, '..', 'index.html');
let passed = 0, failed = 0;
function check(name, cond, extra) {
  if (cond) { passed++; console.log('ok - ' + name); }
  else { failed++; console.log('FAIL - ' + name + (extra ? ' :: ' + extra : '')); }
}
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }
async function getWsUrl() {
  for (let i = 0; i < 50; i++) {
    try {
      const res = await fetch('http://127.0.0.1:' + PORT + '/json/list');
      const list = await res.json();
      const page = list.find((t) => t.type === 'page');
      if (page && page.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch (e) { /* not up yet */ }
    await sleep(200);
  }
  throw new Error('chrome debugger endpoint never came up');
}
async function main() {
  const policyPath = '/var/lib/hatch-browser/rootfs-base/usr/share/hatch/chromium/webgl-allowed-domains.txt';
  const policySha = crypto.createHash('sha256').update(fs.readFileSync(policyPath)).digest('hex');
  const chrome = spawn('/opt/meta-chromium/chrome', [
    '--headless=new', '--no-sandbox', '--disable-gpu',
    '--remote-debugging-port=' + PORT, '--no-first-run',
    '--user-data-dir=/tmp/land-smoke-profile',
    '--hatch-webgl-allowed-domains-file=' + policyPath,
    '--hatch-webgl-allowed-domains-sha256=' + policySha,
    PAGE,
  ], { stdio: 'ignore' });
  const errors = [];
  try {
    const wsUrl = await getWsUrl();
    const ws = new WebSocket(wsUrl);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
    let seq = 0;
    const pending = new Map();
    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.id && pending.has(data.id)) {
        const { resolve, reject } = pending.get(data.id);
        pending.delete(data.id);
        if (data.error) reject(new Error(JSON.stringify(data.error)));
        else resolve(data.result);
      }
      if (data.method === 'Runtime.consoleAPICalled') {
        const args = (data.params.args || []).map((a) => a.value || a.description || '').join(' ');
        if (data.params.type === 'error') errors.push('console.error: ' + args);
      }
      if (data.method === 'Runtime.exceptionThrown') {
        errors.push('exception: ' + (data.params.exceptionDetails.exception.description || ''));
      }
    };
    function send(method, params) {
      return new Promise((resolve, reject) => {
        const id = ++seq;
        pending.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params: params || {} }));
      });
    }
    async function ev(expr) {
      const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
      if (r.exceptionDetails) throw new Error('eval failed: ' + expr + ' :: ' + JSON.stringify(r.exceptionDetails));
      return r.result.value;
    }
    await send('Runtime.enable');
    await send('Page.enable');
    await sleep(1500);
    await ev("localStorage.clear(); location.reload();");
    await sleep(1500);
    check('title renders', await ev("document.getElementById('t-title').textContent") === '🏡 Land Measure BD');
    check('converter has 8 unit options', await ev("document.getElementById('convUnit').options.length") === 8);
    check('reference table has 8 rows', await ev("document.querySelectorAll('#refBody tr').length") === 8);
    // Convert 1 acre -> results visible, decimal row = 100.
    await ev("document.getElementById('convValue').value='1'; var s=document.getElementById('convUnit'); s.value='acre'; document.getElementById('convBtn').click();");
    await sleep(300);
    check('1 acre converts, results shown', await ev("!document.getElementById('convResults').hidden"));
    check('1 acre = 100 decimal row', (await ev("document.getElementById('convResults').textContent")).includes('100'));
    // Invalid converter input -> error, results hidden.
    await ev("document.getElementById('convValue').value='-3'; document.getElementById('convBtn').click();");
    await sleep(300);
    check('negative input shows error', await ev("!document.getElementById('convErr').hidden"));
    check('negative input hides results', await ev("document.getElementById('convResults').hidden"));
    // Plot 60x40 -> 2,400 sq ft row.
    await ev("document.getElementById('plotLength').value='60'; document.getElementById('plotWidth').value='40'; document.getElementById('plotBtn').click();");
    await sleep(300);
    check('plot results shown', await ev("!document.getElementById('plotResults').hidden"));
    check('plot 60x40 = 2,400 sq ft', (await ev("document.getElementById('plotResults').textContent")).includes('2,400'));
    // Price: 10 decimal @ 500000/decimal -> total 5,000,000.
    await ev("document.getElementById('priceArea').value='10'; document.getElementById('priceAreaUnit').value='decimal'; document.getElementById('priceRate').value='500000'; document.getElementById('priceRateUnit').value='decimal'; document.getElementById('priceBtn').click();");
    await sleep(300);
    check('price results shown', await ev("!document.getElementById('priceResults').hidden"));
    check('price total 5,000,000', (await ev("document.getElementById('priceResults').textContent")).includes('5,000,000'));
    // Bangla toggle.
    await ev("document.getElementById('langBtn').click();");
    await sleep(300);
    check('BN title renders', await ev("document.getElementById('t-title').textContent") === '🏡 জমি পরিমাপ বিডি');
    // Re-convert in BN to check Bengali digits.
    await ev("document.getElementById('convValue').value='1'; document.getElementById('convUnit').value='acre'; document.getElementById('convBtn').click();");
    await sleep(300);
    check('BN digits appear in results', (await ev("document.getElementById('convResults').textContent")).includes('১০০'));
    // 390px mobile: no horizontal overflow.
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    await sleep(500);
    const overflow = await ev("document.documentElement.scrollWidth <= 390");
    check('390px no horizontal overflow', overflow, 'scrollWidth=' + await ev("document.documentElement.scrollWidth"));
    check('0 console/page errors', errors.length === 0, errors.join(' | '));
    ws.close();
  } finally {
    chrome.kill();
  }
  console.log(passed + ' passed, ' + failed + ' failed');
  process.exit(failed ? 1 : 0);
}
main().catch((e) => { console.error('HARNESS ERROR: ' + e.message); process.exit(1); });
