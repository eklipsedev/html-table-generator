import * as elements from './elements';
import { createCSSRule, formatUsingBeautify, minifyCSS } from './helpers';
import { settings } from './settings';
import { CAPTION_ELEMENT, setTableStyles, TABLE, tableStyles } from './variables';

export const defaultStyles = {
  CLASS_NAME_INPUT: 'table_component',
  LAYOUT_DROPDOWN: 'fixed',
  HEIGHT_INPUT: '100',
  HEIGHT_DROPDOWN: '%',
  WIDTH_INPUT: '100',
  WIDTH_DROPDOWN: '%',
  HEADER_BG_COLOR_INPUT: '#eceff1',
  HEADER_BG_COLOR_PICKER: '#eceff1',
  HEADER_TEXT_COLOR_INPUT: '#000000',
  HEADER_TEXT_COLOR_PICKER: '#000000',
  BODY_BG_COLOR_INPUT: '#ffffff',
  BODY_BG_COLOR_PICKER: '#ffffff',
  BODY_TEXT_COLOR_INPUT: '#000000',
  BODY_TEXT_COLOR_PICKER: '#000000',
  STRIPES_BG_COLOR_INPUT: '#ffffff',
  STRIPES_BG_COLOR_PICKER: '#ffffff',
  STRIPES_TEXT_COLOR_INPUT: '#000000',
  STRIPES_TEXT_COLOR_PICKER: '#000000',
  BORDER_COLOR_INPUT: '#dededf',
  BORDER_COLOR_PICKER: '#dededf',
  BORDER_STYLE_DROPDOWN: 'solid',
  BORDER_WIDTH_INPUT: '1',
  BORDER_WIDTH_DROPDOWN: 'px',
  BORDER_COLLAPSE_DROPDOWN: 'collapse',
  BORDER_SPACING_INPUT: '1',
  BORDER_SPACING_DROPDOWN: 'px',
  CELL_TEXT_ALIGN_DROPDOWN: 'left',
  CELL_PADDING_INPUT: '5',
  CELL_PADDING_DROPDOWN: 'px',
  CAPTION_ALIGN_DROPDOWN: 'left',
  CAPTION_SIDE_DROPDOWN: 'top',
};

let cell;

// line breaks & spacing...
// \n\t\t = line break + 2 tabs

