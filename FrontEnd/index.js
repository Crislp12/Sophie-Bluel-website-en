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

// Functions to render images on home page

document.addEventListener('DOMContentLoaded', async () => {
  const worksData = await fetchWorks();
  const categoriesData = await fetchCategories();
  // Get elements from the DOM
  const portfolioSection = document.getElementById('portfolio');
  const gallery = document.getElementsByClassName('gallery')[0]; // Assuming you need the first gallery
  const filterButtonsContainer = document.getElementsByClassName('filter-buttons-container')[0];

  // Helper function to create a button element
  function createButton(id, classNames, textContent) {
    const button = document.createElement('button');
    button.id = id;
    button.classList.add(...classNames);
    button.textContent = textContent;
    return button;
  }

  // Create filter buttons from categories data
  const categoryButtons = categoriesData.map((category) => {
    const classNames = ['btn', category.name.replace(/\s+/g, '-').toLowerCase(), 'button-filter'];
    return createButton('categoryButton', classNames, category.name);
  });

  // Create "All" button
  const allButton = createButton('allButton', ['btn', 'all', 'button-filter'], 'All');

  // Append "All" button to the container
  filterButtonsContainer.appendChild(allButton);

  // Append category buttons to the container
  categoryButtons.forEach((button) => {
    filterButtonsContainer.appendChild(button);
  });

  let works = '';

  worksData.forEach((work) => {
    const category = categoriesData.find((element) => element.id === work.category.id).name.replace(/\s+/g, '-');

    works += `
    <figure class="work-item ${category.toLowerCase()} ${work.id}">
      <img src=${work.imageUrl} alt=${work.title} />
      <figcaption>${work.title}</figcaption>
    </figure> `;
  });

  gallery.innerHTML = works;

  const buttons = document.querySelectorAll('.button-filter');
  const renderWorks = document.querySelectorAll('.work-item');

  // Loop through all buttons and add event listeners dynamically

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const category = button.className.split(' ')[1];

      if (category === 'all') {
        gallery.innerHTML = works;
      } else {
        let filterWorks = '';

        renderWorks.forEach((renderWork) => {
          // Check if the job category matches the button category
          if (renderWork.className.split(' ')[1].toLowerCase() === category.toLowerCase()) {
            filterWorks += renderWork.outerHTML; // Add matching job's HTML to filterWorks
          }
        });

        gallery.innerHTML = filterWorks; // Display filtered works
      }
    });
  });
});

// Log In logic

const emailInput = document.getElementById('userEmail');
const passwordInput = document.getElementById('userPassword');
const loginButton = document.getElementById('login-button');

loginButton.addEventListener('click', async () => {

  const request = new Request('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // Adding correct headers
    },
    body: JSON.stringify({
      email: emailInput.value, // Using the input values instead of hardcoded ones
      password: passwordInput.value,
    }),
  });

  try {
    const response = await fetch(request);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
    emailInput.value = '';
    passwordInput.value = '';

  } catch (error) {
    console.error(error.message);
  }
});
