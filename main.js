// MEMORIA DEL CARRITO UTILIZANDO LOCALSTORAGE
let cart = JSON.parse(localStorage.getItem('sportzone_cart')) || [];

// ABRIR Y CERRAR EL PANEL DEL CARRITO
function toggleCart() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  if (drawer && overlay) {
    drawer.classList.toggle('open');
    overlay.classList.toggle('open');
  }
}

// AGREGAR PRODUCTO AL CARRITO
function addToCart(title, price) {
  const existingItem = cart.find(item => item.title === title);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      title: title,
      price: price,
      quantity: 1
    });
  }

  saveAndRefreshCart();
  toggleCart(); // Abre el carrito automáticamente
}

// ELIMINAR UN PRODUCTO DEL CARRITO
function removeFromCart(index) {
  cart.splice(index, 1);
  saveAndRefreshCart();
}

// GUARDAR EN LOCALSTORAGE Y ACTUALIZAR VISTA
function saveAndRefreshCart() {
  localStorage.setItem('sportzone_cart', JSON.stringify(cart));
  updateCartUI();
}

// ACTUALIZAR LA INTERFAZ DEL CARRITO
function updateCartUI() {
  const cartCount = document.getElementById('cart-count');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalPrice = document.getElementById('cart-total-price');

  // Calcular la cantidad total de tenis acumulados
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount) cartCount.textContent = totalItems;

  // Renderizar elementos en el panel
  if (cartItemsContainer) {
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Tu carrito está vacío.</p>';
    } else {
      cartItemsContainer.innerHTML = '';
      cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
          <div class="cart-item-info">
            <h4>${item.title}</h4>
            <span>${item.quantity} x $${item.price.toLocaleString('es-MX')} MXN</span>
          </div>
          <button class="btn-remove" onclick="removeFromCart(${index})" title="Eliminar">🗑️</button>
        `;
        cartItemsContainer.appendChild(itemElement);
      });
    }
  }

  // Calcular total
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  if (cartTotalPrice) {
    cartTotalPrice.textContent = `$${totalPrice.toLocaleString('es-MX')}.00 MXN`;
  }
}

// FINALIZAR COMPRA
function checkout() {
  if (cart.length === 0) {
    alert('Tu carrito está vacío. Agrega algunos tenis antes de proceder al pago.');
    return;
  }
  
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  alert(`¡Gracias por tu compra en SportZone!\nTotal pagado: $${totalPrice.toLocaleString('es-MX')}.00 MXN.`);
  
  cart = [];
  saveAndRefreshCart();
  toggleCart();
}

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();

  // FILTRADO DINÁMICO EN LA PÁGINA DE PRODUCTOS
  const categorySelect = document.getElementById('category');
  const searchInput = document.getElementById('search');
  const productCards = document.querySelectorAll('.product-card');

  function filterProducts() {
    const categoryValue = categorySelect ? categorySelect.value : 'todos';
    const searchValue = searchInput ? searchInput.value.toLowerCase().trim() : '';

    productCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const cardTitle = card.querySelector('h2').textContent.toLowerCase();

      const matchesCategory = (categoryValue === 'todos' || cardCategory === categoryValue);
      const matchesSearch = cardTitle.includes(searchValue);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  if (categorySelect) categorySelect.addEventListener('change', filterProducts);
  if (searchInput) searchInput.addEventListener('input', filterProducts);

  // MANEJO DE FORMULARIO DE CONTACTO
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      alert(`¡Gracias por escribirnos, ${name}! Hemos recibido tu consulta y te responderemos muy pronto.`);
      contactForm.reset();
    });
  }
});