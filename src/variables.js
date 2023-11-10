import { TABLE_TARGET } from './elements';
import { defaultStyles } from './styles';

export let TABLE;
export let CAPTION_ELEMENT = TABLE_TARGET.getElementsByTagName('caption');

export let tableCode = '';
export let tableCaption = 'Table 1';
export let tableStyles = { ...defaultStyles };

// setters so that these variables can be modified across other files

export function setTable(newValue) {
  TABLE = newValue;
}

export function setCaptionElement(newValue) {
  CAPTION_ELEMENT = newValue;
}

export function setTableCode(newValue) {
  tableCode = newValue;
}

export function setTableCaption(newValue) {
  tableCaption = newValue;
}

export function setTableStyles(newValue) {
  tableStyles = newValue;
}

export function setRows(newValue) {
  rows = newValue;
}

export function getRows() {
  return rows;
}

export function setCols(newValue) {
  cols = newValue;
}

export function getCols() {
  return cols;
}
