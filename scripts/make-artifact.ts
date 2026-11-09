/**
 * 把 dist-artifact/index.html（單一檔案版）轉成試用頁面用的片段：
 * 預覽環境會自動包上 <!doctype><html><head><body>，所以只保留 <title>、樣式、腳本與 #root。
 */
import { readFileSync, writeFileSync } from 'node:fs';

const html = readFileSync('dist-artifact/index.html', 'utf8');
const pick = (re: RegExp) => [...html.matchAll(re)].map((m) => m[0]);
const styles = pick(/<style[^>]*>[\s\S]*?<\/style>/g);
const scripts = pick(/<script[^>]*>[\s\S]*?<\/script>/g);
const [themeScript, ...moduleScripts] = scripts;

const out = [
  '<title>工程通</title>',
  '<meta name="theme-color" content="#2B2F33">',
  ...styles,
  themeScript,
  '<div id="root"></div>',
  ...moduleScripts.map((s) => s.replace('<script type="module" crossorigin>', '<script type="module">')),
].join('\n');

writeFileSync('dist-artifact/gongchengtong.html', out);
console.log(`✓ dist-artifact/gongchengtong.html（${(out.length / 1024).toFixed(0)} KB）`);
