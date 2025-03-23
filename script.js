const movieResults = [];
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
  // gets array of indices of movies
  let movieID = findMovie(movieInfo, movieSearch.toLowerCase());
  console.log(movieID);
  // gets elements on services page
  const servicesHeader = document.getElementById('servicesHeader');
  // populates movieResults array with movies if there are results
  if (movieID.length) {
    // sets header for services page
    servicesHeader.innerText = `Results for ${movieSearch.toLowerCase()}`;
    // gets resultsContainer to populate with results
    const resultsContainer = document.getElementById('resultsContainer');
    for (let i = 0; i < movieID.length; i++) {
      movieResults.push(
        await axios.get("https://api.watchmode.com/v1/title/" + movieID[i] + "/details/?apiKey=QJ1dtRDuLGfv2iErp7XSEoQbymXut7IAagrANh88&append_to_response=sources")
      );
    }
    console.log(movieResults);

    // if (movie.data.length) {
    //   servicesDiv.innerText = `${movieInfo[movieIdx].name} is available on:`;
    //   for (let i = 0; i < movie.data.length; i++) {
    //     if (movie.data[i].region === "US") {
    //       console.log(`Film is available on ${movie.data[i].name}`);
    //       servicesDiv.innerText += ` ${movie.data[i].name} (${movie.data[i].type}) <br>`;
    //     }
    //   }
    // } else {
    //   servicesDiv.innerText = "not on streaming";
    // }
  } else {
    servicesHeader.innerText = "movie not found";
  }
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