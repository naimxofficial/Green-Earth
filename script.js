const categoriesContainer = document.getElementById("categoriesContainer");
const treesContainer = document.getElementById("treesContainer");
const loadingSpinner = document.getElementById("loadingSpinner");
const allTreesbtn = document.getElementById("allTreesbtn");
const showTreeDetail = document.getElementById("showTreeDetail");
const modalTitle = document.getElementById("modalTitle");
const modalImage = document.getElementById("modalImage");
const modalCategory = document.getElementById("modalCategory");
const modalDescription = document.getElementById("modalDescription");
const modalPrice = document.getElementById("modalPrice");
let cart = [];
const cartContainer = document.getElementById("cartContainer");
const totalPrice = document.getElementById("totalPrice");
const emptyCartMessage = document.getElementById("emptyCartMessage");

async function loadCategories() {
    const res = await fetch(
        "https://openapi.programming-hero.com/api/categories",
    );
    const data = await res.json();
    data.categories.forEach((category) => {
        const btn = document.createElement("button");
        btn.className = "btn btn-soft w-full p-[10px]";
        btn.innerText = category.category_name;
        btn.onclick = () => selectCategory(category.id, btn);
        categoriesContainer.append(btn);
    });
}

async function selectCategory(categoryid, btn) {
    showL\oading();
    const allButtons = document.querySelectorAll(
        "#categoriesContainer button , #allTreesbtn",
    );
    allButtons.forEach((btn) => {
        btn.classList.remove("btn-primary");
        btn.classList.add("btn-soft");
    });

    btn.classList.add("btn-primary");
    btn.classList.remove("btn-soft");

    const res = await fetch(
        `https://openapi.programming-hero.com/api/category/${categoryid}`,
    );
    const data = await res.json();
    displayTrees(data.plants);
    hideLoading();
}

async function loadTrees() {
    showLoading();
    const res = await fetch("https://openapi.programming-hero.com/api/plants");
    const data = await res.json();
    displayTrees(data.plants);
}

function displayTrees(trees) {
    trees.forEach((tree) => {
        const div = document.createElement("div");
        div.className = "card bg-white shadow-sm p-3";
        div.innerHTML = `
        <figure>
        <img onclick="openTreeModal(${tree.id})"  src="${tree.image}" alt="Tree image"
                class="object-cover w-full h-50 cursor-pointer"/></figure>
        <div class="card-body">
        <h2 class="card-title ">${tree.name}</h2>
        <p class="opacity-80 line-clamp-2">${tree.description}</p>
        <div class="card-actions justify-between">
        <div class="badge badge-soft badge-success">${tree.category}</div>
        <h2 class="text-green-900 font-semibold">৳ ${tree.price}</h2>
        </div>
        <div class="card-actions justify-end">
        <button onclick="addToCart(${tree.id}, '${tree.name}', ${tree.price})" class="btn btn-primary w-full rounded-full">Add to Cart</button>
        </div>
        </div>`;
        treesContainer.append(div);
    });
    hideLoading();
}

function showLoading() {
    loadingSpinner.classList.remove("hidden");
    treesContainer.innerHTML = "";
}
function hideLoading() {
    loadingSpinner.classList.add("hidden");
}

allTreesbtn.addEventListener("click", function () {
    // Reset button styles
    const allButtons = document.querySelectorAll(
        "#categoriesContainer button, #allTreesbtn",
    );
    allButtons.forEach((btn) => {
        btn.classList.remove("btn-primary");
        btn.classList.add("btn-soft");
    });
    allTreesbtn.classList.add("btn-primary");
    allTreesbtn.classList.remove("btn-soft");

    loadTrees(); // Reload all trees
});

async function openTreeModal(treeId) {
    const res = await fetch(
        `https://openapi.programming-hero.com/api/plant/${treeId}`,
    );
    const data = await res.json();
    const plantDetails = data.plants;

    modalTitle.textContent = plantDetails.name;
    modalCategory.textContent = plantDetails.category;
    modalDescription.textContent = plantDetails.description;
    modalPrice.textContent = `৳ ${plantDetails.price}`;
    modalImage.src = plantDetails.image;

    showTreeDetail.showModal();
}

function addToCart(id, name, price) {
    const existingItem = cart.find((item) => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id,
            name,
            price,
            quantity: 1,
        });
    }
    updateCart();
}

function updateCart() {
    cartContainer.innerHTML = "";

    if (cart.length == 0) {
        emptyCartMessage.classList.remove("hidden");
    } else {
        emptyCartMessage.classList.add("hidden");
    }

    let total = 0;
    cart.forEach((item) => {
        total += item.price * item.quantity;
        const div = document.createElement("div");
        // div.classList.add("gap-2");
        div.innerHTML = `<div class=" bg-[#F0FDF4] p-3 rounded-lg">
                            <div class="flex justify-between items-center">
                                <h3 class="font-semibold">${item.name}</h3>
                                <button class="btn btn-ghost" onclick="removeFromCart(${item.id})">X</button>
                            </div>
                            <p class="opacity-50">৳${item.price} x ${item.quantity}</p>
                            <p class="text-right font-medium text-green-500">৳${item.price * item.quantity}</p>
                        </div>`;
        cartContainer.append(div);
    });
    totalPrice.innerText = `৳ ${total}`;
}

function removeFromCart(treeId) {
    const updatedElements = cart.filter((item) => item.id != treeId);
    cart = updatedElements;
    updateCart();
}

loadCategories();
loadTrees();
