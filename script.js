const categoriesContainer = document.getElementById("categoriesContainer");
const treesContainer = document.getElementById("treesContainer");
const loadingSpinner = document.getElementById("loadingSpinner");
const allTreesbtn = document.getElementById("allTreesbtn");

async function loadCategories() {
    const res = await fetch(
        "https://openapi.programming-hero.com/api/categories",
    );
    const data = await res.json();
    data.categories.forEach((category) => {
        const btn = document.createElement("button");
        btn.className = "btn btn-soft w-full p-[10px]";
        btn.innerText = category.category_name;
        btn.onclick = () => selectCategory(category.id, btn)
        categoriesContainer.append(btn);
    });
}

async function selectCategory(categoryid, btn){
    showLoading();
    const allButtons = document.querySelectorAll("#categoriesContainer button , #allTreesbtn");
    allButtons.forEach(btn =>{
        btn.classList.remove("btn-primary");
        btn.classList.add("btn-soft");
    });

    btn.classList.add('btn-primary');
    btn.classList.remove('btn-soft');

    const res = await fetch(`https://openapi.programming-hero.com/api/category/${categoryid}`);
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
        <img src="${tree.image}" alt="Tree image"
                class="object-cover w-full h-50"/></figure>
        <div class="card-body">
        <h2 class="card-title">${tree.name}</h2>
        <p class="opacity-80 line-clamp-2">${tree.description}</p>
        <div class="card-actions justify-between">
        <div class="badge badge-soft badge-success">${tree.category}</div>
        <h2 class="text-green-900 font-semibold">$${tree.price}</h2>
        </div>
        <div class="card-actions justify-end">
        <button class="btn btn-primary w-full rounded-full">Add to Cart</button>
        </div>
        </div>`;
        treesContainer.append(div)
    });
    hideLoading();
}

function showLoading(){
        loadingSpinner.classList.remove("hidden");
        treesContainer.innerHTML = "";
}
function hideLoading(){
        loadingSpinner.classList.add("hidden");
}

allTreesbtn.addEventListener("click", function() {
    // Reset button styles
    const allButtons = document.querySelectorAll("#categoriesContainer button, #allTreesbtn");
    allButtons.forEach(btn => {
        btn.classList.remove("btn-primary");
        btn.classList.add("btn-soft");
    });
    allTreesbtn.classList.add("btn-primary");
    allTreesbtn.classList.remove("btn-soft");
    
    loadTrees(); // Reload all trees
});

loadCategories();
loadTrees();