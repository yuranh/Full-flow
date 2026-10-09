(function () {
  var LIKES_KEY = 'fullflow_likes';

  function readLikes() {
    try {
      var raw = localStorage.getItem(LIKES_KEY);
      var likes = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(likes) || likes.some(function (like) {
        return !like || typeof like !== 'object';
      })) throw new Error('Os favoritos guardados não têm um formato válido.');
      return likes;
    } catch (error) {
      console.error('Não foi possível ler os favoritos guardados.', error);
      return null;
    }
  }

  function saveLikes(likes) {
    try {
      localStorage.setItem(LIKES_KEY, JSON.stringify(likes));
      return true;
    } catch (error) {
      console.error('Não foi possível guardar os favoritos.', error);
      alert('Não foi possível guardar os favoritos neste navegador.');
      return false;
    }
  }

  function getPageName() {
    return window.location.pathname.split('/').pop() || 'index.html';
  }

  function productFromButton(button) {
    var card = button.closest('.item');
    if (card) {
      var name = card.querySelector('.item-link').textContent.trim();
      var brand = card.dataset.brandLabel || card.dataset.brand;
      return {
        id: [card.dataset.category, card.dataset.productType, brand, name]
          .join(':').toLocaleLowerCase('pt'),
        name: name,
        brand: brand,
        category: card.dataset.category,
        page: getPageName()
      };
    }

    var detail = button.closest('.detail-store-page');
    if (!detail) return null;
    var name = detail.querySelector('[data-product-name]').textContent.trim();
    var brandElement = detail.querySelector('[data-product-brand]');
    var brand = brandElement ? brandElement.textContent.trim() : '';
    return {
      id: [detail.dataset.productGender, detail.dataset.productType || 'eau-de-parfum', brand, name]
        .join(':').toLocaleLowerCase('pt'),
      name: name,
      brand: brand,
      category: detail.dataset.productGender || '',
      page: getPageName()
    };
  }

  function setProductButton(button, selected) {
    button.classList.toggle('liked', selected);
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(selected));
    button.setAttribute('aria-label', selected ? 'Remover dos favoritos' : 'Adicionar aos favoritos');
    if (button.classList.contains('product-favorite') || button.classList.contains('product-wishlist')) {
      button.textContent = selected ? '♥' : '♡';
    }
  }

  function setPageButton(button, selected) {
    button.classList.toggle('liked', selected);
    button.setAttribute('aria-pressed', String(selected));
    button.setAttribute('aria-label', selected ? 'Remover esta página dos favoritos' : 'Adicionar esta página aos favoritos');
    button.title = selected ? 'Remover esta página dos favoritos' : 'Adicionar esta página aos favoritos';
  }

  function hasLike(likes, id) {
    return likes.some(function (like) { return like.id === id; });
  }

  function updateButton(button) {
    var likes = readLikes();
    if (!likes) return;
    if (button.matches('.product-favorite, .product-wishlist')) {
      var product = productFromButton(button);
      if (product) setProductButton(button, hasLike(likes, product.id));
      return;
    }

    var pageId = 'page:' + getPageName();
    setPageButton(button, hasLike(likes, pageId));
  }

  function toggleLike(button) {
    var likes = readLikes();
    if (!likes) {
      alert('Não foi possível ler os favoritos guardados neste navegador.');
      return;
    }

    var isProduct = button.matches('.product-favorite, .product-wishlist');
    var product = isProduct ? productFromButton(button) : null;
    if (isProduct && !product) return;
    var id = isProduct ? product.id : 'page:' + getPageName();
    var index = likes.findIndex(function (like) { return like.id === id; });
    var selected = index === -1;

    if (selected) {
      likes.push({
        id: id,
        type: isProduct ? 'product' : 'page',
        name: isProduct ? product.name : document.title,
        brand: isProduct ? product.brand : '',
        category: isProduct ? product.category : '',
        page: isProduct ? product.page : getPageName(),
        at: new Date().toISOString()
      });
    } else {
      likes.splice(index, 1);
    }

    if (saveLikes(likes)) {
      document.querySelectorAll('.product-favorite, .product-wishlist, .heart-icon, [data-like-trigger]')
        .forEach(updateButton);
    }
  }

  document.addEventListener('click', function (event) {
    var button = event.target.closest('.product-favorite, .product-wishlist, .heart-icon, [data-like-trigger]');
    if (!button) return;
    event.preventDefault();
    toggleLike(button);
  });

  document.addEventListener('keydown', function (event) {
    var button = event.target.closest('.heart-icon, [data-like-trigger]');
    if (button && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      toggleLike(button);
    }
  });

  document.querySelectorAll('.product-favorite, .product-wishlist, .heart-icon, [data-like-trigger]')
    .forEach(updateButton);

  var authLinks = document.querySelectorAll('[data-auth-trigger]');
  authLinks.forEach(function (link) {
    link.textContent = 'Conta';
    link.href = 'login.html';
    link.title = 'Contas de cliente ainda não estão disponíveis';
  });

  try {
    localStorage.removeItem('fullflow_auth_user');
  } catch (error) {
    console.error('Não foi possível limpar a sessão simulada guardada anteriormente.', error);
  }

  window.addEventListener('storage', function (event) {
    if (event.key === LIKES_KEY) {
      document.querySelectorAll('.product-favorite, .product-wishlist, .heart-icon, [data-like-trigger]')
        .forEach(updateButton);
    }
  });
})();
