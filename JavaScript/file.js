// ===== ShopZone: товары =====

// Товары "по умолчанию" (то, что было захардкожено в html раньше)
const defaultProducts = [
    {
        id: 'default-1',
        title: 'Iphone 17 pro max',
        description: 'Мощьный и стильный телефон',
        price: 1200.99,
        image: '../img/product/promax.jpeg'
    }
];

const STORAGE_KEY = 'shopzone_products';

function getCustomProducts() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Ошибка чтения localStorage:', e);
        return [];
    }
}

function saveCustomProducts(products) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
        console.error('Ошибка сохранения в localStorage:', e);
        alert('Не удалось сохранить товар. Возможно, фото слишком большое.');
    }
}

// Рисуем карточки товаров на главной странице
function renderProducts() {
    const container = document.querySelector('.main-content');
    if (!container) return; // на странице формы этого блока нет

    const allProducts = [...defaultProducts, ...getCustomProducts()];

    container.innerHTML = allProducts.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${escapeHtml(product.title)}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${escapeHtml(product.title)}</h3>
                <p class="product-description">${escapeHtml(product.description)}</p>
                <div class="product-price">$${Number(product.price).toFixed(2)}</div>
                <button class="buy-button">В корзину</button>
            </div>
        </div>
    `).join('');
}

// Простая защита от html-инъекций в названии/описании
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Логика формы добавления товара (index-add-product.html)
function initAddProductForm() {
    const form = document.getElementById('addProductForm');
    if (!form) return;

    const photoInput = document.getElementById('productPhoto');
    const preview = document.getElementById('photoPreview');

    photoInput.addEventListener('change', () => {
        const file = photoInput.files[0];
        if (!file) {
            preview.style.display = 'none';
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('productName').value.trim();
        const description = document.getElementById('productDescription').value.trim();
        const price = parseFloat(document.getElementById('productPrice').value);
        const file = photoInput.files[0];

        if (!title || !description || isNaN(price) || price < 0) {
            alert('Пожалуйста, заполните название, описание и корректную цену.');
            return;
        }
        if (!file) {
            alert('Пожалуйста, выберите фото товара.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const newProduct = {
                id: 'custom-' + Date.now(),
                title,
                description,
                price,
                image: e.target.result // base64-строка картинки
            };

            const products = getCustomProducts();
            products.push(newProduct);
            saveCustomProducts(products);

            window.location.href = 'index-home.html';
        };
        reader.readAsDataURL(file);
    });
}

// Кнопка "Log in" -> переход на страницу логина
function initLoginButton() {
    const loginBtn = document.getElementById('loginBtn');
    if (!loginBtn) return;

    loginBtn.addEventListener('click', () => {
        // Папка "log in" лежит на уровень выше папки "home" (см. структуру проекта)
        window.location.href = '../log%20in/index-log-in.html';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    initAddProductForm();
    initLoginButton();
});