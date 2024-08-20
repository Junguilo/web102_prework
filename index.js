/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data
    for(let i = 0; i < games.length; i++){

        // create a new div element, which will become the game card
        const gameCard = document.createElement('div');
        
        // add the class game-card to the list
        gameCard.classList.add("game-card");

        // set the inner HTML using a template literal to display some info 
        // about each game
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")
        const display=`
        <p class="emoji"> ${emojiList(games[i].name)} </p>
        <img class="game-img" src=${games[i].img} />
        <h2>${games[i].name}</h2>
        <p>${games[i].description}</p>
        <p><strong> Goal:</strong> ${games[i].goal}</p>
        <p><strong> Pledged:</strong> ${games[i].pledged}</p>
        <p><strong> Backers:</strong> ${games[i].backers}</p>
        `;
        gameCard.innerHTML = display;
        // append the game to the games-container
        gamesContainer.append(gameCard);
    }
}

//addGamesToPage(GAMES_JSON);
// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games


/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce( (acc, games) => {
    return acc + games.backers;
}, 0);
//console.log(totalContributions.toLocaleString('en-US'));
// set the inner HTML using a template literal and toLocaleString to get a number with commas
const display = `${totalContributions.toLocaleString('en-US')}`;
contributionsCard.append(display);

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

const totalRaised = GAMES_JSON.reduce( (acc, games) => {
    return acc + games.pledged;
}, 0);

// set inner HTML using template literal
const raisedDisplay = `$${totalRaised.toLocaleString('en-US')}`;
raisedCard.append(raisedDisplay);

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
const totalGames = GAMES_JSON.length;
gamesCard.append(totalGames);

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    let listOfCompletion = GAMES_JSON.filter( (games)=>{
        return games.pledged < games.goal;
    });

    //optional function
    highlighted("unfunded");

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(listOfCompletion);
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    let listOfCompletion = GAMES_JSON.filter( (games)=>{
        return games.pledged > games.goal;
    });

    //optional function
    highlighted("funded");

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(listOfCompletion);
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    //optional function
    highlighted("all");

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
let listOfUnfunded = GAMES_JSON.filter( (games)=>{
    return games.pledged < games.goal;
}).length;

// create a string that explains the number of unfunded games using the ternary operator

const displayStr = ` A total of $${totalRaised.toLocaleString('en-US')} has been raised for ${GAMES_JSON.length} ${GAMES_JSON.length > 1 ? "games" : "game"}.
Currently, ${listOfUnfunded} remains unfunded. We need your help to fund these amazing games!`;

const descriptionText = document.createElement('p');
descriptionText.append(displayStr);
descriptionContainer.append(descriptionText);
// create a new DOM element containing the template string and append it to the description container

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
let  [first, second, ...others] = sortedGames;
console.log(first.name + "/" + second.name);

// create a new element to hold the name of the top pledge game, then append it to the correct element
const firstGame = document.createElement('p');
firstGame.append(first.name);
firstGameContainer.append(firstGame);

// do the same for the runner up item
const secondGame = document.createElement('p');
secondGame.append(second.name);
secondGameContainer.append(secondGame);

//add all games to page on init
showAllGames();

/*******************************************************************************************
 *  OPTIONAL IMPROVED FUCTIONALITY
 */

//Getting the buttons to stay highlighted when showing unfunded/funded/all games
function highlighted(buttonName){
    //optional. Highlight button when active
    const allBtn = document.getElementById("all-btn");
    const unfundedBtn = document.getElementById("unfunded-btn");
    const fundedBtn = document.getElementById("funded-btn");

    switch(buttonName){
        case "all":
            allBtn.style="background-color: #a8b0bc";
            unfundedBtn.style="background-color: white";
            fundedBtn.style="background-color: white";
            break;
        case "unfunded":
            allBtn.style="background-color: white";
            unfundedBtn.style="background-color: #a8b0bc";
            fundedBtn.style="background-color: white";
            break;
        case "funded":
            allBtn.style="background-color: white";
            unfundedBtn.style="background-color: white";
            fundedBtn.style="background-color: #a8b0bc";
            break;
        default:
            allBtn.style="background-color: white";
            unfundedBtn.style="background-color: white";
            fundedBtn.style="background-color: white";
            break;

    }
}

// Adding functionality to the stats, the way the tutorial makes it seem clickable
// Clicking the Individual Contributions will display all games, and clicking on Top Funded Game/Runner Up will only display those two. 
const fundedRunnerGames = document.getElementById("top-games");
function displayTop(){
    let [first, second, ...others] = GAMES_JSON;
    let top = [first, second];

    deleteChildElements(gamesContainer);
    highlighted("");
    addGamesToPage(top);
}
fundedRunnerGames.addEventListener("click", displayTop);

const stats = document.getElementById("stats-board");
stats.addEventListener("click", showAllGames);

// adding emojis to the top right of the games indicating if they're top/runner, funded, and unfunded
function emojiList(gameName){
    //take funded lists to compare with 
    let listOfFunded = GAMES_JSON.filter( (games)=>{
        return games.pledged > games.goal;
    });


    //takes top two funded, and the rest of them
    let [first, second, ...others] = listOfFunded;

    const otherFundedNames = others.reduce( (acc, games) => {
        return acc + games.name;
    }, 0);

    if(first.name == gameName){
        return '🥇';
    } else if(second.name == gameName){
        return '🥈';
    } else if( otherFundedNames.includes(gameName, 0)){
        return '💰';
    } else {
        return '😢';
    }
}