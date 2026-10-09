(function () {
  function normalizeProductType(value) {
    var type = String(value || '').trim().toLowerCase();
    if (!type) return 'eau-de-parfum';
    var normalized = type.replace(/\s+/g, '-');
    if (normalized === 'rollon' || normalized === 'roll-on' || normalized === 'roll-on-feminino' || normalized === 'roll-on-masculino') return 'roll-on';
    if (normalized === 'eau-de-parfum' || normalized === 'eau-de-parfums' || normalized === 'perfume' || normalized === 'edp') return 'eau-de-parfum';
    return normalized;
  }

  function readCartSafely() {
    try {
      var savedCart = window.localStorage.getItem('fullflow_cart_items');
      var parsedCart = savedCart ? JSON.parse(savedCart) : [];
      if (!Array.isArray(parsedCart)) throw new Error('O carrinho guardado tem um formato inválido.');
      return parsedCart;
    } catch (error) {
      console.error('Não foi possível ler o carrinho.', error);
      return null;
    }
  }

  var page = document.querySelector('.detail-store-page');
  if (!page) return;

  var gender = page.dataset.productGender;
  var isFemale = gender === 'feminino';
  var isRollOn = normalizeProductType(page.dataset.productType) === 'roll-on';
  var currency = 'MT';
  var defaultImage = page.dataset.productImageSource || (isFemale ? 'lady.jpeg' : 'mascu.jpeg');
  var defaultName = isRollOn
    ? (isFemale ? 'Paco Rabanne - Olympea' : 'Azzaro - Wanted')
    : (isFemale ? 'FULL FLOW FEMME' : 'FULL FLOW HOMME');
  var params = new URLSearchParams(window.location.search);
  var name = params.get('product') || defaultName;
  var catalogProducts = window.fullflowCatalog ? window.fullflowCatalog.products : [];
  var catalogProduct = catalogProducts.filter(function (product) {
    var safeProductType = normalizeProductType(product.type);
    var sameGender = product.gender === gender;
    var sameType = safeProductType === (isRollOn ? 'roll-on' : 'eau-de-parfum');
    var normalizedName = name.toLocaleLowerCase('pt');
    return sameGender && sameType &&
      ((product.name || '').toLocaleLowerCase('pt') === normalizedName ||
       (product.displayName || '').toLocaleLowerCase('pt') === normalizedName);
  })[0];
  var brand = catalogProduct ? catalogProduct.brand : (params.get('brand') || 'Full Flow');
  var priceValue = Number(params.get('price'));
  var queryPrice = Number.isFinite(priceValue) && priceValue > 0 ? priceValue : null;
  var price = catalogProduct
    ? catalogProduct.price
    : (queryPrice !== null ? queryPrice : (isRollOn ? 27 : null));
  var requestedImage = catalogProduct ? catalogProduct.image : (params.get('image') || '');
  var imageSource = /^[A-Za-z0-9_-]+\.(?:png|jpe?g|webp)$/i.test(requestedImage)
    ? requestedImage
    : defaultImage;
  var requestedSize = catalogProduct ? catalogProduct.size : (params.get('size') || '');
  var sizeMatch = requestedSize.match(/^(\d+(?:[.,]\d+)?)\s*ml$/i);
  var size = sizeMatch ? sizeMatch[1].replace(',', '.') + ' ml' : '';
  var sizeLabel = size || 'Tamanho a confirmar';
  var formatPrice = function (value) {
    return currency === 'MT' && isRollOn
      ? Number(value).toFixed(2).replace('.', ',') + ' MT'
      : String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' MT';
  };

  document.title = name + ' | Full Flow';
  document.querySelectorAll('[data-product-name]').forEach(function (element) {
    element.textContent = name;
  });
  var brandLink = document.querySelector('[data-product-brand]');
  brandLink.textContent = brand;
  brandLink.href = 'products.html#categories';
  var image = document.querySelector('[data-product-image]');
  image.src = imageSource;
  image.alt = (isRollOn ? 'Roll-On ' : 'Perfume ') + (isFemale ? 'feminino' : 'masculino') + ' Full Flow - ' + name;
  document.querySelector('[data-product-price]').textContent = price === null ? 'Preço sob consulta' : formatPrice(price);
  document.querySelector('[data-product-size]').textContent = sizeLabel;
  var addToCartButton = document.querySelector('.add-to-cart');
  var buyNowButton = document.querySelector('.buy-now');
  var priceEnquiry = document.querySelector('[data-price-enquiry]');
  if (price === null) {
    addToCartButton.disabled = true;
    buyNowButton.disabled = true;
    priceEnquiry.hidden = false;
    priceEnquiry.href = 'https://wa.me/27656134719?text=' + encodeURIComponent(
      'Olá, equipa da Full Flow! Gostaria de confirmar o preço e a disponibilidade de ' + name + '.'
    );
  }
  document.querySelector('[data-product-description]').textContent =
    (isRollOn ? 'Roll-On ' : 'Perfume ') + (isFemale ? 'feminino' : 'masculino') +
    ' Full Flow ' + (isRollOn ? '' : 'perfume, ') + name +
    ', com fragrância marcante para acompanhar o seu dia.';

  var featurePanel = document.getElementById('panel-features');
  featurePanel.querySelector('p').textContent =
    'Categoria: ' + (isRollOn ? 'Roll-On ' : 'Perfume ') + (isFemale ? 'feminino' : 'masculino') +
    (isRollOn ? ' · Volume: ' + sizeLabel + '.' : ' · Concentração: perfume · Volume: ' + sizeLabel + '.');

  var thumbs = Array.prototype.slice.call(document.querySelectorAll('.product-thumbnail'));
  thumbs.forEach(function (button, index) {
    var thumbImage = button.querySelector('img');
    thumbImage.src = imageSource;
    thumbImage.alt = '';
    button.addEventListener('click', function () {
      thumbs.forEach(function (candidate) {
        candidate.classList.toggle('active', candidate === button);
      });
      image.style.objectPosition = ['center 56%', 'center 72%', 'center 88%'][index];
    });
  });

  var quantity = 1;
  var quantityOutput = document.querySelector('[data-quantity]');
  document.querySelectorAll('[data-quantity-step]').forEach(function (button) {
    button.addEventListener('click', function () {
      quantity = Math.max(1, quantity + Number(button.dataset.quantityStep));
      quantityOutput.value = String(quantity);
      quantityOutput.textContent = String(quantity);
    });
  });

  var feedback = document.querySelector('.cart-feedback');
  addToCartButton.addEventListener('click', function () {
    var cart = readCartSafely();
    if (!cart) {
      feedback.textContent = 'Não foi possível ler o carrinho. Tente novamente.';
      return;
    }

    cart.forEach(function (item) {
      item.currency = 'MT';
    });

    var cartItem = cart.find(function (item) {
      var itemProductType = normalizeProductType(item.productType || 'eau-de-parfum');
      return item.name === name && item.size === sizeLabel &&
        item.gender === gender && (item.currency || 'MT') === currency &&
        itemProductType === (isRollOn ? 'roll-on' : 'eau-de-parfum');
    });
    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cart.push({
        name: name,
        brand: brand,
        image: imageSource,
        price: price,
        currency: currency,
        size: sizeLabel,
        quantity: quantity,
        gender: gender,
        productType: isRollOn ? 'roll-on' : 'eau-de-parfum'
      });
    }

    try {
      window.localStorage.setItem('fullflow_cart_items', JSON.stringify(cart));
      feedback.textContent = name + ' adicionado ao carrinho.';
      window.dispatchEvent(new Event('fullflow:cart-updated'));
    } catch (error) {
      console.error('Não foi possível guardar o produto no carrinho.', error);
      feedback.textContent = 'Não foi possível guardar o produto. Verifique o espaço disponível.';
    }
  });

  buyNowButton.addEventListener('click', function () {
    var message = 'Olá, equipa da Full Flow! Quero encomendar ' + name + ' ('
      + formatPrice(price) + '), quantidade: ' + quantity + ', total: '
      + formatPrice(price * quantity) +
      '. Por favor, confirme disponibilidade, entrega e pagamento.';
    window.location.href = 'https://wa.me/27656134719?text=' + encodeURIComponent(message);
  });

  var tabs = Array.prototype.slice.call(document.querySelectorAll('.product-tab'));
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (candidate) {
        var selected = candidate === tab;
        candidate.classList.toggle('active', selected);
        candidate.setAttribute('aria-selected', String(selected));
        document.getElementById(candidate.getAttribute('aria-controls')).hidden = !selected;
      });
    });
  });

  var relatedProducts = isRollOn
    ? catalogProducts.filter(function (product) {
      return product.gender === gender && normalizeProductType(product.type) === 'roll-on';
    }).map(function (product) {
      return { name: product.displayName, brand: product.brand };
    })
    : (isFemale
    ? [
      { name: 'Armani - SI', brand: 'Armani' },
      { name: 'Carolina Herrera - Good Girl', brand: 'Carolina Herrera' },
      { name: "Christian Dior - J'adore", brand: 'Christian Dior' },
      { name: 'YSL - Black Opium', brand: 'YSL' },
      { name: 'Versace - Crystal Noir', brand: 'Versace' }
    ]
    : [
      { name: 'Armani - Acqua di Gio', brand: 'Armani' },
      { name: 'Christian Dior - Sauvage', brand: 'Christian Dior' },
      { name: 'Paco Rabanne - 1 Million', brand: 'Paco Rabanne' },
      { name: 'Versace - Eros', brand: 'Versace' },
      { name: 'Tom Ford - Oud Wood', brand: 'Tom Ford' }
    ]);
  var relatedGrid = document.querySelector('[data-related-products]');
  relatedProducts.filter(function (product) { return product.name !== name; }).slice(0, 4).forEach(function (product) {
    var relatedProduct = catalogProducts.filter(function (candidate) {
      var sameGender = candidate.gender === gender;
      var sameType = normalizeProductType(candidate.type) === (isRollOn ? 'roll-on' : 'eau-de-parfum');
      var normalizedName = product.name.toLocaleLowerCase('pt');
      return sameGender && sameType &&
        ((candidate.name || '').toLocaleLowerCase('pt') === normalizedName ||
         (candidate.displayName || '').toLocaleLowerCase('pt') === normalizedName);
    })[0];
    var relatedParams = new URLSearchParams({
      product: product.name,
      brand: product.brand,
      image: imageSource
    });
    var detailUrl = relatedProduct
      ? relatedProduct.detailUrl
      : ((isRollOn
      ? (isFemale ? 'product-detail-rollon-ladies.html' : 'product-detail-rollon-men.html')
      : (isFemale ? 'product-detail-ladies-edp.html' : 'product-detail.html'))
      + '?' + relatedParams.toString());
    var card = document.createElement('article');
    card.className = 'related-product-card';
    var link = document.createElement('a');
    link.href = detailUrl;
    var productImage = document.createElement('img');
    productImage.src = imageSource;
    productImage.alt = (isRollOn ? 'Roll-On ' : 'Perfume ') + (isFemale ? 'feminino' : 'masculino') + ' Full Flow';
    productImage.loading = 'lazy';
    var title = document.createElement('strong');
    title.textContent = product.name;
    var priceLabel = document.createElement('span');
    priceLabel.textContent = relatedProduct && relatedProduct.price !== null
      ? formatPrice(relatedProduct.price)
      : 'Preço sob consulta';
    link.appendChild(productImage);
    link.appendChild(title);
    link.appendChild(priceLabel);
    card.appendChild(link);
    relatedGrid.appendChild(card);
  });

  var wishlist = document.querySelector('.product-wishlist');
  wishlist.addEventListener('click', function () {
    wishlist.setAttribute('aria-pressed', wishlist.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
  });
})();
