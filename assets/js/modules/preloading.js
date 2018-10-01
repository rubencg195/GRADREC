$(document).ready(() => {

  $('body').attr('aria-busy', true);

  $('#preloader-markup').load('mdb-addons/preloader.html', () => {

    $(window).on('load', () => {

      $('#mdb-preloader').fadeOut('slow');
      $('body').removeAttr('aria-busy');
    });
  });
});