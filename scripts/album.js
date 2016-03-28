var createSongRow = function (songNumber, songName, songLength) {
    var template =
        '<tr class="album-view-song-item">'
        + ' <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
        + ' <td class="song-item-title">' + songName + '</td>'
        + ' <td class="song-item-duration">' + songLength + '</td>'
        + '</tr>'
        ;
    
    var clickHandler = function() {
        var songItem = parseInt($(this).attr('data-song-number'));
        
        if (currentlyPlayingSongNumber !== null) {
            var currentlyPlayingSongItem = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber+ '"]');
            currentlyPlayingSongItem.html(currentlyPlayingSongNumber);
        } 
        if (currentlyPlayingSongNumber === songItem) {
            $(this).html(playButtonTemplate);
            currentlyPlayingSongNumber = null;
            currentSongFromAlbum = null;
            $('.main-controls .play-pause').html(playerBarPlayButton);
        } else if (currentlyPlayingSongNumber !== songItem) {
            $(this).html(pauseButtonTemplate);
            currentlyPlayingSongNumber = songItem;
            currentSongFromAlbum = currentAlbum.songs[songItem - 1]; 
            updatePlayerBarSong();
        }
        
    };
    
    var $row = $(template);
    
    var onHover = function(event) {
        var songItem = $(this).find('.song-item-number');
        var songItemNumber = parseInt(songItem.attr('data-song-number'));
        
        if (songItemNumber !== currentlyPlayingSongNumber) {
            songItem.html(playButtonTemplate);
        }
    };
    
    var offHover = function(event) {
        var songItem = parseInt((this).find('.song-item-number'));
        var songItemNumber = songItem.attr('data-song-number');
        
        if (songItemNumber !== currentlyPlayingSongNumber) {
            songItem.html(songItemNumber);
        }
        console.log('songNumber type is ' + typeof songNumber + '\n and currentlyPlayingSongNumber type is ' + typeof currentlyPlayingSongNumber);
    };
     
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};

var setCurrentAlbum = function (album) {
    currentAlbum = album;
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');

    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);

    $albumSongList.empty();
    
    for (var i = 0; i < album.songs.length; i++) {
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
    }
};

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};

var nextSong = function() {
    var previousSongItem = $(this).find('.song-item-number');
    var previousSongItemNumber = parseInt($(this).attr('data-song-number'));
    // Check if current song is last song in album, if so wrap, else increment
    if (currentlyPlayingSongNumber === currentAlbum.songs.length) {
        currentSongFromAlbum = currentAlbum.songs[0];
    } else {
        currentSongFromAlbum = currentAlbum.songs[trackIndex(currentAlbum, currentSongFromAlbum) + 1];
    }
    updatePlayerBarSong();
    previousSongItem.html(previousSongItemNumber);
    var currentlyPlayingSongItem = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber+ '"]');
    currentlyPlayingSongItem.html(pauseButtonTemplate);
};

var previousSong = function() {
    
    var getLastSongNumber = function(index) {
        return index == currentAlbum.songs.length - 1 ? 1 : index + 2;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _decrementing_ the song here
    currentSongIndex--;
    
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }
    
    // Set a new current song
    currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    // Update the Player Bar information
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
};

var updatePlayerBarSong = function() {
    $('.player-bar .currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.player-bar .currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.player-bar .currently-playing .artist-name').text(currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
});