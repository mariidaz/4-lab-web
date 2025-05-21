const useApi = false;
//товари
let products = [
    { id: 1, name: "Королівський рубін", img: "./img/namysto 1.jpg", category: "necklace", price: "12000 UAH", description: "Вишукане намисто із червоними каменями" },
    { id: 2, name: "Грація кохання", img: "./img/namysto 2.jpg", category: "necklace", price: "1300 UAH", description: "Намито з ніжними рожевими вставками" },
    { id: 3, name: "Золотий міраж", img: "./img/ring 1.jpg", category: "ring", price: "3600 UAH", description: "Витончене золоте кільце з чарівним орнаментом" },
    { id: 4, name: "Перлина чистоти", img: "./img/namysto 3.jpg", category: "necklace", price: "4300 UAH", description: "Лаконічне намисто з перлинним акценто" },
    { id: 5, name: "Перлинне сяйво", img: "./img/ring 2.jpg", category: "ring", price: "5430 UAH", description: "Елегантне кільце з дрібними перлинами" },
    { id: 6, name: "Трояндова ніжність", img: "./img/ring 3.jpg", category: "ring", price: "3200 UAH", description: "Ніжне кільце у рожевому золоті з квітковим мотивом" },
    { id: 7, name: "Небесна легкість", img: "./img/namysto 4.jpg", category: "necklace", price: "1690 UAH", description: "Тонке намисто із крихітними перлинами" },
    { id: 8, name: "Обійми кохання", img: "./img/ring 4.jpg", category: "ring", price: "1060 UAH", description: "Делікатне золотисте кільце з романтичним дизайном" },
    { id: 9, name: "Сонячна корона", img: "./img/ring 5.jpg", category: "ring", price: "850 UAH", description: "Кільце з унікальною текстурою, що нагадує сонячні промені" },
    { id: 10, name: "Золота елегантність", img: "./img/namysto 5.jpg", category: "necklace", price: "2100 UAH", description: "Мінімалістичне золоте намисто" },
    { id: 11, name: "Крапля світла", img: "./img/namysto 6.jpg", category: "necklace", price: "6200 UAH", description: "Срібне намисто з підвіскою-краплиною" },
    { id: 12, name: "Розкіш королеви", img: "./img/namysto 7.jpg", category: "necklace", price: "3400 UAH", description: "Витончене намисто з рубіновими каменями" },
    { id: 13, name: "Таємниці серця", img: "./img/ring 7.jpg", category: "ring", price: "1500 UAH", description: "Мінімалістичне кільце, що додає образу витонченості" },
    { id: 14, name: "Казкова ніжність", img: "./img/namysto 8.jpg", category: "necklace", price: "500 UAH", description: "Делікатне намисто з чарівним дизайном" },
    { id: 15, name: "Чарівна гілка", img: "./img/ring 8.jpg", category: "ring", price: "860 UAH", description: "Кільце, що нагадує витончену гілочку" },
    { id: 16, name: "Крилата мрія", img: "./img/ring 6.jpg", category: "ring", price: "1100 UAH", description: "Фантазійне кільце у формі крил" },
];

let loadedCount = 0;
const perLoad = 4;
let currentCategory = "all";

const container = document.getElementById("products");
const loadMoreBtn = document.getElementById("load_more");
const filterButtons = document.querySelectorAll(".filters button");

function renderProducts() {
    const filteredProducts = currentCategory === "all" ? products : products.filter(p => p.category === currentCategory);
    const productsShow = filteredProducts.slice(0, loadedCount + perLoad);

    container.innerHTML = productsShow.map(product => `
        <div class="product-card">
            <img src="${product.img}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">${product.price}</p>
            <div class="description hidden">${product.description}</div>
            <button class="toggle-description">Show Description</button>
            <div class="quantity-cart">
               <input type="number" min="1" value="1" class="quantity-input" data-id="${product.id}" />
               <button class="add-to-cart" data-id="${product.id}">Add to cart</button>
            </div>
        </div>
    `).join("");

    loadMoreBtn.style.display = productsShow.length >= filteredProducts.length ? "none" : "block";

    container.querySelectorAll(".toggle-description").forEach(button => {
        button.addEventListener("click", function () {
            const description = this.previousElementSibling;
            description.classList.toggle("hidden");
            this.textContent = description.classList.contains("hidden") ? "Show Description" : "Hide Description";
        });
    });

    container.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("data-id");
            const product = products.find(p => p.id == id);

            const count = parseInt(button.previousElementSibling.value) || 1;

            if (product) {
                const item = {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    img: product.img,
                    category: product.category,  
                    quantity: count
                };

                let cart = JSON.parse(localStorage.getItem("cart") || "[]");
                const same = cart.find(i => i.id === product.id);

                if (same) {
                    same.quantity += count;
                } else {
                    cart.push(item);
                }

                localStorage.setItem("cart", JSON.stringify(cart));

                alert("Товар додано в кошик!");
            }
        });
    });

}

