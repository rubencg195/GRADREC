(function ($) {

  $.fn.collapsible = function (options) {

    const defaults = {
      accordion: undefined
    };

    options = $.extend(defaults, options);

    function accordionOpen($collapsible, object) {

      $panelHeaders = $collapsible.find('> li > .collapsible-header');
      if (object.hasClass('active')) {

        object.parent().addClass('active');
      } else {

        object.parent().removeClass('active');
      }

      if (object.parent().hasClass('active')) {

        object.siblings('.collapsible-body').stop(true, false).slideDown({
          duration: 350,
          easing: 'easeOutQuart',
          queue: false,
          complete() {

            $(this).css('height', '');
          }
        });
      } else {

        object.siblings('.collapsible-body').stop(true, false).slideUp({
          duration: 350,
          easing: 'easeOutQuart',
          queue: false,
          complete() {
            $(this).css('height', '');
          }
        });
      }

      $panelHeaders.not(object).removeClass('active').parent().removeClass('active');
      $panelHeaders.not(object).parent().children('.collapsible-body').stop(true, false).slideUp({
        duration: 350,
        easing: 'easeOutQuart',
        queue: false,
        complete() {
          $(this).css('height', '');
        }
      });
    }

    function expandableOpen(object) {

      if (object.hasClass('active')) {

        object.parent().addClass('active');
      } else {

        object.parent().removeClass('active');
      }

      if (object.parent().hasClass('active')) {

        object.siblings('.collapsible-body').stop(true, false).slideDown({
          duration: 350,
          easing: 'easeOutQuart',
          queue: false,
          complete() {
            $(this).css('height', '');
          }
        });
      } else {

        object.siblings('.collapsible-body').stop(true, false).slideUp({
          duration: 350,
          easing: 'easeOutQuart',
          queue: false,
          complete() {
            $(this).css('height', '');
          }
        });
      }
    }

    function isChildrenOfPanelHeader(object) {

      const panelHeader = getPanelHeader(object);
      return panelHeader.length > 0;
    }

    function getPanelHeader(object) {

      return object.closest('li > .collapsible-header');
    }

    return this.each(function () {

      const $this = $(this);

      let $panelHeaders = $(this).find('> li > .collapsible-header');

      const collapsibleType = $this.data('collapsible');

      // Turn off any existing event handlers
      $this.off('click.collapse', '.collapsible-header');
      $panelHeaders.off('click.collapse');

      if (options.accordion || collapsibleType === 'accordion' || collapsibleType === undefined) {

        $panelHeaders = $this.find('> li > .collapsible-header');
        $panelHeaders.on('click.collapse', e => {

          let element = $(e.target);

          if (isChildrenOfPanelHeader(element)) {

            element = getPanelHeader(element);
          }

          element.toggleClass('active');
          accordionOpen($this, element);
        });

        accordionOpen($this, $panelHeaders.filter('.active').first());
      } else {

        $panelHeaders.each(function () {

          $(this).on('click.collapse', e => {

            let element = $(e.target);
            if (isChildrenOfPanelHeader(element)) {

              element = getPanelHeader(element);
            }
            element.toggleClass('active');
            expandableOpen(element);
          });

          if ($(this).hasClass('active')) {

            expandableOpen($(this));
          }
        });
      }
    });
  };

  $('.collapsible').collapsible();
})(jQuery);