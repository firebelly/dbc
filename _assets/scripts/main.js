// import external dependencies
import 'jquery';
import Swup from 'swup';
import SwupBodyClassPlugin from '@swup/body-class-plugin';
import SwupScrollPlugin from '@swup/scroll-plugin';
import SwupDebugPlugin from '@swup/debug-plugin';
import Waypoint from 'waypoints/lib/jquery.waypoints.js';

// import local dependencies
import Router from './util/Router';
import common from './routes/common';

const swup = new Swup({
  plugins: [
    new SwupBodyClassPlugin(),
    new SwupScrollPlugin({
      animateScroll: false
    }),
    // new SwupDebugPlugin()
  ],
  linkSelector:
    'a[href^="' +
    window.location.origin +
    '"]:not([href*="wp-admin"]):not([data-no-swup]), a[href^="/"]:not([href*="wp-admin"]):not([data-no-swup]), a[href^="#"]:not([href*="wp-admin"]):not([data-no-swup])'
});

/** Populate Router instance with DOM routes */
const routes = new Router({
  common,
});

var $body = $('body'),
    $customCursor;

function _initInviewElements() {
  $('.animate-in').each(function() {
    var $elem = $(this);
    inView($elem);
  });

  $('.animate-out').each(function() {
    var $elem = $(this);
    var inview = new Waypoint.Inview({
      element: $(this)[0],
      exited: function(direction) {
        $(this).addClass('out-of-view');
      }
    });
  });

  function inView($elem) {
    var waypoint = $elem.waypoint(function(direction) {
      $elem.addClass('in-view', direction === 'down');
    },{
      offset: '85%'
    });
  }

  $('.animate-in-series').each(function() {
    var $container = $(this);
    $container.waypoint(function(direction) {
      $container.addClass('in-view', direction === 'down');
    },{
      offset: '85%'
    });

    // establish transition delays
    var animationItems = $container.find('.animation-item');
    animationItems.each(function(i) {
      $(this).css('transition-delay', 0.1 * i + 's');
    });
  });
}
_initInviewElements();

function _initCustomCursor() {
  $body.css('cursor', 'none');
  var lastMousePosition = { x: 0, y: 0 };

  // Update the mouse position
  function onMouseMove(evt) {
    if (!$('#cursor').length) {
      $customCursor = $('<div id="cursor"></div>').appendTo($body);
    }
    lastMousePosition.x = evt.clientX;
    lastMousePosition.y = evt.clientY;
    requestAnimationFrame(update);
  }

  function update() {
    if (!$('#cursor').length) {
      return;
    }
    // Get the element we're hovered on
    var hoveredEl = document.elementFromPoint(lastMousePosition.x, lastMousePosition.y);

    // Check if the element or any of its parents have a .js-cursor class
    if ($(hoveredEl).is('a') || $(hoveredEl).parents('a').length || $(hoveredEl).hasClass('button') || $(hoveredEl).parents('.button').length || $(hoveredEl).is('.cursor-hover') || $(hoveredEl).parents('.cursor-hover').length) {
      $body.addClass('-cursor-active');
    } else {
      $body.removeClass('-cursor-active');
    }

    // now draw object at lastMousePosition
    $customCursor.css({
      'top': lastMousePosition.y + 'px',
      'left': lastMousePosition.x + 'px'
    });
  }

  // Listen for mouse movement
  document.addEventListener('mousemove', onMouseMove, false);
  // Make sure a user is still hovered on an element when they start scrolling
  document.addEventListener('scroll', update, false);
}
_initCustomCursor();

// Load Events
$(document).ready(() => routes.loadEvents());
// Reload events when swup replaces content
swup.on('contentReplaced', function() {
  routes.loadEvents();
  $('#nav-toggle.-active').removeClass('-active');
});
swup.on('animationInDone', function() {
  _initInviewElements();
});