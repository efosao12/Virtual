	var apis = {
	    'instagram':{
	      'client_id':'dccaeea556c74aa9aca8d69239eeb3cd',
	      'access_token':''
	    },
	    'twitter':{
	    },
	    'youtube':{
        'api_key':'AIzaSyCfAXlAG7n40MDnJWY8FIsrbiN-CzsBNNk'
      }
	  };

function googleApiClientReady(){
  
      gapi.client.setApiKey(apis.youtube.api_key);
      gapi.client.load('youtube', 'v3', function() {});
};


$(document).ready(function(){


	$('#search').click(function(){
		var term = $('#term').val();
		getInstagram(term);
    getYoutube(term); 

  });



/*
 *GET, EXTRACT, RENDER
 */

  /*
	 * youtube
	 */
	function getYoutube(term) {
          var request = gapi.client.youtube.search.list({
                     q: term,
                  part: 'snippet'                        
          });
          var callstring = 'youtube';
          requester(request, callstring);

    };


  function extractYoutube(data){
    console.log(data);
   
    var srcs= [];
    for(var i=0; i< data.items.length; i++){
      var src = {};
      src['id'] = data.items[i].id.videoId; 
      src['title'] = data.items[i].snippet.title; 
      src['description'] = data.items[i].snippet.description; 
      srcs.push(src);
    }      
    console.log(srcs);
    return srcs;
  }  

  function renderYoutube(srcs){
 		var html = '';
    for(var i=0;i<srcs.length;i++){
      var src = 'https://www.youtube.com/embed/'+srcs[i].id+'?rel=0&html5=1';
      html += '<div><iframe title="'+srcs[i]['title']+'" src="'+src+'" frameborder="0" allowfullscreen=""></iframe></div>'
    }
    
    $('#youtube').html(html);
  }

	/*
	 * END: youtube
	 */




  /*
	 * instagram
	 */

  function getInstagram(term){
    var clientId = apis.instagram.client_id; 
    var callstring = 'instagram';
    var token = {
    'client_id':clientId,
    'term':term
    };
    requester(token, callstring);
  }  

  function extractInstagram(data){
      srcs =[];
      for(i in data.data){
        src = {};
        //640 x 640
        src['img'] = data.data[i].images.standard_resolution.url;
        src['cap'] = data.data[i].caption.text;
        srcs.push(src);
      }
      return srcs;
  }

	function renderInstagram(srcs){
			
		var html = '';
		var max = 18;

		var MAX = srcs.length < max ? srcs.length : max;


		for(var i=0; i<MAX; i++){
//			html+='<div class="col-lg-3 col-lg-offset-2 col-sm-2"><img class="img-responsive" src="'+srcs[i]['img']+'" alt=""></div>';
			html+='<div class="col-lg-4 col-sm-6 col-xs-12"> <img src="'+srcs[i]['img']+'" class="thumbnail img-responsive"></div>';
			
		}
			$('#instagram').html(html);
	}

  /*
	 * END instagram
	 */

  
  /*
 *END: GET, EXTRACT, RENDER
 */


  function requester(token,callstring){
    switch(callstring){
        case 'instagram':
        $.ajax({
					 method:"GET",
            url:"https://api.instagram.com/v1/tags/"+token['term']+"/media/recent?client_id="+token['client_id'],
            dataType: 'jsonp',
             success: function(data){
            responseHandler(data, callstring);
					 }
				 });
          break;
          case 'youtube':
            token.execute(function(response) {
              responseHandler(response,callstring);  
            });
					break;
					default:
						console.log('no api: '+callstring); 
          break;
    }
  }

  function responseHandler(data, callstring){
    switch(callstring){
      case "instagram":
        // console.log(callstring);
        srcs = extractInstagram(data); 
        renderInstagram(srcs);
					
				// console.log(srcs);
        break;
			case "youtube":
        //  console.log(data);
          srcs = extractYoutube(data); 
          renderYoutube(srcs);

        //  console.log(srcs); 
          break;
      default:
        console.log('no api: '+callstring); 
        break
    }
  } 


});



