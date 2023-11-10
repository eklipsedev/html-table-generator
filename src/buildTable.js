/* eslint-disable no-plusplus */
import { updateCode } from './codeGenerator';
import { defaultColCount, defaultRowCount } from './constants';
import * as elements from './elements';
import { cleanHtmlCode } from './helpers';
import {
  editor,
  editorOptions,
  setEditor,
  subscribeToEditableInput,
} from './mediumEditor/mediumEditor';
import { settings } from './settings';
import { updateTableCodeInLocalStorage } from './utils/localStorageUtils';
import {
  CAPTION_ELEMENT,
  setCaptionElement,
  setTable,
  setTableCode,
  TABLE,
  tableCaption,
  tableCode,
} from './variables';

export let rows = 0;
export let cols = 0;

export function buildTableFromCode(data) {
  if (data) {
    if (typeof data === 'string') {
      // its code
      const cleanCode = cleanHtmlCode(data);

      // Set the cleaned HTML to the target element
      elements.TABLE_TARGET.innerHTML = cleanCode;
      setTable(elements.TABLE_TARGET.querySelector('table'));
      setCaptionElement(elements.TABLE_TARGET.querySelector('caption'));
      setTableCode(data);

      // Create a DOMParser instance and parse the HTML string
      const parser = new DOMParser();
      const doc = parser.parseFromString(tableCode, 'text/html');

      const table = doc.querySelector('table');

      // Loop through rows
      table.querySelectorAll('tr').forEach((row, rowIndex) => {
        rows++; // row++

        if (rowIndex === 0) {
          // Loop through the header row
          row.querySelectorAll('th').forEach(() => {
            cols++; // cols++
          });
        }
      });
    } else if (Array.isArray(data)) {
      // its csv data or array data
      createTableStructure();
      createCaption();
      createTableHead(data);
      createTableBody(data);
      saveTableData();
    }
  } else {
    // there is no saved code, build table from scratch
    createTableStructure();
    createCaption();
    createTableHead();
    createTableBody();
    saveTableData();
  }

  const tableElements = document.querySelectorAll('caption, th, td');
  setEditor(new MediumEditor(tableElements, editorOptions));
  editor.addElements(tableElements);
  subscribeToEditableInput();

  elements.ROWS_INPUT.value = rows;
  elements.COLUMNS_INPUT.value = cols;
}

// DOM update function to update the number of rows
export function updateRows() {
  const newRowCount = parseInt(elements.ROWS_INPUT.value);
  if (newRowCount === rows) return;

  if (newRowCount > rows) {
    for (let k = rows; k < newRowCount; k++) {
      const row = TABLE.insertRow(-1);
      for (let i = 0; i < cols; i++) {
        const cell = row.insertCell(i);
        createTableCell(cell, 'td');
        editor.addElements(cell);
      }
    }
    rows = newRowCount;
  } else {
    while (rows > newRowCount) {
      const rowToDelete = TABLE.querySelectorAll('tr')[rows - 1]; //TABLE.rows[rows - 2]; // Get the row to delete
      const cellsToDelete = rowToDelete.cells; // Get the cells in the row

      editor.removeElements(cellsToDelete);

      TABLE.deleteRow(rows - 1);
      rows -= 1; //rows--;
    }
    //setRows(tempRows);
  }

  //setRows(newRowCount);
  rows = newRowCount;
  saveTableData();
  if (settings.autosave) {
    updateTableCodeInLocalStorage();
  }
  updateCode();
}

let elementsToRemove = [];

