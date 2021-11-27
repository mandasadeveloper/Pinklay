
(function (Wishlist, $) {

  var $wishlistButton = $('.wishlist-btn');
  var $wishlistTile = $('.wishlist-tile-container');
  var numProductTiles = $wishlistTile.length;
  var wishlist = localStorage.getItem('user_wishlist') || [];
  if (wishlist.length > 0) {
    wishlist = JSON.parse(localStorage.getItem('user_wishlist'));
  }

  /*
   * Update button to show current state (gold for active)
   */   

  const listwishlist = $('.wish--list');
  let itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
  localStorage.setItem('items', JSON.stringify(itemsArray));
  const  data = JSON.parse(localStorage.getItem('items'));


  const liMaker = (productHandle) => {

    jQuery.getJSON('/products/'+productHandle+'.js', function(product) {
      var productHTML = '';
      var price_min = Shopify.formatMoney(product.price_min, window.money_format);
      productHTML += '<div class="item-wishlist">';
      productHTML += '<div class="product-image col-sm-2"><image src="'+product.featured_image +'" /></div>';
      productHTML += '<div class="product-bottom col-sm-5">';
      productHTML += '<div class="wishlist-vendor">'+ product.vendor +'</div>';
      productHTML += '<a class="wishlist-title" href="'+product.url +'">'+product.title+'</a>';
      productHTML += '</div>';
      productHTML += '<div class="price-box col-sm-2">'+ price_min +'</div>';
      productHTML += '<div class="col-sm-1 text-center wishlist-button"><a class="action--wishlist wishlist-btn is-active" href="#" data-product-handle="' + product.handle + '">Remove</a></div>';
      productHTML += '<div class="col-sm-2 text-center wishlist-button"><div class="action" id="product-actions-'+product.id+'"><form action="/cart/add" method="post" class="variants" enctype="multipart/form-data" style="padding:0px;"><input class="btn" type="button" onclick="window.location.href=\''+product.url +'\'" value="Select options" data-translate="products.product.select_options"></form></div></div>';
      productHTML += '</div>';
      productHTML.textContent = product; 
      listwishlist.append(productHTML).html();

    });
  };


  //   


  var animateWishlist = function (self) {
    $(self).toggleClass('is-active');
  };

  /*
   * Add/Remove selected item to the user's wishlist array in localStorage
   * Wishlist button class 'is-active' determines whether or not to add or remove
   * If 'is-active', remove the item, otherwise add it
   */   
  var updateWishlist = function (self) {
    var productHandle = $(self).attr('data-product-handle');
    var isRemove = $(self).hasClass('is-active');
    /* Remove */
    if (isRemove) {
      var removeIndex = wishlist.indexOf(productHandle);
      var removeIndex2 = itemsArray.indexOf(productHandle);
      wishlist.splice(removeIndex, 1);
      localStorage.setItem('user_wishlist', JSON.stringify(wishlist));
      itemsArray.splice(removeIndex2, 1);
      localStorage.setItem('items', JSON.stringify(itemsArray));
    }
    /* Add */ 
    else {
      wishlist.push(productHandle);
      localStorage.setItem('user_wishlist', JSON.stringify(wishlist));

      jQuery.getJSON('/products/'+productHandle+'.js', function(product) {
        itemsArray.push(productHandle);
        localStorage.setItem('items', JSON.stringify(itemsArray));
        liMaker(productHandle); 
      });
    }
    //     console.log(JSON.stringify(wishlist));
  };

  /*
   * Loop through wishlist buttons and activate any items that are already in user's wishlist
   * Activate by adding class 'is-active'
   * Run on initialization
   */   
  var activateItemsInWishlist = function () {
    $wishlistButton.each(function () {
      var productHandle = $(this).attr('data-product-handle');
      if (wishlist.indexOf(productHandle) > -1) {
        $(this).addClass('is-active');
      }
    });
  };

  /*
   * Loop through product titles and remove any that aren't a part of the wishlist
   * Decrement numProductTiles on removal
   */   
  var displayOnlyWishlistItems = function () {
    $wishlistTile.each(function () {
      var productHandle = $(this).attr('data-product-handle');
      if (wishlist.indexOf(productHandle) === -1) {
        $(this).parent('.item-wishlist').remove();
        numProductTiles--;
      }
    });
  };

  /*
   * Check if on the wishlist page and hide any items that aren't a part of the wishlist
   * If no wishlist items exist, show the empty wishlist notice
   */   

  var bindUIActions = function () {
    $(document).on('click','.wishlist-btn', function(e){
      e.preventDefault();
      updateWishlist(this);
      animateWishlist(this);

      var hide_wishlist = $(this).parents('.item-wishlist');
      hide_wishlist.fadeOut(1000);
      $('.item-wishlist').first().addClass('wishlist-first');

    });
  };


  Wishlist.init = function () {
    bindUIActions();
    activateItemsInWishlist();
    data.forEach(item => {
      liMaker(item);
    });
  };
  $('.fancy-wishlist .close').click(function(){
    $('.fancy-wishlist').fadeOut();
  }); 
}(window.Wishlist = window.Wishlist || {}, jQuery, undefined));
