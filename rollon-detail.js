(function () {
  var page = document.querySelector('.detail-store-page[data-product-type="roll-on"]');
  if (!page) return;

  var params = new URLSearchParams(window.location.search);
  var productName = params.get('product');
  if (!productName) return;

  var gender = page.dataset.productGender;
  var genderLabel = gender === 'feminino' ? 'Feminino' : 'Masculino';
  var title = productName + ' - Roll-On ' + genderLabel;
  document.title = title + ' | Full Flow';

  document.querySelectorAll('.rollon-variants a').forEach(function (option) {
    var selected = new URL(option.href).searchParams.get('product') === productName;
    option.classList.toggle('selected', selected);
    if (selected) option.setAttribute('aria-current', 'page');
    else option.removeAttribute('aria-current');
  });
})();
