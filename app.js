document.addEventListener("DOMContentLoaded", () => {
  // *** CONFIGURAÇÃO DO FIREBASE (CRUCIAL - REMOVA DO HTML) ***
  const firebaseConfig = {
      apiKey: "AIzaSyDvrty4zjeuNMYu8TuQuf49LihZWuiAlgE", // *** NUNCA EXPOR EM PRODUÇÃO! ***
      authDomain: "preciosidades-de-trico.firebaseapp.com",
      databaseURL: "https://preciosidades-de-trico-default-rtdb.firebaseio.com",
      projectId: "preciosidades-de-trico",
      storageBucket: "preciosidades-de-trico.firebasestorage.app",
      messagingSenderId: "53723311991",
      appId: "1:53723311991:web:b32af8acafada569287b72"
  };

  // Inicializa o Firebase apenas uma vez
  if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
  }

  const auth = firebase.auth();
  const database = firebase.database();
  const recipesRef = database.ref('recipes'); // Referência para as receitas

  // *** REFERÊNCIAS AOS ELEMENTOS DO DOM (PARA MELHOR MANUTENÇÃO) ***
  const loginSection = document.getElementById("login-section");
  const signupSection = document.getElementById("signup-section");
  const recipesSection = document.getElementById("recipes-section");
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const addRecipeForm = document.getElementById("add-recipe-form");
  const recipeList = document.getElementById("recipe-list");
  const tagMenu = document.getElementById("tag-menu");
  const loadingMessage = document.getElementById('loading-message');


  // *** FUNÇÕES AUXILIARES ***
  function showRecipesSection() {
      loginSection.style.display = "none";
      signupSection.style.display = "none";
      recipesSection.style.display = "block";
  }

  function hideAllSections() {
      loginSection.style.display = "none";
      signupSection.style.display = "none";
      recipesSection.style.display = "none";
  }

  function renderRecipes(recipes) {
      recipeList.innerHTML = ""; // Limpa a lista antes de renderizar
      recipes.forEach(recipe => {
          const li = document.createElement('li');
          li.textContent = `${recipe.name} - ${recipe.description}`;
          recipeList.appendChild(li);
      });
  }

  function renderTags(recipes) {
      const allTags = [...new Set(recipes.flatMap(recipe => recipe.tags))];
      tagMenu.innerHTML = allTags.map(tag => `
          <li><a href="#" data-tag="${tag}" class="tag-link">${tag}</a></li>
      `).join("");
  }

  function loadRecipes() {
      loadingMessage.style.display = "block";
      recipesRef.on('value', (snapshot) => {
          loadingMessage.style.display = "none";
          const recipes = snapshot.val() || {};
          const recipeArray = Object.values(recipes);
          renderRecipes(recipeArray);
          renderTags(recipeArray);
      });
  }

  // *** LÓGICA DE CADASTRO (COM TRATAMENTO DE ERROS, CONFIRMAÇÃO DE SENHA E PREVENT DEFAULT) ***
  signupForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value.trim();
      const confirmPassword = document.getElementById('signup-password-confirm').value.trim();
      const signupErrorDiv = document.getElementById('signup-error');

      signupErrorDiv.style.display = 'none';

      if (password !== confirmPassword) {
          signupErrorDiv.textContent = "As senhas não conferem.";
          signupErrorDiv.style.display = 'block';
          return;
      }

      auth.createUserWithEmailAndPassword(email, password)
          .then(() => {
              alert('Cadastro bem-sucedido! Agora, você pode fazer login.');
              signupSection.style.display = 'none';
              loginSection.style.display = 'block';
          })
          .catch((error) => {
              signupErrorDiv.textContent = 'Erro ao cadastrar: ' + error.message;
              signupErrorDiv.style.display = 'block';
              console.error("Erro no cadastro:", error); // Log do erro no console
          });
  });

  // *** LÓGICA DE LOGIN (COM PREVENT DEFAULT E TRATAMENTO DE ERROS) ***
  loginForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value.trim();
      const loginErrorDiv = document.getElementById('login-error');
      loginErrorDiv.style.display = 'none';

      auth.signInWithEmailAndPassword(email, password)
          .then(() => {
              showRecipesSection();
              loadRecipes();
          })
          .catch((error) => {
              loginErrorDiv.textContent = 'Erro ao logar: ' + error.message;
              loginErrorDiv.style.display = 'block';
              console.error("Erro no login:", error);
          });
  });

  // *** LÓGICA PARA MOSTRAR/OCULTAR SEÇÕES DE LOGIN/CADASTRO ***
  document.getElementById('show-login').addEventListener('click', () => {
      signupSection.style.display = 'none';
      loginSection.style.display = 'block';
  });

  document.getElementById('show-signup').addEventListener('click', () => {
      loginSection.style.display = 'none';
      signupSection.style.display = 'block';
  });

  // *** LÓGICA DE LOGOUT ***
  document.getElementById('logout-btn').addEventListener('click', () => {
      auth.signOut().then(() => {
          hideAllSections();
          loginSection.style.display = 'block';
      }).catch((error) => {
          console.error("Erro ao sair:", error);
      });
  });

  // *** LÓGICA PARA ADICIONAR UMA RECEITA ***
  addRecipeForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const recipeName = document.getElementById('recipe-name').value;
      const recipeDescription = document.getElementById('recipe-description').value;
      const tags = document.getElementById('tag-input').value.split(',').map(tag => tag.trim());

      const newRecipe = {
          name: recipeName,
          description: recipeDescription,
          tags: tags
      };

      recipesRef.push(newRecipe);

      alert('Receita adicionada com sucesso!');
      addRecipeForm.reset(); // Limpa o formulário
  });

  //Carrega as receitas ao iniciar a aplicação após o login
  auth.onAuthStateChanged(user => {
      if(user) {
          showRecipesSection();
          loadRecipes();
      }
  })
});