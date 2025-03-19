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

async function movieInfo() {
  let res = await axios.get("title_id_map.csv");
  const movieInfo = csvToString(res.data);
  // const movie = await axios.get("https://api.watchmode.com/v1/title/" + 345534 + "/sources/?apiKey=QJ1dtRDuLGfv2iErp7XSEoQbymXut7IAagrANh88");
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

// dataArray[x][0] = watchmode ID
// dataArray[x][4] = title
function csvToString(data) {
  // turns csv data into 2d array
  const dataArray = data.split("\n").map(row => 
    row = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
    // return row;
  );
  console.log(dataArray[2]);
  // const movieData = [];
  // let i = 1;
  // while (dataArray[i][0]) {
  //   movieData.push(new Movie(dataArray[i][4], parseInt(dataArray[i][0].replace(/"/g, ''))));
  //   i++;
  // }
  // console.log(movieData[1]);
  // replaces all "" in string with /g (global) regex
  // console.log(parseInt(dataArray[1][0].replace(/"/g, '')));
  // console.log(typeof parseInt(dataArray[1][0]));
  // console.log(dataArray[0][4].length);
  return dataArray;
}

movieInfo();