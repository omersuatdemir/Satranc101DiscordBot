const { default: axios } = require('axios');

function getresults(t_id){
    axios.get('https://lichess.org/api/tournament/' + t_id + '/results')
    .then(function (response) {

        var json = "[" + response.data.replace(/\r?\n/g, ",").replace(/,\s*$/, "") + "]";
        var jsondata = JSON.parse(json);
        console.log(jsondata[0].username);
        console.log(jsondata[1].username);
        console.log(jsondata[2].username);
    })
    .catch(function (error) {
      console.log(error);
  });
}

getresults('fd7ZJKjQ');