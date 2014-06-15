(function (window, $, _, network) {
  'use strict';

  function appendToDocument(gif) {
    var animatedImage = document.createElement('img');
    animatedImage.src = gif;
    document.body.appendChild(animatedImage);
  }

  function upload(gif) {
    return network.postToImgur(gif);
  }

  function saveToParse(data) {
    return network.postToParse(data);
  }

  function process(gif) {
    var promise;
    appendToDocument(gif);
    promise = upload(gif);
    promise.then(saveToParse);
    return promise;
  }

  window.process = process;
})(window, $, _, window.network)
