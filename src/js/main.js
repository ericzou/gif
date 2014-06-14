(function (window, media, $, _) {
  'use strict';

  var RECORDING_LENGTH = 2000;

  var states = {
    init: [ 'ready'],
    ready: ['recording'],
    recording: ['finish'],
    finish: ['init', 'ready']
  };

  var currentState = null;

  var stateFns = {}

  function registerClick(selector, handler) {
    $(selector).on('click', handler);
  }

  function deRegisterClick(selector) {
    $(selector).off();
  }

  function isValidTransition (state) {
    return $.inArray(state, states[currentState]) >= 0;
  }

  function syncButtonState() {
    clearButtonState().addClass(currentState).blur();
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
    if (currentState != 'recording') {
      throw 'current state should be in recording, but it actually is '  + currentState;
    }

    clearProgressState().show().animate({
      width: 260
    }, RECORDING_LENGTH);
  }

  function transitionTo () {
    var args = Array.prototype.slice.call(arguments);
    var state = args.shift();
    var stateFnName = 'enter' + state.slice(0, 1).toUpperCase() + state.slice(1);
    if (isValidTransition(state)) {
      currentState = state;
      stateFns[stateFnName].apply(null, args);
    } else {
      console.error('Invalid state transition from ' + currentState + ' to ' + state);
    }
  }

  function appendLinkTo(link, selector) {
    var html = '<p class="link"><a target="_blank" href="' + link + '">'
                      + link +
                    '</a></p>'
    $(selector).append(html);
  }

  function initButtonClicked() {
    transitionTo('ready');
  }

  function finishButtonClicked() {
    transitionTo('ready');
  }

  stateFns.enterInit = function () {
    syncButtonState();
    registerClick('button', initButtonClicked);
    $('button').text('Start Recording');
  }

  stateFns.enterReady = function () {
    var count = 1;
    var timer;
    syncButtonState();

    $('button').text('Ready...');

    timer = setInterval(function () {
      console.log("count down in ", count);
      count -= 1;
      if (count <= 0) {
        clearInterval(timer);
        transitionTo('recording');
      } else {
        $('button').text('Ready in ' + count + '...');
      }

    }, 1000);
  }

  stateFns.enterRecording = function() {
    var timer;

    syncButtonState();
    showProgressBar();
    $('button').text('Recording...');
    media.record(media.video, RECORDING_LENGTH).then(function (data) {
      clearProgressState();
      transitionTo('finish', data.link);
    });
  }

  stateFns.enterFinish = function (link) {
    syncButtonState();
    registerClick('button', finishButtonClicked);
    $('button').text('Record another one');
    appendLinkTo(link, '.main');
  }

  window.main = function () {
    currentState = 'finish' // hack to be able to transition to init
    transitionTo('init');
  };


})(window, window.media, $, _);
