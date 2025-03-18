async function movieInfo() {
  let res = await axios.get("title_id_map.csv");
  const movieInfo = csvToString(res.data);
}

function csvToString(data) {
  const dataArray = data.split("\n").map(row => row.split(","));
  console.log(dataArray[0][2]);
}

movieInfo();