// DOM update function to update the number of columns
export function updateCols() {
  const newColCount = parseInt(elements.COLUMNS_INPUT.value);
  if (newColCount === cols) return;

  // adding columns
  if (newColCount > cols) {
    for (let i = 0; i <= rows - 1; i++) {
      let row = TABLE.rows[i];
      for (let k = 0; k < newColCount - cols; k++) {
        if (i === 0) {
          const cell = document.createElement('th');
          // eslint-disable-next-line prefer-destructuring
          row = TABLE.querySelectorAll('tr')[0];
          row.appendChild(cell);
          const n = cols + k + 1;
          createTableCell(cell, 'th', n);
          editor.addElements(cell);
        } else {
          const cell = row.insertCell(-1);
          createTableCell(cell, 'td');
          editor.addElements(cell);
        }
      }
    }
  } else {
    // removing columns
    const colDifference = cols - newColCount;
    for (let i = 0; i <= rows - 1; i++) {
      const row = TABLE.rows[i];
      for (let k = 0; k < colDifference; k++) {
        const cellToDelete = row.cells[row.cells.length - 1]; // Get the cell to delete

        row.deleteCell(row.cells.length - 1);

        if (!document.body.contains(cellToDelete)) {
          elementsToRemove.push(cellToDelete);
        }
      }
    }
    editor.removeElements(elementsToRemove);
  }

  //setCols(newColCount);
  cols = newColCount;
  saveTableData();
  if (settings.autosave) {
    updateTableCodeInLocalStorage();
  }
  updateCode();
}

const createTableStructure = () => {
  const newTable = document.createElement('table');
  // if table exists, clear existing one
  TABLE ? (TABLE.innerHTML = '') : setTable(newTable);
  elements.TABLE_TARGET.appendChild(newTable);
};

const createCaption = () => {
  const caption = document.createElement('caption');
  caption.textContent = tableCaption;
  caption.setAttribute('contenteditable', true);
  setCaptionElement(caption);
  TABLE.appendChild(caption);
};

const createTableHead = (arrayData) => {
  const thead = TABLE.createTHead();
  const headRow = thead.insertRow();

  //let cols = 0;

  // handle based on if array data is present or not, otherwise build from scratch
  if (arrayData) {
    arrayData.forEach((arrayRow, arrayRowIndex) => {
      // if its the first row in the array, its the header
      if (arrayRowIndex === 0) {
        // this loop will only run for each header cell
        arrayRow.forEach((arrayCell, arrayCellIndex) => {
          const cell = document.createElement('th');
          createTableCell(cell, 'th', arrayCellIndex + 1);
          cell.innerHTML = arrayCell;
          headRow.appendChild(cell);
          cols += 1; //cols++;
        });
      }
    });
  } else {
    // there is no array data, build from scratch
    cols = defaultColCount;

    for (let i = 1; i <= cols; i++) {
      const cell = document.createElement('th');
      cell.setAttribute('contenteditable', 'true');
      cell.innerHTML = `Header ${i}`;
      headRow.appendChild(cell);
    }
  }
  TABLE.appendChild(thead);
};

const createTableBody = (arrayData) => {
  const tbody = TABLE.createTBody();

  if (arrayData) {
    //setRows(arrayData.length);
    rows = arrayData.length;
    arrayData.forEach((arrayRow, arrayRowIndex) => {
      // gets every row except header row
      if (arrayRowIndex > 0) {
        const row = tbody.insertRow();

        // each cell in the body
        arrayRow.forEach((arrayCell) => {
          const cell = row.insertCell();
          cell.setAttribute('contenteditable', 'true');
          cell.innerHTML = arrayCell;
        });
      }
    });
  } else {
    rows = defaultRowCount;
    cols = defaultColCount;
    //setRows(defaultRowCount);
    //setCols(defaultColCount);

    for (let i = 1; i <= rows - 1; i++) {
      // remove 1 row to account for header
      const row = tbody.insertRow();
      for (let j = 1; j <= cols; j++) {
        const cell = row.insertCell();
        cell.setAttribute('contenteditable', 'true');
      }
    }
  }
  TABLE.appendChild(tbody);
};

function createTableCell(cell, type, index) {
  cell.setAttribute('contenteditable', 'true');

  if (type === 'th') {
    // Table header cell
    cell.textContent = `Header ${index}`;
  } else if (type === 'td') {
    // Table row cell
    cell.innerHTML = cell.innerHTML.replace(/&nbsp;/g, '');
  }
}

export const resetTable = () => {
  CAPTION_ELEMENT.textContent = 'Table 1';

  Array.from(elements.TABLE_HEADER_CELLS).forEach((cell, index) => {
    cell.innerHTML = `Header ${index + 1}`;
  });

  Array.from(elements.TABLE_DATA_CELLS).forEach((cell) => {
    cell.innerHTML = '';
  });
};

export const saveTableData = () => {
  setTableCode(TABLE.outerHTML);
};
