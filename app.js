document.addEventListener("DOMContentLoaded", () => {
  const validUser = { username: "preciosidade", password: "preciosidade" }; // Credenciais de login fixas
  const loginSection = document.getElementById("login-section");
  const recipesSection = document.getElementById("recipes-section");
  const recipeList = document.getElementById("recipe-list");
  const addRecipeForm = document.getElementById("add-recipe-form");
  const logoutBtn = document.getElementById("logout-btn");
  const tagMenu = document.getElementById("tag-menu"); // Menu de tags
  const loginErrorDiv = document.getElementById("login-error"); // Div para erro de login

  // Função para exibir a seção de receitas após login
  function showRecipesSection() {
    recipesSection.style.display = "block";  // Mostrar a seção de receitas
  }

  // Função para salvar receitas no localStorage
  function saveRecipesToLocalStorage(recipes) {
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }

  // Função para carregar receitas do localStorage
  function loadRecipesFromLocalStorage() {
    return JSON.parse(localStorage.getItem("recipes")) || [];
  }

  // Função para renderizar receitas na interface
  function renderRecipes(recipes) {
    recipeList.innerHTML = ""; // Limpar lista de receitas
    recipes.forEach((recipe, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${recipe.name}</strong><br>
        <p>${recipe.description}</p>
        <p><i>Tags: ${recipe.tags.join(", ")}</i></p>
        ${
          recipe.fileURL
            ? `<a href="${recipe.fileURL}" target="_blank">Abrir Arquivo</a>`
            : ""
        }
        <button class="delete-btn" data-index="${index}">Excluir</button>
      `;
      li.querySelector('.delete-btn').addEventListener('click', (event) => {
        const indexToDelete = event.target.getAttribute('data-index');
        recipes.splice(indexToDelete, 1); // Excluir receita
        saveRecipesToLocalStorage(recipes); // Atualizar localStorage
        renderRecipes(recipes); // Atualizar a lista de receitas
        renderTags(recipes); // Atualizar as tags
      });
      recipeList.appendChild(li);
    });
  }

  // Função para renderizar tags no menu lateral
  function renderTags(recipes) {
    tagMenu.innerHTML = ""; // Limpar menu de tags
    const allTags = [...new Set(recipes.flatMap((recipe) => recipe.tags))].sort(); // Tags únicas e ordenadas

    allTags.forEach((tag) => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="#" data-tag="${tag}" class="tag-link">${tag}</a>`;
      li.addEventListener("click", () => {
        // Adicionar classe 'active' ao item selecionado
        document.querySelectorAll(".tag-link").forEach((link) => link.classList.remove("active"));
        li.querySelector("a").classList.add("active");
        const filteredRecipes = recipes.filter((recipe) => recipe.tags.includes(tag));
        renderRecipes(filteredRecipes); // Filtrar receitas por tag
      });
      tagMenu.appendChild(li);
    });
  }

  // Verificar se o usuário já está logado
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const recipes = loadRecipesFromLocalStorage(); // Carregar receitas do localStorage
  renderRecipes(recipes); // Renderizar receitas
  renderTags(recipes); // Renderizar tags no menu lateral

  if (isLoggedIn) {
    showRecipesSection(); // Exibir a seção de receitas apenas se logado
    addRecipeForm.style.display = "block"; // Exibir formulário de adicionar receita se logado
    loginSection.style.display = "none"; // Esconder login
  } else {
    loginSection.style.display = "block"; // Exibir a seção de login caso contrário
    recipesSection.style.display = "block"; // Ainda mostrar receitas
    addRecipeForm.style.display = "none"; // Ocultar formulário de adicionar receita
  }

  // Evento de login
  document.getElementById("login-form").addEventListener("submit", (event) => {
    event.preventDefault(); // Evitar comportamento padrão

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === validUser.username && password === validUser.password) {
      localStorage.setItem("isLoggedIn", "true"); // Salvar estado de login
      showRecipesSection(); // Exibir a seção de receitas
      addRecipeForm.style.display = "block"; // Exibir formulário de adicionar receita
      loginSection.style.display = "none"; // Esconder login
      loginErrorDiv.style.display = "none"; // Esconder mensagem de erro
    } else {
      loginErrorDiv.textContent = "Usuário ou senha inválidos!"; // Exibir mensagem de erro
      loginErrorDiv.style.display = "block";
    }
  });

  // Evento de logout
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("isLoggedIn"); // Remover estado de login
    loginSection.style.display = "block"; // Mostrar seção de login
    recipesSection.style.display = "block"; // Mostrar receitas ao público
    addRecipeForm.style.display = "none"; // Ocultar formulário de adicionar receita
    renderRecipes(recipes); // Exibir receitas para o público
  });

  // Evento para adicionar uma nova receita (Somente visível para usuários logados)
  if (isLoggedIn) {
    addRecipeForm.style.display = "block"; // Mostrar formulário de adicionar receita
    addRecipeForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("recipe-name").value.trim();
      const description = document.getElementById("recipe-description").value.trim();
      const tags = document.getElementById("tag-input").value.split(",").map((tag) => tag.trim());
      const fileInput = document.getElementById("recipe-file");
      const file = fileInput.files[0];
      const fileURL = file ? URL.createObjectURL(file) : null;

      // Verificação do tipo de arquivo (apenas arquivos permitidos)
      const validFileTypes = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain'];
      if (file && !validFileTypes.includes(file.type)) {
        alert('Arquivo inválido! Por favor, envie uma imagem (JPG/PNG), PDF ou TXT.');
        return;
      }

      if (name && description && tags.length > 0) {
        const newRecipe = { name, description, tags, fileURL };
        recipes.push(newRecipe);
        saveRecipesToLocalStorage(recipes); // Salvar no localStorage
        renderRecipes([newRecipe]); // Adicionar nova receita à lista
        renderTags(recipes); // Atualizar o menu de tags
        addRecipeForm.reset(); // Limpar o formulário
        alert("Receita adicionada com sucesso!");
      } else {
        alert("Preencha todos os campos obrigatórios!");
      }
    });
  }
});
