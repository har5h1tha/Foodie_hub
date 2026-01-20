// --- MENU DATA ---
const menuItems = {
    burger: { name: "Classic Burger", price: 120, qty: 0, elementId: "burger-qty" },
    pizza: { name: "Margherita Pizza", price: 250, qty: 0, elementId: "pizza-qty" },
    pasta: { name: "Creamy Alfredo Pasta", price: 200, qty: 0, elementId: "pasta-qty" },
    salad: { name: "Caesar Salad", price: 150, qty: 0, elementId: "salad-qty" },
    fries: { name: "French Fries", price: 80, qty: 0, elementId: "fries-qty" },
    drink: { name: "Fresh Lemonade", price: 70, qty: 0, elementId: "drink-qty" },
    vanilla: { name: "Vanilla", price: 90, qty: 0, elementId: "vanilla-qty" },
};

// --- DOM ELEMENTS ---
const orderItemsContainer = document.getElementById('order-items');
const emptyOrderMessage = document.getElementById('empty-order');
const subtotalElement = document.getElementById('subtotal');
const taxElement = document.getElementById('tax');
const totalElement = document.getElementById('total');
const checkoutBtn = document.getElementById('checkout-btn');
const deliveryFee = 20;

const addressModal = document.getElementById('address-modal');
const successModal = document.getElementById('success-modal');
const placeOrderBtn = document.getElementById('place-order-btn');
const closeSuccessBtn = document.getElementById('close-success');
const addressInput = document.getElementById('address-input');
const phoneInput = document.getElementById('phone-input');


function showError(id, message) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = message;
}
addressInput.addEventListener('input', () => showError('AddressErr', ''));
phoneInput.addEventListener('input', () => showError('PhoneErr', ''));




// --- ORDER STATE ---
let order = [];
let subtotal = 0;

// --- UPDATE BILL ---
function updateBill() {
    subtotal = 0;
    order.forEach(item => {
        subtotal += item.price * item.qty;
    });

    const tax = subtotal * 0.005;
    const total = subtotal + tax + deliveryFee;

    subtotalElement.textContent = `₹${subtotal}`;
    taxElement.textContent = `₹${tax.toFixed(2)}`;
    totalElement.textContent = `₹${total}`;
    checkoutBtn.textContent = `Checkout (₹${total})`;

     updateOrderItems();
}


// --- UPDATE ORDER ITEMS IN BILL ---
function updateOrderItems() {
    orderItemsContainer.innerHTML = '';
    const orderedItems = order.filter(item => item.qty > 0);

    if (orderedItems.length === 0) {
        orderItemsContainer.appendChild(emptyOrderMessage);
        emptyOrderMessage.style.display = 'block';
    } else {
        emptyOrderMessage.style.display = 'none';
        orderedItems.forEach(item => {
            console.log(item)
            const orderItemElement = document.createElement('div');
            orderItemElement.className = 'order-item';
            orderItemElement.innerHTML = `
                <div class="item-name">${item.name}</div>
                <div class="item-qty">x${item.qty}</div>
                <div class="item-price">₹${item.price * item.qty}</div>
            `;
            orderItemsContainer.appendChild(orderItemElement);
        });
    }
}

// --- UPDATE QUANTITY ---
function updateQuantity(itemId, change) {
    const item = menuItems[itemId];
    // console.log(item)
    item.qty = Math.max(0, item.qty + change);
    document.getElementById(item.elementId).textContent = item.qty;

    const existingIndex = order.findIndex(i => i.id === itemId);
    if (item.qty === 0 && existingIndex !== -1) {
        order.splice(existingIndex, 1);
    } else if (item.qty > 0 && existingIndex === -1) {
        order.push({ id: itemId, name: item.name, price: item.price, qty: item.qty });
    } else if (item.qty > 0 && existingIndex !== -1) {
        order[existingIndex].qty = item.qty;
    }

    updateBill();
}

// --- EVENT LISTENERS FOR PLUS/MINUS BUTTONS ---
document.querySelectorAll('.plus-btn').forEach(btn => {
    // console.log(btn.dataset.item)
    btn.addEventListener('click', () => updateQuantity(btn.dataset.item, 1));
});

document.querySelectorAll('.minus-btn').forEach(btn => {
    btn.addEventListener('click', () => updateQuantity(btn.dataset.item, -1));
});

// --- CHECKOUT BUTTON ---
checkoutBtn.addEventListener('click', () => {
    if (subtotal === 0){
        alert('Please add at least one item to your order before checking out.');
        return;
    } 
    addressModal.style.display = 'flex';
});

// --- PLACE ORDER ---
placeOrderBtn.addEventListener('click', () => {
    const address = addressInput.value.trim();
    const phone = phoneInput.value.trim();

    // Validate address & 10-digit phone
    if (!/^\d{10}$/.test(phone)) {
        phoneInput.focus();
         showError('PhoneErr',"Enter Correct Phone number")
        return;
    }
    if (!address) {
        addressInput.focus();
        showError('AddressErr',"Enter Correct address")
        return;
    }
    

    // Hide address modal, show success
    addressModal.style.display = 'none';
    successModal.style.display = 'flex';

    // Reset order
    for (const id in menuItems) {
        menuItems[id].qty = 0;
        document.getElementById(menuItems[id].elementId).textContent = '0';
        // console.log(id);
        
    }
    order = [];
    addressInput.value = '';
    phoneInput.value = '';
    updateBill();
});

// --- CLOSE SUCCESS MODAL ---
closeSuccessBtn.addEventListener('click', () => {
    successModal.style.display = 'none';
});

// --- CLOSE MODALS ON BACKDROP CLICK ---
window.addEventListener('click', e => {
    if (e.target === addressModal) addressModal.style.display = 'none';
    if (e.target === successModal) successModal.style.display = 'none';
});

// --- LIMIT PHONE INPUT TO NUMBERS ONLY ---
phoneInput.addEventListener('input', () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10);
});

// --- INITIALIZE ---
updateBill();
