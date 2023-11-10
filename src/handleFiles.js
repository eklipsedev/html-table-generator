import * as XLSX from 'xlsx';

import { buildTableFromCode } from './buildTable';
import { updateCode } from './codeGenerator';
import * as elements from './elements';
import { deliverMessage } from './handleMessages';
import { removeAttributes } from './helpers';
import { settings } from './settings';
import { updateTableCodeInLocalStorage } from './utils/localStorageUtils';
import { CAPTION_ELEMENT, tableCaption } from './variables';
import { setTableCaption } from './variables';

// helper to get the file extension of the CSV file
function getFileExtension(fileName) {
  // Split the file name by the dot (.) character and get the last part
  const parts = fileName.split('.');
  if (parts.length > 1) {
    return parts[parts.length - 1].toLowerCase();
  }
  return ''; // If no extension is found
}

function convertCsvToArray(csvContent) {
  const rows = csvContent.split('\n');

  return rows.map((row) => {
    // Use a regular expression to split the row by commas while preserving quoted values
    const values = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);

    // Remove surrounding quotes from each value
    if (values) {
      return values.map((value) => value.replace(/^"(.*)"$/, '$1'));
    }
    return [];
  });
}

export function handleFile(file) {
  if (file) {
    const fileName = file.name;
    const extension = getFileExtension(fileName); // Will return csv or xlsx
    setTableCaption(fileName);

    const reader = new FileReader();

    reader.onload = function (e) {
      if (extension === 'csv') {
        const csvContent = e.target.result;
        const csvArray = convertCsvToArray(csvContent);

        buildTableFromCode(csvArray);
      } else if (extension === 'xlsx') {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Assuming the first sheet is the one you want to convert
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Create an options object to specify allowed HTML elements and attributes
        const options = {
          ALLOWED_TAGS: [
            'table',
            'caption',
            'thead',
            'tbody',
            'tr',
            'th',
            'td',
            'b',
            'a',
            'i',
            'u',
            'strike',
          ],
          ALLOWED_ATTR: ['href', 'target', 'rel'],
        };

        // Convert the sheet data to HTML table with sanitized content
        const htmlTable = XLSX.utils.sheet_to_html(sheet, {
          display: true,
          raw: true, // Return raw cell content
          cellHTML: true, // Include cell content as HTML
        });

        // Sanitize the cell content
        const sanitizedHtmlTable = DOMPurify.sanitize(htmlTable, options);
        const withAttributesRemoved = removeAttributes(sanitizedHtmlTable);

        // Create a temporary container to parse the HTML content
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = withAttributesRemoved;

        // Get the table and its first row
        const table = tempContainer.querySelector('table');
        const tbody = table.querySelector('tbody');
        const tcaption = document.createElement('caption');
        const thead = document.createElement('thead'); // Create a new <thead>
        const headerRow = tbody.querySelector('tr'); // Get the first row from <tbody>

        tcaption.textContent = tableCaption;

        // Remove the first row from <tbody>
        tbody.removeChild(headerRow);

        // Convert the <td> elements in the header row to <th>
        const headerCells = headerRow.querySelectorAll('td');
        headerCells.forEach((cell) => {
          const th = document.createElement('th');
          th.innerHTML = cell.innerHTML;
          thead.appendChild(th);
        });

        // Add the new <thead> above the <tbody>
        table.insertBefore(thead, tbody);
        table.insertBefore(tcaption, thead);

        buildTableFromCode(tempContainer.innerHTML);
      }

      updateCode();
      if (settings.autosave) {
        updateTableCodeInLocalStorage();
      }
      // reset DOM things
      elements.UPLOAD_CSV_AREA.style.display = 'flex';
      elements.FILE_NAME_COMPONENT.style.display = 'none';
      elements.UPLOAD_CSV_CONFIRM_BUTTON.parentElement.style.display = 'none';
      elements.CSV_FILE_INPUT.value = '';
      elements.FILE_NAME_NAME.textContent = 'No file selected';

      deliverMessage('upload-csv');
    };

    reader.onerror = function (error) {
      // Handle the error, e.g., by displaying an error message or logging it
      console.error('Error reading the file:', error);
      deliverMessage('upload-csv');
    };

    // Start reading the file after setting up the event handlers
    if (extension === 'csv') {
      reader.readAsText(file);
    } else if (extension === 'xlsx') {
      reader.readAsArrayBuffer(file);
    }
  }
}

const downloadCSVFile = (csvData) => {
  // Create CSV file object and feed
  // our csv_data into it
  const CSVFile = new Blob([csvData], {
    type: 'text/csv',
  });

  // Create to temporary link to initiate
  // download process
  const tempLink = document.createElement('a');

  // Download csv file
  const hasCaptionCheck =
    CAPTION_ELEMENT.textContent !== ''
      ? CAPTION_ELEMENT.textContent.trim().replace(/\s/g, '-').toLowerCase()
      : 'html-table';

  tempLink.download = hasCaptionCheck;
  const url = window.URL.createObjectURL(CSVFile);
  tempLink.href = url;

  // This link should not be displayed
  tempLink.style.display = 'none';
  document.body.appendChild(tempLink);

  // Automatically click the link to
  // trigger download
  tempLink.click();
  document.body.removeChild(tempLink);
};

export const tableToCSV = () => {
  const csvData = [];

  Array.from(elements.TABLE_ROW_CELLS).forEach((row) => {
    const cols = Array.from(row.querySelectorAll('td, th'));

    const csvRow = cols.map((col) => {
      // Get the text data of each cell, and handle escaping of special characters
      const cellText = col.textContent.trim(); // Remove extra white space
      return `"${cellText.replace(/"/g, '""').replace(/\n/g, ' ').replace(/\r/g, ' ')}"`; // Handle double quotes and line breaks
    });

    csvData.push(csvRow.join(','));
  });

  const tableContent = csvData.join('\n');

  downloadCSVFile(tableContent);
};
