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
  const awaitWorks = await fetchWorks();
  const awaitCategories = await fetchCategories();
  const section = document.getElementById('portfolio');
  const gallery = document.getElementsByClassName('gallery');
  const buttonsContainer = document.getElementsByClassName('filter-buttons-container');

  // Add the HTML to the div

  const buttonFilters = `
          <button class="button-filter all">All</button>
          <button class="button-filter objects">Objects</button>
          <button class="button-filter apartments">Apartments</button>
          <button class="button-filter hotels-&-restaurants">Hotels & Restaurant</button> `;

  buttonsContainer[0].innerHTML = buttonFilters;

  let works = '';

  awaitWorks.forEach((work) => {
    const category = awaitCategories.find((element) => element.id === work.category.id).name.replace(/\s+/g, '-');

    works += `
    <figure class="work-item ${category.toLowerCase()} ${work.id}">
      <img src=${work.imageUrl} alt=${work.title} />
      <figcaption>${work.title}</figcaption>
    </figure> `;
  });

  gallery[0].innerHTML = works;

  const buttons = document.querySelectorAll('.button-filter');
  const renderWorks = document.querySelectorAll('.work-item');

  // Loop through all buttons and add event listeners dynamically


  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const category = button.className.split(' ')[1]; 
      
      if (category === 'all') {
        gallery[0].innerHTML = works;
      } else {
        let filterWorks = ''; 
        
        renderWorks.forEach((renderWork) => {
          // Check if the job category matches the button category
          if (renderWork.className.split(' ')[1].toLowerCase() === category.toLowerCase()) {
            filterWorks += renderWork.outerHTML; // Add matching job's HTML to filterWorks
          }
        });
  
        gallery[0].innerHTML = filterWorks; // Display filtered works
      }
    });
  });
  
});
