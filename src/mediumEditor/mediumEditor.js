import MediumEditor from 'medium-editor';

import { updateCode } from '../codeGenerator';
import { settings } from '../settings';
import { updateTableCodeInLocalStorage } from '../utils/localStorageUtils';

export let editor = null; // Declare as "let" for potential reassignment

export function setEditor(newValue) {
  editor = newValue;
}

export const editorOptions = {
  toolbar: {
    allowMultiParagraphSelection: true,
    buttons: ['bold', 'italic', 'underline', 'anchor', 'strikethrough', 'subscript', 'superscript'],
    diffLeft: 0,
    diffTop: -10,
    firstButtonClass: 'medium-editor-button-first',
    lastButtonClass: 'medium-editor-button-last',
    relativeContainer: null,
    standardizeSelectionStart: false,
    static: false,
    align: 'center',
    sticky: false,
    updateOnEmptySelection: false,
  },
  placeholder: false,
  anchor: {
    linkValidation: true,
    placeholderText: 'Paste or type a link',
    targetCheckbox: true,
    targetCheckboxText: 'Open in new tab',
  },
  paste: {
    forcePlainText: false,
    cleanPastedHTML: true,
    cleanReplacements: [],
    cleanAttrs: ['class', 'style', 'dir'],
    cleanTags: ['meta'],
    unwrapTags: [],
  },
};

// Initialize the editor when the module is imported
export function initializeEditor(selector) {
  editor = new MediumEditor(selector, editorOptions);
}

export function subscribeToEditableInput() {
  editor.subscribe('editableInput', () => {
    updateCode();
    if (settings.autosave) {
      updateTableCodeInLocalStorage();
    }
  });
}
