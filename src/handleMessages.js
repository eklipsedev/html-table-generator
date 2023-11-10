/* eslint-disable no-console */
import { NOTIFICATION_ELEMENT, NOTIFICATION_MESSAGE } from './elements';
import { file } from './eventHandlers';
import { settings } from './settings';

let timeoutID; // Store the timeout ID
let messageText = '';

export const deliverMessage = (message) => {
  // Clear the previous timeout (if it exists)
  if (timeoutID) {
    clearTimeout(timeoutID);
    NOTIFICATION_ELEMENT.classList.remove('is-active');
  }

  switch (message) {
    case 'autosave':
      messageText = settings.autosave ? 'Autosave enabled' : 'Autosave disabled';
      break;
    case 'clear-data':
      messageText = 'Table data cleared';
      break;
    case 'clear-formatting':
      messageText = 'Table formatting cleared';
      break;
    case 'reset-styles':
      messageText = 'Table styles reset';
      break;
    case 'upload-csv':
      messageText = file ? 'CSV imported successfully' : 'Error importing CSV';
      break;
    case 'download-csv':
      messageText = 'Table exported successfully';
      break;
    case 'new-table':
      messageText = 'New table created';
      break;
    default:
      console.log('Invalid option');
      return; // Exit early for invalid options
  }

  setTimeout(() => {
    NOTIFICATION_MESSAGE.textContent = messageText;
    NOTIFICATION_ELEMENT.classList.add('is-active');
  }, 300);

  // Set a new timeout for hiding the notification
  timeoutID = setTimeout(() => {
    NOTIFICATION_ELEMENT.classList.remove('is-active');
  }, 2000);
};
