import Velocity from 'velocity-animate';

import appState from '../util/appState';

export default {
  init() {
    var breakpointIndicatorString,
        breakpoint_xl,
        breakpoint_nav,
        breakpoint_lg,
        breakpoint_md,
        breakpoint_sm,
        breakpoint_xs,
        resizeTimer,
        slideEasing = [0.65, 0, 0.35, 1],
        $document,
        $body,
        $siteHeader,
        $siteNav,
        $siteOverlay,
        overlayTimer,
        loadingTimer,
        transitionElements;

    // Cache some common DOM queries
    $document = $(document);
    $body = $('body');

    // Set screen size vars
    _resize();

    // Transition elements to enable/disable on resize
    transitionElements = [];

    // Init functions

    // Esc handlers
    $(document).keyup(function(e) {
      if (e.keyCode === 27) {
      }
    });

    // Smoothscroll links
    $('a.smoothscroll').click(function(e) {
      e.preventDefault();
      var href = $(this).attr('href');
      _scrollBody($(href));
    });

    function _scrollBody(element, duration, delay, offset) {
      element.velocity("scroll", {
        duration: duration,
        delay: delay,
        offset: -offset
      }, "easeOutSine");
    }

    function _initActiveToggle() {
      $(document).on('click', '[data-active-toggle]', function(e) {
        $(this).toggleClass('-active');
        if ($(this).attr('data-active-toggle') !== '') {
          $($(this).attr('data-active-toggle')).toggleClass('-active');
        }
      });
    }

    function _showSiteOverlay(callback) {
      // Check if there is already an overlay on the page
      if (!$('#site-overlay').length) {
        $siteHeader.append($siteOverlay);
      }

      // Check if it's already active, if not animate showing it
      if (!$('#site-overlay').is('.-active')) {
        // Fade in the overlay
        $('#site-overlay').velocity(
          { opacity: 1 }, {
          display: "block",
            // on complete, fade in the lightbox
            complete: function() {
              $('#site-overlay').addClass('-active');
              if(typeof callback !== 'undefined') {
                callback();
              }
            }
        });
      }
    }

    function _hideSiteOverlay(callback) {
      if (!$('#site-overlay').length) {
        return;
      }

      $('#site-overlay').velocity(
        { opacity: 0 }, {
        display: "none",
        complete: function() {
          $('#site-overlay').removeClass('-active');
          if(typeof callback !== 'undefined') {
            callback();
          }
        }
      });
    }

    // Track ajax pages in Analytics
    function _trackPage() {
      if (typeof ga !== 'undefined') { ga('send', 'pageview', document.location.href); }
    }

    // Track events in Analytics
    function _trackEvent(category, action) {
      if (typeof ga !== 'undefined') { ga('send', 'event', category, action); }
    }

    // Disabling transitions on certain elements on resize
    function _disableTransitions() {
      $.each(transitionElements, function() {
        $(this).css('transition', 'none');
      });
    }

    function _enableTransitions() {
      $.each(transitionElements, function() {
        $(this).attr('style', '');
      });
    }

    // Called in quick succession as window is resized
    function _resize() {
      // Check breakpoint indicator in DOM ( :after { content } is controlled by CSS media queries )
      breakpointIndicatorString = window.getComputedStyle(
        document.querySelector('#breakpoint-indicator'), ':after'
      ).getPropertyValue('content')
      .replace(/['"]+/g, '');

      // Determine current breakpoint
      breakpoint_xl = breakpointIndicatorString === 'xl';
      breakpoint_nav = breakpointIndicatorString === 'nav' || breakpoint_xl;
      breakpoint_lg = breakpointIndicatorString === 'lg' || breakpoint_nav;
      breakpoint_md = breakpointIndicatorString === 'md' || breakpoint_lg;
      breakpoint_sm = breakpointIndicatorString === 'sm' || breakpoint_md;
      breakpoint_xs = breakpointIndicatorString === 'xs' || breakpoint_sm;

      // Disable transitions when resizing
      _disableTransitions();

      // Functions to run on resize end
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        // Re-enable transitions
        _enableTransitions();
      }, 250);
    }

    $(window).resize(_resize);
  },
  finalize() {
    // JavaScript to be fired on all pages, after page specific JS is fired
  },
};
