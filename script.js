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
  // console.log(movieID);
  
  // gets elements on services page
  const servicesHeader = document.getElementById('servicesHeader');
  // populates movieResults array with movies if there are results
  if (movieID.length) {
    // sets header for services page
    servicesHeader.innerText = `Results for ${movieSearch.toLowerCase()}`;
    // gets resultsContainer to populate with results
    const resultsContainer = document.getElementById('resultsContainer');
    for (let i = 0; i < movieID.length; i++) {
      // gets movie info
      const movie = (await axios.get("https://api.watchmode.com/v1/title/" + movieID[i] + "/details/?apiKey=QJ1dtRDuLGfv2iErp7XSEoQbymXut7IAagrANh88&append_to_response=sources")).data;
      console.log(movie);
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
      // creates element to list streaming service(s)
      // const service = document.createElement('p');
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
                  resultsItemDiv.innerHTML += `<p>Rent on ${source.name}: $${source.price}</p>`;
                  break;
                
                // execute if type is buy
                case "buy":
                  resultsItemDiv.innerHTML += `<p>Buy on ${source.name}(${source.format}): $${source.price}</p>`;
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