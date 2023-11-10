import { D } from './constants';

// table elements
export const TABLE_TARGET = D.querySelector("[data-element='table-target']");
export const TABLE_HEADER_CELLS = TABLE_TARGET.getElementsByTagName('th');
export const TABLE_ROW_CELLS = TABLE_TARGET.getElementsByTagName('tr');
export const TABLE_DATA_CELLS = TABLE_TARGET.getElementsByTagName('td');
export const LAYOUT_DROPDOWN = D.getElementById('layout-dropdown');
export const ROWS_INPUT = D.getElementById('rows-input');
export const COLUMNS_INPUT = D.getElementById('columns-input');

// table width elements
export const WIDTH_INPUT = D.getElementById('width-input');
export const WIDTH_DROPDOWN = D.getElementById('width-dropdown');

// Table height elements
export const HEIGHT_INPUT = D.getElementById('height-input');
export const HEIGHT_DROPDOWN = D.getElementById('height-dropdown');

// class name elements
export const CLASS_NAME_INPUT = D.getElementById('class-name-input');

// header background color elements
export const HEADER_BG_COLOR_INPUT = D.getElementById('header-bg-color-input');
export const HEADER_BG_COLOR_PICKER = D.getElementById('header-bg-color-picker');

// header text color elements
export const HEADER_TEXT_COLOR_INPUT = D.getElementById('header-text-color-input');
export const HEADER_TEXT_COLOR_PICKER = D.getElementById('header-text-color-picker');

// body background color elements
export const BODY_BG_COLOR_INPUT = D.getElementById('body-bg-color-input');
export const BODY_BG_COLOR_PICKER = D.getElementById('body-bg-color-picker');

// body text color elements
export const BODY_TEXT_COLOR_INPUT = D.getElementById('body-text-color-input');
export const BODY_TEXT_COLOR_PICKER = D.getElementById('body-text-color-picker');

// stripes background color elements
export const STRIPES_BG_COLOR_INPUT = D.getElementById('stripes-bg-color-input');
export const STRIPES_BG_COLOR_PICKER = D.getElementById('stripes-bg-color-picker');

// body text color elements
export const STRIPES_TEXT_COLOR_INPUT = D.getElementById('stripes-text-color-input');
export const STRIPES_TEXT_COLOR_PICKER = D.getElementById('stripes-text-color-picker');

export const STRIPES_CHECKBOX = D.getElementById('stripes');
export const STRIPE_STYLES_ROW = D.querySelector("[data-element='stripe-styles']");
export const SETTINGS_COMPONENT = D.querySelector("[data-element='settings-component']");

// border color elements
export const BORDER_COLOR_INPUT = D.getElementById('border-color-input');
export const BORDER_COLOR_PICKER = D.getElementById('border-color-picker');

// border style elements
export const BORDER_STYLE_DROPDOWN = D.getElementById('border-style-dropdown');

// border width elements
export const BORDER_WIDTH_INPUT = D.getElementById('border-width-input');
export const BORDER_WIDTH_DROPDOWN = D.getElementById('border-width-dropdown');

// border collapse elements
export const BORDER_COLLAPSE_DROPDOWN = D.getElementById('border-collapse-dropdown');

// border spacing elements
export const BORDER_SPACING_INPUT = D.getElementById('border-spacing-input');
export const BORDER_SPACING_DROPDOWN = D.getElementById('border-spacing-dropdown');

// cell text alignment elements
export const CELL_TEXT_ALIGN_DROPDOWN = D.getElementById('cell-text-align-dropdown');

// cell padding elements
export const CELL_PADDING_INPUT = D.getElementById('cell-padding-input');
export const CELL_PADDING_DROPDOWN = D.getElementById('cell-padding-dropdown');

// caption elements
export const CAPTION_ALIGN_DROPDOWN = D.getElementById('caption-align-dropdown');
export const CAPTION_SIDE_DROPDOWN = D.getElementById('caption-side-dropdown');

// code results elements
export const GENERATE_CSS_CHECKBOX = D.getElementById('generatecss');
export const COMPACT_MODE_CHECKBOX = D.getElementById('compactMode');

export const NEW_TABLE_BUTTON = D.querySelector("[data-setting='new-table']");
export const RESET_TABLE_BUTTON = D.querySelector("[data-setting='clear-table']");
export const CLEAR_FORMATTING_BUTTON = D.querySelector("[data-setting='clear-formatting']");
export const RESET_STYLES_BUTTON = D.querySelector("[data-setting='reset-styles']");
export const AUTOSAVE_BUTTON = D.querySelector("[data-setting='autosave']");

// CSV related elements
export const DOWNLOAD_CSV_BUTTON = D.querySelector("[data-setting='download-csv']");
export const UPLOAD_CSV_BUTTON = D.querySelector("[data-setting='upload-csv']");
export const UPLOAD_CSV_MODAL = document.querySelector('.modal.is-csv-upload');
export const UPLOAD_CSV_CLOSER = UPLOAD_CSV_MODAL.firstChild;
export const UPLOAD_CSV_AREA = UPLOAD_CSV_MODAL.querySelector(
  "[data-element='upload-file-component']"
);
export const FILE_NAME_COMPONENT = UPLOAD_CSV_MODAL.querySelector(
  "[data-element='file-name-component']"
);
export const FILE_NAME_REMOVE = FILE_NAME_COMPONENT.querySelector("[data-element='remove-file']");
export const FILE_NAME_NAME = FILE_NAME_COMPONENT.querySelector("[data-element='file-text']");
export const CSV_FILE_INPUT = document.getElementById('csvFileInput');
export const UPLOAD_CSV_CONFIRM_BUTTON = UPLOAD_CSV_MODAL.querySelector(
  "[data-element='upload-confirm']"
);

export const CODE_RESULTS_TEXTAREA = D.querySelector("[data-element='code-output']");
export const CODE_RESULTS_COUNT = D.querySelector("[data-element='character-count']");

export const UPDATE_ELEMENTS = D.querySelectorAll("[data-action='update']");

export const NOTIFICATION_ELEMENT = document.querySelector(
  "[data-element='notification-component']"
);
export const NOTIFICATION_MESSAGE = NOTIFICATION_ELEMENT.querySelector(
  "[data-element='notification-message']"
);
