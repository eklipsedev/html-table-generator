/* eslint-disable prefer-destructuring */
import { buildTableFromCode, resetTable, saveTableData } from './buildTable';
import { updateCode } from './codeGenerator';
import * as elements from './elements';
import { handleFile, tableToCSV } from './handleFiles';
import { deliverMessage } from './handleMessages';
import { clearTableFormatting, getNextCell } from './helpers';
import { settings } from './settings';
import { defaultStyles, setStylePanelStyles } from './styles';
import {
  updateSettingsInLocalStorage,
  updateStylesInLocalStorage,
  updateTableCodeInLocalStorage,
} from './utils/localStorageUtils';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CAPTION_ELEMENT, setTableCaption, setTableStyles, tableCaption } from './variables';

export let file = '';

// handle class name input changes
export function handeClassNameInputChange() {
  elements.CLASS_NAME_INPUT.value = elements.CLASS_NAME_INPUT.value
    .trim()
    .replace(/\s/g, '-')
    .toLowerCase();
}

export function handleCompactModeCheckboxChange() {
  settings.minifyCode = elements.COMPACT_MODE_CHECKBOX.checked;
  updateCode();
  updateSettingsInLocalStorage('minifyCode');
}

export function handleGenerateCssCheckboxChange() {
  settings.generateCSS = elements.GENERATE_CSS_CHECKBOX.checked;
  updateCode();
  updateSettingsInLocalStorage('generateCSS');
}

export function handleStripesCheckboxChange() {
  settings.stripes = elements.STRIPES_CHECKBOX.checked;
  if (settings.stripes) {
    elements.STRIPE_STYLES_ROW.style.display = 'flex';
    elements.SETTINGS_COMPONENT.classList.add('is-stripes');
  } else {
    elements.STRIPE_STYLES_ROW.style.display = 'none';
    elements.SETTINGS_COMPONENT.classList.remove('is-stripes');
  }

  updateCode();
  updateSettingsInLocalStorage('stripes');
}

export function handleResetTableButtonClick() {
  resetTable();
  saveTableData();
  updateCode();
  if (settings.autosave === true) {
    updateTableCodeInLocalStorage();
    setTableCaption('Table 1');
    CAPTION_ELEMENT.textContent = tableCaption;
  }
  deliverMessage('clear-data');
}

export function handleDownloadCsvButtonClick() {
  tableToCSV();
  deliverMessage('download-csv');
}

export function handleUploadCsvButtonClick() {
  elements.UPLOAD_CSV_MODAL.classList.add('is-open');
}

export function handleUploadCsvCloserClick() {
  elements.UPLOAD_CSV_MODAL.classList.remove('is-open');
}

// Click event for the drop area
export function handeUploadCsvAreaClick() {
  elements.CSV_FILE_INPUT.click();
}

// Drag and drop events for the drop area
export function handleUploadCsvAreaDrop(e) {
  e.preventDefault();
  //const file = getFile(e.dataTransfer.files[0]);
  file = e.dataTransfer.files[0];
  if (file) {
    elements.UPLOAD_CSV_AREA.style.display = 'none';
    elements.FILE_NAME_NAME.textContent = file.name;
    elements.FILE_NAME_COMPONENT.style.display = 'flex';
    elements.UPLOAD_CSV_CONFIRM_BUTTON.parentElement.style.display = 'flex';
  } else {
    elements.FILE_NAME_NAME.textContent = 'No file selected';
  }
}

export function handleCsvFileInputChange(e) {
  //const file = getFile(e.target.files[0]);
  file = e.target.files[0];
  if (file) {
    elements.UPLOAD_CSV_AREA.style.display = 'none';
    elements.FILE_NAME_NAME.textContent = file.name;
    elements.FILE_NAME_COMPONENT.style.display = 'flex';
    elements.UPLOAD_CSV_CONFIRM_BUTTON.parentElement.style.display = 'flex';
  } else {
    elements.FILE_NAME_NAME.textContent = 'No file selected';
  }
}

export function handleFileNameRemoveClick() {
  elements.UPLOAD_CSV_AREA.style.display = 'flex';
  elements.FILE_NAME_COMPONENT.style.display = 'none';
  elements.UPLOAD_CSV_CONFIRM_BUTTON.parentElement.style.display = 'none';
}

// Drag and drop events for the drop area
export function handleUploadCsvAreaDragover(e) {
  e.preventDefault();
  elements.UPLOAD_CSV_AREA.classList.add('drag-over');
}

export function handeUploadCsvAreaDragleave() {
  elements.UPLOAD_CSV_AREA.classList.remove('drag-over');
}

export function handleCsvUploadConfirmButtonClick() {
  elements.UPLOAD_CSV_MODAL.classList.remove('is-open');
  handleFile(file);
}

export function handleAutoSaveButtonClick(e) {
  elements.AUTOSAVE_BUTTON.classList.toggle('is-active');
  updateSettingsInLocalStorage('autosave');
  if (settings.autosave) {
    updateTableCodeInLocalStorage();
    updateStylesInLocalStorage(e);
  } else {
    localStorage.removeItem('tableCode');
    localStorage.removeItem('tableStyles');
  }
  deliverMessage('autosave');
}

export function handleClearFormattingButtonClick() {
  clearTableFormatting();
  updateCode();

  if (settings.autosave) {
    updateTableCodeInLocalStorage();
  }
  deliverMessage('clear-formatting');
}

export function handleResetStylesButtonClick(e) {
  setStylePanelStyles(defaultStyles);
  setTableStyles(defaultStyles);
  updateCode();

  elements.STRIPES_CHECKBOX.checked = false;
  elements.STRIPES_CHECKBOX.dispatchEvent(new Event('change'));

  if (settings.stripes) {
    elements.STRIPES_CHECKBOX.previousElementSibling.classList.add('w--redirected-checked');
  } else {
    elements.STRIPES_CHECKBOX.previousElementSibling.classList.remove('w--redirected-checked');
  }

  if (settings.autosave) {
    updateTableCodeInLocalStorage();
    updateStylesInLocalStorage(e);
  }
  deliverMessage('reset-styles');
}

export function handleNewTableButtonClick(e) {
  setTableCaption('Table 1');
  buildTableFromCode();
  setStylePanelStyles(defaultStyles);
  setTableStyles(defaultStyles);
  updateCode();
  // handle stripes change
  elements.STRIPES_CHECKBOX.checked = false;
  elements.STRIPES_CHECKBOX.dispatchEvent(new Event('change'));

  if (settings.stripes) {
    elements.STRIPES_CHECKBOX.previousElementSibling.classList.add('w--redirected-checked');
  } else {
    elements.STRIPES_CHECKBOX.previousElementSibling.classList.remove('w--redirected-checked');
  }

  if (settings.autosave) {
    updateTableCodeInLocalStorage();
    updateStylesInLocalStorage(e);
  }
  deliverMessage('new-table');
}

export function handleTableKeyup() {
  updateCode();
  saveTableData();
  if (settings.autosave) {
    updateTableCodeInLocalStorage();
  }
}

export function handleTableKeydown(e) {
  if (e.key === 'Tab') {
    e.preventDefault(); // Prevent the default tab behavior
    const currentCell = document.activeElement;
    const nextCell = getNextCell(currentCell);
    if (nextCell) {
      nextCell.focus();
      // Set the cursor at the end of the text in the cell
      const range = document.createRange();
      range.selectNodeContents(nextCell);
      range.collapse(false);

      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
}
