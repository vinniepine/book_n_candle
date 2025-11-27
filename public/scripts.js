const apiUrl = window.location.origin;

const grid = document.getElementById('products-grid');
const categoryFilter = document.getElementById('category-filter');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const emptyState = document.getElementById('empty-state');
const spotlightTitle = document.getElementById('spotlight-title');
const spotlightDesc = document.getElementById('spotlight-desc');
const spotlightPrice = document.getElementById('spotlight-price');
const spotlightTags = document.getElementById('spotlight-tags');

let products = [];

async function loadProducts() {
  try {
    const res = await fetch(`${apiUrl}/products`);
    if (!res.ok) throw new Error('Erro ao buscar produtos');
    products = await res.json();
    renderCategories(products);
    renderProducts(products);
    highlightProduct();
  } catch (err) {
    console.error(err);
    emptyState.hidden = false;
    emptyState.textContent = 'Não foi possível carregar o catálogo agora. Tente novamente em instantes.';
  }
}

function renderCategories(list) {
  const categories = Array.from(new Set(list.map((p) => p.category).filter(Boolean))).sort();
  categories.forEach((cat) => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categoryFilter.appendChild(option);
  });
}

function formatPrice(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function renderProducts(list) {
  grid.innerHTML = '';
  if (!list.length) {
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;

  list.forEach((p) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <span class="badge">${p.category || 'Místico'}</span>
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <div class="chip-row">
        ${(p.tags || []).map((t) => `<span class="chip">${t}</span>`).join('')}
      </div>
      <div class="meta">
        <span class="price">${formatPrice(p.price)}</span>
        <span class="pill">${p.popularity ? '★ ' + p.popularity : 'Novo'}</span>
      </div>
    `;
    grid.appendChild(card);
  });
}

function filterProducts() {
  const term = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  const sort = sortSelect.value;

  let list = [...products];

  if (category) {
    list = list.filter((p) => p.category === category);
  }
  if (term) {
    list = list.filter(
      (p) => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term),
    );
  }

  if (sort === 'popularity') {
    list.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  }
  if (sort === 'priceAsc') {
    list.sort((a, b) => a.price - b.price);
  }
  if (sort === 'priceDesc') {
    list.sort((a, b) => b.price - a.price);
  }

  renderProducts(list);
}

function highlightProduct() {
  if (!products.length) return;
  const top = [...products].sort((a, b) => (b.popularity || 0) - (a.popularity || 0))[0];
  if (!top) return;
  spotlightTitle.textContent = top.name;
  spotlightDesc.textContent = top.description;
  spotlightPrice.textContent = formatPrice(top.price);
  spotlightTags.innerHTML = (top.tags || []).map((t) => `<span class="chip">${t}</span>`).join('');
}

categoryFilter.addEventListener('change', filterProducts);
searchInput.addEventListener('input', filterProducts);
sortSelect.addEventListener('change', filterProducts);

loadProducts();
