document.addEventListener("DOMContentLoaded", function () {
    const basket = document.querySelector(".products-container");
    const totalText = document.getElementById("total-price");
    const itemTypeSelect = document.getElementById("itemType");
    const minPriceInput = document.getElementById("minPrice");
    const maxPriceInput = document.getElementById("maxPrice");

    let products = [];

    if (typeof window.products !== 'undefined') {
        products = window.products;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let filteredCart = [...cart];

    console.log("Initial cart data:", cart);
// товари
    function showCart(items = filteredCart) {
        basket.innerHTML = "";
        let total = 0;

        if (items.length === 0) {
            basket.innerHTML = "<p>Ваш кошик порожній або немає товарів, що відповідають фільтрам.</p>";
            totalText.textContent = "0 UAH";
            return;
        }

        items.forEach((item, index) => {
            const price = parseFloat(item.price.split(' ')[0]);
            const sum = price * item.quantity;
            total += sum;

            const originalIndex = cart.findIndex(cartItem =>
                cartItem.id === item.id || (cartItem.name === item.name && cartItem.price === item.price)
            );

            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <img src="${item.img}" alt="${item.name}">
                <div class="card-info">
                    <p class="card-name">${item.name}</p>
                    <span class="card-price">${item.price} × ${item.quantity} = ${sum.toFixed(2)} UAH</span>
                </div>
                <div class="quantity-cntrl">
                    <button class="decrease" data-index="${originalIndex}">–</button>
                    <span class="card-qty">${item.quantity}</span>
                    <button class="increase" data-index="${originalIndex}">+</button>
                    <button class="remove" data-index="${originalIndex}">Видалити</button>
                </div>
            `;
            basket.appendChild(card);
        });

        totalText.textContent = `${total.toFixed(2)} UAH`;
        addButtonListeners();
        drawChart();
    }
    // діаграма
    const chartCanvas = document.getElementById("chartCanvas");
    const ctx = chartCanvas.getContext("2d");
    const chartTypeSelect = document.getElementById("chartType");

    chartTypeSelect.addEventListener("change", drawChart);

    function drawChart() {
        ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);

        if (filteredCart.length === 0) return;

        const dataMap = {};
        filteredCart.forEach(item => {
            const category = item.category || item.type || item.name;
            dataMap[category] = (dataMap[category] || 0) + item.quantity;
        });

        const labels = Object.keys(dataMap);
        const values = Object.values(dataMap);
        const chartType = chartTypeSelect.value;

        if (chartType === "pie") {
            drawPieChart(labels, values);
        } else if (chartType === "bar") {
            drawBarChart(labels, values);
        } else if (chartType === "line") {
            drawLineChart(labels, values);
        }
    }

    function drawPieChart(labels, values) {
        const total = values.reduce((a, b) => a + b, 0);
        let startAngle = 0;
        values.forEach((val, i) => {
            const angle = (val / total) * 2 * Math.PI;
            ctx.beginPath();
            ctx.moveTo(300, 200);
            ctx.fillStyle = getColor(i);
            ctx.arc(300, 200, 150, startAngle, startAngle + angle);
            ctx.fill();
            startAngle += angle;
        });
    }

    function drawBarChart(labels, values) {
        const barWidth = 40;
        const spacing = 60;
        const maxVal = Math.max(...values);
        values.forEach((val, i) => {
            const barHeight = (val / maxVal) * 300;
            ctx.fillStyle = getColor(i);
            ctx.fillRect(i * spacing + 50, 350 - barHeight, barWidth, barHeight);
            ctx.fillStyle = "#000";
            ctx.fillText(labels[i], i * spacing + 50, 370);
        });
    }

    function drawLineChart(labels, values) {
        const maxVal = Math.max(...values);
        ctx.beginPath();
        ctx.moveTo(50, 350 - (values[0] / maxVal) * 300);
        values.forEach((val, i) => {
            const x = i * 100 + 50;
            const y = 350 - (val / maxVal) * 300;
            ctx.lineTo(x, y);
            ctx.arc(x, y, 3, 0, 2 * Math.PI);
        });
        ctx.strokeStyle = "#007bff";
        ctx.stroke();
    }

    function getColor(index) {
        const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#AA65D2", "#45D279", "#FF9F40"];
        return colors[index % colors.length];
    }

// кнопки
    function addButtonListeners() {
        document.querySelectorAll(".remove").forEach(btn => {
            btn.addEventListener("click", () => {
                const i = parseInt(btn.dataset.index);
                cart.splice(i, 1);
                saveCart();
            });
        });

        document.querySelectorAll(".increase").forEach(btn => {
            btn.addEventListener("click", () => {
                const i = parseInt(btn.dataset.index);
                cart[i].quantity += 1;
                saveCart();
            });
        });

        document.querySelectorAll(".decrease").forEach(btn => {
            btn.addEventListener("click", () => {
                const i = parseInt(btn.dataset.index);
                if (cart[i].quantity > 1) {
                    cart[i].quantity -= 1;
                } else {
                    cart.splice(i, 1);
                }
                saveCart();
            });
        });
    }

    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
        filterAndSortItems();
    }

    //фільтрація товарів
    function filterAndSortItems() {
        const selectedType = itemTypeSelect.value;
        const minPrice = minPriceInput.value ? parseFloat(minPriceInput.value) : 0;
        const maxPrice = maxPriceInput.value ? parseFloat(maxPriceInput.value) : Infinity;

        console.log("Selected category:", selectedType);

        filteredCart = cart.filter(item => {
            const itemPrice = parseFloat(item.price.split(' ')[0]);

            const itemCategory = item.category || item.type;
            const typeMatch = selectedType === "" || itemCategory === selectedType;

            const priceMatch = itemPrice >= minPrice &&
                (maxPrice === Infinity || itemPrice <= maxPrice);

            console.log(`Item: ${item.name}, Category: ${itemCategory}, Selected: ${selectedType}, TypeMatch: ${typeMatch}, PriceMatch: ${priceMatch}`);

            return typeMatch && priceMatch;
        });

        console.log("Filtered items:", filteredCart);
        showCart(filteredCart);
    }

    function filterItems() {
        filterAndSortItems();
    }

    itemTypeSelect.addEventListener("change", filterAndSortItems);

    const filterButton = document.querySelector("button[onclick='filterItems()']");
    if (filterButton) {
        filterButton.removeAttribute("onclick");
        filterButton.addEventListener("click", filterItems);
    }

    showCart();
});

// кнопка вгору
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

//тільки користувач
document.getElementById("makeOrderBtn").addEventListener("click", function () {
  const token = localStorage.getItem("token");

  if (!token || isTokenExpired(token)) {
    alert("Лише зареєстровані користувачі можуть оформити замовлення!");
    const modal = document.getElementById("loginModal");
    if (modal) {
      modal.classList.remove("hidden"); 
    }
  } else {
    alert("Замовлення успішно відправлено!");
  }
});

document.querySelectorAll(".close").forEach(btn => {
  btn.addEventListener("click", function () {
    const modalId = btn.getAttribute("data-close");
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("hidden");
    }
  });
});

function isTokenExpired(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error("Невірний формат токена");
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp && currentTime > payload.exp;
  } catch (e) {
    console.error("Помилка розбору токена:", e.message);
    return true; 
  }
}


