import { CLASS_NAME_INPUT, CODE_RESULTS_COUNT, CODE_RESULTS_TEXTAREA } from './elements';
import { formatUsingBeautify, minifyHTML, removeAttributes } from './helpers';
import { settings } from './settings';
import { updateStyle } from './styles';
import { TABLE } from './variables';

// helper to count the text inside of the text area
const textCounter = (textArea) => {
  CODE_RESULTS_COUNT.textContent = textArea.value.length;
};

export const updateCode = () => {
  let styleTagText = updateStyle(); // will come preformatted

  let text = TABLE.outerHTML; // this will create a new text string for the HTML, later to be combined

  // remove attributes, but only certain ones
  text = removeAttributes(text);

  // format the text using Beautify
  text = formatUsingBeautify('html', text);

  const cleanClass = CLASS_NAME_INPUT.value.trim().replace(/\s/g, '-').toLowerCase();
  const isStyled = settings.generateCSS ? ` class="${cleanClass}"` : '';

  text = `<div${isStyled} role="region" tabindex="0">\n${text}\n<div style="margin-top:8px">Made with <a href="https://www.htmltables.io/" target="_blank">HTML Tables</a></div>\n</div>`;

  // Combine style and HTML
  if (settings.generateCSS) {
    if (settings.minifyCode) {
      styleTagText += '\n' + minifyHTML(text);
    } else {
      styleTagText += '\n' + text;
    }
  } else if (settings.minifyCode) {
    styleTagText = minifyHTML(text);
  } else {
    styleTagText += text;
  }

  // Update the code results textarea
  // this will update the textarea with the code
  CODE_RESULTS_TEXTAREA.value = styleTagText;
  textCounter(CODE_RESULTS_TEXTAREA);
};
