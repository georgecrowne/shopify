


document.getElementById("clear_button").addEventListener("click", function() {
  document.getElementById("search").value = "";
  document.getElementById("results").innerHTML = "";
})


document.getElementById("search").addEventListener('input', function() {
  document.getElementById("results").innerHTML = "";
  var query = document.getElementById("search").value
  var url = "https://www.omdbapi.com/?s=" + query + "&plot=full&apikey=3680be5c";
  var aj = new XMLHttpRequest();
  aj.open("GET", url, true);
  aj.send();
  aj.onreadystatechange = function() {
    if (aj.readyState == 4 && aj.status == 200) {
      var result = JSON.parse(aj.responseText).Search;
      if (result != null) {
        for (var i = 0; i < result.length; i++) {
          var div = document.createElement("DIV")
          var id = result[i].imdbID
          var year = result[i].Year
          var title = result[i].Title
          var p = document.createElement("H4")
          var info_button = document.createElement("DIV")
          info_button.classList.add("info_button")
          var info = document.createElement("H4")
          info.classList.add("info_button_text")
          info.innerHTML = "More Info"
          info_button.appendChild(info)
          info_button.dataset.toggle = "modal"
          info_button.dataset.target = "#exampleModal-lg"
          info_button.type = "button"
          info_button.id = "button_" + id
          info_button.title = title
          info_button.onclick = function() {
            fillmodal(this.id)
          }
          p.classList.add("result_title")
          p.id = "title_" + id
          p.innerHTML = title + " (" + year + ")";
          div.id = id
          div.title = p.innerHTML
          if (!selected.some(row => row.includes(id))) {
            div.classList.add("result")
          }
          else {
            div.classList.add("result_taken")
          }
          var row = document.createElement("DIV")
          row.classList.add("row")
          row.classList.add("justify-content-md-center")
          var col1 = document.createElement("DIV")
          col1.classList.add("col-8")
          var col2 = document.createElement("DIV")
          col2.classList.add("col-3")
          var divrow = document.createElement("DIV")
          divrow.classList.add("row")
          var divcol = document.createElement("DIV")
          divcol.classList.add("col")
          divcol.appendChild(p)
          divrow.appendChild(divcol)
          div.appendChild(divrow)
          col1.appendChild(div)
          col2.appendChild(info_button)
          row.appendChild(col1)
          row.appendChild(col2)
          document.getElementById("results").appendChild(row);
          div.addEventListener("click", function() {
            selectmovie(this.id, this.title)
          });
        }
      }
      else {
        document.getElementById("results").innerHTML = "";
      }
    }
  };
});



document.getElementById("modal_nomiate").addEventListener("click", function() {
  selectmovie(this.parentElement.parentElement.movie_id, this.parentElement.parentElement.movie_title)
});




function fillmodal(id) {
  var id = id.substring(7)
  console.log(id)
  var url = "http://www.omdbapi.com/?i=" + id + "&apikey=3680be5c";
  var aj = new XMLHttpRequest();
  aj.open("GET", url, true);
  aj.send();
  aj.onreadystatechange = function() {
    if (aj.readyState == 4 && aj.status == 200) {
      var result = JSON.parse(aj.responseText);
      if (result != null) {
        document.getElementById("modal_content").movie_id = id
        document.getElementById("modal_movie_title").innerHTML = result.Title + " (" + result.Year + ")";
        document.getElementById("modal_content").movie_title = result.Title + " (" + result.Year + ")";
        document.getElementById("poster_image").src = result.Poster
        for (var i = 0; i < result.Ratings.length; i++) {
          if (i==0) {
            var beg = "IMDb: "
          }
          else if (i==1) {
            var beg = "Rotten Tomatoes: "
          }
          else {
            var beg = "Metacritic: "
          }
          document.getElementById("modal_movie_rating" + (i+1)).innerHTML = beg + result.Ratings[i].Value;
        }
        document.getElementById("modal_movie_director").innerHTML = "Directed By: " + result.Director
        document.getElementById("actors").innerHTML = "Starring: " + result.Actors
        document.getElementById("genres").innerHTML = result.Genre;
        document.getElementById("rated").innerHTML = "Rated: " + result.Rated;
        document.getElementById("released").innerHTML = "Released: " + result.Released;
        document.getElementById("boxOffice").innerHTML = "Box Office: " + result.BoxOffice;
        document.getElementById("runtime").innerHTML = "Runtime: " + result.Runtime;
        document.getElementById("plot").innerHTML = "Plot: " + result.Plot;
      }
    }
  }
}

document.getElementById("modal_close").addEventListener("click", function() {
  document.getElementById("poster_image").src = ""
})




