
// Menu items data
const menuItems = {
    burger: { name: "Classic Burger", price: 120, qty: 0, elementId: "burger-qty" },
    pizza: { name: "Margherita Pizza", price: 250, qty: 0, elementId: "pizza-qty" },
    pasta: { name: "Creamy Alfredo Pasta", price: 200, qty: 0, elementId: "pasta-qty" },
    salad: { name: "Caesar Salad", price: 150, qty: 0, elementId: "salad-qty" },
    fries: { name: "French Fries", price: 80, qty: 0, elementId: "fries-qty" },
    drink: { name: "Fresh Lemonade", price: 70, qty: 0, elementId: "drink-qty" }
};

// DOM elements
const orderItemsContainer = document.getElementById('order-items');
const emptyOrderMessage = document.getElementById('empty-order');
const subtotalElement = document.getElementById('subtotal');
const taxElement = document.getElementById('tax');
const totalElement = document.getElementById('total');
const checkoutBtn = document.getElementById('checkout-btn');
const deliveryFee = 20;



function showError(id, message) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = message;
}



// Initialize order
let order = [];
let subtotal = 0;

// Update bill display
function updateBill() {
    // Calculate subtotal
    subtotal = 0;
    order.forEach(item => {
        subtotal += item.price * item.qty;
    });

    // Calculate tax (5%)
    const tax = subtotal * 0.005;

    // Calculate total
    const total = subtotal + tax + deliveryFee;

    // Update bill elements
    subtotalElement.textContent = `₹${subtotal}`;
    taxElement.textContent = `₹${tax}`;
    totalElement.textContent = `₹${total}`;
    checkoutBtn.textContent = `Checkout (₹${total})`;

    // Update order items in bill
    updateOrderItems();
}

// Update order items in bill section
function updateOrderItems() {
    // Clear current order items
    orderItemsContainer.innerHTML = '';

    // Filter items with quantity > 0
    const orderedItems = order.filter(item => item.qty > 0);

    if (orderedItems.length === 0) {
        // Show empty message
        orderItemsContainer.appendChild(emptyOrderMessage);
        emptyOrderMessage.style.display = 'block';
    } else {
        // Hide empty message
        emptyOrderMessage.style.display = 'none';

        // Add each ordered item to bill
        orderedItems.forEach(item => {
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

// Update quantity for an item
function updateQuantity(itemId, change) {
    const item = menuItems[itemId];

    // Update quantity (ensure it doesn't go below 0)
    item.qty = Math.max(0, item.qty + change);

    // Update quantity display
    document.getElementById(item.elementId).textContent = item.qty;

    // Update order array
    const existingOrderIndex = order.findIndex(orderItem => orderItem.id === itemId);

    if (item.qty === 0 && existingOrderIndex !== -1) {
        // Remove item from order if quantity is 0
        order.splice(existingOrderIndex, 1);
    } else if (item.qty > 0 && existingOrderIndex === -1) {
        // Add item to order if it's not already there
        order.push({
            id: itemId,
            name: item.name,
            price: item.price,
            qty: item.qty
        });
    } else if (item.qty > 0 && existingOrderIndex !== -1) {
        // Update quantity in existing order
        order[existingOrderIndex].qty = item.qty;
    }

    // Update bill
    updateBill();
}

// Add event listeners to all plus and minus buttons
document.querySelectorAll('.plus-btn').forEach(button => {
    button.addEventListener('click', function () {
        const itemId = this.getAttribute('data-item');
        updateQuantity(itemId, 1);
    });
});

document.querySelectorAll('.minus-btn').forEach(button => {
    button.addEventListener('click', function () {
        const itemId = this.getAttribute('data-item');
        updateQuantity(itemId, -1);
    });
});


// Initialize bill on page load
updateBill();



const addressModal = document.getElementById('address-modal');
const successModal = document.getElementById('success-modal');
const placeOrderBtn = document.getElementById('place-order-btn');
const closeSuccessBtn = document.getElementById('close-success');
const addressInput = document.getElementById('address-input');
const phoneInput = document.getElementById('phone-input');


checkoutBtn.addEventListener('click', function () {
    const total = parseFloat(totalElement.textContent.replace('₹', ''));

    if (total <= deliveryFee) {
        alert('Please add items before checkout.');
        return;
    }

    // Show address modal
    addressModal.style.display = 'flex';
});

placeOrderBtn.addEventListener('click', function () {
    const address = addressInput.value.trim();
    const phone = phoneInput.value.trim();

    // if (!phone || !address) return;

    // if (!address) {
    //     alert('Please enter a delivery address.');
    //     return;
    // }

    // HARD STOP if phone is not exactly 10 digits
    if (!/^\d{10}$/.test(phone)) {
        phoneInput.focus();
         showError('PhoneErr','Enter correct number');
         return
    }

    // HARD STOP if address empty
    if (address.length === 0) {
        addressInput.focus();
        showError('AddressErr','Enter correct Address')
        return
    }

    addressModal.style.display = 'none';
    successModal.style.display = 'flex';

    // Reset everything
    for (const itemId in menuItems) {
        menuItems[itemId].qty = 0;
        document.getElementById(menuItems[itemId].elementId).textContent = '0';
    }

    order = [];
    addressInput.value = '';
    phoneInput.value = '';
    updateBill();
});

closeSuccessBtn.addEventListener('click', function () {
    successModal.style.display = 'none';
});
