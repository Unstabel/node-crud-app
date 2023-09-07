// ============ GLOBAL VARIABELS ============ //
const endpoint = "http://localhost:3333"; // To do: paste url to endpoint DONE
let selectedUser;

// ============ READ ============ //
// Read (GET) all users from Firebase (Database) using REST API
async function readUsers() {
  const response = await fetch(`${endpoint}/users`);
  const data = await response.json();

  return data;
}

// Create HTML and display all users from given list
function displayUsers(list) {
  // reset <section id="users-grid" class="grid-container">...</section>
  document.querySelector("#users-grid").innerHTML = "";
  //loop through all users and create an article with content for each
  for (const user of list) {
    document.querySelector("#users-grid").insertAdjacentHTML(
      "beforeend",
      /*html*/ `
            <article>
                <h2>${user.name}</h2>
                <h2><img src="${user.image}"></h2>
                <p>${user.birthdate}</p>
                <p>${user.activeSince}</p>
                <p>${user.genres}</p>
                <p>${user.labels}</p>
                <p>${user.website}</p>
                <p>${user.shortDescription}</p>
                 <div class="btns">
                    <button class="btn-update-user">Update</button>
                    <button class="btn-delete-user">Delete</button>
                </div>
            </article>
            `
    );
    document
      .querySelector("#users-grid article:last-child .btn-update-user")
      .addEventListener("click", () => selectUser(user));
    document
      .querySelector("#users-grid article:last-child .btn-delete-user")
      .addEventListener("click", () => deleteUser(user.id));
    // To do: Add event listeners
  }
}

// ============ CREATE ============ //
// Create (POST) user to Firebase (Database) using REST API
async function createUser(event) {
  event.preventDefault();

  const name = event.target.name.value;
  const image = event.target.image.value;
  const birthdate = event.target.birthdate.value;
  const activeSince = event.target.activeSince.value;
  const genres = event.target.genres.value;
  const labels = event.target.labels.value;
  const website = event.target.website.value;
  const shortDescription = event.target.shortDescription.value;

  const newUser = {
    name,
    image,
    birthdate,
    activeSince,
    genres,
    labels,
    website,
    shortDescription,
  };
  const userAsJson = JSON.stringify(newUser);
  const response = await fetch(`${endpoint}/users`, {
    method: "POST",
    body: userAsJson,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    // if success, update the users grid
    updateUsersGrid();
    // and scroll to top
    scrollToTop();
  }
}

// ============ UPDATE ============ //
function selectUser(user) {
  console.log(user);
  // Set global varaiable
  selectedUser = user;
  // reference to update form

  const form = document.querySelector("#form-update");

  form.name.value = user.name;
  form.image.value = user.image;
  form.birthdate.value = user.birthdate;
  form.activeSince.value = user.activeSince;
  form.genres.value = user.genres;
  form.labels.value = user.labels;
  form.website.value = user.website;
  form.shortDescription.value = user.shortDescription;

  const dialogOpen = document.querySelector("#dialog");
  dialogOpen.showModal();
  // To do: set form input values with user.xxxx

  //form.scrollIntoView({ behavior: "smooth" });
}

async function updateUser(event) {
  event.preventDefault();
  const name = event.target.name.value;
  const birthdate = event.target.birthdate.value;
  const activeSince = event.target.activeSince.value;
  const genres = event.target.genres.value;
  const labels = event.target.labels.value;
  const website = event.target.website.value;
  const image = event.target.image.value;
  const shortDescription = event.target.shortDescription.value;
  // To do: add variables with reference to input fields (event.target.xxxx.value)

  // update user
  const userToUpdate = {
    name,
    image,
    birthdate,
    activeSince,
    genres,
    labels,
    website,
    shortDescription,
  }; // To do: add all fields/ variabels
  const userAsJson = JSON.stringify(userToUpdate);
  const response = await fetch(`${endpoint}/users/${selectedUser.id}`, {
    method: "PUT",
    body: userAsJson,
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    updateUsersGrid();
    // and scroll to top
    scrollToTop();
  }
}

// ================== DELETE ============ //
async function deleteUser(id) {
  console.log(id);
  const response = await fetch(`${endpoint}/users/${id}`, {
    method: "DELETE",
  });
  if (response.ok) {
    updateUsersGrid();
    // and scroll to top
    scrollToTop();
  }
}

// ================== Events and Event Listeners ============ //
// To do: add submit event listener to create form (#form-create)
// To do: add submit event listener to update form (#form-update)
document.querySelector("#form-create").addEventListener("submit", createUser);
document.querySelector("#form-update").addEventListener("submit", updateUser);

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function updateUsersGrid() {
  const filterSelect = document.querySelector("#filter-select");
  const filterValue = filterSelect.value;

  let users = await readUsers();

  if (filterValue !== "all") {
    users = users.filter((user) => user.genres === filterValue);
    console.log(filterValue);
  }
  displayUsers(users);
}

// ============ Init CRUD App ============ //
// To do: call/ run updateUsersGrid to initialise the app

updateUsersGrid();
document
  .querySelector("#filter-select")
  .addEventListener("change", updateUsersGrid);