export function updateStyle() {
  let text = '';
  let text_wrapper = ''; // css rule for table wrapper
  let text_table = ''; // css rule for table
  let text_cap = ''; // css rule for table caption
  let text_th = ''; // css rule for table headers
  let text_td = ''; // css rule for table td;
  let text_stripes_even = '';
  let text_stripes_odd = '';

  // helper functions

  const setStyleTextAndCodeStyles = (element, elementText, cssPropertyValue, cssPropertyName) => {
    let cssProperty = `\n\t\t${cssPropertyName}: ${cssPropertyValue.value || cssPropertyValue};`;

    if (elementText === text_table) {
      text_table += cssProperty;
    } else if (elementText === text_cap) {
      text_cap += cssProperty;
    } else if (elementText === text_th) {
      text_th += cssProperty;
    } else if (elementText === text_td) {
      text_td += cssProperty;
    } else if (elementText === text_stripes_even) {
      text_stripes_even += cssProperty;
    } else if (elementText === text_stripes_odd) {
      text_stripes_odd += cssProperty;
    }
    element.style[cssPropertyName] = cssPropertyValue.value || cssPropertyValue;
  };

  const setCellStyles = (i, element, cssPropertyName, cssPropertyValue) => {
    if (element.value.length) {
      i.style[cssPropertyName] = cssPropertyValue.value || cssPropertyValue;
    } else {
      i.style[cssPropertyName] = '';
    }
  };

  // construct the style text for the wrapping <div>
  text_wrapper += `\n\t\toverflow: auto;`;
  text_wrapper += `\n\t\twidth: 100%;`;

  let s = '';

  if (elements.BORDER_WIDTH_INPUT.value.length)
    s += ` ${elements.BORDER_WIDTH_INPUT.value + elements.BORDER_WIDTH_DROPDOWN.value}`;
  if (elements.BORDER_STYLE_DROPDOWN.value.length) s += ` ${elements.BORDER_STYLE_DROPDOWN.value}`;
  if (elements.BORDER_COLOR_INPUT.value.length) s += ` ${elements.BORDER_COLOR_INPUT.value}`;

  if (s.length) {
    s = s.replace(' ', '');
    text_table += `\n\t\tborder: ${s};`;
    text_th += `\n\t\tborder: ${s};`;
    text_td += `\n\t\tborder: ${s};`;
    TABLE.style.border = s;
  }

  setStyleTextAndCodeStyles(
    TABLE,
    text_table,
    elements.HEIGHT_INPUT.value + elements.HEIGHT_DROPDOWN.value,
    'height'
  );
  setStyleTextAndCodeStyles(
    TABLE,
    text_table,
    elements.WIDTH_INPUT.value + elements.WIDTH_DROPDOWN.value,
    'width'
  );
  setStyleTextAndCodeStyles(TABLE, text_table, elements.LAYOUT_DROPDOWN, 'table-layout');
  setStyleTextAndCodeStyles(
    TABLE,
    text_table,
    elements.BORDER_COLLAPSE_DROPDOWN,
    'border-collapse'
  );
  setStyleTextAndCodeStyles(
    TABLE,
    text_table,
    elements.BORDER_SPACING_INPUT.value + elements.BORDER_SPACING_DROPDOWN.value,
    'border-spacing'
  );
  setStyleTextAndCodeStyles(TABLE, text_table, elements.CELL_TEXT_ALIGN_DROPDOWN, 'text-align');
  setStyleTextAndCodeStyles(
    CAPTION_ELEMENT,
    text_cap,
    elements.CAPTION_SIDE_DROPDOWN,
    'caption-side'
  );
  setStyleTextAndCodeStyles(
    CAPTION_ELEMENT,
    text_cap,
    elements.CAPTION_ALIGN_DROPDOWN,
    'text-align'
  );
  setStyleTextAndCodeStyles(TABLE, text_th, elements.HEADER_BG_COLOR_INPUT, 'background-color');
  setStyleTextAndCodeStyles(TABLE, text_th, elements.HEADER_TEXT_COLOR_INPUT, 'color');
  setStyleTextAndCodeStyles(
    TABLE,
    !settings.stripes ? text_td : text_stripes_even,
    elements.BODY_BG_COLOR_INPUT,
    'background-color'
  );

  setStyleTextAndCodeStyles(
    TABLE,
    !settings.stripes ? text_td : text_stripes_even,
    elements.BODY_TEXT_COLOR_INPUT,
    'color'
  );

  setStyleTextAndCodeStyles(
    TABLE,
    text_th,
    elements.CELL_PADDING_INPUT.value + elements.CELL_PADDING_DROPDOWN.value,
    'padding'
  );
  setStyleTextAndCodeStyles(
    TABLE,
    text_td,
    elements.CELL_PADDING_INPUT.value + elements.CELL_PADDING_DROPDOWN.value,
    'padding'
  );

  if (settings.stripes) {
    // for stripes
    setStyleTextAndCodeStyles(
      TABLE,
      text_stripes_odd,
      elements.STRIPES_BG_COLOR_INPUT,
      'background-color'
    );
    setStyleTextAndCodeStyles(TABLE, text_stripes_odd, elements.STRIPES_TEXT_COLOR_INPUT, 'color');
  }

  cell = Array.from(elements.TABLE_HEADER_CELLS);

  cell.forEach((cellElement) => {
    setCellStyles(
      cellElement,
      elements.HEADER_BG_COLOR_INPUT,
      'background-color',
      elements.HEADER_BG_COLOR_INPUT
    );
    setCellStyles(
      cellElement,
      elements.HEADER_TEXT_COLOR_INPUT,
      'color',
      elements.HEADER_TEXT_COLOR_INPUT
    );
    setCellStyles(
      cellElement,
      elements.CELL_PADDING_INPUT,
      'padding',
      `${elements.CELL_PADDING_INPUT.value}${elements.CELL_PADDING_DROPDOWN.value}`
    );
    setCellStyles(
      cellElement,
      elements.BORDER_WIDTH_INPUT,
      'border-width',
      `${elements.BORDER_WIDTH_INPUT.value}${elements.BORDER_WIDTH_DROPDOWN.value}`
    );
    setCellStyles(
      cellElement,
      elements.BORDER_STYLE_DROPDOWN,
      'border-style',
      elements.BORDER_STYLE_DROPDOWN
    );
    setCellStyles(
      cellElement,
      elements.BORDER_COLOR_INPUT,
      'border-color',
      elements.BORDER_COLOR_INPUT
    );
  });

  cell = Array.from(elements.TABLE_DATA_CELLS);

  cell.forEach((cellElement) => {
    setCellStyles(
      cellElement,
      elements.CELL_PADDING_INPUT,
      'padding',
      `${elements.CELL_PADDING_INPUT.value}${elements.CELL_PADDING_DROPDOWN.value}`
    );
    setCellStyles(
      cellElement,
      elements.BORDER_WIDTH_INPUT,
      'border-width',
      `${elements.BORDER_WIDTH_INPUT.value}${elements.BORDER_WIDTH_DROPDOWN.value}`
    );
    setCellStyles(
      cellElement,
      elements.BORDER_STYLE_DROPDOWN,
      'border-style',
      elements.BORDER_STYLE_DROPDOWN
    );
    setCellStyles(
      cellElement,
      elements.BORDER_COLOR_INPUT,
      'border-color',
      elements.BORDER_COLOR_INPUT
    );

    if (settings.stripes) {
      const trElement = cellElement.parentElement; // Get the parent <tr> element

      if (trElement && trElement.tagName === 'TR') {
        const trIndex = Array.from(TABLE.querySelectorAll('tr')).indexOf(trElement);

        if (trIndex % 2 === 1) {
          // <td> is inside an odd <tr>
          // for stripes
          setCellStyles(
            cellElement,
            elements.STRIPES_BG_COLOR_INPUT,
            'background-color',
            elements.STRIPES_BG_COLOR_INPUT
          );
          setCellStyles(
            cellElement,
            elements.STRIPES_TEXT_COLOR_INPUT,
            'color',
            elements.STRIPES_TEXT_COLOR_INPUT
          );
        } else {
          // <td> is inside an even <tr>
          setCellStyles(
            cellElement,
            elements.BODY_BG_COLOR_INPUT,
            'background-color',
            elements.BODY_BG_COLOR_INPUT
          );
          setCellStyles(
            cellElement,
            elements.BODY_TEXT_COLOR_INPUT,
            'color',
            elements.BODY_TEXT_COLOR_INPUT
          );
        }
      }
    } else {
      // stripes is off, apply regular styles
      setCellStyles(
        cellElement,
        elements.BODY_BG_COLOR_INPUT,
        'background-color',
        elements.BODY_BG_COLOR_INPUT
      );
      setCellStyles(
        cellElement,
        elements.BODY_TEXT_COLOR_INPUT,
        'color',
        elements.BODY_TEXT_COLOR_INPUT
      );
    }
  });

  const wrapperRule = createCSSRule(text_wrapper);
  const tableRule = createCSSRule(text_table, 'table');
  const captionRule = createCSSRule(text_cap, 'caption');
  const thRule = createCSSRule(text_th, 'th');
  const tdRule = createCSSRule(text_td, 'td');
  const stripesEvenRule = createCSSRule(text_stripes_even, 'tr:nth-child(even) td');
  const stripeOddRule = createCSSRule(text_stripes_odd, 'tr:nth-child(odd) td'); // will be "even" or "odd"

  text = wrapperRule + tableRule + captionRule + thRule + tdRule + stripesEvenRule + stripeOddRule;

  if (settings.generateCSS) {
    if (settings.minifyCode) {
      text = minifyCSS(text);
    } else {
      text = formatUsingBeautify('css', text);
    }
  } else {
    text = '';
  }

  return text.length ? `<style>\n${text}\n</style>` : '';
}

