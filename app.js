// Configuração do Firebase
var firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "seu-dominio.firebaseapp.com",
  databaseURL: "https://seu-dominio.firebaseio.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-bucket.appspot.com",
  messagingSenderId: "seu-messaging-id",
  appId: "seu-app-id"
};

// Inicializando o Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

// Função para salvar uma nova receita
document.getElementById("recipe-form").addEventListener("submit", function (e) {
  e.preventDefault();

  var title = document.getElementById("title").value;
  var description = document.getElementById("description").value;
  var tags = document.getElementById("tag").value.split(",").map(tag => tag.trim());
  var file = document.getElementById("file").files[0];

  var newRecipeRef = database.ref("recipes").push();

  var recipeData = {
      title: title,
      description: description,
      tags: tags,
      timestamp: Date.now()
  };

  if (file) {
      var fileReader = new FileReader();
      fileReader.onload = function (e) {
          var fileData = e.target.result;

          // Armazenar o arquivo no Firebase Storage (caso necessário)
          newRecipeRef.set({
              ...recipeData,
              fileData: fileData
          });

          // Redirecionar para abrir a receita em uma nova aba
          openInNewTab(fileData);
      };

      fileReader.readAsDataURL(file);
  } else {
      newRecipeRef.set(recipeData);
      alert("Receita salva!");
  }
});

// Função para exibir as receitas
function displayRecipes() {
  var recipesRef = database.ref("recipes");
  recipesRef.on("child_added", function (snapshot) {
      var recipe = snapshot.val();
      var recipesDiv = document.getElementById("recipes");

      var recipeDiv = document.createElement("div");
      recipeDiv.classList.add("recipe");

      var title = document.createElement("h3");
      title.textContent = recipe.title;
      recipeDiv.appendChild(title);

      var description = document.createElement("p");
      description.textContent = recipe.description;
      recipeDiv.appendChild(description);

      var tags = document.createElement("p");
      tags.textContent = "Tags: " + recipe.tags.join(", ");
      recipeDiv.appendChild(tags);

      recipesDiv.appendChild(recipeDiv);
  });
}

// Função para abrir a receita em uma nova aba
function openInNewTab(fileData) {
  var newWindow = window.open();
  newWindow.document.write(`
      <html>
          <head>
              <title>Receita de Tricô</title>
          </head>
          <body>
              <h1>Receita</h1>
              <pre>${fileData}</pre>
          </body>
      </html>
  `);
}

// Carregar as receitas ao iniciar
window.onload = function () {
  displayRecipes();
};
