async function fetchWorks() {
  try {
    const response = await fetch('http://localhost:5678/api/works');
    const userData = await response.json();
    return userData; // this returns the array of objects
  } catch (error) {
    console.log(error);
  }
}

async function fetchCategories() {
  try {
    const response = await fetch('http://localhost:5678/api/categories');
    const categories = await response.json();
    return categories;
  } catch (error) {
    console.log(error);
  }
}

// Functions to render images on home page

function createImg(element, categories) {
  const card = document.createElement('figure');

  for (let i = 0; i < categories.length; i++) {
    if (categories[i].id === element.categoryId) {
      const name = categories[i].name.replace(/\s+/g, '-');
      card.classList.add(`${element.userId}`, `${name}`);
    }
  }

  const img = document.createElement('img');
  img.src = element.imageUrl;
  img.alt = element.title;

  const workTitle = document.createElement('figcaption');
  workTitle.textContent = element.title;

  card.appendChild(img);
  card.appendChild(workTitle);

  return card;
}

async function renderImages(users) {
  const data = await fetchWorks();
  const categories = await fetchCategories();
  const gallery = document.getElementsByClassName('gallery');

  data.forEach((element) => {
    const card = createImg(element, categories);
    gallery[0].appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const userEmails = await renderImages();
});

// button filters

const allBtn = document.querySelector('.all');
const objectsBtn = document.querySelector('.objects');
const aparmentsBtn = document.querySelector('.aparments');
const hotelsAndRestaurantsBtn = document.querySelector('.hotels-and-restaurants');

const objects = document.getElementsByClassName('Objects');
const aparments = document.getElementsByClassName('Apartments');
const hotels = document.getElementsByClassName('Hotels-&-restaurants');

function addClassName(array) {
  for (let i = 0; i < array.length; i++) {
    array[i].classList.add('display');
  }
}

function removeClassName(array) {
  for (let i = 0; i < array.length; i++) {
    array[i].classList.remove('display');
  }
}

allBtn.addEventListener('click', ()=> {
  removeClassName(objects);
  removeClassName(aparments);
  removeClassName(hotels);
})

objectsBtn.addEventListener('click', () => {
  removeClassName(objects);
  addClassName(aparments);
  addClassName(hotels);
});

aparmentsBtn.addEventListener('click', () => {
  removeClassName(aparments);
  addClassName(hotels);
  addClassName(objects);
});

hotelsAndRestaurantsBtn.addEventListener('click', ()=> {
  removeClassName(hotels);
  addClassName(aparments);
  addClassName(objects)
})

