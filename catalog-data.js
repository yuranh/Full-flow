(function () {
  function normalizeProductType(value) {
    var type = String(value || '').trim().toLowerCase();
    if (!type) return 'eau-de-parfum';
    var normalized = type.replace(/\s+/g, '-');
    if (normalized === 'rollon' || normalized === 'roll-on' || normalized === 'roll-on-feminino' || normalized === 'roll-on-masculino') return 'roll-on';
    if (normalized === 'eau-de-parfum' || normalized === 'eau-de-parfums' || normalized === 'perfume' || normalized === 'edp') return 'eau-de-parfum';
    return normalized;
  }

  var female = [
    { name: 'Armani - SI', brand: 'armani', label: 'Armani' },
    { name: 'Ariana Grande - Mod Vanilla', brand: 'ariana-grande', label: 'Ariana Grande' },
    { name: 'Azzaro - Wanted Girl', brand: 'azzaro', label: 'Azzaro' },
    { name: 'Boujee Marshmallow', brand: 'boujee', label: 'Boujee' },
    { name: 'Carolina Herrera - Good Girl', brand: 'carolina-herrera', label: 'Carolina Herrera', size: '80ml', bestSeller: true },
    { name: 'Carolina Herrera - 212 VIP', brand: 'carolina-herrera', label: 'Carolina Herrera' },
    { name: 'Carolina Herrera - 212 VIP Rose', brand: 'carolina-herrera', label: 'Carolina Herrera', size: '80ml', bestSeller: true, newArrival: true },
    { name: 'Chanel Coco - Mademoiselle', brand: 'chanel', label: 'Chanel' },
    { name: "Christian Dior - J'adore", brand: 'dior', label: 'Christian Dior', displayName: "J'adore Dior", image: 'lady.jpeg', size: '100ml', bestSeller: true },
    { name: 'Christian Dior - Miss Dior', brand: 'dior', label: 'Christian Dior', image: 'lady.jpeg' },
    { name: 'D&G - The One', brand: 'dolce-gabbana', label: 'D&G' },
    { name: 'DKNY - Be Delicious', brand: 'dkny', label: 'DKNY' },
    { name: 'FULL FLOW Femme', brand: 'full-flow', label: 'Full Flow', image: 'full-flow-femme.png' },
    { name: "Givenchy - L'interdit", brand: 'givenchy', label: 'Givenchy' },
    { name: 'Gucci - Flora', brand: 'gucci', label: 'Gucci' },
    { name: 'Gucci - Guilty', brand: 'gucci', label: 'Gucci' },
    { name: 'Hugo Boss - The Scent for her', brand: 'hugo-boss', label: 'Hugo Boss' },
    { name: 'Jimmy Choo', brand: 'jimmy-choo', label: 'Jimmy Choo' },
    { name: 'JPG - Scandal', brand: 'jpg', label: 'JPG' },
    { name: 'Katy Perry - Mad Love', brand: 'katy-perry', label: 'Katy Perry' },
    { name: 'Kayali - Juicy Apple', brand: 'kayali', label: 'Kayali' },
    { name: 'Kayali - Yum Pistachio Gelato', brand: 'kayali', label: 'Kayali' },
    { name: 'Lancôme - La vie est belle', brand: 'lancome', label: 'Lancôme', size: '75ml', bestSeller: true },
    { name: 'Lancôme - La Nuit Trésor', brand: 'lancome', label: 'Lancôme' },
    { name: 'Mont Blanc - Signature', brand: 'montblanc', label: 'Mont Blanc' },
    { name: 'Narciso Rodriguez - For her', brand: 'narciso-rodriguez', label: 'Narciso Rodriguez' },
    { name: 'Paco Rabanne - Black XS', brand: 'paco-rabanne', label: 'Paco Rabanne' },
    { name: 'Paco Rabanne - Lady Million', brand: 'paco-rabanne', label: 'Paco Rabanne' },
    { name: 'Paco Rabanne - Olympea', brand: 'paco-rabanne', label: 'Paco Rabanne' },
    { name: 'Roberto Cavalli - Acqua', brand: 'roberto-cavalli', label: 'Roberto Cavalli' },
    { name: 'Rihanna - Riri', brand: 'rihanna', label: 'Rihanna' },
    { name: 'Tom Ford - Noir Pour Femme', brand: 'tom-ford', label: 'Tom Ford' },
    { name: 'Tom Ford - Velvet Orchid', brand: 'tom-ford', label: 'Tom Ford' },
    { name: 'Versace - Bright Crystal', brand: 'versace', label: 'Versace', displayName: 'Versace Bright Crystal', image: '12.png', size: '90ml', newArrival: true },
    { name: 'Versace - Crystal Noir', brand: 'versace', label: 'Versace' },
    { name: 'Versace - Dylan Blue Pour Femme', brand: 'versace', label: 'Versace' },
    { name: 'Versace - Dylan Purple Pour Femme', brand: 'versace', label: 'Versace' },
    { name: "Victoria's Secret - Bombshell", brand: 'victorias-secret', label: "Victoria's Secret" },
    { name: 'Xerjoff - Dama Bianca', brand: 'xerjoff', label: 'Xerjoff' },
    { name: 'YSL - Black Opium', brand: 'ysl', label: 'YSL', displayName: 'Black Opium YSL', image: 'lady.jpeg', size: '90ml', bestSeller: true, newArrival: true },
    { name: 'Paco Rabanne - Olympea', brand: 'paco-rabanne', label: 'Paco Rabanne', type: 'rollon', size: '50ml' },
    { name: 'Carolina Herrera - Good Girl', brand: 'carolina-herrera', label: 'Carolina Herrera', type: 'rollon', size: '50ml' },
    { name: 'Full Flow Femme', brand: 'full-flow', label: 'Full Flow', type: 'rollon' },
    { name: 'Azzaro - Wanted Girl', brand: 'azzaro', label: 'Azzaro', type: 'rollon' },
    { name: 'Ariana Grande - Mod Vanilla', brand: 'ariana-grande', label: 'Ariana Grande', type: 'rollon' }
  ];
  var male = [
    { name: 'Armani - Acqua di Gio', brand: 'armani', label: 'Armani', size: '50ml' },
    { name: 'Armani - Stronger with you', brand: 'armani', label: 'Armani' },
    { name: 'Azzaro - Chrome', brand: 'azzaro', label: 'Azzaro' },
    { name: 'Azzaro - Wanted', brand: 'azzaro', label: 'Azzaro' },
    { name: 'Baccarat - Rouge', brand: 'baccarat', label: 'Baccarat' },
    { name: 'Byredo - Monjave Ghost', brand: 'byredo', label: 'Byredo' },
    { name: 'Bvlgari - Man', brand: 'bvlgari', label: 'Bvlgari' },
    { name: 'Carolina Herrera - Bad Boy', brand: 'carolina-herrera', label: 'Carolina Herrera' },
    { name: 'Carolina Herrera - 212 VIP', brand: 'carolina-herrera', label: 'Carolina Herrera' },
    { name: 'Chanel - Bleau de Chanel', brand: 'chanel', label: 'Chanel' },
    { name: 'Creed - Aventus', brand: 'creed', label: 'Creed' },
    { name: 'Christian Dior - Sauvage', brand: 'dior', label: 'Christian Dior', displayName: 'Sauvage Dior', image: 'mascu.jpeg', size: '100ml' },
    { name: 'Christian Dior - Fahrenheit', brand: 'dior', label: 'Christian Dior' },
    { name: 'D&G - Light Blue', brand: 'dolce-gabbana', label: 'D&G' },
    { name: 'Diesel - Bad', brand: 'diesel', label: 'Diesel' },
    { name: 'Diesel - Only the Brave', brand: 'diesel', label: 'Diesel' },
    { name: 'Dunhil - Desire', brand: 'dunhill', label: 'Dunhill' },
    { name: 'FULL FLOW Homme', brand: 'full-flow', label: 'Full Flow', image: 'full-flow-homme.png', size: '50ml' },
    { name: 'Hugo Boss - Hugo', brand: 'hugo-boss', label: 'Hugo Boss' },
    { name: 'Hugo Boss - Orange', brand: 'hugo-boss', label: 'Hugo Boss' },
    { name: 'Hugo Boss - Original (BOTTLED)', brand: 'hugo-boss', label: 'Hugo Boss' },
    { name: "Issey Miyake - L'Eau D'Issey", brand: 'issey-miyake', label: 'Issey Miyake' },
    { name: 'JPG - Scandal for Men', brand: 'jpg', label: 'JPG' },
    { name: 'Lacoste - Essential', brand: 'lacoste', label: 'Lacoste' },
    { name: 'Louis Vuitton - Ombre Nomade', brand: 'louis-vuitton', label: 'Louis Vuitton' },
    { name: 'Molton Browen - Rhubarb Rose', brand: 'molton-brown', label: 'Molton Brown' },
    { name: 'Mont Blanc - Explorer', brand: 'montblanc', label: 'Mont Blanc' },
    { name: 'Nishane - 100 silent ways', brand: 'nishane', label: 'Nishane' },
    { name: 'Paco Rabanne - 1 Million', brand: 'paco-rabanne', label: 'Paco Rabanne' },
    { name: 'Paco Rabanne - Pure XS', brand: 'paco-rabanne', label: 'Paco Rabanne' },
    { name: 'Paco Rabanne - Black XS', brand: 'paco-rabanne', label: 'Paco Rabanne' },
    { name: "Paco Rabanne - Black XS L'exces", brand: 'paco-rabanne', label: 'Paco Rabanne' },
    { name: 'Paco Rabanne - Invictus', brand: 'paco-rabanne', label: 'Paco Rabanne' },
    { name: 'Ralph Lauren - Polo Black', brand: 'ralph-lauren', label: 'Ralph Lauren' },
    { name: 'Tom Ford - Tobacco Vanille', brand: 'tom-ford', label: 'Tom Ford' },
    { name: 'Tom Ford - Ombre Leather', brand: 'tom-ford', label: 'Tom Ford' },
    { name: 'Tom Ford - Oud Wood', brand: 'tom-ford', label: 'Tom Ford' },
    { name: 'Versace - Dylan Blue', brand: 'versace', label: 'Versace' },
    { name: 'Versace - Eros', brand: 'versace', label: 'Versace' },
    { name: 'Versace - Pour Homme', brand: 'versace', label: 'Versace' },
    { name: 'Azzaro - Wanted', brand: 'azzaro', label: 'Azzaro', type: 'rollon' },
    { name: 'Baccarat Rouge', brand: 'baccarat', label: 'Baccarat', type: 'rollon' },
    { name: 'Carolina Herrera - 212 VIP', brand: 'carolina-herrera', label: 'Carolina Herrera', type: 'rollon' },
    { name: 'Paco Rabanne - Invictus', brand: 'paco-rabanne', label: 'Paco Rabanne', type: 'rollon' },
    { name: 'Jean Paul Gaultier - Scandal', brand: 'jpg', label: 'Jean Paul Gaultier', type: 'rollon' }
  ];

  var productDetails = function (product, gender) {
    var safeProduct = product || {};
    var productType = normalizeProductType(safeProduct.type);
    var isRollOn = productType === 'roll-on';
    var isFemale = gender === 'feminino';
    var price = isRollOn ? 130 : 370;
    var detailPage = isRollOn
      ? (isFemale ? 'product-detail-rollon-ladies.html' : 'product-detail-rollon-men.html')
      : (isFemale ? 'product-detail-ladies-edp.html' : 'product-detail.html');
    var image = safeProduct.image || (isRollOn ? (isFemale ? 'rl.jpg' : 'rm.jpg') : (isFemale ? 'lady.jpeg' : 'mascu.jpeg'));
    var params = new URLSearchParams({
      product: safeProduct.displayName || safeProduct.name || (isFemale ? 'FULL FLOW FEMME' : 'FULL FLOW HOMME'),
      brand: safeProduct.label || safeProduct.brand || 'Full Flow',
      image: image
    });
    if (safeProduct.size) params.set('size', safeProduct.size);
    if (price !== null) params.set('price', String(price));
    return {
      name: safeProduct.name,
      displayName: safeProduct.displayName || safeProduct.name,
      brand: safeProduct.label || safeProduct.brand,
      brandId: safeProduct.brand,
      gender: gender,
      category: gender,
      type: productType,
      size: safeProduct.size || '',
      price: price,
      currency: 'MT',
      image: image,
      detailUrl: detailPage + '?' + params.toString(),
      searchText: [
        safeProduct.name,
        safeProduct.displayName || '',
        safeProduct.label,
        gender,
        isFemale ? 'femininos feminino mulheres mulher ladies women femme' : 'masculinos masculino homens homem mens men homme',
        isRollOn ? 'roll on roll-on roller' : 'eau de parfum perfume edp'
      ].join(' ')
    };
  };

  var prepareCatalog = function (products, gender) {
      return products.map(function (product) {
        var details = productDetails(product, gender);
        return Object.assign({}, product, {
          size: details.size,
          price: details.price,
          currency: details.currency,
          image: details.image,
          detailUrl: details.detailUrl
        });
      });
  };

  var femaleCatalog = prepareCatalog(female, 'feminino');
  var maleCatalog = prepareCatalog(male, 'masculino');
  window.fullflowCatalog = {
      feminino: femaleCatalog,
      masculino: maleCatalog,
      products: femaleCatalog.map(function (product) {
        return productDetails(product, 'feminino');
      }).concat(maleCatalog.map(function (product) {
        return productDetails(product, 'masculino');
      }))
  };
})();