document.getElementById("search").onfocus = function() {
  document.getElementById("search_bar").style.border = "2px solid #377e62"
}

document.getElementById("search").onfocusout = function() {
  document.getElementById("search_bar").style.border = "0.5px solid #377e62"
}


var selected = []
function selectmovie(id, title) {
  if (selected.length < 5) {
    if (!selected.some(row => row.includes(id))) {
      selected.push([id, title])
      document.getElementById(id).remove();
      document.getElementById("button_" + id).remove();
      for (var i = 1; i < selected.length +1; i++) {
        var id = selected[i-1][0]
        var title = selected[i-1][1]
        document.getElementById("nominated_" + i).classList.remove("nominated_empty")
        document.getElementById("nominated_" + i).classList.add("nominated")
        document.getElementById("nominated_" + i).innerHTML = ""
        var text = document.createElement("P")
        text.id = "nominated_text_" + id
        text.innerHTML = selected[i-1][1]
        text.classList.add("nominated_text")
        document.getElementById("nominated_" + i).appendChild(text)
        document.getElementById("nominated_" + i).movie_title = selected[i-1][1];
        document.getElementById("nominated_" + i).movieID = selected[i-1][0];
        document.getElementById("nominated_" + i).nomination_number = i;
        document.getElementById("nominated_" + i).onclick = function() {
          removemovie(this.movieID, this.movie_title)
        }
        document.getElementById("nominated_" + i).addEventListener("mouseenter", function() {
          if (this.nomination_number <= selected.length) {
            document.getElementById("nominated_text_" + this.movieID).innerHTML = "REMOVE"
          }
        })
        document.getElementById("nominated_" + i).addEventListener("mouseleave", function() {
          if (this.nomination_number <= selected.length) {
            document.getElementById("nominated_text_" + this.movieID).innerHTML = this.movie_title
          }
        })
      }
    }
    if (selected.length == 5) {
      document.getElementById("submit").classList.remove("submit_button_disabled")
      document.getElementById("submit").classList.add("submit_button")
      document.getElementById("submit").dataset.toggle = "modal"
      document.getElementById("submit").dataset.target = "#exampleModal"
      document.getElementById("submit_text").innerHTML = "Submit"
    }
    else {
      document.getElementById("submit_text").innerHTML = "Nominate " + (5-selected.length) + " more movie(s)!"
    }
  }
  else {
    alert("NO MORE SPOTS")
  }
}

function removemovie(id, title) {
  for (var i = 0; i < selected.length; i++) {
    if (selected[i][0] == id) {
      selected.splice(i, 1)
    }
  }
  if (selected.length < 5) {
    document.getElementById("submit").className = ""
    document.getElementById("submit").classList.add("submit_button_disabled")
    document.getElementById("submit").dataset.toggle = ""
    document.getElementById("submit").dataset.target = ""
    document.getElementById("submit_text").innerHTML = "Nominate " + (5-selected.length) + " more movie(s)!"
  }
  for (var i = 1; i < 6; i++) {
    if (i <= selected.length) {
      var id = selected[i-1][0]
      var title = selected[i-1][1]
      document.getElementById("nominated_" + i).classList.remove("nominated_empty")
      document.getElementById("nominated_" + i).classList.add("nominated")
      document.getElementById("nominated_" + i).innerHTML = ""
      var text = document.createElement("P")
      text.innerHTML = selected[i-1][1]
      text.id = "nominated_text_" + selected[i-1][0]
      text.classList.add("nominated_text")
      document.getElementById("nominated_" + i).appendChild(text)
      document.getElementById("nominated_" + i).movieID = selected[i-1][0];
      document.getElementById("nominated_" + i).onclick = function() {
        removemovie(this.movieID, this.innerHTML)
      }
    }
    else {
      document.getElementById("nominated_" + i).classList.remove("nominated")
      document.getElementById("nominated_" + i).classList.add("nominated_empty")
      document.getElementById("nominated_" + i).innerHTML = ""
      var number = document.createElement("H1")
      number.innerHTML = i
      number.classList.add("number")
      document.getElementById("nominated_" + i).appendChild(number)
    }
  }
  if (document.getElementById(id) != null) {
    document.getElementById(id).classList.remove("result_taken")
    document.getElementById(id).classList.add("result")
  }
}

document.getElementById("submit").addEventListener("click", function() {
  if (selected.length == 5) {
    document.getElementById("nominations").innerHTML = ""
    for (var i = 0; i < selected.length; i++) {
      var movie = document.createElement("H3")
      movie.innerHTML = selected[i][1]
      document.getElementById("nominations").appendChild(movie)
    }
  }
})
