(function ($) {

  $(document).on('click.card', '.card', function (e) {

    const $reveal = $(this).find('.card-reveal');

    if ($reveal.length) {

      const $clicked = $(e.target);
      const isTitle = $clicked.is('.card-reveal .card-title');
      const isTitleIcon = $clicked.is('.card-reveal .card-title i');
      const isActivator = $clicked.is('.card .activator');
      const isActivatorIcon = $clicked.is('.card .activator i');

      // if (isTitle || isTitleIcon) {

      //   $reveal.removeClass('show');
      // } else if (isActivator || isActivatorIcon) {

      //   $reveal.addClass('show');
      // }
      if (isTitle || isTitleIcon) {

        // down
        $(this).find('.card-reveal').velocity({
          translateY: 0
        }, {
          duration: 225,
          queue: false,
          easing: 'easeInOutQuad',
          complete: function complete() {
            $(this).css({
              display: 'none'
            });
          }
        });
      } else if (isActivator || isActivatorIcon) {

        // up
        $(this).find('.card-reveal').css({
          display: 'block'
        }).velocity('stop', false).velocity({
          translateY: '-100%'
        }, {
          duration: 300,
          queue: false,
          easing: 'easeInOutQuad'
        });
      }
    }
  });

  $('.rotate-btn').on('click', function () {

    const cardId = $(this).attr('data-card');
    $(`#${cardId}`).toggleClass('flipped');
  });

  $('.card-share > a').on('click', function (e) {

    e.preventDefault();

    $(this).toggleClass('share-expanded').parent().find('div').toggleClass('social-reveal-active');
  });
})(jQuery);