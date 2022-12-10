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
    case 'ArrowLeft': {
      // console.log(input.selectionStart);
      // console.log(input.selectionEnd);

      // If you are at the beginning of a credit number field and you click ArrowLeft, it will move to the previous credit card input field.
      if (input.selectionStart === 0 && input.selectionEnd === 0) {
        const prev = input.previousElementSibling;
        prev.focus();
        prev.selectionStart = prev.value.length - 1;
        prev.selectionEnd = prev.value.length - 1;
        e.preventDefault();
      }
      break;
    }
    default: {
    }
  }
});

function isConnectedInput(input) {
  const parent = input.closest('[data-connected-inputs]');
  return input.matches('input') && parent != null;
}
