import { buildTableFromCode } from '../buildTable';
import * as elements from '../elements';
import { cleanHtmlCode } from '../helpers';
import { settings } from '../settings';
import { setStylePanelStyles } from '../styles';
import { TABLE, tableStyles } from '../variables';
import { setTableCode, setTableStyles } from '../variables';

// handle local storage for settings
export function getSettingsFromLocalStorage() {
  const tableSettings = JSON.parse(localStorage.getItem('tableSettings')) || {};

  const settingsMap = {
    autosave: {
      element: elements.AUTOSAVE_BUTTON,
      localStorageKey: 'autosave',
    },
    generateCSS: {
      element: elements.GENERATE_CSS_CHECKBOX,
      localStorageKey: 'generateCSS',
    },
    minifyCode: {
      element: elements.COMPACT_MODE_CHECKBOX,
      localStorageKey: 'minifyCode',
    },
    stripes: {
      element: elements.STRIPES_CHECKBOX,
      localStorageKey: 'stripes',
    },
  };

  for (const key in settingsMap) {
    const setting = settingsMap[key];
    const { element, localStorageKey } = setting;

    if (localStorageKey in tableSettings && element.type === 'checkbox') {
      const isChecked = tableSettings[localStorageKey] === true;
      element.checked = isChecked;
      const classMethod = isChecked ? 'add' : 'remove';
      element.previousElementSibling.classList[classMethod]('w--redirected-checked');
    }
  }

  // if the table settings exist
  if ('autosave' in tableSettings) {
    settings.autosave = tableSettings.autosave;
    tableSettings.autosave
      ? elements.AUTOSAVE_BUTTON.classList.add('is-active')
      : elements.AUTOSAVE_BUTTON.classList.remove('is-active');
  } else {
    settings.autosave = true;
    elements.AUTOSAVE_BUTTON.classList.add('is-active');
  }

  if ('generateCSS' in tableSettings) {
    settings.generateCSS = tableSettings.generateCSS;
  } else {
    settings.generateCSS = true;
  }

  if ('minifyCode' in tableSettings) {
    settings.minifyCode = tableSettings.minifyCode;
  } else {
    settings.minifyCode = false;
  }

  if ('stripes' in tableSettings) {
    settings.stripes = tableSettings.stripes;
    if (tableSettings.stripes) {
      elements.STRIPE_STYLES_ROW.style.display = 'flex';
      elements.SETTINGS_COMPONENT.classList.add('is-stripes');
    } else {
      elements.STRIPE_STYLES_ROW.style.display = 'none';
      elements.SETTINGS_COMPONENT.classList.remove('is-stripes');
    }
  } else {
    settings.stripes = false;
  }

  localStorage.setItem('tableSettings', JSON.stringify(settings));
}

export function updateSettingsInLocalStorage(action) {
  if (action === 'autosave') {
    settings.autosave = elements.AUTOSAVE_BUTTON.classList.contains('is-active') ? true : false;
  } else if (action === 'generateCSS') {
    settings.generateCSS = elements.GENERATE_CSS_CHECKBOX.checked;
  } else if (action === 'minifyCode') {
    settings.minifyCode = elements.COMPACT_MODE_CHECKBOX.checked;
  } else if (action === 'stripes') {
    settings.stripes = elements.STRIPES_CHECKBOX.checked;
  }
  localStorage.setItem('tableSettings', JSON.stringify(settings));
}

// handle local storage for table code
export function getTableCodeFromLocalStorage() {
  const savedTableCode = JSON.parse(localStorage.getItem('tableCode'));

  if (savedTableCode) {
    setTableCode(savedTableCode);
    buildTableFromCode(savedTableCode);
  } else {
    buildTableFromCode();
  }
  updateTableCodeInLocalStorage();
}

export function updateTableCodeInLocalStorage() {
  const cleanCode = cleanHtmlCode(TABLE.outerHTML);
  localStorage.setItem('tableCode', JSON.stringify(cleanCode));
}

// handle local storage for styles

export function getStylesFromLocalStorage() {
  const savedTableStyles = JSON.parse(localStorage.getItem('tableStyles'));

  if (savedTableStyles) {
    setTableStyles(savedTableStyles);
    // styles are stored, parse and set to their correct input
    setStylePanelStyles(savedTableStyles);
  } else {
    // no styles are stored
    localStorage.setItem('tableStyles', JSON.stringify(tableStyles));
    setStylePanelStyles(tableStyles);
  }
}

export function updateStylesInLocalStorage() {
  localStorage.setItem('tableStyles', JSON.stringify(tableStyles));
}
