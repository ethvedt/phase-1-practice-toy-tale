let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  fetch("http://localhost:3000/toys")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((toy) => {
        renderToyCard(toy);
      });
    })
  const addForm = document.querySelector(".add-toy-form");
  addForm.addEventListener("submit", e => {
    e.preventDefault();
    handleAddToy(e);
  });
});

////////////////////////////////////////////////////////////////////////////////

// {{<div class="card">
//   <h2>Woody</h2>
//   <img src="[toy_image_url]" class="toy-avatar" />
//   <p>4 Likes</p>
//   <button class="like-btn" id="[toy_id]">Like ❤️</button>
// </div>}}
// The following code creates a new toy card and append it to the toy collection div.
// The toy card will have the above HTML structure.
function renderToyCard(toy) {
  const card = document.createElement("div");
  card.classList.add("card");
  const toyName = document.createElement("h2");
  toyName.textContent = toy.name;
  const img = document.createElement("img");
  img.src=toy.image;
  img.classList.add("toy-avatar");
  const likes = document.createElement("p");
  likes.textContent = `${toy.likes} Likes`;
  const likeBtn = document.createElement("button");
  likeBtn.classList.add("like-btn");
  likeBtn.id = toy.id;
  likeBtn.textContent = "Like ❤️";
  card.appendChild(toyName);
  card.appendChild(img);
  card.appendChild(likes);
  card.appendChild(likeBtn);
  document.querySelector("#toy-collection").appendChild(card);
  likeBtn.addEventListener("click", handleLike);
};

////////////////////////////////////////////////////////////////////////////////

function handleAddToy(e) {
  const toyName = document.querySelector("input[name=name]").value;
  const toyImage = document.querySelector("input[name=image]").value;
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      name: toyName,
      image: toyImage,
      likes: 0
    }),
  })
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    renderToyCard(data);
    });
}

////////////////////////////////////////////////////////////////////////////////

function handleLike(e) {
  const toyId = e.target.id;
  const likes = e.target.parentElement.querySelector("p");
  let toyLikes = parseInt(e.target.parentElement.querySelector("p").textContent.split(" ").slice(0, 1));
  fetch(`http://localhost:3000/toys/${toyId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      likes: ++toyLikes
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      likes.textContent = `${data.likes} Likes`;
    })

}