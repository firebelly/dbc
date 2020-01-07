import jQueryBridget from 'jquery-bridget';
import Velocity from 'velocity-animate';
import Masonry from 'masonry-layout';

// Shared vars among modules
import appState from '../util/appState';
import Breakpoints from '../util/Breakpoints';

export default {
  init() {
    // Set up libraries to be used with jQuery
    jQueryBridget( 'masonry', Masonry, $ );

    var resizeTimer,
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
    $siteNav = $('#site-nav');

    // Set screen size vars
    _resize();

    // Transition elements to enable/disable on resize
    transitionElements = [];

    // Init functions
    _initMasonry();
    _initLoadMore();
    _initFormFunctions();

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

    function _initMasonry() {
      $('.masonry-grid').masonry({
        itemSelector: '.grid-item'
      });
    }

    function _initLoadMore() {
      var $loadMoreSections = $('.load-more-container').parents('.section');

      $loadMoreSections.each(function() {
        var $container = $(this).find('.load-more-container');
        var $grid = $container.masonry({
          itemSelector: '.grid-item'
        });

        var $queue = $(this).find('.load-more-queue');

        if ($queue.find('article').length) {
          $(this).find('.section-cta').append('<button class="load-more circle-button cursor-hover">Load More Events <svg class="icon-plus" aria-hidden="true" role="presentation"><use xlink:href="#icon-plus"/></svg></button>');
          var $button = $(this).find('.load-more');

          $button.on('click', function() {
            var newPosts = $queue.find('article').slice(0,4);
            newPosts.appendTo($container);
            $grid.masonry('appended', newPosts);

            if (!$queue.find('article').length) {
              $button.remove();
            }
          });
        }
      });
    }

    function _initFormFunctions() {
      $('form input').on('focus', function() {
        $(this).closest('.input-wrap').addClass('-focus');
      }).on('blur', function() {
        $(this).closest('.input-wrap').removeClass('-focus');
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
      // Reset inline styles for navigation for medium breakpoint
      if (Breakpoints.nav) {
        $('.site-nav').attr('style', '');
      }

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
