async function fetchWorks() {
  try {
    const response = await fetch('http://localhost:5678/api/works');
    const works = await response.json();
    return works; // this returns the array of objects
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

// Functions to render images and buttons in home page

document.addEventListener('DOMContentLoaded', async () => {
  const worksData = await fetchWorks();
  const categoriesData = await fetchCategories();

  // Get elements from the DOM

  const gallery = document.getElementsByClassName('gallery')[0];

  let works = '';
  worksData.forEach((work) => {
    const category = categoriesData
      .find((element) => element.id === work.category.id)
      .name.replace(/\s+/g, '-')
      .toLowerCase();
    works += `
    <figure class="work-item ${category} ${work.id}">
      <img src=${work.imageUrl} alt=${work.title} />
      <figcaption>${work.title}</figcaption>
    </figure> `;
  });

  gallery.innerHTML = works;
  const allWorks = document.querySelectorAll('.work-item');

  async function createFilterbuttons() {
    const filterContainer = document.getElementsByClassName('filter-buttons-container')[0];

    //All Button
    const allButton = document.createElement('button');
    allButton.textContent = 'All';
    allButton.classList.add('button-filter');

    allButton.addEventListener('click', () => (gallery.innerHTML = works));
    filterContainer.appendChild(allButton);

    categoriesData.forEach((category) => {
      const button = document.createElement('button');
      button.textContent = category.name;
      const categoryClassName = category.name.replace(/\s+/g, '-').toLowerCase();
      button.classList.add('button-filter');
      button.addEventListener('click', (event) => filterWorks(categoryClassName, event));
      filterContainer.appendChild(button);
    });
  }

  function filterWorks(categoryName, event) {
    event.preventDefault();

    const filteredWorks = Array.from(allWorks).filter((work) => work.className.split(' ')[1] === categoryName);

    gallery.innerHTML = '';

    filteredWorks.forEach((element) => {
      gallery.appendChild(element);
    });
  }

  displayContentOnLogin();

  createFilterbuttons();

  // edit mode
  const openButton = document.querySelector('[data-open-modal]');
  const closeButton = document.querySelector('[data-close-modal]');
  const modal = document.querySelector('[data-modal]');
  const editGallary = document.querySelector('.edit-gallary');

  openButton.addEventListener('click', () => {
    modal.showModal();
  });

  closeButton.addEventListener('click', () => {
    modal.close();
  });

  getEditImgs(worksData, editGallary);
});

function displayContentOnLogin() {
  const logInContainer = document.getElementById('edit-mode');
  const loginLink = document.querySelector('.log-in');
  const editContainer = document.getElementById('edit-container');
  const buttonsConatiner = document.getElementById('buttons');
  const svg = document.getElementById('edit-svg-text');
  const editSvgText = document.getElementById('edit-svg-text');

  if (sessionStorage.getItem('authToken')) {
    logInContainer.classList.remove('edit-mode-inactive');
    svg.style.display = 'flex';
    logInContainer.classList.toggle('edit-mode-active');
    editContainer.classList.toggle('edit-container');
    buttonsConatiner.style.display = 'none';
    loginLink.innerText = 'logout';
  }
}

// edit mode functionally

const loginLink = document.querySelector('.log-in');

loginLink.addEventListener('click', () => {
  const logInContainer = document.getElementById('edit-mode');
  const loginLink = document.querySelector('.log-in');
  const editContainer = document.getElementById('edit-container');
  const buttonsConatiner = document.getElementById('buttons');
  const svg = document.getElementById('edit-svg-text');
  const editSvgText = document.getElementById('edit-svg-text');

  if (loginLink.innerText === 'login') {
    window.location.href = 'login.html';
  } else if (loginLink.innerText === 'logout' && sessionStorage.getItem('authToken')) {
    sessionStorage.removeItem('authToken');
    loginLink.innerText = 'login';
    logInContainer.classList.add('edit-mode-inactive');
    svg.style.display = 'none';
    editSvgText.classList.add('edit-mode-inactive');
    logInContainer.classList.toggle('edit-mode-active');
    editContainer.classList.toggle('edit-container');
    buttonsConatiner.style.display = 'flex';
  }
});


function getEditImgs(worksData, editGallary) {
  worksData.forEach((work) => {
    const div = document.createElement('div');
    div.classList.add('edit-card', work.id);
    div.style.backgroundImage = `url(${work.imageUrl})`;

    const span = document.createElement('span');
    span.classList.add('span-svg'); 

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 448 512');
    svg.classList.add('deletesvg'); 

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute(
      'd',
      'M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z'
    );
    
    svg.appendChild(path);

    span.appendChild(svg);

    // Assuming you want to append the SVG to the body or some other element
    div.appendChild(span);

    editGallary.appendChild(div);
  });
}
