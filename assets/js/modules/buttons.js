(function ($) {

  $(document).ready(() => {

    $(document).on('mouseenter', '.fixed-action-btn', function () {

      const $this = $(this);
      openFABMenu($this);
    });

    $(document).on('mouseleave', '.fixed-action-btn', function () {

      const $this = $(this);
      closeFABMenu($this);
    });

    $(document).on('click', '.fixed-action-btn > a', function () {

      const $this = $(this);
      const $menu = $this.parent();

      $menu.hasClass('active') ? openFABMenu($menu) : closeFABMenu($menu);

      if ($menu.hasClass('active')) {

        closeFABMenu($menu);
      } else {

        openFABMenu($menu);
      }
    });
  });

  $.fn.extend({
    openFAB() {

      openFABMenu($(this));
    },
    closeFAB() {

      closeFABMenu($(this));
    }
  });

  const openFABMenu = btn => {

    const fab = btn;
    if (!fab.hasClass('active')) {

      fab.addClass('active');
      const btnList = document.querySelectorAll('ul .btn-floating');
      btnList.forEach(el => {

        el.classList.add('shown');
      });
    }
  };

  const closeFABMenu = btn => {

    const fab = btn;

    fab.removeClass('active');
    const btnList = document.querySelectorAll('ul .btn-floating');
    btnList.forEach(el => {

      el.classList.remove('shown');
    });
  };

  $('.fixed-action-btn > .btn-floating').on('click', e => {

    e.preventDefault();
    toggleFABMenu($('.fixed-action-btn'));

    return false;
  });

  function toggleFABMenu(btn) {

    const elem = btn;

    if (elem.hasClass('active')) {

      closeFABMenu(elem);
    } else {

      openFABMenu(elem);
    }
  }
})(jQuery);