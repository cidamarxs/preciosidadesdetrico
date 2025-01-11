document.addEventListener("DOMContentLoaded", () => {
  // Configuração do Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyDvrty4zjeuNMYu8TuQuf49LihZWuiAlgE",
    authDomain: "preciosidades-de-trico.firebaseapp.com",
    databaseURL: "https://preciosidades-de-trico-default-rtdb.firebaseio.com",
    projectId: "preciosidades-de-trico",
    storageBucket: "preciosidades-de-trico.appspot.com",
    messagingSenderId: "53723311991",
    appId: "1:53723311991:web:b32af8acafada569287b72"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const database = firebase.database();
  const recipesRef = database.ref("recipes");

  const recipeForm = document.getElementById("recipe-form");
  const recipesList = document.getElementById("recipes");
  const menu = document.getElementById("menu");

  const loadLocalRecipes = () => JSON.parse(localStorage.getItem("recipes")) || [];
  const saveLocalRecipes = (recipes) => localStorage.setItem("recipes", JSON.stringify(recipes));

  const loadRecipes = () => {
    const localRecipes = loadLocalRecipes();

    recipesRef.once("value", (snapshot) => {
      const firebaseRecipes = snapshot.val() || {};
      const recipes = Object.values(firebaseRecipes).concat(localRecipes);

      renderRecipes(recipes);
      renderMenu(recipes);
    });
  };

  const renderMenu = (recipes) => {
    menu.innerHTML = `<li><a href="#inicio">Início</a></li>`;
    const tags = [...new Set(recipes.map((recipe) => recipe.tags).flat())].sort();
    tags.forEach((tag) => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="#${tag}">${tag}</a>`;
      menu.appendChild(li);

      li.querySelector("a").addEventListener("click", () => {
        document.querySelectorAll(".recipe").forEach((recipe) => {
          recipe.style.display = recipe.dataset.tags.includes(tag) ? "block" : "none";
        });
      });
    });
  };

  const renderRecipes = (recipes) => {
    recipesList.innerHTML = "";
    recipes.forEach((recipe, index) => {
      const recipeContainer = document.createElement("div");
      recipeContainer.className = "recipe";
      recipeContainer.dataset.tags = recipe.tags.join(",");
      recipeContainer.innerHTML = `
        <h3>${recipe.title}</h3>
        <p>${recipe.content}</p>
        ${recipe.file ? `<a href="${recipe.file.url}" target="_blank">${recipe.file.name}</a>` : ""}
        <button class="remove-recipe" data-index="${index}">Remover</button>
      `;

      recipesList.appendChild(recipeContainer);

      recipeContainer.querySelector(".remove-recipe").addEventListener("click", () => {
        const updatedRecipes = loadLocalRecipes().filter((_, i) => i !== index);
        saveLocalRecipes(updatedRecipes);
        renderRecipes(updatedRecipes);
        renderMenu(updatedRecipes);
      });
    });
  };

  recipeForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const localRecipes = loadLocalRecipes();
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const tags = document.getElementById("tag").value.split(",").map((tag) => tag.trim());
    const fileInput = document.getElementById("file");
    const file = fileInput.files[0]
      ? { name: fileInput.files[0].name, url: URL.createObjectURL(fileInput.files[0]) }
      : null;

    const newRecipe = { title, content: description, tags, file };

    localRecipes.push(newRecipe);
    saveLocalRecipes(localRecipes);
    recipesRef.push(newRecipe);

    renderRecipes(localRecipes);
    renderMenu(localRecipes);

    recipeForm.reset();
    alert("Receita adicionada com sucesso!");
  });

  loadRecipes();
});
