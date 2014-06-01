(function (navigator, main, $, _) {
  'use strict';
  function getUserMedia(argument) {
    return (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGet)
  }

  // body...
})(window.navigator, window.main, $, _);
