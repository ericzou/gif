(function (window, $, _) {
  'use strict';
  window.sm = {};

  var states = {
    init: [ 'ready'],
    ready: ['recording', ],
    recording: ['processing'],
    processing: ['finish'],
    finish: ['init', 'ready']
  };

  function isValidTransition (state) {
    debugger;
    return $.inArray(state, states[sm.currentState]) >= 0;
  }

  function transitionTo () {
    var args = Array.prototype.slice.call(arguments);
    var state = args.shift();
    var stateFnName = 'enter' + state.slice(0, 1).toUpperCase() + state.slice(1);
    if (isValidTransition(state)) {
      sm.currentState = state;
      sm[stateFnName].apply(null, args);
    } else {
      console.error('Invalid state transition from ' + sm.currentState + ' to ' + state);
    }
  }

  sm.states = states;
  sm.isValidTransition = isValidTransition;
  sm.currentState = 'finish'; // hack to be able to transition to init
  sm.transitionTo = transitionTo;
})(window, $, _)
