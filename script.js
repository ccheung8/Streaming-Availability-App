// API KEY: QJ1dtRDuLGfv2iErp7XSEoQbymXut7IAagrANh88

class Movie {
  /**
   * @definition Constructs movie object for parsing csv
   * @param {string} name - Describes the name of the movie
   * @param {number} id - Describes the watchmode title id
   * @param {array} sources - Describes the sources the title is available in
   */
  constructor(name, id, sources) {
    this.name = name;
    this.id = id;
    this.sources = sources;
  }
}

async function movieInfo() {
  let res = await axios.get("title_id_map.csv");
  const movieInfo = csvToString(res.data);
  const movie = await axios.get("https://api.watchmode.com/v1/title/" + 345534 + "/sources/?apiKey=QJ1dtRDuLGfv2iErp7XSEoQbymXut7IAagrANh88");
  console.log(movie.data);
  if (movie.data.length) {
    console.log("media is out on:")
    for (let i = 0; i < movie.data.length; i++) {
      if (movie.data[i].region === "US" && movie.data[i].type === "sub") {
        console.log(`Film is available on ${movie.data[i].name}`);
      }
    }
  } else {
    console.log("not on streaming");
  }
}

function csvToString(data) {
  // turns csv data into 2d array
  const dataArray = data.split("\n").map(row => row.split(","));
  // replaces all "" in string with /g (global) regex
  // console.log(parseInt(dataArray[1][0].replace(/"/g, '')));
  // console.log(typeof parseInt(dataArray[1][0]));
  return dataArray;
}

movieInfo();