const searchInput = document.querySelector(".searchInput");
const searchButton = document.querySelector(".searchButton");
const recipeContainer = document.querySelector(".recipe-container");
const recipeCloseButton = document.querySelector(".recipe-close-btn");
const recipeDetailsContent = document.querySelector(".recipe-details-content");

// BY DEFAULT RECIPIES
const recipeKeywords = [
  "chicken",
  "pizza",
  "salad",
  "beef",
  "soup",
  "dessert",
  "vegetarian",
  "seafood",
  "breakfast",
  "lunch",
  "dinner",
];

// FETCHING DATA AND STORING IN LOCAL STORAGE
const fetchRecipes = async (query) => {
  const cachedRecipes = localStorage.getItem(`recipes_${query}`);
  if (cachedRecipes) {
    renderRecipes(JSON.parse(cachedRecipes));
    return;
  }

  recipeContainer.innerHTML = "Loading Recipes...";
  recipeContainer.classList.add("loading");
  const data = await fetch(
    `https://api.spoonacular.com/recipes/complexSearch?apiKey=2d64886d0c044243bfbb47cc4f2d0c7a&query=${query}`
  );

  const response = await data.json();
  localStorage.setItem(`recipes_${query}`, JSON.stringify(response.results));
  renderRecipes(response.results);
};

const renderRecipes = (recipes) => {
  recipeContainer.innerHTML = "";
  recipeContainer.classList.remove("loading");

  recipes.slice(0, 9).forEach((item) => {
    const newRecipe = document.createElement("div");
    newRecipe.classList.add("recipe");
    newRecipe.innerHTML = `
      <div class="image-container">
        <img src="${item.image}" alt="${item.title}" />
      </div>
      <div class="recipe-name">${item.title}</div>
    `;

    const button = document.createElement("button");
    button.textContent = "View Recipe";
    button.addEventListener("click", () => {
      openRecipe(item);
    });
    newRecipe.appendChild(button);

    recipeContainer.appendChild(newRecipe);
  });
};
// FETCHING INGREDIENTS
const fetchIngredients = async (recipeId) => {
  const cachedIngredients = localStorage.getItem(`ingredients_${recipeId}`);
  if (cachedIngredients) {
    return JSON.parse(cachedIngredients);
  }

  const data = await fetch(
    `https://api.spoonacular.com/recipes/${recipeId}/ingredientWidget.json?apiKey=2d64886d0c044243bfbb47cc4f2d0c7a`
  );
  const response = await data.json();
  localStorage.setItem(
    `ingredients_${recipeId}`,
    JSON.stringify(response.ingredients)
  );
  return response.ingredients;
};

const openRecipe = async (item) => {
  const ingredients = await fetchIngredients(item.id);
  const ingredientList = ingredients
    .map(
      (ingredient) => `
    <li>${ingredient.name}: ${ingredient.amount.us.value} ${ingredient.amount.us.unit}</li>
  `
    )
    .join("");

  recipeDetailsContent.innerHTML = `
    <h5>${item.title}</h5>
    <h5>Ingredients</h5>
    <ul>${ingredientList}</ul>
  `;
  recipeDetailsContent.parentElement.style.display = "block";
};

recipeCloseButton.addEventListener("click", () => {
  recipeDetailsContent.parentElement.style.display = "none";
});

searchButton.addEventListener("click", (event) => {
  event.preventDefault();
  const searchRecipe = searchInput.value.trim();
  fetchRecipes(searchRecipe);
});

document.addEventListener("DOMContentLoaded", () => {
  const randomKeyword =
    recipeKeywords[Math.floor(Math.random() * recipeKeywords.length)];
  fetchRecipes(randomKeyword);
});
