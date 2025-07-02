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

const gallery = document.querySelector(".gallery");

getData().then((data) => {
  data.forEach((elt) => {
    const temp = document.createElement("div");
    temp.innerHTML = `
      <figure data-id="${elt.id}" data-category-id="${elt.categoryId}">
        <img src="${elt.imageUrl}" alt="${elt.title}" />
        <figcaption>${elt.title}</figcaption>
      </figure>
    `;
    const figure = temp.firstElementChild;
    gallery.appendChild(figure);
  });
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

createBtnEvent();

async function openModale() {
  const temp = document.createElement("div");
  temp.innerHTML = `
  <div id="modale-window">
    <div id="modale-wrapper">
      <button id="close">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <button id="back">
        <i id="back" class="fa-solid fa-arrow-left"></i>
      </button>  
      <section id="modale-main">
        <h2>Galerie photo</h2>
        <div id="modale-gallery"></div>
        <button id="add">Ajouter une photo</button>
      </section>
      <section id="modale-form">
        <h2>Ajout photo</h2>
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

  const modaleGallery = modaleWindow.querySelector("#modale-gallery");
  const data = await getData();
  data.forEach((elt) => {
    const temp = document.createElement("div");
    temp.innerHTML = `
      <figure data-id="${elt.id}" data-category-id="${elt.categoryId}">
        <i class="fa-solid fa-trash-can"></i>
        <img src="${elt.imageUrl}" alt="${elt.title}" />
      </figure>
    `;
    const figure = temp.firstElementChild;
    modaleGallery.appendChild(figure);

    figure
      .querySelector(".fa-trash-can")
      .addEventListener("click", () => deleteArticle(elt.id));
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
      const modalFigure = document
        .querySelector(`#modale-gallery figure[data-id="${id}"]`)
        .remove();

      const mainFigure = document
        .querySelector(`.gallery figure[data-id="${id}"]`)
        .remove();
    }
  } catch (error) {
    console.error(error);
  }
}

async function addArticle(id) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 204) {
      const modalFigure = document
        .querySelector(`#modale-gallery figure[data-id="${id}"]`)
        .remove();

      const mainFigure = document
        .querySelector(`.gallery figure[data-id="${id}"]`)
        .remove();
    }
  } catch (error) {
    console.error(error);
  }
}

function showAddForm() {
  const main = document.querySelector("#modale-main");
  const form = document.querySelector("#modale-form");
  const back = document.querySelector("#back");
  main.style.right = "100%";
  form.style.right = "0%";
}