loadMoreBtn.addEventListener("click", () => {
    loadedCount += perLoad;
    renderProducts();
});

filterButtons.forEach(button => {
    button.addEventListener("click", function () {
        currentCategory = this.dataset.category;

        filterButtons.forEach(btn => btn.classList.remove("active"));
        this.classList.add("active");

        renderProducts();
    });
});

filterButtons[0].classList.add("active");
renderProducts();

async function loadProducts(category = "all") {
    const url = "https://chnu-student-interview-preparation.netlify.app/.netlify/functions/userGetItems";
    const jwtToken = localStorage.getItem("token");

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            }
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();

        const productsContainer = document.getElementById("products");
        productsContainer.innerHTML = "";

        const filteredProducts = category === "all"
            ? data
            : data.filter(p => p.category === category);

        filteredProducts.forEach(product => {
            const productEl = document.createElement("div");
            productEl.classList.add("product");
            productEl.innerHTML = `
                <img src="${product.img}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p><strong>${product.price} грн</strong></p>
                <button class="add-to-cart">До кошика</button>
            `;
            productsContainer.appendChild(productEl);
        });

    } catch (error) {
        console.error("Помилка при завантаженні товарів:", error);
    }
}

//підписка
const Subscribe = document.getElementById("subscribe");
setTimeout(() => {
    Subscribe.style.display = "block";
}, 4000);

document.getElementById("subscribe_accept").addEventListener("click", () => {
    Subscribe.style.display = "none";
    localStorage.setItem("subscribed", "true");
    alert("Thank you for subscribing!");

});
document.getElementById("subscribe_decline").addEventListener("click", () => {
    Subscribe.style.display = "none";
    localStorage.setItem("subscribe", "shown");
});

//реклама
const AdModal = document.getElementById("ad");
function showAd() {
    AdModal.style.display = "block";
    let timeleft = 5;
    const CloseAD = document.getElementById("close_ad");
    CloseAD.setAttribute("disabled", "true");
    CloseAD.textContent = `Please wait! (${timeleft})`;

    const timer = setInterval(() => {
        CloseAD.textContent = `Please wait! (${timeleft})`;
        timeleft--;
        if (timeleft < 0) {
            clearInterval(timer);
            CloseAD.textContent = "Close";
            CloseAD.removeAttribute("disabled");
        }
    }, 1000);

    function CloseHandler() {
        AdModal.style.display = "none";
        CloseAD.removeEventListener("click", CloseHandler);

        setTimeout(showAd, 30000);
    }
    CloseAD.addEventListener("click", CloseHandler);
}
setTimeout(showAd, 30000);

const scrollBtn = document.getElementById("scrollToTopBtn");

window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    const triggerHeight = window.innerHeight * (2 / 3);
    
    if (scrolled > triggerHeight) {
        scrollBtn.style.display = "block";
    } else {
        scrollBtn.style.display = "none";
    }
});

scrollBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

document.addEventListener("DOMContentLoaded", () => {
    if (useApi) {
        loadProducts();
    } else {
        renderProducts();
    }

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            currentCategory = button.dataset.category;
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            if (useApi) {
                loadProducts(currentCategory);
            } else {
                loadedCount = 0;
                renderProducts();
            }
        });
    });

    if (!useApi) {
        loadMoreBtn.addEventListener("click", () => {
            loadedCount += perLoad;
            renderProducts();
        });
    }
});