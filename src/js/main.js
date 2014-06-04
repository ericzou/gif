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

  function transitionTo (state) {
    console.log("state", state);
    var stateFnName = 'enter' + state.slice(0, 1).toUpperCase() + state.slice(1);
    console.log('statename', stateFnName);
    if (isValidTransition(state)) {
      currentState = state;
      stateFns[stateFnName].apply();
    } else {
      console.error('Invalid state transition from ' + currentState + ' to ' + state);
    }
  }

  function initButtonClicked() {
    console.log("init button clicked");
    transitionTo('ready');
  }

  function finishButtonClicked() {
    console.log("finish button clicked");
    transitionTo('ready');
  }

  stateFns.enterInit = function () {
    syncButtonState();
    registerClick('button', initButtonClicked);
    $('button').text('Start Recording');
  }

  stateFns.enterReady = function () {
    var count = 3;
    var timer;
    syncButtonState();

    $('button').text('Ready in ' + count + '...');

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
    media.record(media.video, RECORDING_LENGTH);

    $('button').text('Recording...');

    timer = setTimeout(function () {
      clearProgressState();
      transitionTo('finish');
    }, RECORDING_LENGTH);
  }

  stateFns.enterFinish = function () {
    syncButtonState();
    registerClick('button', finishButtonClicked);
    $('button').text('Record another one');
  }

  window.main = function () {
    currentState = 'finish' // hack to be able to transition to init
    transitionTo('init');
  };


})(window, window.media, $, _);
