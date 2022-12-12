const expirationSelect = document.querySelector('[data-expiration-year]');

const currentYear = new Date().getFullYear();
for (let i = currentYear; i < currentYear + 10; i++) {
  const option = document.createElement('option');
  option.value = i;
  option.innerText = i;
  expirationSelect.append(option);
}

document.addEventListener('keydown', (e) => {
  const input = e.target;
  const key = e.key;
  if (!isConnectedInput(input)) return;

  /* selectionStart === 0 && input.selectionEnd === 0 means the cursor is at the start of the field
     let's say you highlined the first 3 digits, then
     selectionStart === 0 && input.selectionEnd === 3
   */

  switch (key) {
    // If you are at the beginning of a credit number field and you press ArrowLeft, it will move to the end of the previous credit card input field.
    case 'ArrowLeft': {
      // console.log(input.selectionStart);
      // console.log(input.selectionEnd);
      if (input.selectionStart === 0 && input.selectionEnd === 0) {
        const prev = input.previousElementSibling;
        prev.focus();

        /* The one from webdevsimplify is prev.value.length -1 */
        prev.selectionStart = prev.value.length;
        prev.selectionEnd = prev.value.length;

        e.preventDefault();
      }
      break;
    }

    // If you are at the end of a credit card input field (doesn't matter if you only enter 1|2|3 digits only), press ArrowRight will always move to the beginning of the next credit card input field.
    case 'ArrowRight': {
      if (
        input.selectionStart === input.value.length &&
        input.selectionEnd === input.value.length
      ) {
        const next = input.nextElementSibling;
        next.focus();
        next.selectionStart = 0; /* The one from webdevsimplify is 1 */
        next.selectionEnd = 0; /* The one from webdevsimplify is 1 */
        e.preventDefault();
      }
      break;
    }
    case 'Delete': {
      if (
        input.selectionStart === input.value.length &&
        input.selectionEnd === input.value.length
      ) {
        const next = input.nextElementSibling;
        // Need to handle if user is at the end of full 16 digits (4th input, and cursor is after the 4 digits) because it doesn't have a nextElementSibling
        if (next) {
          next.value = next.value.substring(1, next.value.length);
          next.focus();
          next.selectionStart = 0;
          next.selectionEnd = 0;
          e.preventDefault();
        }
      }
      break;
    }
    default: {
      if (e.ctrlKey || e.altKey) return;

      // This is for key like 'tab'
      if (key.length > 1) return;

      // Don't do anything if user is not typing 0-9 number
      if (key.match(/^[^0-9]$/)) return e.preventDefault();

      e.preventDefault();
      onInputChange(input, key);
    }
  }
});

document.addEventListener('paste', (e) => {
  const input = e.target;
  const data = e.clipboardData.getData('text');

  if (!isConnectedInput(input)) return;
  if (!data.match(/^[0-9]+$/)) return e.preventDefault();

  e.preventDefault();
  onInputChange(input, data);
});

// new value doesn't have to be 1 digits, user can copy the whole digits e.g. 56789, and ready to do a ctrl+paste to put the new value in.
function onInputChange(input, newValue) {
  const start = input.selectionStart;
  const end = input.selectionStart;
  updateInputValue(input, newValue, start, end);

  // You will notice without this function, when you enter 12345678, the field is 123487654
  focusInput(input, newValue.length + start);
}

// This is for when user highlight some string and then replace with the typing.
// e.g. the input has 1234, user highlight 23 and do a paste value of 56789, then we need to handle to put 1567894 into the input field.
function updateInputValue(input, extraValue, start = 0, end = 0) {
  const newValue = `${input.value.substring(
    0,
    start
  )}${extraValue}${input.value.substring(end, 4)}`;
  input.value = newValue.substring(0, 4);

  // Create recursive function to keep adding the value until it finishes
  if (newValue > 4) {
    const next = input.nextElementSibling;
    if (next === null) return;
    updateInputValue(next, newValue.substring(4));
  }
}

function focusInput(input, dataLength) {
  let addedChars = dataLength;
  let currentInput = input;

  // Add while loop until of the conditional is false
  while (addedChars > 4 && currentInput.nextElementSibling != null) {
    addedChars -= 4;
    currentInput = currentInput.nextElementSibling;
  }
  if (addedChars > 4) addedChars = 4;

  currentInput.focus();
  currentInput.selectionStart = addedChars;
  currentInput.selectionEnd = addedChars;
}

function isConnectedInput(input) {
  const parent = input.closest('[data-connected-inputs]');
  return input.matches('input') && parent != null;
}
