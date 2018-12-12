// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    $("#articles").empty();
    if(data.length == 0){
      $("#articles").append("<h4>Uh oh! Looks like you aren't viewing any articles. Click the button Scrape New Articles!</h4>");

    }
    else{

    
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append("<div class='col-md-4 displayedArt'><div class='card mb-4 shadow-sm'><div style='width: 18rem' class = 'card' data-id='" + data[i]._id + "'> <img class ='card-img-top' src='" + data[i].img +"'><div class='card-body'> <h6 class='card-title'> <a href=https://www.washingtonpost.com"+data[i].link + "? class='card-link' target='_blank'>"+data[i].title + "</a> </h6> <p class='card-text'>"+ data[i].description + "</p> </div><div class='card-footer'><button type='button' data-id='" + data[i]._id + "' class=' addNote btn btn-primary' data-toggle='modal' data-target='#noteModal'> View Notes</button></div></div></div>");
    }
  }
});

$(document).on("click", "#clear", function() {
  // Grab the id associated with the article from the submit button
  

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "GET",
    url: "/clear"
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#articles").empty();
      $("#articles").append("<h4>Uh oh! Looks like you aren't viewing any articles. Click the button Scrape New Articles!</h4>");
    });

  });

  $(document).on("click", "#add", function() {
    // Grab the id associated with the article from the submit button
    
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "GET",
      url: "/scrapeNew"
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        $("#articles").empty();
        for (var i = 0; i < data.length; i++) {
          // Display the apropos information on the page
          $("#articles").append("<div class='col-md-4 displayedArt'><div class='card mb-4 shadow-sm'><div style='width: 18rem' class = 'card' data-id='" + data[i]._id + "'> <img class ='card-img-top' src='" + data[i].img +"'><div class='card-body'> <h6 class='card-title'> <a href=https://www.washingtonpost.com"+data[i].link + "? class='card-link'>"+data[i].title + "</a> </h6> <p class='card-text'>"+ data[i].description + "</p> </div></div></div>");
        }
      });
  
    });

    // Whenever someone clicks a p tag
$(document).on("click", ".addNote", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  $("#notesBody").empty();
  var thisId = $(this).attr("data-id");
  console.log(thisId);

  

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);

      // The title of the article
      $("#notes").append( data.title );
      console.log(data.notes.length);

      for(var i = 0; i<data.notes.length; i++){
        console.log(data.notes[i].title);
        $("#notesBody").append( "<p>" + data.notes[i].title + "</p> <button class='btn btn-danger' data-id='" + data._id + "' id='delnote'>X</button>" );
      }


      // An input to enter a new title
      $("#notesBody").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body<h2>" + data.title + "</h2>
      $("#notesBody").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notesBody").append("<button class='btn btn-primary' data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // // If there's a note in the article
      // if (data.note) {
      //   // Place the title of the note in the title input
      //   $("#titleinput").val(data.note.title);
      //   // Place the body of the note in the body textarea
      //   $("#bodyinput").val(data.note.body);
      // }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/submit/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      //$("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

  //========== Modal to Display Youtube ================================
  var modal = document.getElementById('noteModal');
  var btn = document.getElementsByClassName("addNote");
  // var span = document.getElementsByClassName("close")[0];

  btn.onclick = function() {
      modal.style.display = "block";
  }


  // span.onclick = function() {
  //     modal.style.display = "none";
  //     $("#noteModal").empty();
  // }

  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = "none";
      }
  }