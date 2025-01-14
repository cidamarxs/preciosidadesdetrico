document.addEventListener("DOMContentLoaded", () => {
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
  const recipesRef = database.ref("receitas");

  const recipeForm = document.getElementById("recipe-form");
  const recipesList = document.getElementById("recipes");
  const menu = document.getElementById("menu");

  const loadRecipes = () => {
    recipesRef.once("value", (snapshot) => {
      const firebaseRecipes = snapshot.val() || {};
      const receitas = Object.entries(firebaseRecipes).map(([id, data]) => ({ id, ...data }));
      console.log('Receitas carregadas do Firebase:', receitas);
      renderRecipes(receitas);
      renderMenu(receitas);
    });
  };

  const renderMenu = (receitas) => {
    menu.innerHTML = '<li><a href="#inicio">Início</a></li>';

    const tags = [...new Set(receitas.map((recipe) => recipe.tags).flat())].sort();

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

  const renderRecipes = (receitas) => {
    recipesList.innerHTML = "";

    receitas.forEach((recipe) => {
      const recipeContainer = document.createElement("div");
      recipeContainer.className = "recipe";
      recipeContainer.dataset.tags = recipe.tags.join(",");

      recipeContainer.innerHTML = `
        <h3>${recipe.title}</h3>
        <p>${recipe.content}</p>
        ${recipe.file ? `<a href="${recipe.file.url}" target="_blank">${recipe.file.name}</a>` : ""}
        <button class="remove-recipe" data-id="${recipe.id}">Remover</button>
      `;

      recipesList.appendChild(recipeContainer);

      recipeContainer.querySelector(".remove-recipe").addEventListener("click", async () => {
        const recipeId = recipeContainer.querySelector(".remove-recipe").dataset.id;
        await recipesRef.child(recipeId).remove();
        console.log('Receita removida do Firebase:', recipeId);

        loadRecipes(); // Recarrega as receitas após remoção
      });
    });
  };

  recipeForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const tags = document.getElementById("tag").value.split(",").map((tag) => tag.trim());
    const fileInput = document.getElementById("file");
    const file = fileInput.files[0] ? { name: fileInput.files[0].name, url: URL.createObjectURL(fileInput.files[0]) } : null;

    const newRecipe = { title, content: description, tags, file };
    const newRecipeRef = await recipesRef.push(newRecipe);
    console.log('Nova receita adicionada ao Firebase:', newRecipe);

    loadRecipes(); // Recarrega as receitas após adição

    recipeForm.reset();
    alert("Receita adicionada com sucesso!");
  });

    loadRecipes();
});
