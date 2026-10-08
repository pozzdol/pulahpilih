// Run: node src/lib/platform.test.mjs  (Node 23+ loads the .ts module directly)
import assert from 'node:assert/strict';
import { fromUserAgent } from './platform.ts';

/** @type {[string, number, string][]} */
const cases = [
	['Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36', 0, 'windows'],
	['Mozilla/5.0 (Windows NT 10.0; WOW64; rv:130.0) Gecko/20100101 Firefox/130.0', 0, 'windows'],
	['Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36', 0, 'windows-32'],
	['Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 Chrome/109.0 Safari/537.36', 0, 'windows-old'],
	['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15', 0, 'other'],
	['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15', 5, 'mobile'], // iPadOS
	['Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148', 5, 'mobile'],
	['Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 Chrome/140.0 Mobile Safari/537.36', 5, 'mobile'],
	['Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/140.0 Safari/537.36', 0, 'other'],
	['Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 Chrome/140.0 Safari/537.36', 0, 'other']
];
for (const [ua, touch, kind] of cases) {
	assert.equal(fromUserAgent(ua, touch).kind, kind, ua);
}
console.log(`platform: ${cases.length} cases ok`);
