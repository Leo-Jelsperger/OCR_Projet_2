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
  let html = "";
  console.log(data);
  data.forEach((elt) => {
    html += `
    <figure class="category-${elt.categoryId}">
      <img
        src="${elt.imageUrl}"
        alt="${elt.title}"
      />
      <figcaption>${elt.title}</figcaption>
    </figure>`;
  });
  gallery.innerHTML = html;
});

const filters = [
  { name: "allFilter", id: "#all", categoryId: 0 },
  { name: "itemFilter", id: "#items", categoryId: 1 },
  { name: "flatFilter", id: "#flats", categoryId: 2 },
  {
    name: "hotelsFilter",
    id: "#hotels-and-restaurants",
    categoryId: 3,
  },
];

function filterClick(targetedClass, activeBtn) {
  const figures = gallery.querySelectorAll("figure");
  const btn = document.querySelectorAll(".filter-buttons");
  console.log(activeBtn);
  btn.forEach((elt) => elt.classList.remove("used-btn"));
  activeBtn.classList.add("used-btn");
  if (targetedClass === "category-0") {
    figures.forEach((elt) => {
      elt.classList.remove("display-none");
    });
  } else {
    figures.forEach((elt) => elt.classList.add("display-none"));
    gallery
      .querySelectorAll(`.${targetedClass}`)
      .forEach((elt) => elt.classList.remove("display-none"));
  }
}

filters.forEach((filter) => {
  const element = document.querySelector(filter.id);
  if (element) {
    element.addEventListener("click", () =>
      filterClick(`category-${filter.categoryId}`, element)
    );
  }
});
