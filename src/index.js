import { buildTableFromCode, updateCols, updateRows } from './buildTable';
import { updateCode } from './codeGenerator';
import * as elements from './elements';
import * as events from './eventHandlers';
import { subscribeToEditableInput } from './mediumEditor/mediumEditor';
import { settings } from './settings';
import {
  defaultStyles,
  saveStylesToTableStyles,
  setStylePanelStyles,
  syncColorInputs,
} from './styles';
import {
  getSettingsFromLocalStorage,
  getStylesFromLocalStorage,
  getTableCodeFromLocalStorage,
  updateStylesInLocalStorage,
} from './utils/localStorageUtils';
import { TABLE } from './variables';

getSettingsFromLocalStorage();

if (settings.autosave) {
  getTableCodeFromLocalStorage();
  getStylesFromLocalStorage();
} else {
  buildTableFromCode();
  setStylePanelStyles(defaultStyles);
}

subscribeToEditableInput();

// Event listeners
elements.UPDATE_ELEMENTS.forEach((element) => {
  if (element.id === 'class-name-input') {
    element.addEventListener('keyup', () => {
      updateCode();
    });
  }
  element.addEventListener('change', (e) => {
    saveStylesToTableStyles(e);
    updateCode();
    if (settings.autosave) {
      updateStylesInLocalStorage(e);
    }
  });
});

elements.CLASS_NAME_INPUT.addEventListener('change', () => events.handeClassNameInputChange());
elements.ROWS_INPUT.addEventListener('change', updateRows);
elements.COLUMNS_INPUT.addEventListener('change', updateCols);
elements.COMPACT_MODE_CHECKBOX.addEventListener('change', () =>
  events.handleCompactModeCheckboxChange()
);
elements.GENERATE_CSS_CHECKBOX.addEventListener('change', () =>
  events.handleGenerateCssCheckboxChange()
);
elements.STRIPES_CHECKBOX.addEventListener('change', () => events.handleStripesCheckboxChange());
elements.RESET_TABLE_BUTTON.addEventListener('click', () => events.handleResetTableButtonClick());
elements.DOWNLOAD_CSV_BUTTON.addEventListener('click', () => events.handleDownloadCsvButtonClick());
elements.UPLOAD_CSV_BUTTON.addEventListener('click', () => events.handleUploadCsvButtonClick());
elements.UPLOAD_CSV_CLOSER.addEventListener('click', () => events.handleUploadCsvCloserClick());
elements.UPLOAD_CSV_AREA.addEventListener('click', () => events.handeUploadCsvAreaClick());
elements.UPLOAD_CSV_AREA.addEventListener('drop', (e) => events.handleUploadCsvAreaDrop(e));
elements.CSV_FILE_INPUT.addEventListener('change', (e) => events.handleCsvFileInputChange(e));
elements.FILE_NAME_REMOVE.addEventListener('click', () => events.handleFileNameRemoveClick());
elements.UPLOAD_CSV_AREA.addEventListener('dragover', (e) => events.handleUploadCsvAreaDragover(e));
elements.UPLOAD_CSV_AREA.addEventListener('dragleave', () => events.handeUploadCsvAreaDragleave());
elements.UPLOAD_CSV_CONFIRM_BUTTON.addEventListener('click', () =>
  events.handleCsvUploadConfirmButtonClick()
);
elements.AUTOSAVE_BUTTON.addEventListener('click', (e) => events.handleAutoSaveButtonClick(e));
elements.CLEAR_FORMATTING_BUTTON.addEventListener('click', () =>
  events.handleClearFormattingButtonClick()
);
elements.RESET_STYLES_BUTTON.addEventListener('click', (e) =>
  events.handleResetStylesButtonClick(e)
);
elements.NEW_TABLE_BUTTON.addEventListener('click', (e) => events.handleNewTableButtonClick(e));
TABLE.addEventListener('keyup', () => events.handleTableKeyup());
TABLE.addEventListener('keydown', (e) => events.handleTableKeydown(e));

updateCode();

syncColorInputs(elements.BORDER_COLOR_PICKER, elements.BORDER_COLOR_INPUT);
syncColorInputs(elements.HEADER_BG_COLOR_PICKER, elements.HEADER_BG_COLOR_INPUT);
syncColorInputs(elements.HEADER_TEXT_COLOR_PICKER, elements.HEADER_TEXT_COLOR_INPUT);
syncColorInputs(elements.BODY_BG_COLOR_PICKER, elements.BODY_BG_COLOR_INPUT);
syncColorInputs(elements.BODY_TEXT_COLOR_PICKER, elements.BODY_TEXT_COLOR_INPUT);
syncColorInputs(elements.STRIPES_BG_COLOR_PICKER, elements.STRIPES_BG_COLOR_INPUT);
syncColorInputs(elements.STRIPES_TEXT_COLOR_PICKER, elements.STRIPES_TEXT_COLOR_INPUT);
