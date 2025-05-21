const productForm = document.getElementById("addProductForm");
const successMessage = document.getElementById("successMessage");

productForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const productName = document.getElementById("product_text").value.trim();
  const productImg = document.getElementById("product_img").value.trim();
  const productPriceRaw = document.getElementById("product_price").value.trim();
  const productCategory = document.getElementById("category").value;
  const productDescription = document.getElementById("product_description").value.trim();

  if (!productName || !productImg || !productPriceRaw || !productCategory || !productDescription) {
    alert("Заповніть всі поля!");
    return;
  }

  // Ціна в число
  const productPrice = parseFloat(productPriceRaw.replace(/[^\d\.]/g, ''));
  if (isNaN(productPrice)) {
    alert("Введіть коректну ціну!");
    return;
  }

  const productData = {
    name: productName,
    img: productImg,
    price: productPrice,
    category: productCategory,
    description: productDescription
  };

  try {
    await postProduct(productData);
    successMessage.textContent = `Товар "${productName}" успішно додано!`;
    productForm.reset();
  } catch (error) {
    successMessage.textContent = "Помилка при додаванні товару. Спробуйте пізніше.";
    console.error("Помилка:", error);
  }
});

// Відправка на сервер
async function postProduct(productData) {
  const url = "https://chnu-student-interview-preparation.netlify.app/.netlify/functions/userCreateItem";
  const jwtToken = localStorage.getItem("token");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${jwtToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(productData)
  });

  if (!response.ok) {
    throw new Error(`помилка HTTP! Status: ${response.status}`);
  }

  const data = await response.json();
  console.log("Отримані дані:", data);
  return data;
}
