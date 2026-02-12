// Imports
import * as model from "./model.js";
import {MODAL_CLOSE_SEC} from "./config.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";

// Hot Module
if (module.hot) {
  module.hot.accept();
}

// Loading Recipe
const controlRecipes = async function() {
  try {
    // Listening for Changes in #
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Render Spinner
    recipeView.renderSpinner();

    // Update Results View to Mark Selected 
    resultsView.update(model.getSearchResultsPage());
    
    // Updating Bookmarks View
    bookmarksView.update(model.state.bookmarks);

    // Loading Recipe
    await model.loadRecipe(id);
    
    // Rendering Recipe
    recipeView.render(model.state.recipe);
  }

  // Error Handling
  catch (err) {
    recipeView.renderError();
    console.error(err);
  };
};

controlRecipes();

// Search
const controlSearchResults = async function() {
  try {
    // Spinner
    resultsView.renderSpinner();

    // Get Search Query
    const query = searchView.getQuery();
    if(!query) return;

    // Load Search Results
    await model.loadSearchResults(query);

    // Render Results
    resultsView.render(model.getSearchResultsPage());

    // Render Initial Pagination Buttons
    paginationView.render(model.state.search);

  }

  catch(err) {
    console.log(err);
  };
};

// Control Pagination
const controlPagination = function(goToPage) {
    // Render NEW Results
    resultsView.render(model.getSearchResultsPage(goToPage));

    // Render NEW Pagination Buttons
    paginationView.render(model.state.search);
};

// Control Servings
const controlServings = function(newServings) {
  // Update the Recipe Servings (in State)
  model.updateServings(newServings);

  // Update the Recipe View
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

// Control for Bookmark
const controlAddBookmark = function() {
  // Add or Remove Bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update Recipe View
  recipeView.update(model.state.recipe);

  // Render Bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function(newRecipe) {
  try {
    // Show Loading Spinner
    addRecipeView.renderSpinner();

    // Upload the New Recipe Data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render Recipe
    recipeView.render(model.state.recipe);

    // Success Message
    addRecipeView.renderMessage();

    // Render Bookmark View
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    // Close Form Window
    setTimeout(function() {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  }

  catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

// Initialize
const init = function() {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
};

init();