'use strict'

if (typeof window.FileReader !== 'function') {
    alert("The file API isn't supported on this browser yet.");
};

var jsonResponse,
    images,
    videoTitle,
    videoAdditionalInfo,
    titles,
    years,
    player,
    element;

const DEFAULT_VIDEO_ID = 0;

document.addEventListener("DOMContentLoaded", function(){initialise();}, false);

function initialise(){
    loadJSON(function (response) {
        jsonResponse = JSON.parse(response);

        videoTitle = document.getElementById("video-title");
        videoAdditionalInfo = document.getElementById('video-additional-info');
        images = document.getElementsByTagName('img');
        titles = document.getElementsByClassName('title');
        years = document.getElementsByClassName('year');
        player = document.getElementById('media-video');
        element = document.getElementById('horizontal-list');

        initialiseDataSources();

        loadVideo(DEFAULT_VIDEO_ID);

        element.addEventListener("click", onVideoItemClick, false);

        //console.log("DOM fully loaded and parsed");
    });
};

function initialiseDataSources(){

    for (var i = 0; i < images.length; i++) {
        images[i].src = "images/" + jsonResponse[i].images.cover;

        while( titles[i].firstChild ) {
            titles[i].removeChild( titles[i].firstChild );
        }
        titles[i].appendChild( document.createTextNode(jsonResponse[i].title));

        while( years[i].firstChild ) {
            years[i].removeChild( years[i].firstChild );
        }
        years[i].appendChild( document.createTextNode(jsonResponse[i].meta.releaseYear));

        var array = jsonResponse[i].streams,
            imageStreams = [];

        for (var z = 0; z < array.length; z++) {
            imageStreams.push(array[z].url);
        };

        images[i].streams = imageStreams;
    };
};

function onVideoItemClick(e) {
    if (e.target !== e.currentTarget) {
        var clickedItem = e.target.id;
        loadVideo(clickedItem);
    }
    e.stopPropagation();
};

function loadJSON(callback) {
    var xobj;
    xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'movies.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
};

function loadVideo(id) {

    var streams=images[id].streams;

    for (var k = 0; k < streams.length; k++) {
        var url = streams[k].split('.');
        var ext = url[url.length - 1];
        if (canPlayVideo(ext)) {
            player.src = streams[k];
            player.load();

            while( videoTitle.firstChild ) {
                videoTitle.removeChild( videoTitle.firstChild );
            }
            videoTitle.appendChild(document.createTextNode(jsonResponse[id].title + " (" + jsonResponse[id].meta.releaseYear + ")") );

            while( videoAdditionalInfo.firstChild ) {
                videoAdditionalInfo.removeChild(videoAdditionalInfo.firstChild );
            }
            videoAdditionalInfo.appendChild(document.createTextNode("Director: " + jsonResponse[id].meta.directors[0].name));

            break;
        };
    };
};

function canPlayVideo(ext) {
    var ableToPlay = player.canPlayType('video/' + ext);
    if (ableToPlay == '') return false;
    else return true;
};



