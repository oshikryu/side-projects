$(function() {
  $('.submit-form').on('click', function(evt) {
    alert('you submitted the form');
  });
  $('.toggle').on('click', function(evt) {
    $('.form-group').toggleClass('vertical-stack');
  });
});
