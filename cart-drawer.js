(function () {
  var cartKey = 'fullflow_cart_items';
  var deliveryFee = 250;
  var triggers = Array.prototype.slice.call(document.querySelectorAll(
    '[data-cart-toggle], a[aria-label="Ver produtos"]'
  ));
  if (!triggers.length) return;

  var overlay = document.createElement('div');
  overlay.className = 'cart-drawer-overlay';
  overlay.hidden = true;

  var drawer = document.createElement('aside');
  drawer.className = 'cart-drawer';
  drawer.hidden = true;
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-modal', 'true');
  drawer.setAttribute('aria-labelledby', 'cart-drawer-title');
  drawer.innerHTML =
    '<div class="cart-drawer-header">' +
      '<h2 id="cart-drawer-title">Seu Carrinho</h2>' +
      '<button class="cart-drawer-close" type="button" aria-label="Fechar carrinho">×</button>' +
    '</div>' +
    '<p class="cart-drawer-error" role="alert" hidden></p>' +
    '<div class="cart-drawer-items" aria-live="polite"></div>' +
    '<div class="cart-drawer-summary">' +
      '<div><span>Subtotal</span><strong data-cart-subtotal>0 MT</strong></div>' +
      '<div><span>Entrega</span><strong data-cart-delivery>0 MT</strong></div>' +
      '<div class="cart-drawer-total"><span>Total</span><strong data-cart-total>0 MT</strong></div>' +
      '<p class="cart-drawer-note">A encomenda é enviada pelo WhatsApp. A equipa confirma disponibilidade, entrega e pagamento antes da conclusão.</p>' +
      '<button class="cart-checkout" type="button">Finalizar Compra</button>' +
      '<button class="cart-continue" type="button">Continuar comprando</button>' +
    '</div>';

  document.body.appendChild(overlay);
  document.body.appendChild(drawer);

  var itemsContainer = drawer.querySelector('.cart-drawer-items');
  var errorMessage = drawer.querySelector('.cart-drawer-error');
  var previousFocus = null;
  var formatPrice = function (value) {
    return new Intl.NumberFormat('pt-MZ', { maximumFractionDigits: 2 }).format(Number(value)) + ' MT';
  };
  var formatTotals = function (totals) {
    return Object.keys(totals).filter(function (currency) {
      return totals[currency] > 0;
    }).map(function (currency) {
      return formatPrice(totals[currency]);
    }).join(' + ') || '0 MT';
  };
  var getCart = function () {
    var savedCart;
    try {
      savedCart = window.localStorage.getItem(cartKey);
    } catch (error) {
      console.error('Não foi possível ler os itens do carrinho.', error);
      throw new Error('Não foi possível aceder ao carrinho neste navegador.');
    }
    if (!savedCart) return [];

    var cart;
    try {
      cart = JSON.parse(savedCart);
    } catch (error) {
      console.error('Os dados guardados no carrinho não são válidos.', error);
      throw new Error('Os dados do carrinho estão inválidos. Atualize a página ou contacte o atendimento.');
    }
    if (!Array.isArray(cart)) throw new Error('Os dados do carrinho estão inválidos.');

    cart.forEach(function (item) {
      if (!item || typeof item.name !== 'string' || !item.name ||
          !Number.isFinite(Number(item.price)) || Number(item.price) <= 0 ||
          !Number.isInteger(Number(item.quantity)) || Number(item.quantity) < 1) {
        throw new Error('Um produto guardado no carrinho está inválido.');
      }
      item.price = Number(item.price);
      item.quantity = Number(item.quantity);
      item.currency = 'MT';
    });
    return cart;
  };
  var updateCartCount = function () {
    try {
      var count = getCart().reduce(function (total, item) {
        return total + item.quantity;
      }, 0);
      triggers.forEach(function (trigger) {
        var badge = trigger.querySelector('.cart-count-badge');
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'cart-count-badge';
          badge.setAttribute('aria-hidden', 'true');
          trigger.appendChild(badge);
        }
        badge.textContent = count > 99 ? '99+' : String(count);
        badge.hidden = count === 0;
        trigger.setAttribute('aria-label', count > 0
          ? 'Abrir carrinho, ' + count + (count === 1 ? ' produto' : ' produtos')
          : 'Abrir carrinho');
      });
    } catch (error) {
      console.error('Não foi possível atualizar a quantidade de produtos no carrinho.', error);
      triggers.forEach(function (trigger) {
        var badge = trigger.querySelector('.cart-count-badge');
        if (badge) badge.hidden = true;
        trigger.setAttribute('aria-label', 'Carrinho indisponível');
      });
    }
  };
  var saveCart = function (cart) {
    try {
      window.localStorage.setItem(cartKey, JSON.stringify(cart));
    } catch (error) {
      console.error('Não foi possível guardar os itens do carrinho.', error);
      errorMessage.textContent = 'Não foi possível guardar as alterações. Verifique o espaço disponível.';
      errorMessage.hidden = false;
      return false;
    }
    errorMessage.hidden = true;
    window.dispatchEvent(new Event('fullflow:cart-updated'));
    return true;
  };
  var showError = function (error) {
    console.error('Não foi possível apresentar o carrinho.', error);
    errorMessage.textContent = error.message || 'Não foi possível carregar o carrinho.';
    errorMessage.hidden = false;
    itemsContainer.replaceChildren();
    updateSummary({});
  };
  var updateSummary = function (subtotals) {
    var totals = Object.assign({}, subtotals);
    var delivery = Object.keys(subtotals).some(function (currency) { return subtotals[currency] > 0; })
      ? deliveryFee
      : 0;
    totals.MT = (totals.MT || 0) + delivery;
    drawer.querySelector('[data-cart-subtotal]').textContent = formatTotals(subtotals);
    drawer.querySelector('[data-cart-delivery]').textContent = formatPrice(delivery);
    drawer.querySelector('[data-cart-total]').textContent = formatTotals(totals);
  };
  var makeCartItem = function (item, index) {
    var row = document.createElement('article');
    row.className = 'cart-item';
    var image = document.createElement('img');
    image.className = 'cart-item-image';
    image.src = typeof item.image === 'string' && /^[A-Za-z0-9_-]+\.(?:png|jpe?g|webp)$/i.test(item.image)
      ? item.image
      : (item.gender === 'masculino' ? 'mascu.jpeg' : 'lady.jpeg');
    image.alt = '';
    image.loading = 'lazy';

    var details = document.createElement('div');
    details.className = 'cart-item-details';
    var name = document.createElement('strong');
    name.className = 'cart-item-name';
    name.textContent = item.name;
    var size = document.createElement('span');
    size.className = 'cart-item-size';
    size.textContent = item.size || 'Tamanho a confirmar';
    var quantity = document.createElement('div');
    quantity.className = 'cart-item-quantity';
    quantity.setAttribute('aria-label', 'Quantidade de ' + item.name);
    var decrease = document.createElement('button');
    decrease.type = 'button';
    decrease.dataset.cartAction = 'decrease';
    decrease.dataset.cartIndex = String(index);
    decrease.setAttribute('aria-label', 'Diminuir quantidade de ' + item.name);
    decrease.textContent = '−';
    var count = document.createElement('span');
    count.textContent = String(item.quantity);
    var increase = document.createElement('button');
    increase.type = 'button';
    increase.dataset.cartAction = 'increase';
    increase.dataset.cartIndex = String(index);
    increase.setAttribute('aria-label', 'Aumentar quantidade de ' + item.name);
    increase.textContent = '+';
    quantity.appendChild(decrease);
    quantity.appendChild(count);
    quantity.appendChild(increase);
    details.appendChild(name);
    details.appendChild(size);
    details.appendChild(quantity);

    var price = document.createElement('strong');
    price.className = 'cart-item-price';
    price.textContent = formatPrice(Number(item.price));
    var remove = document.createElement('button');
    remove.className = 'cart-item-remove';
    remove.type = 'button';
    remove.dataset.cartAction = 'remove';
    remove.dataset.cartIndex = String(index);
    remove.setAttribute('aria-label', 'Remover ' + item.name + ' do carrinho');
    remove.textContent = '×';

    row.appendChild(image);
    row.appendChild(details);
    row.appendChild(price);
    row.appendChild(remove);
    return row;
  };
  var render = function () {
    try {
      errorMessage.hidden = true;
      var cart = getCart();
      itemsContainer.replaceChildren();
      var subtotals = { MT: 0 };
      cart.forEach(function (item) {
        subtotals.MT += Number(item.price) * Number(item.quantity);
      });
      if (!cart.length) {
        var empty = document.createElement('p');
        empty.className = 'cart-empty';
        empty.textContent = 'O seu carrinho está vazio.';
        itemsContainer.appendChild(empty);
      } else {
        cart.forEach(function (item, index) {
          itemsContainer.appendChild(makeCartItem(item, index));
        });
      }
      updateSummary(subtotals);
    } catch (error) {
      showError(error);
    }
  };
  var open = function (trigger) {
    previousFocus = trigger;
    render();
    overlay.hidden = false;
    drawer.hidden = false;
    document.body.classList.add('cart-drawer-open');
    window.requestAnimationFrame(function () {
      overlay.classList.add('visible');
      drawer.classList.add('visible');
      drawer.querySelector('.cart-drawer-close').focus();
    });
  };
  var close = function () {
    overlay.classList.remove('visible');
    drawer.classList.remove('visible');
    document.body.classList.remove('cart-drawer-open');
    drawer.hidden = true;
    overlay.hidden = true;
    if (previousFocus) previousFocus.focus();
  };

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function (event) {
      event.preventDefault();
      open(trigger);
    });
    trigger.setAttribute('aria-haspopup', 'dialog');
  });
  updateCartCount();
  drawer.querySelector('.cart-drawer-close').addEventListener('click', close);
  drawer.querySelector('.cart-continue').addEventListener('click', close);
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', function (event) {
    if (!drawer.hidden && event.key === 'Escape') close();
  });
  itemsContainer.addEventListener('click', function (event) {
    var button = event.target.closest('[data-cart-action]');
    if (!button) return;
    var index = Number(button.dataset.cartIndex);
    try {
      var cart = getCart();
      var item = cart[index];
      if (!item) throw new Error('Este produto já não está no carrinho.');
      if (button.dataset.cartAction === 'increase') item.quantity = Number(item.quantity) + 1;
      if (button.dataset.cartAction === 'decrease') {
        item.quantity = Number(item.quantity) - 1;
        if (item.quantity < 1) cart.splice(index, 1);
      }
      if (button.dataset.cartAction === 'remove') cart.splice(index, 1);
      if (saveCart(cart)) render();
    } catch (error) {
      showError(error);
    }
  });
  drawer.querySelector('.cart-checkout').addEventListener('click', function () {
    try {
      var cart = getCart();
      if (!cart.length) {
        errorMessage.textContent = 'Adicione um produto antes de finalizar a compra.';
        errorMessage.hidden = false;
        return;
      }
      var subtotals = { MT: 0 };
      var lines = cart.map(function (item) {
        subtotals.MT += Number(item.price) * Number(item.quantity);
        return '- ' + item.name + ' (' + (item.size || 'Tamanho a confirmar') + ')\n' +
          '  Quantidade: ' + item.quantity + '\n' +
          '  Preço unitário: ' + formatPrice(Number(item.price)) + '\n' +
          '  Total do produto: ' + formatPrice(Number(item.price) * Number(item.quantity));
      });
      lines.unshift('Olá, equipa da Full Flow! Gostaria de fazer esta encomenda:');
      Object.keys(subtotals).forEach(function (currency) {
        lines.push('Subtotal dos produtos (' + currency + '): ' + formatPrice(subtotals[currency], currency));
      });
      lines.push('Entrega estimada: ' + formatPrice(deliveryFee));
      var totalByCurrency = Object.assign({}, subtotals);
      totalByCurrency.MT = (totalByCurrency.MT || 0) + deliveryFee;
      lines.push('Total estimado: ' + formatTotals(totalByCurrency));
      lines.push('A equipa confirmará disponibilidade, entrega e pagamento antes de concluir a encomenda.');
      window.location.href = 'https://wa.me/27656134719?text=' +
        encodeURIComponent(lines.join('\n'));
    } catch (error) {
      showError(error);
    }
  });
  window.addEventListener('storage', function (event) {
    if (event.key === cartKey) updateCartCount();
    if (event.key === cartKey && !drawer.hidden) render();
  });
  window.addEventListener('fullflow:cart-updated', function () {
    updateCartCount();
    if (!drawer.hidden) render();
  });
})();
