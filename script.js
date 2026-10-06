const displayEl = document.getElementById('display');
const historyEl = document.getElementById('history');
const SYMBOL = { '+': '+', '-': '−', '*': '×', '/': '÷' };

let current = '0';   // số đang nhập (dạng chuỗi)
let previous = null; // số trước đó
let operator = null; // phép tính đang chờ
let startNew = false; // true: chữ số tiếp theo bắt đầu một số mới

function show(text) {
  displayEl.textContent = text ?? current;
  displayEl.classList.toggle('small', displayEl.textContent.length > 16);
}

function calculate(a, op, b) {
  if (op === '+') return a + b;
  if (op === '-') return a - b;
  if (op === '*') return a * b;
  if (op === '/') return b === 0 ? null : a / b;
}

function clean(n) {
  // làm tròn để 0.1 + 0.2 ra 0.3 thay vì 0.30000000000000004
  return String(Number(n.toPrecision(12)));
}

function reset() {
  current = '0'; previous = null; operator = null; startNew = false;
  historyEl.textContent = '';
}

function inputDigit(d) {
  if (startNew) { current = '0'; startNew = false; }
  if (d === '.') {
    if (!current.includes('.')) current += '.';
  } else {
    current = current === '0' ? d : current + d;
  }
  show();
}

function chooseOperator(op) {
  if (operator && !startNew) equals(true);
  previous = parseFloat(current);
  operator = op;
  startNew = true;
  historyEl.textContent = clean(previous) + ' ' + SYMBOL[op];
}

function equals(keepOperator) {
  if (operator === null) return;
  const b = parseFloat(current);
  const result = calculate(previous, operator, b);
  if (result === null) {
    reset();
    historyEl.textContent = 'Lỗi';
    show('Không chia được cho 0');
    startNew = true;
    return;
  }
  historyEl.textContent = clean(previous) + ' ' + SYMBOL[operator] + ' ' + clean(b) + ' =';
  current = clean(result);
  if (!keepOperator) { operator = null; previous = null; }
  startNew = true;
  show();
}

function backspace() {
  if (startNew) return;
  const tooShort = current.length <= 1 || (current.length === 2 && current[0] === '-');
  current = tooShort ? '0' : current.slice(0, -1);
  show();
}

function toggleSign() {
  if (current === '0') return;
  current = current[0] === '-' ? current.slice(1) : '-' + current;
  show();
}

document.getElementById('keys').addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const { digit, op, action } = btn.dataset;
  if (digit !== undefined) inputDigit(digit);
  else if (op) chooseOperator(op);
  else if (action === 'equals') equals(false);
  else if (action === 'clear') { reset(); show(); }
  else if (action === 'back') backspace();
  else if (action === 'sign') toggleSign();
});

document.addEventListener('keydown', (e) => {
  const k = e.key;
  if (/^[0-9]$/.test(k)) inputDigit(k);
  else if (k === '.' || k === ',') inputDigit('.');
  else if ('+-*/'.includes(k)) chooseOperator(k);
  else if (k === 'Enter' || k === '=') { e.preventDefault(); equals(false); }
  else if (k === 'Backspace') backspace();
  else if (k === 'Escape' || k.toLowerCase() === 'c') { reset(); show(); }
});
