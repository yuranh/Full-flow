(function () {
  var catalog = window.fullflowCatalog;
  var products = catalog && catalog.products;
  var input = document.querySelector('.header-search input');
  var form = document.querySelector('.header-search');
  var panel = document.querySelector('.search-suggestions');
  if (!products || !input || !form || !panel) return;

  function normalize(value) {
    return String(value || '').toLocaleLowerCase('pt').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  }

  function isRollOnProduct(product) {
    var type = String(product && product.type || '').trim().toLowerCase();
    return type === 'roll-on' || type === 'rollon';
  }

  function searchUrl(term, extra) {
    var params = new URLSearchParams();
    if (term) params.set('q', term);
    Object.keys(extra || {}).forEach(function (key) {
      if (extra[key]) params.set(key, extra[key]);
    });
    return 'products.html' + (params.toString() ? '?' + params.toString() : '');
  }

  function formatPrice(price) {
    return new Intl.NumberFormat('pt-MZ', { useGrouping: true, maximumFractionDigits: 0 }).format(price);
  }

  function addSuggestion(list, label, kind, url) {
    var link = document.createElement('a');
    link.className = 'search-suggestion';
    link.href = url;
    var name = document.createElement('span');
    name.textContent = label;
    var description = document.createElement('small');
    description.textContent = kind;
    link.appendChild(name);
    link.appendChild(description);
    list.appendChild(link);
  }

  function render() {
    var term = input.value.trim();
    var normalizedTerm = normalize(term);
    var terms = normalizedTerm.split(/\s+/).filter(Boolean);
    var matches = term ? products.filter(function (product) {
      var content = normalize(product.searchText + ' ' + product.displayName + ' ' + product.brandId);
      return terms.every(function (word) { return content.indexOf(word) !== -1; });
    }) : products.slice(0, 3);
    var brandMatches = [];
    products.forEach(function (product) {
      var matchBrand = normalizedTerm && (normalize(product.brand).indexOf(normalizedTerm) !== -1
        || normalize(product.brandId).replace(/-/g, ' ').indexOf(normalizedTerm) !== -1);
      if (matchBrand && !brandMatches.some(function (brand) { return brand.id === product.brandId; })) {
        brandMatches.push({ id: product.brandId, label: product.brand });
      }
    });

    panel.replaceChildren();
    var content = document.createElement('div');
    content.className = 'search-suggestions-inner';
    var suggestions = document.createElement('section');
    var suggestionsHeading = document.createElement('h2');
    suggestionsHeading.textContent = 'Sugestões';
    suggestions.appendChild(suggestionsHeading);
    var suggestionList = document.createElement('div');
    suggestionList.className = 'search-suggestion-list';
    brandMatches.slice(0, 3).forEach(function (brand) {
      addSuggestion(suggestionList, brand.label, 'Marca', searchUrl(term, { brand: brand.id }));
    });
    [
      { name: 'Femininos', key: 'feminino' },
      { name: 'Masculinos', key: 'masculino' }
    ].forEach(function (category) {
      addSuggestion(suggestionList, category.name, 'Categoria', searchUrl(term, { category: category.key }));
    });
    suggestions.appendChild(suggestionList);

    var resultSection = document.createElement('section');
    var resultHeading = document.createElement('h2');
    resultHeading.textContent = 'Produtos relacionados';
    resultSection.appendChild(resultHeading);
    var resultGrid = document.createElement('div');
    resultGrid.className = 'search-result-grid';
    if (!matches.length) {
      var empty = document.createElement('div');
      empty.className = 'search-no-results';
      var emptyTitle = document.createElement('strong');
      emptyTitle.textContent = 'Nenhum produto encontrado';
      var emptyText = document.createElement('p');
      emptyText.textContent = 'Não encontramos perfumes para "' + term + '".';
      empty.appendChild(emptyTitle);
      empty.appendChild(emptyText);
      resultGrid.appendChild(empty);
    } else {
      matches.slice(0, 6).forEach(function (product) {
        var card = document.createElement('a');
        card.className = 'search-result-card';
        card.href = product.detailUrl;
        var image = document.createElement('img');
        image.src = product.image;
        image.alt = product.displayName;
        image.loading = 'lazy';
        var name = document.createElement('strong');
        name.textContent = product.displayName;
        var details = document.createElement('span');
        var isRollOn = isRollOnProduct(product);
        details.textContent = isRollOn
          ? (product.size ? 'Roll-On · ' + product.size : 'Roll-On · Tamanho a confirmar')
          : (product.size ? 'Perfume · ' + product.size : 'Perfume · Tamanho a confirmar');
        var price = document.createElement('span');
        price.className = 'search-result-price';
        price.textContent = product.price === null
          ? 'Preço sob consulta'
          : isRollOn
            ? product.price.toFixed(2).replace('.', ',') + ' ' + product.currency
            : formatPrice(product.price) + ' ' + product.currency;
        card.appendChild(image);
        card.appendChild(name);
        card.appendChild(details);
        card.appendChild(price);
        resultGrid.appendChild(card);
      });
    }
    resultSection.appendChild(resultGrid);
    content.appendChild(suggestions);
    content.appendChild(resultSection);
    panel.appendChild(content);

    var viewAll = document.createElement('a');
    viewAll.className = 'search-view-all';
    viewAll.href = term && matches.length ? searchUrl(term) : 'products.html';
    viewAll.textContent = term && matches.length ? 'Ver todos os resultados →' : 'Ver todos os produtos';
    panel.appendChild(viewAll);
    panel.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    window.location.href = searchUrl(input.value.trim());
  });
  input.addEventListener('input', render);
  input.addEventListener('focus', render);
  input.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      panel.hidden = true;
      input.setAttribute('aria-expanded', 'false');
      input.blur();
    }
  });
  document.addEventListener('click', function (event) {
    if (!panel.contains(event.target) && !form.contains(event.target)) {
      panel.hidden = true;
      input.setAttribute('aria-expanded', 'false');
    }
  });
  document.querySelectorAll('.utility-links a[aria-label="Pesquisar"]').forEach(function (trigger) {
    trigger.addEventListener('click', function (event) {
      event.preventDefault();
      input.focus();
    });
  });

  var query = new URLSearchParams(window.location.search).get('q');
  if (query) input.value = query;
})();
