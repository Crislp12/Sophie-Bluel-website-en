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

  createFilterbuttons();
});

// Log In logic

const emailInput = document.getElementById('userEmail');
const passwordInput = document.getElementById('userPassword');
const loginButton = document.getElementById('login-button');

loginButton.addEventListener('click', makeLoginRequest);

async function makeLoginRequest (event) {
  event.preventDefault()
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
    };

    const json = await response.json();
    console.log(json);
    emailInput.value = '';
    passwordInput.value = '';
   
  } catch (error) {
    console.error(error.message);
  };
};


// Sample data to populate the table
const data = [
  ["Name", "Age", "City"],
  ["Alice", 25, "New York"],
  ["Bob", 30, "Chicago"],
  ["Charlie", 28, "San Francisco"]
];

// Create a table element
const table = document.createElement("table");

// Loop through each row in the data
data.forEach((rowData, rowIndex) => {
  // Create a new row
  const row = document.createElement("tr");

  // Loop through each cell in the row data
  rowData.forEach(cellData => {
    // Create a cell (th for header row, td for others)
    const cell = document.createElement(rowIndex === 0 ? "th" : "td");
    cell.textContent = cellData; // Set the cell's text
    row.appendChild(cell);       // Add the cell to the row
  });

  table.appendChild(row); // Add the row to the table
});

// Add the table to the document body (or any other container)
document.body.appendChild(table);
