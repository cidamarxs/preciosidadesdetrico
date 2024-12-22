(function () {
  const adminPassword = "trico2010"; // Defina a senha da administradora
  const adminSection = document.getElementById("admin-section");

  // Solicitar senha ao usuário para acessar o formulário
  const userPassword = prompt("Digite a senha para acessar o formulário de administração:");

  if (userPassword === adminPassword) {
      // Exibe o formulário se a senha estiver correta
      adminSection.style.display = "block";
      alert("Bem-vinda, administradora!");
  } else if (userPassword === null || userPassword === "") {
      // Caso o usuário cancele ou deixe o prompt em branco
      alert("Acesso ao formulário não autorizado. Você pode ver as receitas já carregadas.");
      adminSection.style.display = "none";
  } else {
      // Caso a senha esteja errada
      alert("Senha incorreta. Apenas as receitas estarão disponíveis.");
      adminSection.style.display = "none";
  }
})();

document.getElementById("recipe-form").addEventListener("submit", function (event) {
  event.preventDefault();

  const title = document.getElementById("recipe-title").value;
  const tags = document.getElementById("recipe-tags").value
      ? document.getElementById("recipe-tags").value.split(",").map(tag => tag.trim())
      : [];
  const content = document.getElementById("recipe-content").value;
  const fileInput = document.getElementById("recipe-file");

  const recipeSection = document.getElementById("recipes");

  // Cria o contêiner para a receita
  const recipeContainer = document.createElement("div");
  recipeContainer.className = "recipe";
  recipeContainer.dataset.tags = tags.join(",");

  // Adiciona o título
  const recipeTitle = document.createElement("h3");
  recipeTitle.textContent = title;
  recipeContainer.appendChild(recipeTitle);

  // Adiciona o conteúdo
  const recipeContent = document.createElement("p");
  recipeContent.textContent = content;
  recipeContainer.appendChild(recipeContent);

  // Adiciona o arquivo anexado, se houver
  if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const fileLink = document.createElement("a");
      fileLink.textContent = `Anexo: ${file.name}`;
      fileLink.href = URL.createObjectURL(file);
      fileLink.target = "_blank";
      fileLink.download = file.name;

      const fileContainer = document.createElement("p");
      fileContainer.appendChild(fileLink);
      recipeContainer.appendChild(fileContainer);
  }

  // Adiciona a receita à seção de receitas
  recipeSection.appendChild(recipeContainer);

  // Atualiza o menu de tags
  const menu = document.getElementById("menu");
  tags.forEach(tag => {
      if (!Array.from(menu.children).some(item => item.textContent === tag)) {
          const menuItem = document.createElement("li");
          const menuLink = document.createElement("a");
          menuLink.href = "#";
          menuLink.textContent = tag;
          menuItem.appendChild(menuLink);
          menu.appendChild(menuItem);

          // Adiciona evento de clique na tag
          menuLink.addEventListener("click", function () {
              document.querySelectorAll(".recipe").forEach(recipe => {
                  const recipeTags = recipe.dataset.tags.split(",");
                  if (!recipeTags.includes(tag)) {
                      recipe.style.display = "none";
                  } else {
                      recipe.style.display = "block";
                  }
              });
          });
      }
  });

  // Exibe uma mensagem de sucesso e limpa o formulário
  alert("Receita adicionada com sucesso!");
  document.getElementById("recipe-form").reset();
});
