(function (navigator, $, _) {
  'use strict';
  var width = 260;
  var height = 195;
  var canvas;
  var context;
  var video;

  function snapshot(video) {
    var img = document.createElement('img');
    getContext().drawImage(video, 0, 0, width, height);
    img.src = getCanvas().toDataURL('image/webp');
    return img;
  }

  function getVideo() {
    if (!video) {
      video = $('video').get(0);
      video.setAttribute('width', width);
      video.setAttribute('height', height);
    }
    return video;
  }

  function getCanvas() {
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
    }
    return canvas;
  }

  function getContext() {
    return getCanvas().getContext('2d');
  }


  function getUserMedia() {
    return (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || function () {
      throw 'This browser does not support navigator.getUserMedia';
    }).apply(navigator, arguments)
  }


  function setupVideoCapture() {
    getUserMedia({video: true}, function  (mediaStream) {
      // getVideo().src = window.URL.createObjectURL(mediaStream);
      getVideo().srcObject = mediaStream;
      getVideo().play();
    }, function (error) {
      console.log("not getting the video stream");
    });
  }

  function createGif(frames) {
    var gif = new Animated_GIF({ workerPath: 'js/Animated_GIF.worker.js' });
    gif.setSize(width, height);
    gif.setDelay(0);
    for (var i = 0; i < frames.length; i++) {
      gif.addFrame(frames[i]);
    }

    return gif;
  }

  window.media = function () {
  }

  media.record = function (video, duration) {
    var frames = [];
    var frameRate = 5;
    var counter = 0;
    var interval = Math.floor(1000/frameRate);
    var deferred = $.Deferred();
    var gif;

    var timer = setInterval(function () {
      frames.push(snapshot(video));
      counter += interval;
      if (counter > duration) {
        clearInterval(timer);
        gif = createGif(frames);
        gif.getBase64GIF(deferred.resolve)
      }
    }, interval);

    return deferred.promise();
  }

  setupVideoCapture();

  media.snapshot = snapshot;

  media.video = getVideo();

  // body...
})(window.navigator, $, _);
