var apiusers = 'https://api.github.com/users?per_page=100';
var apireq = 'https://api.github.com/users/';
var usernames = [];

// create an ajax function.
function jsonCall(url, callback) {
	$.ajax({
	  url: url,
	  complete: function(xhr) {
	    callback.call(null, xhr.responseJSON);
	  }
	});
}

// search for the users and save them in an object.
jsonCall(apiusers, function(json) {

    for(var i=0; i < json.length; i++){
    	usernames.push({ value: json[i].login });
    }

});

$(function(){

  	$('#githubuser').autocomplete({
  		// tell autocomplete to fetch the usernames object.
	    lookup: usernames,
	    // filter the autocomplete so that only first letter will be registred.
	    lookupFilter: function (suggestion, originalQuery, queryLowerCase) {
            return suggestion.value.toLowerCase().indexOf(queryLowerCase) === 0;
        },
	    onSelect: function (suggestion) {
	    	// empty the searchfield.
	    	$('#githubuser').val("");
	    	// save the username.
	    	var username = suggestion.value;

	        jsonCall(apireq+username, function(json) {
	        	// converting the json time recieved to readable time.
	        	var time = json.created_at;
	        	var date = time.slice(0,10);
	        	var hour = time.slice(11,16);
	        	var newTime = date.concat(' '+hour);
	        	// Add the username and date to content div.
	        	$('#content').append( "<div class='username-div'><span>&#x2713;</span>"+username+ ' - ' +newTime+"</div>");
		  	});
	    }
	});
	// make the input field in focus by making content darker.
	$('#githubuser').focusin(function(event) {
    	$('#wrapper').addClass('focused');
	});
	// reverse the darker content when inputfield is not focused.
	$('#githubuser').focusout(function(event) {
	    $('#wrapper').removeClass('focused');
	    // clear field because of autocomplete not able to pickup on current letter(s) on re-focus.
	    $('#githubuser').val("");
	    // Using settimeout for att reduce spamming for results.
	    $("#githubuser").prop('disabled', true);
	    setTimeout(function(){ $("#githubuser").prop('disabled', false); }, 400);
	});

});

