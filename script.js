const search = document.getElementById('search'),
      submit = document.getElementById('submit'),
      random = document.getElementById('random'),
      mealsEl = document.getElementById('meals'),
      resultsHeading = document.getElementById('results-heading'),
      single_mealEl = document.getElementById('single-meal');

// Search meal and fetch from API
function searchMeal(e) { //it is submit, needs to pass evenet param and prevent default
  
  e.preventDefault();

  // Clear single meal
  single_mealEl.innerHTML = '';

  // Get search term
  const term = search.value;

  // Check for empty
  if(term.trim()) {
    try {
      fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
        .then(res => res.json())
        .then(data => {
          resultsHeading.innerHTML = `<h2>Search Result for '${term}': </h2>`

          if(data.meals === null) {

            resultsHeading.innerHTML = `<p>There are no search results for '${term}'. Please try again. </p>`

          }else{

            mealsEl.innerHTML = data.meals.map(meal => `
              <div class="meal">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal.trim()}" />
                <div class="meal-info" data-mealID="${meal.idMeal}">
                  <h3>${meal.strMeal}</h3>

                </div>
              </div>
              `
            ).join('')

          }
        });

        // Clear search text
        search.value = '';
    } catch (error) {
      console.log('GetMealByName err: ' + error);
    }
  }else {
    
    resultsHeading.innerHTML = `<p>There are no search results for '${term}'. Please try again. </p>`
  }

}

// Fetch meal by id
function getMealById(id) {
  try {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
      .then(res => res.json())
      .then(data => {
        const meal = data.meals[0];

        addMealToDOM(meal);
    
      })
  } catch (error) {
    console.log('GetMealById err: ' + error);
  }
}

// Fetch random meal
function getRandomMeal() {
  // Clear meals and headings
  mealsEl.innerHTML = '';
  resultsHeading.innerHTML = '';

  // Fetch random
  try {
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
      .then(res => res.json())
      .then(data => {
        const meal = data.meals[0];

        addMealToDOM(meal);
    
      })
  } catch (error) {
    console.log('GetRandomMeal err: ' + error);
  }
}


// Aadding meal to DOM
function addMealToDOM(meal){
  const ingredients = [];
    console.log(meal);
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) { //using [] because we are using variable
      ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
    }else {
      break;
    }   
  }

  single_mealEl.innerHTML = `
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal.trim()}" />
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''} 
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ''} 
      </div>
      <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
}

// Event listeners
submit.addEventListener('click',  searchMeal);

mealsEl.addEventListener('click', (e) => {
  const path = e.path || (e.composedPath && e.composedPath());
  const mealInfo = path.find(item => {
    if (item.classList) {
      return item.classList.contains('meal-info');
    } else {
      return false;
    }  
  });
    if(mealInfo){
      const mealId = mealInfo.getAttribute('data-mealID');
      getMealById(mealId);
    }else{

    }
});

random.addEventListener('click', getRandomMeal);
