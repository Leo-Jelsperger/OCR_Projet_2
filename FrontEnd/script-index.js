const gallery = document.querySelector(".gallery");

async function isLogged() {
  const token = localStorage.getItem("token");
  if (!token) {
    return false;
  } else {
    return true;
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  const logged = await isLogged();
  if (logged) {
    const hiddenContent =
      "<button id='modifier'><i class='fa-regular fa-pen-to-square'></i><p>modifier</p></button>";
    document.querySelector("#hidden-content").innerHTML = hiddenContent;
    const projectModifier = document.querySelector("#modifier");
    projectModifier.addEventListener("click", openModale);
  }
});

async function getData() {
  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur :", error);
  }
}

getData().then((data) => {
  data.forEach((elt) => {
    addGalleryContent(elt);
  });
});

async function getBtn() {
  try {
    const response = await fetch("http://localhost:5678/api/categories", {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Erreur :", error);
  }
}

getBtn().then((data) => {
  const btnList = document.querySelector(".filters");
  data.forEach((elt) => {
    const temp = document.createElement("div");
    temp.innerHTML = `
    <button
      data-id="${elt.id}"
      id="${elt.name}"
      class="filter-buttons">
      ${elt.name}
    </button>
    `;
    const newBtn = temp.firstElementChild;
    btnList.appendChild(newBtn);
  });
  createBtnEvent();
});

function filterClick(event) {
  const figures = gallery.querySelectorAll("figure");
  const btn = document.querySelectorAll(".filter-buttons");
  btn.forEach((elt) => elt.classList.remove("used-btn"));
  event.target.classList.add("used-btn");
  if (event.target.dataset.id === "0") {
    figures.forEach((elt) => {
      elt.classList.remove("display-none");
    });
  } else {
    figures.forEach((elt) => {
      elt.classList.add("display-none");
    });
    gallery
      .querySelectorAll(`figure[data-category-id="${event.target.dataset.id}"]`)
      .forEach((elt) => elt.classList.remove("display-none"));
  }
}

function createBtnEvent() {
  const btns = document.querySelectorAll(".filters button");
  btns.forEach((elt) => elt.addEventListener("click", (e) => filterClick(e)));
}

async function openModale() {
  const temp = document.createElement("div");
  temp.innerHTML = `
  <div id="modale-window">
    <div id="modale-wrapper">
      <button id="back">
        <i class="fa-solid fa-arrow-left"></i>
      </button>  
      <button id="close">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <section id="modale-main" class="modale-elt">
        <h2>Galerie photo</h2>
        <div id="modale-gallery"></div>
        <button id="add">Ajouter une photo</button>
      </section>
      <section id="modale-form" class="modale-elt">
        <h2>Ajout photo</h2>
        <form
            action=""
            method="post">
            <div class="form-main">
              <label
                for="image"
                class="image-upload">
                <i class="fa-regular fa-image"></i>
                <p class="capsule">+ Ajouter photo</p>
                <p>jpg, png : 4mo max</p>
              </label>
              <input
                type="file"
                name="image"
                id="image"
                accept="image/*"
                required />
              <label for="title">Titre</label>
              <input
                type="text"
                name="title"
                id="title"
                required />
              <label for="category">Catégorie</label>
              <select
                name="category"
                id="category"
                required>
                <option value="" disabled selected></option>
              </select>
            </div>
            <div class="border-top">
              <input
                id="submit"
                class="submit"
                type="submit"
                value="Valider" />
              <p id="form-error"></p>
            </div>
          </form>        
      </section>
    </div>
  </div>
  `;

  const bgTemp = document.createElement("div");
  bgTemp.innerHTML = `  
    <div id="modale-bg"></div>
    `;

  const modaleWindow = temp.firstElementChild;
  const modaleBg = bgTemp.firstElementChild;

  document.body.appendChild(modaleWindow);
  document.body.appendChild(modaleBg);
  document.body.style.overflow = "hidden";

  modaleWindow.querySelector("#close").addEventListener("click", closeModale);
  modaleWindow.querySelector("#add").addEventListener("click", showAddForm);
  modaleBg.addEventListener("click", closeModale);

  const data = await getData();
  data.forEach((elt) => {
    addModaleGalleryContent(elt);
  });

  const submit = modaleWindow.querySelector("#submit");
  const image = modaleWindow.querySelector("#image");
  const title = modaleWindow.querySelector("#title");
  const category = modaleWindow.querySelector("#category");

  const btns = await getBtn();
  btns.forEach((elt) => {
    const temp = document.createElement("div");
    temp.innerHTML = `<option value="${elt.id}">${elt.name}</option>`;
    const newSelect = temp.firstElementChild;
    category.appendChild(newSelect);
  });

  function handleClick() {
    let emptyValue;
    !image.files.length
      ? (emptyValue = "Image")
      : !title.value
      ? (emptyValue = "Titre")
      : !category.value
      ? (emptyValue = "Catégorie")
      : "";
    const formError = modaleWindow.querySelector("#form-error");
    formError.textContent = `Elément manquant : ${emptyValue}`;
    formError.classList.add("visible");
  }

  submit.addEventListener("click", (e) => {
    handleClick(e);
  });

  function updateSubmitState() {
    const form = modaleWindow.querySelector("form");
    if (image.files.length && title.value && category.value) {
      submit.style.backgroundColor = "#1d6154";
      submit.style.cursor = "pointer";
      form.addEventListener("submit", async (e) => {
        await addArticle(e);
        updateSubmitState();
      });
    } else {
      submit.style.backgroundColor = "";
      submit.style.cursor = "not-allowed";
    }
  }

  [image, title, category].forEach((input) => {
    input.addEventListener("input", updateSubmitState);
  });

  image.addEventListener("input", () => {
    const file = image.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        modaleWindow.querySelector(
          ".image-upload"
        ).innerHTML = `<img src="${e.target.result}" alt="" class="">`;
        modaleWindow.querySelector(".image-upload").style.paddingBlock = `0`;
        modaleWindow.querySelector(".image-upload").style.height = `156px`;
      };
      reader.readAsDataURL(file);
    }
  });
}

