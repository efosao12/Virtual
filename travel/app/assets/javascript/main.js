

console.log("connected")

// var config = require('/config.js');

var apis = {
        'instagram':{
            'client_id':'',
            'access_token':''
        },
        'twitter':{
        },
        'youtube':{
            'api_key':''
        }
    };


      google.load('search', '1');

      var newsSearch;

google.setOnLoadCallback(onLoad);

function onLoad() {
    newsSearch = new google.search.NewsSearch();
}

function googleApiClientReady(){
      gapi.client.setApiKey(apis.youtube.api_key);
      gapi.client.load('youtube', 'v3', function() {});
};


$(document).ready(function(){


    $('#searchRequest').click(function(){
        console.log("searchClicked")
        var term = $('#term').val();
        getInstagram(term);
    getYoutube(term); 
        getNews(term);
  });


/*
 *GET, EXTRACT, RENDER
 */

    /*
     *news
     *
     */
    function getNews(term){
        newsSearch.setSearchCompleteCallback(this, extractNews, null);
        newsSearch.execute(term);
        google.search.Search.getBranding('branding');
    }

    /*
     *
     */
    function extractNews() {

                var srcs = [];
                if (newsSearch.results && newsSearch.results.length > 0) {
                        for (var i = 0; i < newsSearch.results.length; i++) {
                            src = {};
                            src['title'] = newsSearch.results[i].title;
                            src['content'] = newsSearch.results[i].content; 
                            srcs.push(src);
                        }
                    }
                renderNews(srcs);
    }


    function renderNews(srcs){
        console.log(srcs);
        html = '';
        for(var i=0; i<srcs.length; i++){
                html+='<div class="col-lg-5 col-lg-offset-1 col-sm-push-6  col-sm-6"><h2 class="section-heading">'+srcs[i].title+'</h2><p class="lead">'+srcs[i].content+'</p></div>';
            }
        $('#news').html(html);
    }

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
   
    var srcs= [];
    for(var i=0; i< data.items.length; i++){
      var src = {};
      src['id'] = data.items[i].id.videoId; 
      src['title'] = data.items[i].snippet.title; 
      src['description'] = data.items[i].snippet.description; 
      srcs.push(src);
    }      
    return srcs;
  }  

  function renderYoutube(srcs){
        var html = '';
    for(var i=0;i<srcs.length;i++){
            var itemClass = i == 0 ? 'item active' : 'item';
      var src = 'https://www.youtube.com/embed/'+srcs[i].id+'?rel=0&html5=1';
      html += '<div class="col-md-3 '+itemClass+'" ><iframe  width="300"title="'+srcs[i]['title']+'" src="'+src+'" frameborder="0" allowfullscreen=""></iframe></div>'
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
//          html+='<div class="col-lg-3 col-lg-offset-2 col-sm-2"><img class="img-responsive" src="'+srcs[i]['img']+'" alt=""></div>';
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







