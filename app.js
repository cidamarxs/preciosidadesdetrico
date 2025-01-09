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

    // Inicializar Firebase
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    const database = firebase.database();

    // Referências aos elementos
    const recipeForm = document.getElementById("recipe-form");
    const recipesList = document.getElementById("recipes");
    const menu = document.getElementById("menu");

    // Funções para carregar e salvar receitas localmente
    const loadRecipes = () => JSON.parse(localStorage.getItem("recipes")) || [];
    const saveRecipes = (recipes) => localStorage.setItem("recipes", JSON.stringify(recipes));

    // Renderizar menu lateral
    const renderMenu = (recipes) => {
        menu.innerHTML = `<li><a href="#inicio">Início</a></li>`;
        const tags = [...new Set(recipes.flatMap(recipe => recipe.tags))].sort();
        tags.forEach(tag => {
            const li = document.createElement("li");
            li.innerHTML = `<a href="#${tag}">${tag}</a>`;
            menu.appendChild(li);

            li.querySelector("a").addEventListener("click", () => {
                document.querySelectorAll(".recipe").forEach(recipe => {
                    recipe.style.display = recipe.dataset.tags.includes(tag) ? "block" : "none";
                });
            });
        });
    };

    // Renderizar receitas
    const renderRecipes = (recipes) => {
        recipesList.innerHTML = "";
        recipes.forEach((recipe, index) => {
            const recipeContainer = document.createElement("div");
            recipeContainer.className = "recipe";
            recipeContainer.dataset.tags = recipe.tags.join(",");
            recipeContainer.innerHTML = `
                <h3>${recipe.title}</h3>
                <p>${recipe.content}</p>
                ${recipe.file ? `<a href="${recipe.file.url}" target="_blank" download>${recipe.file.name}</a>` : ""}
                <button class="remove-recipe" data-index="${index}">Remover</button>
            `;

            recipesList.appendChild(recipeContainer);

            recipeContainer.querySelector(".remove-recipe").addEventListener("click", () => {
                recipes.splice(index, 1);
                saveRecipes(recipes);
                renderRecipes(recipes);
                renderMenu(recipes);
            });
        });
    };

    // Submissão do formulário
    recipeForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const recipes = loadRecipes();
        const title = document.getElementById("recipe-title").value;
        const content = document.getElementById("recipe-content").value;
        const tags = document.getElementById("recipe-tags").value.split(",").map(tag => tag.trim());
        const fileInput = document.getElementById("recipe-file");
        const file = fileInput.files[0]
            ? { name: fileInput.files[0].name, url: URL.createObjectURL(fileInput.files[0]) }
            : null;

        recipes.push({ title, content, tags, file });
        saveRecipes(recipes);

        renderRecipes(recipes);
        renderMenu(recipes);
        recipeForm.reset();
        alert("Receita adicionada com sucesso!");
    });

    // Inicializar a interface
    const recipes = loadRecipes();
    renderRecipes(recipes);
    renderMenu(recipes);
});
