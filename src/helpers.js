import { css_beautify, html_beautify } from 'js-beautify';

import { buildTableFromCode } from './buildTable';
import { CLASS_NAME_INPUT, TABLE_TARGET } from './elements';
import { setTableCode, tableCode } from './variables';

// Helper function to create a style rule
export function createCSSRule(elementText, tag = '', pseudoClass = '') {
  if (elementText.length) {
    return `\n\t.${CLASS_NAME_INPUT.value
      .trim()
      .replace(/\s/g, '-')
      .toLowerCase()} ${tag} ${pseudoClass} {${elementText}\n\t}`;
  }
  return '';
}

// minify CSS code
export function minifyCSS(css) {
  css = css
    .replace(/\r\n|\r|\n/g, '') // Remove line breaks, extra spaces, and tabs
    .replace(/\s+/g, ' ')
    .replace(/: /g, ':') // Remove spaces around colons, semicolons, and curly braces
    .replace(/; /g, ';')
    .replace(/{ /g, '{')
    .replace(/ }/g, '}');

  return css;
}

// minify HTML code
export function minifyHTML(text) {
  text = text
    .replace(/<!--[\s\S]*?-->/g, '') // Remove HTML comments
    .replace(/\s+/g, ' ') // Remove extra whitespace and line breaks
    .replace(/>\s+</g, '><') // Remove spaces around HTML tags
    .trim(); // Trim any leading or trailing whitespace

  return text;
}

// clean code of Medium Editor elements
// this is needed to reinitialize correctly
export function cleanHtmlCode(htmlCode) {
  // Parse the HTML code into a DocumentFragment
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlCode, 'text/html');

  // Remove the specified attributes from all elements in the DocumentFragment
  doc
    .querySelectorAll(
      '[medium-editor-index], [data-medium-editor-editor-index], [data-medium-editor-element], .medium-editor-element'
    )
    .forEach((element) => {
      element.removeAttribute('medium-editor-index');
      element.removeAttribute('data-medium-editor-editor-index');
      element.removeAttribute('data-medium-editor-element');
      element.classList.remove('medium-editor-element');
    });

  // Get the clean HTML string
  return doc.body.innerHTML;
}

export function clearTableFormatting() {
  const tableHtml = TABLE_TARGET.innerHTML;
  // pattern to clean formatting
  const pattern = /<(?!\/?(table|caption|tr|td|th)\b)[^>]+>/gi;
  // Remove unwanted HTML tags using regular expressions
  const cleanHtml = tableHtml.replace(pattern, '');

  setTableCode(cleanHtml);
  buildTableFromCode(tableCode);
}

// helper to format code using beautifier
export function formatUsingBeautify(type, text) {
  const defaultOptions = {
    indent_size: 4,
    indent_char: ' ',
    max_preserve_newlines: -1,
    preserve_newlines: false,
    keep_array_indentation: false,
    break_chained_methods: false,
    indent_scripts: type === 'html' ? 'separate' : 'keep',
    brace_style: type === 'html' ? 'expand' : 'end-expand',
    space_before_conditional: false,
    unescape_strings: false,
    jslint_happy: false,
    end_with_newline: false,
    wrap_line_length: 0,
    indent_inner_html: false,
    comma_first: false,
    e4x: false,
    indent_empty_lines: true,
  };

  const beautifyFunction = type === 'html' ? html_beautify : css_beautify;
  const mergedOptions = { ...defaultOptions };

  return beautifyFunction(text, mergedOptions);
}

export function removeAttributes(text) {
  return text.replace(/<[^>]+>/g, (match) => {
    // Define an array of attributes to exclude from removal
    const excludedAttributes = ['href', 'target', 'rel'];

    // Use a regular expression to match and preserve the desired attributes
    return match.replace(
      /([^\s=]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g,
      (attributeMatch, attributeName /*doubleQuotedValue, singleQuotedValue*/) => {
        // Use the first non-empty value as the attribute value
        //const attributeValue = doubleQuotedValue || singleQuotedValue;

        // Check if the attributeName is in the excludedAttributes list
        return excludedAttributes.includes(attributeName) ? attributeMatch : '';
      }
    );
  });
}

/*
export function removeAttributes(text) {
  return (text = text.replace(/<[^>]+>/g, (match) => {
    // Define an array of attributes to exclude from removal
    const excludedAttributes = ['href', 'target', 'rel'];

    // Use a regular expression to match and preserve the desired attributes
    return match.replace(
      /([^\s=]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g,
      (attributeMatch, attributeName, doubleQuotedValue, singleQuotedValue) => {
        // Use the first non-empty value as the attribute value
        const attributeValue = doubleQuotedValue || singleQuotedValue;

        // Check if the attributeName is in the excludedAttributes list
        if (excludedAttributes.includes(attributeName)) {
          return attributeMatch; // Preserve the matched attribute
        } else {
          return ''; // Remove the attribute
        }
      }
    );
  }));
}
*/

export function getNextCell(currentCell) {
  const allCells = Array.from(document.querySelectorAll('td, th'));
  const currentIndex = allCells.indexOf(currentCell);
  const nextIndex = (currentIndex + 1) % allCells.length;
  return allCells[nextIndex];
}
