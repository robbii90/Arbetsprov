var apiusers = 'https://api.github.com/users?per_page=100';
var apireq = 'https://api.github.com/users/';
var usernames = [];

function jsonCall(url, callback) {
	$.ajax({
	  url: url,
	  complete: function(xhr) {
	    callback.call(null, xhr.responseJSON);
	  }
	});
}

jsonCall(apiusers, function(json) {

    for(var i=0; i < json.length; i++){
    	usernames.push({ value: json[i].login });
    }

});

$(function(){

  	$('#githubuser').autocomplete({
	    lookup: usernames,
	    lookupFilter: function (suggestion, originalQuery, queryLowerCase) {
            return suggestion.value.toLowerCase().indexOf(queryLowerCase) === 0;
        },
	    onSelect: function (suggestion) {

	    	$('#githubuser').val("");
	    	var username = suggestion.value;

	        jsonCall(apireq+username, function(json) {
	        	var time = json.created_at;
	        	var date = time.slice(0,10);
	        	var hour = time.slice(11,16);
	        	var newTime = date.concat(' '+hour);

	        	$('#content').append( "<div class='username-div'><span>&#x2713;</span>"+username+ ' - ' +newTime+"</div>");
	        	$("#githubuser").prop('disabled', true);
	        	setTimeout(function(){ $("#githubuser").prop('disabled', false); }, 200);
		  	});
	    }
	});

	$('#githubuser').focusin(function(event) {
    	$('#wrapper').addClass('focused');
	});

	$('#githubuser').focusout(function(event) {
	    $('#wrapper').removeClass('focused');
	});

});

