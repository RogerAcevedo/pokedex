// ! DOM OBJECTS - how we grab the HTML elements

// ? GRABS "poke-name" class from index.css
// ? document.querySelector is a function that grabs a class from index.html
const mainScreen = document.querySelector('.main-screen');
const pokeName = document.querySelector('.poke-name');
const pokeId = document.querySelector('.poke-id');
const pokeFrontImage = document.querySelector('.poke-front-image');
const pokeBackImage = document.querySelector('.poke-back-image');
const pokeTypeOne = document.querySelector('.poke-type-one');
const pokeTypeTwo = document.querySelector('.poke-type-two');
const pokeWeight = document.querySelector('.poke-weight');
const pokeHeight = document.querySelector('.poke-height');

// ! GRAB THE SAME INFO FOR DISPLAY ON THE RIGHT SIDE OF THE DEX. 
// we use querySelectorAll because it grabs all of them
const pokeListItems = document.querySelectorAll('.list-item');
const leftButton = document.querySelector('.left-button');
const rightButton = document.querySelector('.right-button');



// ! CONSTANTS AND VARIABLES
const TYPES = [
  'normal', 'fighting', 'flying',
  'poison', 'ground', 'rock',
  'bug', 'ghost', 'steel',
  'fire', 'water', 'grass',
  'electric', 'psychic', 'ice',
  'dragon', 'dark', 'fairy'
];

let prevUrl = null;
let nextUrl = null;



// ! FUNCTIONS

//  FUNCTION TO RESET SCREEN 
const resetScreen = () => {
      // ?remove the class by accesing the classLIst property.remove('hide')
    // ? mainScreen acess class - classList access class - .remove('hide') hides removes
    mainScreen.classList.remove('hide');
  // ? look through our types constants
  // ? for of loop itirates through evertype and removes the type upon new pokemon
  for (const type of TYPES) {
    mainScreen.classList.remove(type);
  }
};

// FUNCTION TO CAPITALIZE LETTERS
// ? gets a string, and capitalizes the first element[0] and append(+) it to the substr(1) starting at one
const capitalize = (str) => str[0].toUpperCase() + str.substr(1);


// ! GET DATA FOR DISPLAY POKEDEX ON THE LEFT SIDE
const fetchPokeData = id => {
fetch (`https://pokeapi.co/api/v2/pokemon/${id}`)
  .then( res => {
    return res.json();
  })
  // ? RETURNS OUR DATA IN THE JSON FORM 
  .then(data => {

    // ? INVOKE THE resetScreen Funciton
    resetScreen();

        // ? GRAB POKEMON TYPES with one or two types objects in the array
    // ? CREATE A FUNCTION THAT EXTRACTS THE TYPES PROPERTY FROM THE API
    const dataTypes = data['types'];
    // console.log(dataTypes);
    // ? EXTRACT TWO TYPES OF POKEMON IN THE ARAY OBJECT
    const dataFirstType = dataTypes[0];
    const dataSecondType = dataTypes[1];
    // ? pokeTypeOne.textContent - GETS DATA FROM OUR DOM OBJECTS AND SETS IT TO dataFirstType
    pokeTypeOne.textContent = capitalize(dataFirstType['type']['name']);
      // ? IF SECOND TYPE EXISTS
      if(dataSecondType)  {
        // ? WE DISPLAY THE CONTECT
        pokeTypeTwo.textContent = capitalize(dataSecondType['type']['name']);
        // ? IF THE SECOND CLASS(.classList) EXIST WE HAVE TO ACCESS THE CLASS AND REMOVE IT .remove('hide)
        pokeTypeTwo.classList.remove('hide');
      } 
      else{
        // ? IF IT DOESNT EXIST WE SET IT TO AM EMPTY STRING '' - so that it resets on click
        pokeTypeTwo.textContent = '';
        // ? IF IT DOESNT EXIST WE GRAB OUR .classlist(second type) and we .add('hide') to hide second type
        pokeTypeTwo.classList.add('hide');
      }
    
    // ? CHANGES THE BACKGROUND COLOR BASED ON TYPE NAME[0] from dataFirstType
    mainScreen.classList.add(dataFirstType['type']['name']);

    
    // ?pokeName access our function(const) - .textContent displays the content
    pokeName.textContent = capitalize(data['name']);
    // ? toString turns ints into strings
    // ? padStart is how a string starts(3 charactsers, and pad it with 0 if its not 3 characters)
    pokeId.textContent = '#' + data['id'].toString().padStart(3, '0');
    pokeWeight.textContent = data['weight'];
    pokeHeight.textContent = data['height'];
    // ? UPDATADE THE IMAGE SOURCE FOR THE IMAGE
    // ? pokeFrontImage.src access our DOM object. in this case, src in HTML
    // ? = data['sprites']['front_default']; -  displays the data in our API
    // ? ADD SHORT CIRCUIT OPERATOR JUST IN CASE THE IMAGE DOESNT EXIST AND SET IT TO EMPTY STRING (|| '' ;)
    pokeFrontImage.src = data['sprites']['front_default'] || '';
    pokeBackImage.src = data['sprites']['back_default'] || '';
  // FINISHES OUR FETCH DISPLAY FUNCTION 
  });
}