export function saveStylesToTableStyles(e) {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
    const key = e.target.id.toUpperCase().replace(/-/g, '_');
    const { value } = e.target;
    setTableStyles({ ...tableStyles, [key]: value });
  }
}

export function setStylePanelStyles(stylesObject) {
  for (const key in stylesObject) {
    if (stylesObject.hasOwnProperty(key)) {
      const elementId = key.toLowerCase().replace(/_/g, '-');

      const element = document.getElementById(elementId);

      if (element) {
        if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
          element.value = stylesObject[key];
        }
      }
    }
  }
}

export const syncColorInputs = (colorPicker, textField) => {
  // Function to validate the input value
  const isValidColorFormat = (value) => /^#([0-9A-Fa-f]{6})$/.test(value);

  // Update the text field when the color picker changes
  colorPicker.addEventListener('input', () => {
    const newValue = colorPicker.value;
    if (isValidColorFormat(newValue)) {
      if (textField.value !== newValue) {
        textField.value = newValue;
      }
    } else {
      // Provide feedback for an invalid format
      console.error('Invalid color format');
    }
    textField.dispatchEvent(new Event('change'));
  });

  // Update the color picker when the text field changes
  textField.addEventListener('input', () => {
    const newValue = textField.value;
    if (isValidColorFormat(newValue)) {
      if (colorPicker.value !== newValue) {
        colorPicker.value = newValue;
      }
    } else {
      // Provide feedback for an invalid format
      console.error('Invalid color format');
    }
    colorPicker.dispatchEvent(new Event('change'));
  });
};
