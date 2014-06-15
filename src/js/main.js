(function (window, media, sm, process, $, _) {
  'use strict';

  var RECORDING_LENGTH = 2000;

  function registerClick(selector, handler) {
    $(selector).on('click', handler);
  }

  function deRegisterClick(selector) {
    $(selector).off();
  }

  function syncButtonState() {
    clearButtonState().addClass(sm.currentState).blur();
  }

  function clearButtonState() {
    $('button').removeClass();
    deRegisterClick('button');
    return $('button');
  }

  function clearProgressState() {
    $('.progress-bar').css('width', 0);
    $('.progress-bar').hide();
    return $('.progress-bar');
  }

  function showProgressBar() {
    if (sm.currentState != 'recording') {
      throw 'current state should be in recording, but it actually is '  + sm.currentState;
    }

    clearProgressState().show().animate({
      width: 260
    }, RECORDING_LENGTH);
  }

  function appendLinkTo(link, selector) {
    var html = '<p class="link"><a target="_blank" href="' + link + '">'
                      + link +
                    '</a></p>'
    $(selector).append(html);
  }

  function initButtonClicked() {
    sm.transitionTo('ready');
  }

  function finishButtonClicked() {
    sm.transitionTo('ready');
  }

  sm.enterInit = function () {
    syncButtonState();
    registerClick('button', initButtonClicked);
    $('button').text('Start Recording');
  }

  sm.enterReady = function () {
    var count = 1;
    var timer;
    syncButtonState();

    $('button').text('Ready...');

    timer = setInterval(function () {
      console.log("count down in ", count);
      count -= 1;
      if (count <= 0) {
        clearInterval(timer);
        sm.transitionTo('recording');
      } else {
        $('button').text('Ready in ' + count + '...');
      }

    }, 1000);
  }

  sm.enterRecording = function() {
    var timer;

    syncButtonState();
    showProgressBar();
    $('button').text('Recording...');
    media.record(media.video, RECORDING_LENGTH).then(function (gif) {
      clearProgressState();
      sm.transitionTo('processing', gif);
    });
  },

  sm.enterProcessing = function (gif) {
    syncButtonState();
    $('button').text('Uploading...');
    process(gif).then(function (data) {
      sm.transitionTo('finish', data.link);
    });
  },

  sm.enterFinish = function (link) {
    syncButtonState();
    registerClick('button', finishButtonClicked);
    $('button').text('Record another one');
    appendLinkTo(link, '.main');
  }

  window.main = function () {
    sm.transitionTo('init');
  };


})(window, window.media, window.sm, window.process, $, _);
