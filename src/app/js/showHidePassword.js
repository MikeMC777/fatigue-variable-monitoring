function showHidePassword(element) {
  $(`${element} a`).on('click', function(event) {
      event.preventDefault();
      if ($(`${element} input`).attr("type") == "text") {
          $(`${element} input`).attr('type', 'password');
          $(`${element} i`).addClass("fa-eye-slash");
          $(`${element} i`).removeClass("fa-eye");
      } else if ($(`${element} input`).attr("type") == "password") {
          $(`${element} input`).attr('type', 'text');
          $(`${element} i`).removeClass("fa-eye-slash");
          $(`${element} i`).addClass("fa-eye");
      }
  });
}
function showHidePasswordCustomer(element) {
      if ($(`${element} input`).attr("type") == "text") {
          $(`${element} input`).attr('type', 'password');
          $(`${element} i`).addClass("fa-eye-slash");
          $(`${element} i`).removeClass("fa-eye");
      } else if ($(`${element} input`).attr("type") == "password") {
          $(`${element} input`).attr('type', 'text');
          $(`${element} i`).removeClass("fa-eye-slash");
          $(`${element} i`).addClass("fa-eye");
      }
}


