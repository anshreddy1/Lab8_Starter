// main.js

// CONSTANTS
const RECIPE_URLS = [
  'https://adarsh249.github.io/Lab8-Starter/recipes/1_50-thanksgiving-side-dishes.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/2_roasting-turkey-breast-with-stuffing.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/3_moms-cornbread-stuffing.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/4_50-indulgent-thanksgiving-side-dishes-for-any-holiday-gathering.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/5_healthy-thanksgiving-recipe-crockpot-turkey-breast.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/6_one-pot-thanksgiving-dinner.json'
];

// Run the init() function when the page has loaded
window.addEventListener('DOMContentLoaded', init);

// Starts the program, all function calls trace back here
async function init() {
  initializeServiceWorker();           // — B-block
  let recipes = [];
  try {
    recipes = await getRecipes();      // — A-block
  } catch (err) {
    console.error(err);
  }
  addRecipesToDocument(recipes);
}

/* ─────────────────────────────────────────────────────────────  EXPLORE  (B1-B5) */
function initializeServiceWorker() {
  // B1. Check that Service Workers are supported
  if (!('serviceWorker' in navigator)) return;

  // B2. Register only after the page finishes loading
  window.addEventListener('load', async () => {
    try {
      // B3. Register sw.js
      const reg = await navigator.serviceWorker.register('./sw.js', { scope: './' });
      // B4. Success
      console.log('✅ Service-Worker registered:', reg.scope);
    } catch (err) {
      // B5. Failure
      console.error('❌ Service-Worker registration failed:', err);
    }
  });
}

/* ─────────────────────────────────────────────────────────────  EXPOSE  (A1-A11) */
async function getRecipes() {
  /* ---------- A1. Return cached recipes if they already exist ---------- */
  const cached = localStorage.getItem('recipes');
  if (cached) return JSON.parse(cached);

  /* ---------- A2. Holder for newly-fetched recipes ---------- */
  const recipes = [];

  /* ---------- A3. Wrap the async fetch loop in a Promise ---------- */
  return new Promise(async (resolve, reject) => {
    for (const url of RECIPE_URLS) {
      try {
        /* A6. Fetch each URL */
        const response = await fetch(url);
        /* A7. Parse JSON */
        const data = await response.json();
        /* A8. Push into array */
        recipes.push(data);

        /* A9. When all recipes are in, save & resolve */
        if (recipes.length === RECIPE_URLS.length) {
          saveRecipesToStorage(recipes);
          resolve(recipes);
        }
      } catch (err) {
        /* A10. Log errors */
        console.error('Recipe fetch failed:', err);
        /* A11. Forward the error to caller */
        reject(err);
        break;
      }
    }
  });
}

/* ---------- helper utilities (unchanged) ---------- */
function saveRecipesToStorage(recipes) {
  localStorage.setItem('recipes', JSON.stringify(recipes));
}
function addRecipesToDocument(recipes) {
  if (!recipes) return;
  const main = document.querySelector('main');
  recipes.forEach((recipe) => {
    const recipeCard = document.createElement('recipe-card');
    recipeCard.data = recipe;
    main.append(recipeCard);
  });
}
