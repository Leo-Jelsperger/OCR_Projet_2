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
  const gallery = document.querySelector(".gallery");
  let html = "";
  console.log(data);
  data.forEach((elt) => {
    html += `
    <figure>
      <img
        src="${elt.imageUrl}"
        alt="${elt.title}"
      />
      <figcaption>${elt.title}</figcaption>
    </figure>`;
  });
  gallery.innerHTML = html;
});
