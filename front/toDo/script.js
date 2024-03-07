function createTask() {
  const taskDescription = document.getElementById("taskDescription").value;
  // Crie um objeto com os dados da tarefa a ser enviada
  const storedUserData = JSON.parse(localStorage.getItem("userData"));

  const taskData = {
    title: null,
    description: taskDescription,
    isCompleted: false,
    emailUser: storedUserData.email, // Utilizando o email do usuário logado
  };

  // Configuração do objeto de opções para a requisição fetch
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData), // Converte o objeto para JSON
  };

  // Enviar a requisição fetch para o endpoint
  fetch("http://localhost:3000/tasks/", options)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao criar a tarefa");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Tarefa criada com sucesso:", data);
      // Aqui você pode adicionar lógica para atualizar a interface do usuário se necessário
    })
    .catch((error) => {
      console.error("Erro ao criar a tarefa:", error);
    });

  let div = document.createElement("div");
  div.classList.add("tasks");

  let checkIcon = document.createElement("i");
  checkIcon.classList.add("fa-solid", "fa-circle-check");

  let editDeleteDiv = document.createElement("div");
  editDeleteDiv.classList.add("edit-delete");

  let taskPara = document.createElement("p");
  taskPara.textContent = taskDescription;

  let iconsDiv = document.createElement("div");
  iconsDiv.classList.add("icons");

  let editIcon = document.createElement("i");
  editIcon.classList.add("fa-solid", "fa-pen-to-square", "edit");
  editIcon.style.color = "blue";
  editIcon.style.cursor = "pointer";
  editIcon.addEventListener("click", function () {
    console.log("Editar tarefa");
  });

  let deleteIcon = document.createElement("i");
  deleteIcon.classList.add("fa-solid", "fa-trash", "delete");
  deleteIcon.style.color = "red";
  deleteIcon.style.cursor = "pointer";
  deleteIcon.addEventListener("click", function () {
    console.log("Excluir tarefa");
    div.remove();
  });

  iconsDiv.appendChild(editIcon);
  iconsDiv.appendChild(deleteIcon);

  editDeleteDiv.appendChild(checkIcon);
  editDeleteDiv.appendChild(taskPara);
  editDeleteDiv.appendChild(iconsDiv);

  div.appendChild(editDeleteDiv);

  document.getElementById("taskContainer").appendChild(div);
}

document.addEventListener("DOMContentLoaded", function () {
  // Função para abrir a barra lateral
  function openSidebar() {
    document.getElementById("sidebar").style.display = "block";
  }

  // Função para fechar a barra lateral
  function closeSidebar() {
    document.getElementById("sidebar").style.display = "none";
  }

  // Função para atualizar o nome do usuário
  function updateUsername() {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserData) {
      document.getElementById("username").textContent = storedUserData.username;
    }
  }

  // Adiciona o evento de clique no ícone de editar
  const editIcon = document.getElementById("editIcon");
  if (editIcon) {
    editIcon.addEventListener("click", function () {
      openSidebar();
    });
  } else {
    console.error("Elemento editIcon não encontrado.");
  }

  // Adiciona o evento de clique no ícone de fechar (X)
  const closeIcon = document.querySelector(".closebtn");
  if (closeIcon) {
    closeIcon.addEventListener("click", function () {
      closeSidebar();
    });
  } else {
    console.error("Elemento closeIcon não encontrado.");
  }

  // Adiciona o evento de clique no ícone de gear (configurações)
  const gearIcon = document.getElementById("editIcon");
  if (gearIcon) {
    gearIcon.addEventListener("click", function () {
      openSidebar();
    });
  } else {
    console.error("Elemento gearIcon não encontrado.");
  }

  // Adiciona o evento de clique no texto "Configurações"
  const settingsText = document.querySelector(".btnConfig");
  if (settingsText) {
    settingsText.addEventListener("click", function () {
      openSidebar();
    });
  } else {
    console.error("Elemento settingsText não encontrado.");
  }

  // Adiciona o evento de submit no formulário de edição
  document
    .getElementById("editForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();
      var newUsername = document.getElementById("editUsername").value;
      var newActivity = document.getElementById("editActivity").value;

      // Verifica se os elementos do formulário existem e se os valores não estão vazios
      if (newUsername && newActivity) {
        try {
          const storedUserData = JSON.parse(localStorage.getItem("userData"));
          const email = storedUserData.email;

          // Enviar solicitação GET para obter os dados atualizados do usuário
          const getResponse = await fetch(
            `http://localhost:3000/users/${email}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (getResponse.ok) {
            const userData = await getResponse.json();
            console.log("Dados do usuário (atualizados):", userData);

            // Enviar solicitação PUT para atualizar o perfil do usuário
            const putResponse = await fetch(
              `http://localhost:3000/users/${email}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  ...userData, // Utilizar dados originais do usuário
                  username: newUsername,
                  favoriteActivity: newActivity,
                }),
              }
            );

            if (putResponse.ok) {
              // Atualizar os valores na página
              document.getElementById("username").textContent = newUsername;
              document.getElementById("favoriteActivity").textContent =
                newActivity;
              closeSidebar();
            } else {
              console.error(
                "Erro ao atualizar usuário:",
                putResponse.statusText
              );
            }
          } else {
            console.error(
              "Erro ao obter dados do usuário:",
              getResponse.statusText
            );
          }
        } catch (error) {
          console.error("Erro ao enviar dados para a API:", error.message);
        }
      } else {
        console.error("Por favor, preencha todos os campos.");
      }
    });

  // Adiciona o evento de clique no ícone de excluir
  document
    .getElementById("deleteIcon")
    .addEventListener("click", async function () {
      var confirmDelete = confirm("Tem certeza que deseja excluir sua conta?");
      if (confirmDelete) {
        try {
          const storedUserData = JSON.parse(localStorage.getItem("userData"));
          const email = storedUserData.email;

          const deleteResponse = await fetch(
            `http://localhost:3000/users/${email}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (deleteResponse.ok) {
            localStorage.removeItem("userData");
            window.location.href = "../login/index.html";
          } else {
            console.error("Erro ao excluir conta:", deleteResponse.statusText);
          }
        } catch (error) {
          console.error("Erro ao enviar solicitação DELETE:", error.message);
        }
      }
    });

  // Atualiza o nome do usuário quando o documento é carregado
  updateUsername();

  // Adiciona o evento de clique no botão de logout
  document
    .getElementById("logoutButton")
    .addEventListener("click", function () {
      localStorage.removeItem("userData");
      window.location.href = "../login/index.html";
    });
});
