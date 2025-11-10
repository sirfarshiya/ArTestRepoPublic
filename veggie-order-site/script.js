const vegetables = [
  {
    id: 'tomato',
    name: 'Tomato',
    price: 38,
    unit: 'kg',
    description: 'Juicy, vine-ripened tomatoes perfect for salads and curries.'
  },
  {
    id: 'potato',
    name: 'Potato',
    price: 32,
    unit: 'kg',
    description: 'Starchy and versatile potatoes sourced from local farms.'
  },
  {
    id: 'spinach',
    name: 'Spinach',
    price: 28,
    unit: 'bunch',
    description: 'Fresh spinach bunches packed with iron and vitamins.'
  },
  {
    id: 'carrot',
    name: 'Carrot',
    price: 40,
    unit: 'kg',
    description: 'Crunchy orange carrots ideal for juices and roasting.'
  },
  {
    id: 'cauliflower',
    name: 'Cauliflower',
    price: 55,
    unit: 'head',
    description: 'Tender florets that stay crisp after steaming or baking.'
  },
  {
    id: 'cucumber',
    name: 'Cucumber',
    price: 30,
    unit: 'kg',
    description: 'Cool cucumbers that add instant refreshment to every meal.'
  }
];

const DELIVERY_FEE = 40;

const vegetableList = document.querySelector('#vegetable-list');
const subtotalEl = document.querySelector('#order-subtotal');
const deliveryFeeEl = document.querySelector('#delivery-fee');
const totalEl = document.querySelector('#order-total');
const paymentExtra = document.querySelector('#payment-extra');
const orderForm = document.querySelector('#order-form');
const confirmationModal = document.querySelector('#confirmation-modal');
const confirmEmail = document.querySelector('#confirm-email');
const confirmAddress = document.querySelector('#confirm-address');
const confirmTotal = document.querySelector('#confirm-total');
const yearEl = document.querySelector('#year');

yearEl.textContent = new Date().getFullYear();

deliveryFeeEl.textContent = formatCurrency(DELIVERY_FEE);

const quantities = new Map();

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
}

function renderVegetables() {
  const fragment = document.createDocumentFragment();
  vegetables.forEach((veg) => {
    const card = document.createElement('article');
    card.className = 'vegetable-card';
    card.innerHTML = `
      <div class="vegetable-card__header">
        <span>${veg.name}</span>
        <span class="vegetable-card__price">${formatCurrency(veg.price)} / ${veg.unit}</span>
      </div>
      <p>${veg.description}</p>
      <div class="quantity-control" data-id="${veg.id}">
        <button type="button" aria-label="Decrease quantity">−</button>
        <input type="number" min="0" value="0" step="0.5" inputmode="decimal" />
        <button type="button" aria-label="Increase quantity">+</button>
      </div>
    `;
    fragment.appendChild(card);
  });

  vegetableList.appendChild(fragment);
}

function updateTotals() {
  let subtotal = 0;
  quantities.forEach((qty, id) => {
    const vegetable = vegetables.find((veg) => veg.id === id);
    if (vegetable) {
      subtotal += qty * vegetable.price;
    }
  });

  subtotalEl.textContent = formatCurrency(subtotal);
  const total = subtotal === 0 ? 0 : subtotal + DELIVERY_FEE;
  totalEl.textContent = formatCurrency(total);

  if (subtotal === 0) {
    deliveryFeeEl.textContent = formatCurrency(0);
  } else {
    deliveryFeeEl.textContent = formatCurrency(DELIVERY_FEE);
  }
}

function attachQuantityHandlers() {
  vegetableList.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;

    const control = button.closest('.quantity-control');
    if (!control) return;

    const input = control.querySelector('input');
    const id = control.dataset.id;
    const current = parseFloat(input.value) || 0;
    const step = parseFloat(input.step) || 1;

    if (button.textContent.trim() === '+') {
      input.value = (current + step).toFixed(1);
    } else {
      input.value = Math.max(0, current - step).toFixed(1);
    }

    const newQty = parseFloat(input.value);
    if (newQty > 0) {
      quantities.set(id, newQty);
    } else {
      quantities.delete(id);
    }
    updateTotals();
  });

  vegetableList.addEventListener('input', (event) => {
    const input = event.target.closest('input[type="number"]');
    if (!input) return;

    const control = input.closest('.quantity-control');
    const id = control.dataset.id;
    const value = Math.max(0, parseFloat(input.value) || 0);
    input.value = value.toFixed(1);
    if (value > 0) {
      quantities.set(id, value);
    } else {
      quantities.delete(id);
    }
    updateTotals();
  });
}

function renderPaymentExtra(paymentType) {
  if (!paymentType) {
    paymentExtra.innerHTML = '';
    return;
  }

  if (paymentType === 'card') {
    paymentExtra.innerHTML = `
      <label class="form-field">
        <span>Name on card</span>
        <input type="text" name="cardName" required placeholder="Name as on card" />
      </label>
      <label class="form-field">
        <span>Card number</span>
        <input type="text" name="cardNumber" required inputmode="numeric" pattern="[0-9]{16}" placeholder="16-digit card number" />
      </label>
      <div class="form-grid">
        <label class="form-field">
          <span>Expiry (MM/YY)</span>
          <input type="text" name="expiry" required pattern="(0[1-9]|1[0-2])\/\d{2}" placeholder="05/28" />
        </label>
        <label class="form-field">
          <span>CVV</span>
          <input type="password" name="cvv" required inputmode="numeric" pattern="[0-9]{3}" placeholder="123" />
        </label>
      </div>
    `;
  } else if (paymentType === 'upi') {
    paymentExtra.innerHTML = `
      <label class="form-field">
        <span>UPI ID</span>
        <input type="text" name="upi" required placeholder="name@bank" />
      </label>
    `;
  } else {
    paymentExtra.innerHTML = `
      <p class="order__intro">
        Keep the exact change ready. Our delivery agent will carry a card/UPI
        reader for contactless collection.
      </p>
    `;
  }
}

function attachPaymentHandler() {
  orderForm.addEventListener('change', (event) => {
    if (event.target.name === 'payment') {
      renderPaymentExtra(event.target.value);
    }
  });
}

function handleSubmit() {
  orderForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (quantities.size === 0) {
      alert('Please add at least one vegetable to your basket.');
      return;
    }

    if (!orderForm.reportValidity()) {
      return;
    }

    const formData = new FormData(orderForm);
    confirmEmail.textContent = formData.get('email');
    confirmAddress.textContent = formData.get('address');
    confirmTotal.textContent = totalEl.textContent;

    if (typeof confirmationModal.showModal === 'function') {
      confirmationModal.showModal();
    } else {
      alert('Order confirmed!');
    }

    orderForm.reset();
    paymentExtra.innerHTML = '';
    quantities.clear();
    updateTotals();
  });
}

renderVegetables();
attachQuantityHandlers();
attachPaymentHandler();
handleSubmit();
updateTotals();
