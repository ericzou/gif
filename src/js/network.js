(function (window, $) {
  'use strict';

  var imgurUrl = 'https://api.imgur.com/3/upload';
  var accept = 'application/json';
  var authorization = 'Client-ID b5d7fcedc09fb89';
  var contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
  var transactions = [];


  function postToImgur(gif) {
    var deferred = $.Deferred();
    var imageData = gif.split(',').pop();
    $.ajax({
      url: imgurUrl,
      method: 'POST',
      headers: {
        Authorization: authorization,
        Accept: accept
      },
      data: {
        image: imageData,
        type: 'base64'
      },
      success: function (response) {
        deferred.resolve(response.data.link);
      },
      reject: function () {
        deferred.reject(arguments);
      }
    });

    return deferred.promise();
  }

  window.network = {}
  network.postToImgur = postToImgur;

})(window, $)
