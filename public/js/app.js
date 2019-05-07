// Get the articles from the DB as a JSON
$.getJSON("/articles", function(data) {
  // console.log("get JSON app test");
  // console.log(data);
  
  // a loop to handle each article
  for (var i = 0; i < data.length; i++) {
    console.log(data);
    console.log("loop:" + i);
    //display the info we wanted on the page
    $("#news-section").append("<br><p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p><br>");
  }
});



$(document).on("click", "p", function () {

  $("comments-section").empty();

  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/articles/" +thisId
  })
  .then(function(data) {
    console.log(data);
    //titles
    $("#comments-section").append("<h2>" + data.title + "</h2>");
    // An input to enter a new title
    $("#comments-section").append("<input id='titleinput' name='title' >");
    // A textarea to add a new note body
    $("#comments-section").append("<textarea id='bodyinput' name='body'></textarea>");
    // A button to submit a new note, with the id of the article saved to it
    $("#comments-section").append("<button data-id='" + data._id + "' id='savecomment'>Save Comment</button>");
  
    // If there's a note in the article
    if (data.comment) {
      $("#titleinput").val(data.comment.title);
      $("#bodyinput").val(data.comment.body);
    }
  });
});

$(document).on("click", "#savecomment", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from comment textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#comments-section").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