function showAddForm() {
  const main = document.querySelector("#modale-main");
  const form = document.querySelector("#modale-form");
  const back = document.querySelector("#back");
  main.style.right = "100%";
  form.style.right = "0%";
  back.style.left = "30px";
  back.addEventListener("click", () => {
    main.style.right = "0%";
    form.style.right = "-100%";
    back.style.left = "calc(100% + 30px)";
  });
}

function closeModale() {
  const modaleWindow = document.querySelector("#modale-window");
  const modaleBg = document.querySelector("#modale-bg");
  modaleWindow.remove();
  modaleBg.remove();
  document.querySelector("body").style.overflow = "scroll";
}

async function deleteArticle(id) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 204) {
      document
        .querySelector(`#modale-gallery figure[data-id="${id}"]`)
        .remove();
      document.querySelector(`.gallery figure[data-id="${id}"]`).remove();
    }
  } catch (error) {
    console.error(error);
  }
}

async function addArticle(e) {
  e.preventDefault();
  const token = localStorage.getItem("token");

  const modaleWindow = document.querySelector("#modale-window");
  const image = modaleWindow.querySelector("#image");
  const title = modaleWindow.querySelector("#title");
  const category = modaleWindow.querySelector("#category");
  const form = modaleWindow.querySelector("form");
  const modaleGallery = modaleWindow.querySelector("#modale-gallery");

  const formData = new FormData();
  formData.append("image", image.files[0]);
  formData.append("title", title.value);
  formData.append("category", category.value);

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (response.ok) {
      form.reset();
      modaleWindow.querySelector(".image-upload").style.backgroundImage = "";
      gallery.innerHTML = "";
      modaleGallery.innerHTML = "";
      const data = await getData();
      data.forEach((elt) => {
        addGalleryContent(elt);
        addModaleGalleryContent(elt);
      });
      openAlert("Projet ajouté");
      const formError = modaleWindow.querySelector("#form-error");
      formError.textContent = ``;
      formError.classList.remove("visible");
      modaleWindow.querySelector(".image-upload").innerHTML = `
        <i class="fa-regular fa-image"></i>
        <p class="capsule">+ Ajouter photo</p>
        <p>jpg, png : 4mo max</p>
      `;
      modaleWindow.querySelector(".image-upload").style.paddingBlock = `20px`;
      modaleWindow.querySelector(".image-upload").style.height = `116px`;
    } else {
      const errorData = await response.json();
      alert(`Erreur : ${errorData.message || response.status}`);
    }
  } catch (error) {
    console.log(error);
  }
}

function addGalleryContent(elt) {
  const temp = document.createElement("div");
  temp.innerHTML = `
              <figure data-id="${elt.id}" data-category-id="${elt.categoryId}">
                <img src="${elt.imageUrl}" alt="${elt.title}" />
                <figcaption>${elt.title}</figcaption>
              </figure>
            `;
  const figure = temp.firstElementChild;
  gallery.appendChild(figure);
}

function addModaleGalleryContent(elt) {
  const modaleGallery = document.querySelector("#modale-gallery");
  const modaleTemp = document.createElement("div");
  modaleTemp.innerHTML = `
      <figure data-id="${elt.id}" data-category-id="${elt.categoryId}">
        <i class="fa-solid fa-trash-can"></i>
        <img src="${elt.imageUrl}" alt="${elt.title}" />
      </figure>
    `;
  const modaleFigure = modaleTemp.firstElementChild;
  modaleGallery.appendChild(modaleFigure);

  modaleFigure
    .querySelector(".fa-trash-can")
    .addEventListener("click", () => deleteArticle(elt.id));
}

function openAlert(msg) {
  const temp = document.createElement("div");
  temp.innerHTML = `
     <div class="alert-message">
      <span>${msg}</span>
    </div>
    `;
  const figure = temp.firstElementChild;
  document.body.appendChild(figure);

  setTimeout(() => {
    figure.classList.add("active");
  }, 10);

  setTimeout(() => {
    figure.remove();
  }, 3000);
}
