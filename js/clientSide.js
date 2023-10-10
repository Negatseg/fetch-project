// ROTTEN TOMATOES KEY: emsqjacpmmqtms79muj8v6xm
// ROTTEN TOMATOES SECRET: Qt7Fp4QJQG
// OMDB KEY:  4efa80bc
// REDDIT KEY(?): n4brKxZAfsAOHMyzmUlhpw

// REDDIT SECRET: 	YF7RwwTWTPa8eUc6smx-WRMIbOxyuw
// REDDIT USERNAME: movieLookup
// REDDIT PASSWORD: keyboard

let omdbElement = document.getElementById('ombd');
let redditElement = document.getElementById('reddit')


// encodeURIComponent replaces non english characters with escape sequences that can be read by APIs
// fetches data from OMDB
async function getOmdbData(movieTitle) {
    const apiUrl = `http://www.omdbapi.com/?apikey=4efa80bc&t=${encodeURIComponent(movieTitle)}`
    try {
      const response = await fetch(apiUrl);
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      return data;
      // Handle the data received from the OMDB API
    } catch (error) {
      // Handle any errors that occurred during the fetch
      console.error('Fetch error:', error);
    }
}

// fetches data from Reddit
async function getRedditAPI(input) {
    let url = `https://api.reddit.com/r/movies/search/?q=${encodeURIComponent(input)}&restrict_sr=1`
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Reddit network response failed');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Reddit fetch error:' + error)
    }
}

// master function to retireve API data and display it
async function displaySearch() {
  let input;
  if(this.getAttribute('id') === 'submitBtn') {
    input = document.getElementById('movieSearch').value;
    document.querySelector('.content').remove();
    document.getElementById('searchBarHidden').setAttribute('style', 'margin-bottom:.5em')
  } else {
    input = document.getElementById('movieSearchHidden').value;
  }
  if (input === '') {
    alert('Please enter the exact title of the movie')
  } else {
    let omdbData = await getOmdbData(input);
    let redditData = await getRedditAPI(input);  
    // Call the fetchMovieData function to fetch and display the data
    displayMovieData(omdbData);
    displayReddit(redditData);
  }
}

// displays OMDB data
function displayMovieData(movieData) {
  document.getElementById('omdb').innerHTML = ``;
  let ratings = document.createElement('div');
  for (let i = 0; i < movieData.Ratings.length; i++) {
    let source = document.createElement('h2');
    source.textContent = `
      ${movieData.Ratings[i].Source} || ${movieData.Ratings[i].Value}
    `
    ratings.append(source);
  }
  document.getElementById('omdb').innerHTML = `
    <div id = "omdb-inner">
      <h2> ${movieData.Title}</h2>
      <p>Released: ${movieData.Released} | Runtime: ${movieData.Runtime}</p>
      <p>${movieData.Genre}</p>
      <p>Director: ${movieData.Director} | ${movieData.Writer} | ${movieData.Actors}</p>
      <p style= 'width:60%; margin:auto;'>${movieData.Plot}</p>
      <p>${movieData.Awards}</p>
      <img src = ${movieData.Poster}></img>
    </div>
  `;


  document.getElementById('omdb-inner').append(ratings);
}  

// displays Reddit Data
function displayReddit(data) {
  document.getElementById('reddit').innerHTML = ``;
  document.getElementById('reddit').innerHTML = `
    <h1>See what people on Reddit are saying!</h1>
  `
  for (let i = 0; i < data.data.children.length; i++) {
    let card = document.createElement('div')
    card.innerHTML= `
      <h3>${data.data.children[i].data.title}<a href = ${data.data.children[i].data.url}>[Link]</a></h3>
      <p>${data.data.children[i].data.author}</p>
      <p>${data.data.children[i].data.selftext}</p>
    `;
    document.getElementById('reddit').append(card)
  }
}

// two buttons, one primary and one hidden
let button = document.getElementById('submitBtn')
let buttonHidden = document.getElementById('submitBtnHidden')
button.addEventListener('click', displaySearch);
buttonHidden.addEventListener('click', displaySearch);



