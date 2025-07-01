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
      <figure data-category-id="${elt.categoryId}">
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

function openModale() {
  const temp = document.createElement("div");
  temp.innerHTML = `
   <section id="modale">
      <button id="close">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <h2>Galerie photo</h2>
      <div id="modale-gallery"></div>
      <button id="add">Ajouter une photo</button>
    </section>
  `;
  const bgTemp = document.createElement("div");
  bgTemp.innerHTML = `  
    <div id="modale-bg"></div>
    `;
  const modaleWindow = temp.firstElementChild;
  const modaleBg = bgTemp.firstElementChild;
  document.querySelector("body").appendChild(modaleWindow);
  document.querySelector("body").appendChild(modaleBg);
  const closeBtn = document.querySelector("#close");
  closeBtn.addEventListener("click", closeModale);
  document.querySelector("body").style.overflow = "hidden";
  const modaleGallery = document.querySelector("#modale-gallery");

  getData().then((data) => {
    data.forEach((elt) => {
      const temp = document.createElement("div");
      temp.innerHTML = `
      <figure data-category-id="${elt.categoryId}">
        <i class="fa-solid fa-trash-can"></i>
         <img src="${elt.imageUrl}" alt="${elt.title}" />
      </figure>
    `;
      const figure = temp.firstElementChild;
      modaleGallery.appendChild(figure);
    });
  });
}

function closeModale() {
  const modaleWindow = document.querySelector("#modale");
  const modaleBg = document.querySelector("#modale-bg");
  modaleWindow.remove();
  modaleBg.remove();
  document.querySelector("body").style.overflow = "scroll";
}
