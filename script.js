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
  if (!isConnectedInput(input)) return;
});

function isConnectedInput(input) {
  const parent = input.closest('[data-connected-inputs]');
  return input.matches('input') && parent != null;
}
