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
    default: {
    }
  }
});

function isConnectedInput(input) {
  const parent = input.closest('[data-connected-inputs]');
  return input.matches('input') && parent != null;
}
