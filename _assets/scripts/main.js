// import external dependencies
import 'jquery';
import Swup from 'swup';
import SwupBodyClassPlugin from '@swup/body-class-plugin';
import SwupScrollPlugin from '@swup/scroll-plugin';
import SwupDebugPlugin from '@swup/debug-plugin';
import Waypoint from 'waypoints/lib/jquery.waypoints.js';

// import local dependencies
import Router from './util/Router';
import Breakpoints from './util/Breakpoints';
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
    '"]:not([href*="wp-admin"]):not([data-no-swup]), a[href^="/"]:not([href*="wp-admin"]):not([data-no-swup]), a[href^="#"]:not([href*="wp-admin"]):not([data-no-swup])',
  containers: ["#swup", "#swup-banner"]
});

/** Populate Router instance with DOM routes */
const routes = new Router({
  common,
});

var $body = $('body'),
    $siteNav = $('#site-nav'),
    $customCursor;

function _isTouchDevice() {
  var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
  var mq = function(query) {
      return window.matchMedia(query).matches;
  }

  if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
      return true;
  }

  // include the 'heartz' as a way to have a non matching MQ to help terminate the join
  // https://git.io/vznFH
  var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
  return mq(query);
}

// Esc handlers
$(document).keyup(function(e) {
  if (e.keyCode === 27) {
    _hideNav();
  }
});

function _initSiteNav() {
  $(document).on('click', '.nav-open', function() {
    if (!$body.is('.mobile-nav-open')) {
      _showNav();
    }
  });

  $('.nav-close').on('click', _hideNav);
}
_initSiteNav();

function _showNav() {
  $body.addClass('mobile-nav-open');
  $siteNav.velocity(
    { opacity: 1 }, {
    display: "flex",
    complete: function() {
      $siteNav.addClass('-active');
    }
  });
}

function _hideNav() {
  $body.removeClass('mobile-nav-open');
  $siteNav.velocity(
    { opacity: 0 }, {
    display: "none",
    complete: function() {
      $siteNav.removeClass('-active');
    }
  });
}

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
        $(this).attr('data-out-of-view', 'true');
      }
    });
  });

  function inView($elem) {
    var waypoint = $elem.waypoint(function(direction) {
      if (direction === 'down') {
        $elem.attr('data-in-view', 'true');
      }
    },{
      offset: '75%'
    });
  }

  $('.animate-in-series').each(function() {
    var $container = $(this);
    $container.waypoint(function(direction) {
      $container.attr('data-in-view', direction === 'down');
    },{
      offset: '75%'
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
  if (_isTouchDevice()) {
    return;
  }

  $body.addClass('custom-cursor');
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
  if (!Breakpoints.nav) {
    _hideNav();
  }
});
swup.on('animationInDone', function() {
  _initInviewElements();
});