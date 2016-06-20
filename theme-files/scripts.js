$(document).ready(function() {

  // FOR BUTTON DEV ONLY: TAKE THIS OUT LATER CLARA!!!
  // $('.social a').click(function(event) {
  //   event.preventDefault();
  // });

  $('.three-cards .panel').matchHeight();
  $('.latest-news article .match').matchHeight();

  $('.grid').masonry({
    columnWidth: '.grid-item',
    itemSelector: '.grid-item',
    transitionDuration: '0.2s'
  });

  function setCalendarHeight() {
    if ($('#calendar').length > 0) {
      if ($(window).width() < 767) {
        $('#calendar').fullCalendar('option', 'aspectRatio', 0.6);
      } else {
        $('#calendar').fullCalendar('option', 'aspectRatio', 1.35);
      }
    }
  }

  function isSidebar($element) {
    return $element.parent().hasClass("twitter-sidebar");
  }

  function fixLongLinks(index, el) {
    $(el).text($(el).attr('href'));
  }

  function twitterFeeds() {
    $('.tweets-feed').each(function(index) {
      $(this).attr('id', 'tweets-' + index);
    }).each(function(index) {

      function handleTweets(tweets) {

        console.log('doing this thing now');
        console.log(tweets);
        var x = tweets.length;
        var n = 0;
        var element = $('#tweets-' + index);
        var listOfTweets = $('<ul>').addClass("slides");

        while (n < x) {

          var thisTweet = $('<li>');
          thisTweet.html(tweets[n]);
          thisTweet.append($('<div class="clearfix">'));
          var longLinks = thisTweet.find('a[data-scribe="element:url"]');
          longLinks.each(fixLongLinks);
          // console.log(longLinks);

          listOfTweets.append(thisTweet);

          var reply = thisTweet.find('.twitter_reply_icon');
          var retweet = thisTweet.find('.twitter_retweet_icon');
          var favorite = thisTweet.find('.twitter_fav_icon');

          if(isSidebar(element)) {

            reply.html('<i class="icon icon-undo2"></i>');
            retweet.html('<i class="icon icon-loop"></i>');
            favorite.html('<i class="icon icon-star3"></i>');
          }

          n++;
        }
        element.html(listOfTweets);

        if(!isSidebar(element)) {
          $('#tweets-' + index).flexslider({ directionNav: false });
        }

        return listOfTweets;
      }

      var element = $('#tweets-' + index);
      var limit;
      if (isSidebar(element)) {
        limit = 3;
      } else {
        limit = 5;
      }

      var config = {
        "id": $('#tweets-' + index).attr('data-widget-id'),
        "maxTweets": limit,
        "customCallback": handleTweets,
        "showRetweet": false
      };

      twitterFetcher.fetch(config);

    });
  }

  function addClassToSelects() {
    $('select').addClass('form-control');
  }

  function faq() {
    $('#faq-panel .faq-item').hide();
    $('#faq-intro').show();

    $('#faq-menu a').click(function(event) {
      var target = $(this).data('target');
      $(this).parents('ul').find('li').removeClass('active');
      $(this).parent().addClass('active');
      $('#faq-panel .faq-item:visible').fadeOut(200, function() {
        $(target).fadeIn(200);
      });
      if ($(window).width() < 767) {
        $('html, body').animate({
          scrollTop: $('#faq-panel').offset().top - ($('.nav-background').height() + 15)
        }, 300);
      }
    });
  }

  var $background = $(".nav-background");

  function setDrawerOpen(bool) {
    if (bool) {
      $('#drawer-nav').toggleClass("is-open");
      $('.main').toggleClass("drawer-is-open");
      checkNavTransparency();
    } else {
      if ($('.main').hasClass("drawer-is-open")) {
        $('#drawer-nav').toggleClass("is-open");
        $('.main').toggleClass("drawer-is-open");
        checkNavTransparency();
      }
    }
  }

  function drawerNav() {
    $('#drawer-open').click(function(event) {
      event.preventDefault();
      setDrawerOpen(true);
    });

    $('.main').click(function() {
      setDrawerOpen(false);
    });
  }

  function scrollTransparentNav() {
    $(window).scroll(function() {
      checkNavTransparency();
    });
    $(window).resize(function() {
      checkNavTransparency();
    });
  }

  function checkNavTransparency() {
    var showBackground = true;
    if (window.scrollY < 200) {
      showBackground = false;
    }
    if ($('.main').hasClass("drawer-is-open")) {
      showBackground = false;
    }

    if ($(window).width() < 768) {
      showBackground = true;
    }
    setNavTransparency(showBackground);
  }


  function setNavTransparency(show) {
    if (show) {
      $background.fadeIn();
      $('.drawer-nav').addClass("with-background");
    } else {
      $background.fadeOut();
      $('.drawer-nav').removeClass("with-background");
    }
  }

  if($background) {
    drawerNav();
    checkNavTransparency();
    scrollTransparentNav();
  }

  function slideDropdownMenu() {
    $('#top-nav .dropdown').on('show.bs.dropdown', function(event) {
       $(this).find('.dropdown-menu').first().stop(true, true).slideDown(200);
    });
    $('#top-nav .dropdown').on('hide.bs.dropdown', function(event) {
      $(this).find('.dropdown-menu').first().stop(true, true).slideUp(200);
    });
  }

  function mobileButtonEffect() {
    $(document).bind('touchstart', function(event) {
      if ($(event.target).hasClass('btn')) {
        if ($(event.target).hasClass('activated')) {
          $('.btn').removeClass('activated');
        } else {
          $(event.target).addClass('activated');
        }
      }

      if ($(event.target).data('toggle') == 'collapse') {
        $(event.target).parent().find('.collapse').collapse('toggle');
      }

    });
  }

  function floatIfFilled(index, el) {
    if ($(el).val().length > 0) {
      $(el).parent().addClass('floating');
    }
  }

  function floatLabels() {
    $(document).on('focus', '.float-label input, .float-label select', function(event) {
      $(this).parent().addClass('floating').addClass('active');
    });

    $(document).on('focusout', '.float-label input, .float-label select', function(event) {
      $(this).parent().removeClass('active');
      if ($(this).val().length === 0) {
        $(this).parent().removeClass('floating');
      }
      $('.float-label input, .float-label select').each(floatIfFilled);
    });

    setTimeout(function() {
      $('.float-label input, .float-label select').each(floatIfFilled);
    }, 500);
  }

  function initSlidingSignup() {

    var finished = true;
    var forceClosed = false;
    var forceOpened = false;
    var aTop;
    var showSignup = false;
    var pixelsFromBottom = 200;
    var slideoutWidth = "-352px";

    function showSlidingSignup() {
      $('#bottom-slider').addClass("open");
      $('#bottom-slider').animate(
        {right:'0px'}, 
        {complete: function() {
          finished = true;
          showSignup = true;
        }
      });
    }

    function hideSlidingSignup() {
      $('#bottom-slider').removeClass("open");
      $('#bottom-slider').animate({right: slideoutWidth}, {complete: function() {
        finished = true;
        showSignup = false;
      }});
    }

    $(window).scroll(function(){
      aTop = $( document ).height() - ($(window).height() + pixelsFromBottom);

      if (finished && $(this).scrollTop() > aTop && !showSignup && !forceClosed) {
        finished = false;
        // slide out!
        showSlidingSignup();
      }
      if (finished && $(this).scrollTop() < aTop && showSignup && !forceOpened) {
        finished = false;
        // slide in!
        hideSlidingSignup();
      }
    });

    $("#toggle-bottom-slider").click(function() {
      if (showSignup) {
        hideSlidingSignup();
        if (forceOpened) {
          forceOpened = false;
        }
        forceClosed = true;
      } else {
        showSlidingSignup();
        forceOpened = true;
        forceClosed = false;
      }
    });

    $('#close-bottom-slider').click(function() {
      hideSlidingSignup();
      forceClosed = true;
    });

  }

  faq();
  twitterFeeds();
  addClassToSelects();
  slideDropdownMenu();
  floatLabels();
  mobileButtonEffect();
  setCalendarHeight();

  initSlidingSignup();

  $(window).resize(function(event) {
    if ($(window).width() > 991) {
      setDrawerOpen(false);
    }
    setCalendarHeight();
  });


});
