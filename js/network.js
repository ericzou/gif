(function (window, $) {
  'use strict';

  var imgurUrl = 'https://api.imgur.com/3/upload';
  var accept = 'application/json';
  var authorization = 'Client-ID b5d7fcedc09fb89';
  var contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
  var parseUrl = 'https://api.parse.com/1/classes/gif';
  var restId = 'Ze79Z9SUSEEjXOnNhA5PZQ6axgnBb1e8WrM12AaL';
  var appId = 'XqG211wrMHbWl421tKGY0jcWz88XZLidbGDG438z';


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
        album: 'bZ3EoMpwPZ3N1Gf',
        type: 'base64'
      },
      success: function (response) {
        deferred.resolve(response.data);
      },
      reject: function () {
        deferred.reject(arguments);
      }
    });

    return deferred.promise();
  }

  function postToParse(data) {
    var deferred = $.Deferred();
    $.ajax({
      url: parseUrl,
      method: 'POST',
      headers: {
        'X-Parse-Application-Id': appId,
        'X-Parse-REST-API-Key': restId
      },
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(data),
      dataType: 'json',
      success: function (response) {
        deferred.resolve(response);
      },
      reject: function () {
        console.log("save faied", arguments);
        deferred.reject(arguments);
      }
    });
    return deferred.promise();
  }

  window.network = {}
  network.postToImgur = postToImgur;
  network.postToParse = postToParse;

})(window, $)
