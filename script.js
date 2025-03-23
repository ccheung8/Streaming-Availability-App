const movieInfo = [];

class Movie {
  /**
   * @definition Constructs movie object for parsing csv
   * @param {string} name - Describes the name of the movie
   * @param {number} id - Describes the watchmode title id
   */
  constructor(name, id) {
    this.name = name;
    this.id = id;
  }
}

/**
 * @definition gets movie from watchmode API and displays result on page
 * @param {string} movieSearch - name of movie to search for
 */
async function getMovie(movieSearch) {
  // waits for csv to load to data to initialize
  await loadMovies();
  // gets array of IDs of movies
  let movieID = findMovie(movieInfo, movieSearch.toLowerCase());
  
  // gets elements on services page
  const servicesHeader = document.getElementById('servicesHeader');
  // populates movieResults array with movies if there are results
  const resultsContainer = document.getElementById('resultsContainer');
  if (movieID.length) {
    // sets header for services page
    servicesHeader.innerText = `Results for ${movieSearch.toLowerCase()}`;
    // gets resultsContainer to populate with results
    for (let i = 0; i < movieID.length; i++) {
      // gets movie info
      const movie = (await axios.get("https://api.watchmode.com/v1/title/" + movieID[i] + "/details/?apiKey=" + apiKey + "&append_to_response=sources")).data;
      // creates div to display item info
      const resultsItemDiv = document.createElement('div');
      // adds class to div for styling
      resultsItemDiv.classList.add('resultsItem');
      // populates results item div
      resultsItemDiv.innerHTML += 
        `
        <img src="${movie.posterMedium}" alt="movie poster of ${movieSearch}">
        <h3>${movie.title}</h3>
        `;
      // checks if media is available on any sources
      if (movie.sources.length) {
        // loops through sources
        movie.sources.forEach((source) => {
          switch (source.region) {
            // execute if region is US
            case "US":
              switch (source.type) {
                // execute if type is sub
                case "sub":
                  resultsItemDiv.innerHTML += `<p>Stream on ${source.name}</p>`;
                  break;

                // execute if type is rent
                case "rent":
                  resultsItemDiv.innerHTML += `<p>Rent on ${source.name} (${source.format}): $${source.price}</p>`;
                  break;
                
                // execute if type is buy
                case "buy":
                  resultsItemDiv.innerHTML += `<p>Buy on ${source.name} (${source.format}): $${source.price}</p>`;
                  break;
                }
              }
        });
        resultsContainer.appendChild(resultsItemDiv);
      }
      else {
        // if movie.services array is empty
        resultsItemDiv.innerHTML += "<p>Not available on streaming</p>"
      }
    }
  }
  else {
    // if no movie IDs were found
    servicesHeader.innerText = "movie not found";
  }

  // hides loader and shows info
  document.getElementById('loaderContainer').style.display = 'none';
  servicesHeader.style.display = 'block';
  resultsContainer.style.display = 'grid';
}

/**
 * @definition linear search of movieInfo array for Index
 * @param {array} movieInfo - array of movie objects
 * @param {string} movieName - name of movie to find ID for
 * @returns Array of IDs of movie(s) that include movieName
 */
function findMovie(movieInfo, movieName) {
  const movieID = [];
  for (let i = 0; i < movieInfo.length; i++) {
    if (movieInfo[i].name.includes(movieName)) {
      movieID.push(movieInfo[i].id);
    }
  }
  return movieID;
}

/**
 * @definition Takes csv file and loads data into an array of Movie objects
 */
async function loadMovies() {
  let res = await axios.get("../title_id_map.csv");
  // turns csv data into 2d array
  const dataArray = res.data.split("\n").map(row => row = row.split(
    // finds , that doesn't have " before and after 
    // , - matches , char
    // (?= - positive lookahead of group
    // (?:(?:[^"]*"){2}) - finds where there aren't 2 "
    // * - unlimited times (until end of string)
    // [^"]* - find where there is not " after ,
    /,(?=(?:(?:[^"]*"){2})*[^"]*$)/
  ));
  let i = 1;
  // dataArray[x][0] - watchmode ID
  // dataArray[x][4] - title
  while (dataArray[i][0]) {
    // removes " in name and id for data cleaning and makes movie lowercase for non case sensitive search
    movieInfo.push(new Movie(dataArray[i][4].replace(/"/g, '').toLowerCase(), parseInt(dataArray[i][0].replace(/"/g, '')))); 
    i++;
  }
}

/**
 * @definition Logs user out of account and resets nav bar
 */
function logOut() {
  localStorage.setItem("loggedIn", false);

  navRight.innerHTML = 
      `
      <ul>
        <li><a href="#">Sign In</a></li>
        <li><a href="SignUp/">Sign Up</a></li>
      </ul>
      `;
}

const hamburgerCheck = document.getElementById('checkbox');

/**
 * @definition Function for showing and hiding the hamburger menu when clicked
 */
function showHamburger() {
  const hamburgerMenu = document.getElementById('hamburgerMenu')
  if (hamburgerCheck.checked) {
    hamburgerMenu.style.display = 'flex';
    // gives time for animation to play
    setTimeout(() => {
      hamburgerMenu.style.opacity = 1;
    }, 10);
  }
  else {
    // gives time for animation to play
    hamburgerMenu.style.opacity = 0;
    setTimeout(() => {
      hamburgerMenu.style.display = 'none';
    }, 150);
  }
}

window.addEventListener('load', () => {
  // resets hamburger
  hamburgerCheck.checked = false;

  // checks to see if user is logged in
  if (localStorage.getItem('loggedIn') === "true") {
    const navRight = document.getElementById('navRight');
    navRight.innerHTML = 
      `
      <ul>
        <li><a href="../account/">${localStorage.getItem('username')}</a></li>
        <li><a href="/" onclick="logOut()">Log out</a></li>
      </ul>
      `;
  }
});
// checks resize for hamburger display
window.addEventListener('resize', () => {
  const hamburger = document.getElementById('hamburger');
  if (window.innerWidth <= 768) {
    hamburger.style.display = 'block'
  }
  else {
    hamburger.style.display = 'none';
  }
});