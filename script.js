const movieSearch = document.getElementById('movieSearch');
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

async function getMovie() {
  let movieID = findMovie(movieInfo, movieSearch.value.toLowerCase());
  if (movieID === -1) {
    console.log("movie not found");
  } else {
    // const movie = await axios.get("https://api.watchmode.com/v1/title/" + movieID + "/sources/?apiKey=QJ1dtRDuLGfv2iErp7XSEoQbymXut7IAagrANh88");
    // console.log(movie.data);
    // if (movie.data.length) {
    //   console.log("media is out on:");
    //   for (let i = 0; i < movie.data.length; i++) {
    //     if (movie.data[i].region === "US" && movie.data[i].type === "sub") {
    //       console.log(`Film is available on ${movie.data[i].name}`);
    //     }
    //   }
    // } else {
    //   console.log("not on streaming");
    // }
  }
}

/**
 * @definition linear search of movieInfo array for ID
 * @param {array} movieInfo - array of movie objects
 * @param {string} movieName - name of movie to find ID for
 * @returns ID of movie, else -1 if not found
 */
function findMovie(movieInfo, movieName) {
  for (let i = 0; i < movieInfo.length; i++) {
    if (movieInfo[i].name === movieName) {
      console.log(`${movieName} has WatchMode ID of ${movieInfo[i].id}`);
      return movieInfo[i].id;
    }
  }
  return -1
}

// gets csv and arranges into an array on page load
window.onload = async function() {
  let res = await axios.get("title_id_map.csv");
  // turns csv data into 2d array
  const dataArray = res.data.split("\n").map(row => row = row.split(
    // finds , that doesn't have " before and after 
    // , - matches , char
    // (?= - positive lookahead of group
    // (?:(?:[^"]*"){2}) - finds where there aren't 2 "
    // * - unlimited times (until end of string)
    // [^"]* - find where there is " after ,
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
  console.log(movieInfo[1].name);
}