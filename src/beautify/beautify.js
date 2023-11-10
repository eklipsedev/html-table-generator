import { css_beautify, html_beautify } from 'js-beautify';

const beautifyCSS = css_beautify;
const beautifyHTML = html_beautify;

const beautifiers = {
  html: beautifyHTML,
  css: beautifyCSS,
};

export function beautify(type, text, options) {
  const beautifyFunction = beautifiers[type] || ((text) => text);
  return beautifyFunction(text, options);
}