// ! LOAD NEXT & PREVIOUS PAGES BY URL & DISPLAY RIGHT SIDE
const fetchPokeList = url => {
  // GET DATA FOR POKEMON SELECTOR(RIGHT SIDE)
fetch(url)
.then(res => res.json())
.then(data => {
  
  // ? DESTRUCTURE PROPERTY FROM DATA OBJECT
  const { results, previous, next } = data; //OR const results = data['results'];
  prevUrl = previous;
  nextUrl = next;
    
  // ? traditional for loop to have acces to the [i]
  // ? looping through pokeListItems in case there are NO 20 elements which is the limit of our fetch
  for (let i = 0; i < pokeListItems.length ; i++) {
    // ? current dom element(list-item from HTML) from the array
    const pokeListItem = pokeListItems[i]; // ? access to resultdata at that index from API
    const resultData = results[i];
    
    if (resultData) { // ?if resultData exists
      // ? Need to destrucure in here because if wont return anything unles we recieve the data. if its null or undefined
      const { name, url } =resultData; // ? destructure the data from our API the name and url
      const urlArray = url.split('/'); // ? .split  the  url at the /
      // console.log(urlArray);
      const id = urlArray [urlArray.length - 2]; // ? grabs our index position -2 BECAUSE THAT IS THE ID name we are trying to grab
      pokeListItem.textContent = id + '.' + capitalize(name); // ? update our pokeListItem(from our DOM)the text content to the name
    }
    else {
      pokeListItem.textContent = ''; // ? if nothing is found, we return an empty array
    }
  }
});
};

// FUCTION FOR RIGHT BUTTON HANDLER


const handleLeftButtonClick = () => {
  if (prevUrl) {
    fetchPokeList(prevUrl);
  }
};

const handleRightButtonClick = () => {
  if (nextUrl) {
    fetchPokeList(nextUrl);
  }
};

const handleListItemClick = (e) => {
  if (!e.target) return;

  const listItem = e.target;
  if (!listItem.textContent) return;

  const id = listItem.textContent.split('.')[0];
  fetchPokeData(id);
};





// !EVENT LISTENERS FOR "PREV" & "NEXT" BUTTONS
// ? click even and second argument is function that we want to fire
leftButton.addEventListener('click', handleLeftButtonClick);

// we are only passing the fuction, not calling it. Hence why no parenthesis 
rightButton.addEventListener('click', handleRightButtonClick);// ? we do not put parenthesis on second argument to not call the function only pass it as a reference

// FOR LOOP TO MAKE EACH POKEMON "CLICKABLE"
for (const pokeListItem of pokeListItems) {
  pokeListItem.addEventListener('click', handleListItemClick);
}


// INITLIAZE APP
fetchPokeList('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20');






















