(function($) {  
  if ($(".collection-sidebar").length) {
    //work only in collection page
    History.Adapter.bind(window, 'statechange', function() {
      var State = History.getState();

      if (!lynkco.isSidebarAjaxClick) {
        lynkco.sidebarParams();

        var newurl = lynkco.sidebarCreateUrl();

        lynkco.sidebarGetContent(newurl);
      }

      lynkco.isSidebarAjaxClick = false;
    });
  }

  var changeSwatch = function(swatch) {
    swatch.change(function() {
      var optionIndex = $(this).closest('.swatch').attr('data-option-index');
      var optionValue = $(this).val();

      $(this)
      .closest('form')
      .find('.single-option-selector')
      .eq(optionIndex)
      .val(optionValue)
      .trigger('change');
    });
  };

  if (window.use_color_swatch) {
    changeSwatch($('.swatch :radio'));

    Shopify.productOptionsMap = {};
    Shopify.quickViewOptionsMap = {};

    Shopify.updateOptionsInSelector = function(selectorIndex, wrapperSlt) {

      Shopify.optionsMap = wrapperSlt === '.product' ? Shopify.productOptionsMap : Shopify.quickViewOptionsMap;

      switch (selectorIndex) {
        case 0:
          var key = 'root';
          var selector = $(wrapperSlt + '.single-option-selector:eq(0)');
          break;
        case 1:
          var key = $(wrapperSlt + ' .single-option-selector:eq(0)').val();
          var selector = $(wrapperSlt + ' .single-option-selector:eq(1)');
          break;
        case 2:
          var key = $(wrapperSlt + ' .single-option-selector:eq(0)').val();
          key += ' / ' + $(wrapperSlt + ' .single-option-selector:eq(1)').val();
          var selector = $(wrapperSlt + ' .single-option-selector:eq(2)');
      }

      var initialValue = selector.val();

      selector.empty();

      var availableOptions = Shopify.optionsMap[key];

      if (availableOptions && availableOptions.length) {
        for (var i = 0; i < availableOptions.length; i++) {
          var option = availableOptions[i];

          var newOption = $('<option></option>').val(option).html(option);

          selector.append(newOption);
        }

        $(wrapperSlt + ' .swatch[data-option-index="' + selectorIndex + '"] .swatch-element').each(function() {
          if ($.inArray($(this).attr('data-value'), availableOptions) !== -1) {
            $(this).removeClass('soldout').find(':radio').removeAttr('disabled', 'disabled').removeAttr('checked');
          }
          else {
            $(this).addClass('soldout').find(':radio').removeAttr('checked').attr('disabled', 'disabled');
          }
        });

        if ($.inArray(initialValue, availableOptions) !== -1) {
          selector.val(initialValue);
        }

        selector.trigger('change');
      };
    };

    Shopify.linkOptionSelectors = function(product, wrapperSlt) {
      // Building our mapping object.
      Shopify.optionsMap = wrapperSlt === '.product' ? Shopify.productOptionsMap : Shopify.quickViewOptionsMap;

      for (var i = 0; i < product.variants.length; i++) {
        var variant = product.variants[i];

        if (variant.available) {
          // Gathering values for the 1st drop-down.
          Shopify.optionsMap['root'] = Shopify.optionsMap['root'] || [];

          Shopify.optionsMap['root'].push(variant.option1);
          Shopify.optionsMap['root'] = Shopify.uniq(Shopify.optionsMap['root']);

          // Gathering values for the 2nd drop-down.
          if (product.options.length > 1) {
            var key = variant.option1;
            Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
            Shopify.optionsMap[key].push(variant.option2);
            Shopify.optionsMap[key] = Shopify.uniq(Shopify.optionsMap[key]);
          }

          // Gathering values for the 3rd drop-down.
          if (product.options.length === 3) {
            var key = variant.option1 + ' / ' + variant.option2;
            Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
            Shopify.optionsMap[key].push(variant.option3);
            Shopify.optionsMap[key] = Shopify.uniq(Shopify.optionsMap[key]);
          }
        }
      };

      // Update options right away.
      Shopify.updateOptionsInSelector(0, wrapperSlt);

      if (product.options.length > 1) Shopify.updateOptionsInSelector(1, wrapperSlt);
      if (product.options.length === 3) Shopify.updateOptionsInSelector(2, wrapperSlt);

      // When there is an update in the first dropdown.
      $(wrapperSlt + " .single-option-selector:eq(0)").change(function() {
        Shopify.updateOptionsInSelector(1, wrapperSlt);
        if (product.options.length === 3) Shopify.updateOptionsInSelector(2, wrapperSlt);
        return true;
      });

      // When there is an update in the second dropdown.
      $(wrapperSlt + " .single-option-selector:eq(1)").change(function() {
        if (product.options.length === 3) Shopify.updateOptionsInSelector(2, wrapperSlt);
        return true;
      });

    };
  };

 $(function() {

    lynkco.init();

    $(document)
    .on( 'shopify:section:load', lynkco.slideshow )
    .on( 'shopify:section:unload', lynkco.slideshow)

    .on( 'shopify:section:load', lynkco.featuredproduct )
    .on( 'shopify:section:unload', lynkco.featuredproduct)

    .on( 'shopify:section:load', lynkco.initShuffleList('.collections-mansory', '.collections-mansory .grid-item'))
    .on( 'shopify:section:unload', lynkco.initShuffleList('.collections-mansory', '.collections-mansory .grid-item'))

    .on( 'shopify:section:load', lynkco.brands )
    .on( 'shopify:section:unload', lynkco.brands);

    $(document).on('click touchstart', function(e) {
      var lookbook_modal = $('.lookbook-modal');
      var hd_option = $('.hd-option');

      if (!lookbook_modal.is(e.target) && lookbook_modal.has(e.target).length === 0 && !hd_option.is(e.target) && hd_option.has(e.target).length === 0){
        lynkco.closeLookBookPopup();
      }
    });    
  });

  $(window).resize(function() {
    lynkco.initMobileMenu();
    lynkco.initDropdownMenuMobile();

    if($('.template-product').length) {
      setTimeout(function(){
        lynkco.hieghtGalleryProduct();
      },500);
    };

    if($('.body-left-sidebar').length) {
      lynkco.HomeLeftSidebar();
      lynkco.menuDestok();

    };

  });

  if($('.vertical-tab-fullwidth').length) {
    var currentWinWidth = $(window).width();
    var resizeTimeout;

    $(window).off('resize.isStuckMobile').on('resize.isStuckMobile', function() {
      clearTimeout(resizeTimeout);

      resizeTimeout = setTimeout(function() {
        if (currentWinWidth !== $(window).width()){
          lynkco.isStuckMobile();
          lynkco.initProductFullWidthMoreview();          
          currentWinWidth = $(window).width();
        }
      }, 50);
    });
  };

  $(window).off('resize.initDropdownFooter').on('resize.initDropdownFooter', function() {
    lynkco.initDropdownFooterMenu();
  });

  $(document).keyup(function(e) {
    if (e.keyCode == 27) {
      lynkco.closeLookBookPopup();

      clearTimeout(lynkco.lynkcoTimeout);

      if ($('.modal').is(':visible')) {
        $('.modal').fadeOut(500);
      }
    }
  });

  var lynkco = {
    lynkcoTimeout: null,
    isSidebarAjaxClick: false,

    init: function() {
      this.initSidebar();
      this.initToolbarMapEvents();
      this.initMobileMenu();
      this.initDropdownMenuMobile();
      this.OpenCart();
      this.MultiOption();
      this.slideshow();
      this.featuredproduct($('.featured-product'));
      this.brands();
      this.initDropDownCart();
      this.ProductTabs();
      this.initColorSwatchGrid();
      this.initAddToCart();
      this.initModal();
      this.initLookBookProduct();
      this.initScrollDown();
      this.initShuffleList('.list-collections-mansory', '.list-collections-mansory .grid-item');
      this.initShuffleList('.lookbook-mansory .lookbook_page', '.lookbook-mansory .lb-mansory-item');
      this.initShuffleList('.blog-mansory .list-blog', '.blog-mansory .blog-item');
      this.initShuffleList('.collections-mansory', '.collections-mansory .grid-item');
      this.initShuffleList('.collections-banner-mansory', '.collections-banner-mansory .image-banner');   
      this.dropDownSubCategory();

      if(!$('.collection-template-order').length) {
        this.InitViewAs();
      }

      this.InitsidebarFilter();
      this.initProductAddToCart();
      this.initQuickView();
      this.initWishList();
      this.initInfiniteScrolling();
      this.initDropdownFooterMenu();
      this.initScrollTop();
      this.fixedTop();

      if($('.template-article').length) {
        this.initArticleProductSlider($('.article-product .widget-content'));
        this.initArticleProductSlider($('#shopify-section-article-gallery .article-lookbook .widget-content'));
      }

      if($('.header-layout-3').length) {
        this.LayoutHeader3();
      }

      if($('.template-cart').length) {
        this.initCartQty();
        this.featuredproduct($('.best-sell-product'));
        this.initUpdateCart();
      };

      if($('.template-product').length) {
        this.initProductMoreview();
        this.initZoom();
        this.initStickyAddtoCart();
        this.initEventPopupNextPrevProduct();
        this.initLookbookProductDescription();
        this.initGroupedAddtoCart();
        this.hieghtGalleryProduct();
      };

      if($('.vertical-tab-fullwidth').length) {
        this.isStuckMobile();
        this.initProductFullWidthMoreview();
        this.initWindowLoad();
      };

      if($('.body-left-sidebar').length) {       
        this.HomeLeftSidebar();
        this.menuDestok();

      };

      if($('.brands-page').length) {
        this.Page_brands();
      };

      if($('.template-search').length) {
        this.sidebarParams();
        this.sidebarMapPaging();       
      };

      if($('.collection-template-order').length) {
        this.orderAddToCart();
        this.optionAddToCart();
      };

      this.initbrowser();
    },

    initArticleProductSlider: function(slide) {
      slide.slick({
        slidesToShow: 4,
        slidesToScroll: 4,
        dots: true,
        arrows: false,
        responsive: [
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
            }
          }
        ]
      });
    },

    sidebarCreateUrl: function(baseLink) {
      var newQuery = $.param(Shopify.queryParams).replace(/%2B/g, '+');

      if(Shopify.queryParams.view == undefined) {
        newQuery = newQuery.replace('view=', '');
      }	

      if (baseLink) {
        if (newQuery != "")
          return baseLink + "?" + newQuery;
        else
          return baseLink;
      }
      return location.pathname + "?" + newQuery;
    },

    toolbarAjaxClick: function(baseLink) {
      delete Shopify.queryParams.page;
      var newurl = lynkco.sidebarCreateUrl(baseLink);

      lynkco.isSidebarAjaxClick = true;

      //       History.pushState({
      //         param: Shopify.queryParams
      //       }, newurl, newurl);

      lynkco.toolbarGetContent(newurl);
    },

    sidebarAjaxClick: function(baseLink) {
      delete Shopify.queryParams.page;
      var newurl = lynkco.sidebarCreateUrl(baseLink);

      lynkco.isSidebarAjaxClick = true;

      History.pushState({
        param: Shopify.queryParams
      }, newurl, newurl);

      lynkco.sidebarGetContent(newurl);
    },

    toolbarGetContent: function(newurl) {
      $.ajax({
        type: 'get',
        url: newurl,
        beforeSend: function() {
          lynkco.showLoading();
        },

        success: function(data) {
          lynkco.hideLoading();
          lynkco.toolbarMapData(data);

          clearTimeout(lynkco.lynkcoTimeout);

          lynkco.lynkcoTimeout = setTimeout(function() {
            lynkco.initShuffleList('.collections-mansory', '.collections-mansory .grid-item');
            lynkco.initShuffleList('.collections-banner-mansory', '.collections-banner-mansory .image-banner');   
          }, 500);

          lynkco.translateBlock(".main-content");
          lynkco.sidebarMapTagEvents();
          lynkco.sidebarMapPaging();
          lynkco.sidebarMapClear();

          $('html').removeClass('filter-open');

        },
        error: function(xhr, text) {
          lynkco.hideLoading();
          $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
          lynkco.showModalError('.ajax-error-modal'); 
        } 
      });
    },

    sidebarGetContent: function(newurl) {
      $.ajax({
        type: 'get',
        url: newurl,
        beforeSend: function() {
          lynkco.showLoading();
        },
        success: function(data) {
          lynkco.hideLoading();
          lynkco.sidebarMapData(data);

          clearTimeout(lynkco.lynkcoTimeout);

          lynkco.lynkcoTimeout = setTimeout(function() {
            lynkco.initShuffleList('.collections-mansory', '.collections-mansory .grid-item');
            lynkco.initShuffleList('.collections-banner-mansory', '.collections-banner-mansory .image-banner');   
          }, 500);

          lynkco.translateBlock(".main-content");
          lynkco.sidebarMapTagEvents();
          lynkco.sidebarMapPaging();
          lynkco.sidebarMapClear();

          $('html').removeClass('filter-open');

        },
        error: function(xhr, text) {
          lynkco.hideLoading();
          $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
          lynkco.showModalError('.ajax-error-modal'); 
        } 
      });
    },

    initSidebar: function() {
      //if category page then init sidebar
      if ($(".collection-sidebar").length) {
        lynkco.sidebarParams();
        lynkco.sidebarMapEvents();
        lynkco.sidebarMapClearAll();
        lynkco.sidebarMapClear();
      }
    },

    initToolbarMapEvents:function() {
      lynkco.sidebarParams();
      lynkco.sidebarMapPaging();
      lynkco.sidebarMapSorting();
    },

    sidebarMapEvents: function() {      
      //       if(window.template_suffix != "express-order") {        
      //         if(window.ajax_sidebar_link) {
      //           lynkco.sidebarMapCategories();
      //         }
      //       }

      lynkco.sidebarMapTagEvents();
    },

    sidebarParams: function() {
      Shopify.queryParams = {};
      //get after ?...=> Object {q: "Acme"} 
      if (location.search.length) {
        for (var aKeyValue, i = 0, aCouples = location.search.substr(1).split('&'); i < aCouples.length; i++) {
          aKeyValue = aCouples[i].split('=');
          if (aKeyValue.length > 1) {
            Shopify.queryParams[decodeURIComponent(aKeyValue[0])] = decodeURIComponent(aKeyValue[1]);
          }
        }
      }
    },

    toolbarMapData: function(data) {
      var currentList = $(".col-main .products-grid");

      if (currentList.length == 0) {
        currentList = $(".col-main .product-list");
      }

      var productList = $(data).find(".col-main .products-grid");

      if(!productList.length) {
        productList = $(data).find(".col-main .product-list");
      }

      currentList.replaceWith(productList);

      //convert currency
      if (lynkco.checkNeedToConvertCurrency()) {
      //  Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
      }

      //replace paging
      if ($(".collections-content-product div.padding").length > 0) {
        $(".collections-content-product div.padding").replaceWith($(data).find(".collections-content-product div.padding"));
      }
      else {
        $(".block-row.col-main .collections-content-product").append($(data).find("div.padding"));
      }   

      //replace tags
      $(".sidebar-filter").replaceWith($(data).find(".sidebar-filter"));

      //replace breadcrumb
      $(".breadcrumb").replaceWith($(data).find(".breadcrumb"));

      //replace description
      $(".cat-content").replaceWith($(data).find(".cat-content"));



      var viewMode = $(".view-mode");
      var newViewMode = $(data).find(".view-mode");

      if(!viewMode.find('.view-grid').length) {
        viewMode.replaceWith(newViewMode);

        lynkco.setActiveViewMode();
      }
      else {
        var child = viewMode.children();
        var childActive = viewMode.children('active');
        var childNew = newViewMode.children();

        child.removeClass('view-grid');
        childNew.removeClass('view-grid active');

        if(childActive.hasClass('view-two')) {
          childNew.find('view-two').addClass('active');
        }
        else if(childActive.hasClass('view-three')) {
          childNew.find('view-three').addClass('active');
        }
        else if(childActive.hasClass('view-four')) {
          childNew.find('view-four').addClass('active');
        }
        else if(childActive.hasClass('view-five')) {
          childNew.find('view-five').addClass('active');
        }

        lynkco.setActiveViewMode();
      }
      //product review
      if ($(".spr-badge").length > 0) {
        return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
      }
      else {
        $(".block-row.col-main .collections-content-product").append($(data).find(".spr-badge"));
        return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
      }
    },

    sidebarMapData: function(data) {
      var currentList = $(".col-main .products-grid");

      if (currentList.length == 0) {
        currentList = $(".col-main .product-list");
      }

      var productList = $(data).find(".col-main .products-grid");

      if(!productList.length) {
        productList = $(data).find(".col-main .product-list");
      };                  

      currentList.replaceWith(productList);

      //convert currency
      if (lynkco.checkNeedToConvertCurrency()) {
       // Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
      }

      //replace paging
      if ($(".collections-content-product div.padding, .search-page div.padding").length > 0) {
        $(".collections-content-product div.padding, .search-page div.padding").replaceWith($(data).find(".collections-content-product div.padding, .search-page div.padding"));
      }
      else {
        $(".block-row.col-main .collections-content-product, .search-page").append($(data).find("div.padding"));
      }

      //replace tags
      $(".sidebar-filter").replaceWith($(data).find(".sidebar-filter"));

      //replace breadcrumb
      $(".breadcrumb").replaceWith($(data).find(".breadcrumb"));

      //replace description
      $(".cat-content").replaceWith($(data).find(".cat-content"));

      $('head title').text(($(data).filter('title').text()));

      lynkco.viewAs();

      //product review
      if ($(".spr-badge").length > 0) {
        return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
      }
      else {
        $(".block-row.col-main .collections-content-product").append($(data).find(".spr-badge"));
        return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
      }
    },

    sidebarMapCategories: function() {
      var sidebarLinkSlt = '.collection-sidebar .sidebar-links a';
      var sidebarLinkElm = $(sidebarLinkSlt);

      $('body').off('click.initSidebarLink', sidebarLinkSlt).on('click.initSidebarLink', sidebarLinkSlt, function(e) {

        var mn = $(this).parent('li');

        if (!$(mn).hasClass('active')) {

          delete Shopify.queryParams.q;

          lynkco.sidebarAjaxClick($(this).attr('href'));

          sidebarLinkElm.parent('li').removeClass('active');

          $(mn).addClass('active');

          $(this).next().next().slideDown(200);            
        }

        else{            
          $(this).next().next().slideUp(200);

          $(mn).removeClass('active');
        }
        e.preventDefault();
      });

    },

    sidebarMapTagEvents: function() {
      var sidebar_tag = $('.sidebar-tag a:not(".clear"), .sidebar-tag label, .refined-widgets .selected-tag');

      sidebar_tag.on('click',function(e) {
        var currentTags = [];
        if (Shopify.queryParams.constraint) {
          currentTags = Shopify.queryParams.constraint.split('+');
        }

        //one selection or multi selection
        if (!window.enable_sidebar_multiple_choice && !$(this).prev().is(":checked")) {
          //remove other selection first
          var otherTag = $(this).parents('.sidebar-tag').find("input:checked");
          if (otherTag.length > 0) {
            var tagName = otherTag.val();
            if (tagName) {
              var tagPos = currentTags.indexOf(tagName);
              if (tagPos >= 0) {
                //remove tag
                currentTags.splice(tagPos, 1);
              }
            }
          }
        }

        var tagName = $(this).prev().val();
        if (tagName) {
          var tagPos = currentTags.indexOf(tagName);
          if (tagPos >= 0) {
            //tag already existed, remove tag
            currentTags.splice(tagPos, 1);
          } else {
            //tag not existed
            currentTags.push(tagName);
          }
        }

        if (currentTags.length) {
          Shopify.queryParams.constraint = currentTags.join('+');
        } 
        else {
          delete Shopify.queryParams.constraint;
        }

        lynkco.sidebarAjaxClick();

        e.preventDefault();
      });
    },

    sidebarMapClearAll: function() {
      //clear all selection
      $(document).on('click', '.refined-widgets a.clear-all', function(e) {
        delete Shopify.queryParams.constraint;
        delete Shopify.queryParams.q;

        lynkco.sidebarAjaxClick();
        e.preventDefault();
      });
    },

    sidebarMapClear: function() {
      $(".sidebar-tag").each(function() {
        var sidebarTag = $(this);
        if (sidebarTag.find("input:checked").length > 0) {
          //has active tag
          sidebarTag.find(".clear").show().click(function(e) {
            var currentTags = [];

            if (Shopify.queryParams.constraint) {
              currentTags = Shopify.queryParams.constraint.split('+');
            }

            sidebarTag.find("input:checked").each(function() {
              var selectedTag = $(this);
              var tagName = selectedTag.val();
              if (tagName) {
                var tagPos = currentTags.indexOf(tagName);
                if (tagPos >= 0) {
                  //remove tag
                  currentTags.splice(tagPos, 1);
                }
              }
            });

            if (currentTags.length) {
              Shopify.queryParams.constraint = currentTags.join('+');
            } 
            else {
              delete Shopify.queryParams.constraint;
            }
            lynkco.sidebarAjaxClick();
            e.preventDefault();
          });
        }
      });
    },

    sidebarMapSorting: function(e) {
      $(".filter-sortby li span").on('click', function(e) {
        if (!$(this).parent().hasClass("active")) {
          Shopify.queryParams.sort_by = $(this).attr("data-href");
          lynkco.sidebarAjaxClick();

          var sortbyText = $(this).text();
          $(".filter-sortby > button span").text(sortbyText);
          $(".filter-sortby li.active").removeClass("active");
          $(this).parent().addClass("active");
        }
        e.preventDefault();
      });

      if (Shopify.queryParams.sort_by) {
        var sortby = Shopify.queryParams.sort_by;
        var sortbyText = $(".filter-sortby span[data-href='" + sortby + "']").text();

        $('.filter-sortby .label-text').text(sortbyText);
        $('.filter-sortby li.active').removeClass('active');
        $(".filter-sortby span[data-href='" + sortby + "']").parent().addClass("active");
      }

      else {
        var sortbyText = $('.filter-sortby .dropdown-menu .active').text();

        $('.filter-sortby .label-text').text(sortbyText);
      }

    },

    sidebarMapPaging: function() {
      $(".pagination-page a").on('click', function(e) {
        var page = $(this).attr("href").match(/page=\d+/g);

        if (page) {
          Shopify.queryParams.page = parseInt(page[0].match(/\d+/g));

          if (Shopify.queryParams.page) {
            var newurl = lynkco.sidebarCreateUrl();
            lynkco.isSidebarAjaxClick = true;
            History.pushState({
              param: Shopify.queryParams
            }, newurl, newurl);

            lynkco.sidebarGetContent(newurl);
            //go to top
            var top = $('.collections-content-product .toolbar, .search-page').offset().top;

            $('body,html').animate({
              scrollTop: top
            }, 600);
          }
        }
        e.preventDefault();
      });
    },

    checkItemsInDropdownCart: function() {
      if ($('.dropdown-cart .mini-products-list').children().length > 0) {
        //Has item in dropdown cart
        $('.dropdown-cart .no-items').hide();
        $('.dropdown-cart .has-items').show();
      } else {
        //No item in dropdown cart                
        $('.dropdown-cart .has-items').hide();
        $('.dropdown-cart .no-items').show();
      }
    },

    initDropDownCart:function(){
      lynkco.checkItemsInDropdownCart();
      $('.dropdown-cart .btn-remove').on('click', function(event) {
        event.preventDefault();
        var productId = $(this).parents('.item').attr('id');
        productId = productId.match(/\d+/g);
        Shopify.removeItem(productId, function(cart) {
          lynkco.doUpdateDropdownCart(cart);
        });
      });
    },

    updateDropdownCart: function() {
      Shopify.getCart(function(cart) {
        lynkco.doUpdateDropdownCart(cart);
      });
    },

    doUpdateDropdownCart: function(cart) {
      var template = '<li class="item" id="cart-item-{ID}"><a href="{URL}" title="{TITLE}" class="product-image"><img src="{IMAGE}" alt="{TITLE}"></a><div class="product-details"><a href="javascript:void(0)" title="Remove This Item" class="btn-remove"><?xml version="1.0" encoding="iso-8859-1"?><svg class="closemnu" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><g><g><path d="M505.943,6.058c-8.077-8.077-21.172-8.077-29.249,0L6.058,476.693c-8.077,8.077-8.077,21.172,0,29.249 C10.096,509.982,15.39,512,20.683,512c5.293,0,10.586-2.019,14.625-6.059L505.943,35.306 C514.019,27.23,514.019,14.135,505.943,6.058z"/></g></g><g><g><path d="M505.942,476.694L35.306,6.059c-8.076-8.077-21.172-8.077-29.248,0c-8.077,8.076-8.077,21.171,0,29.248l470.636,470.636 c4.038,4.039,9.332,6.058,14.625,6.058c5.293,0,10.587-2.019,14.624-6.057C514.018,497.866,514.018,484.771,505.942,476.694z"/></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg></a><p class="product-name"><a href="{URL}">{TITLE}</a></p><div class="pro_properties" style="display:none;">{properties}</div><div class="cart-collateral">{QUANTITY} x <span class="price">{PRICE}</span></div></div></li>';

      $('.cartCount').text(cart.item_count);

      $('.fixcartCount').text(cart.item_count);
      /*Total price*/
      $('.dropdown-cart .summary .price').html(Shopify.formatMoney(cart.total_price, window.money_format));
      /*Clear cart*/
      $('.dropdown-cart .mini-products-list').html('');
      /*Add product to cart*/
      if (cart.item_count > 0) {
        for (var i = 0; i < cart.items.length; i++) {
          var item = template;
          item = item.replace(/\{ID\}/g, cart.items[i].id);
          item = item.replace(/\{URL\}/g, cart.items[i].url);
          item = item.replace(/\{TITLE\}/g, lynkco.translateText(cart.items[i].title));        
          item = item.replace(/\{QUANTITY\}/g, cart.items[i].quantity);
          item = item.replace(/\{IMAGE\}/g, Shopify.resizeImage(cart.items[i].image, 'small'));
          item = item.replace(/\{PRICE\}/g, Shopify.formatMoney(cart.items[i].price, window.money_format));
  
          var pro_per = cart.items[i].properties;
          var pro_html = "";
          for(var x in pro_per){
            if(x == "Recipient E-mail" || x == "Delivery Date"){
            pro_html += "<div>"+x+":"+pro_per[x]+"</div>";
            }
          }
          item = item.replace(/\{properties\}/g, pro_html);
          $('.dropdown-cart .mini-products-list').append(item);
        }

        $('.dropdown-cart .btn-remove').click(function(event) {
          event.preventDefault();
          var productId = $(this).parents('.item').attr('id');
          productId = productId.match(/\d+/g);
          Shopify.removeItem(productId, function(cart) {
            lynkco.doUpdateDropdownCart(cart);
          });
        });

        if (lynkco.checkNeedToConvertCurrency()) {       
          //Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
        }
      }
      lynkco.checkItemsInDropdownCart();
    },

    showLoading: function() {
      $('.loading-modal').show();
    },

    hideLoading: function() {
      $('.loading-modal').hide();
    },

    showModal: function(selector) {
      $(selector).fadeIn(500);
    },

    showModalError: function(selector){
      $(selector).fadeIn(500);

      lynkco.lynkcoTimeout = setTimeout(function() {
        $(selector).fadeOut(500);
      }, 5000);

      $(document).on('click touchstart', function(){
        $(selector).fadeOut(500);
      });
    },

    hideModal: function(){
      $('.ajax-success-modal').fadeOut(500);
    },

    initModal: function() {
      $('.continue-shopping').on('click',function() {
        clearTimeout(lynkco.lynkcoTimeout);
        $('.ajax-success-modal').fadeOut(500);
      });

      $('.close-modal, .overlay').on('click',function() {
        clearTimeout(lynkco.lynkcoTimeout);
        $('.ajax-success-modal').fadeOut(500);
        $('html').removeClass('popup-cart');
      });
    },

    initProductAddToCart: function(){
      if ($('#product-add-to-cart').length > 0) {

        $('#product-add-to-cart').on('click',function(event) {

          event.preventDefault();

          var handle = $(this).parent('.groups-btn').data('handle');

          if ($(this).attr('disabled') != 'disabled') {

            if (!window.ajax_cart) {
              $(this).closest('form').submit();
            } 

            else {
              var variant_id = $('#add-to-cart-form select[name=id]').val();

              if (!variant_id) {
                variant_id = $('#add-to-cart-form input[name=id]').val();
              }

              var quantity = $('#add-to-cart-form input[name=quantity]').val();

              if (!quantity) {
                quantity = 1;
              }

              lynkco.doAjaxAddToCart(variant_id, quantity, handle);
            }
          }
          return false;
        });
      }
    },

    initAddToCart: function() {
      if ($('.add-to-cart-btn').length > 0) {
        $(document).on('click', '.add-to-cart-btn:not(.best-sell-product .add-to-cart-btn)', function(event) {
          event.preventDefault();
          if ($(this).attr('disabled') != 'disabled') {

            var productItem = $(this).parents('.product-item');
            var productId = $(productItem).attr('id');          
            var handle = $(productItem).find('.product-grid-image').data('handle');

            productId = productId.match(/\d+/g);
            if (!window.ajax_cart) {
              $('#product-actions-' + productId).submit();
            } 
            else {
              var variant_id = $('#product-actions-' + productId + ' select[name=id]').val();
              if (!variant_id) {
                variant_id = $('#product-actions-' + productId + ' input[name=id]').val();
              }
              var quantity = $('#product-actions-' + productId + ' input[name=quantity]').val();
              if (!quantity) {
                quantity = 1;
              }
              lynkco.doAjaxAddToCart2(variant_id, quantity, handle);

            }
          }

          return false;

        });              

      }
    },

    initSliderPopupAddToCart: function(slide) {
      slide.slick({
        slidesToShow: 4,
        slidesToScroll: 4,
        dots: true,
        arrows: false,
        responsive: [
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
            }
          },
          {
            breakpoint: 380,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            }
          }
        ]
      });
    },

    doAjaxAddToCart: function(variant_id, quantity, handle) {
      var properties = "";
             
      $(".custom_fields").each(function(i, v) {
        if($(this).val() != "" && $(this).val() !== undefined) {
          properties += '&'+$(this).attr("name")+'=' + $(this).val();
        }
      });  
      console.log(properties);
      $.ajax({
        type: "post",
        url: "/cart/add.js",
        data: 'quantity=' + quantity + '&id=' + variant_id + properties,
        dataType: 'json',
        beforeSend: function() {
//           lynkco.showLoading();
        },
        success: function(msg) {
          lynkco.hideLoading();

          $.get('/cart?view=json', function(data) {
//             lynkco.showModal('.ajax-success-modal');       
//             $('.ajax-success-modal .content .cart-page').html(data); 

//             if( window.dpl_upsell ){
//               if( handle != '/collections/?view=related'){
//                 $('.ajax-success-modal .ajax-load-content').load(''+handle+'');
//               }
//             }
            if (window.show_multiple_currencies) {
              //Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
            }

            lynkco.initCartQty();
            lynkco.initUpdateCart(); 
            lynkco.updateDropdownCart();

            setTimeout(function(){
              lynkco.translateBlock('.ajax-container');

              if($('.ajax-load-content').children().length) {
                lynkco.initSliderPopupAddToCart($('.ajax-load-content .col-12 > .row'));
              }
            },1000);


          });

          $('html').addClass('popup-cart');

        },
        error: function(xhr) {
          lynkco.hideLoading();
          $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
          lynkco.showModalError('.ajax-error-modal');
        }
      });
    },

     doAjaxAddToCart2: function(variant_id, quantity, handle) {
      var properties = "";
             
      $(".custom_fields").each(function(i, v) {
        if($(this).val() != "" && $(this).val() !== undefined) {
          properties = '&'+$(this).attr("name")+'=' + $(this).val();
        }
      });  
      
      $.ajax({
        type: "post",
        url: "/cart/add.js",
        data: 'quantity=' + quantity + '&id=' + variant_id + properties,
        dataType: 'json',
        beforeSend: function() {
          lynkco.showLoading();
        },
        success: function(msg) {
          lynkco.hideLoading();

          $.get('/cart?view=json', function(data) {
            lynkco.showModal('.ajax-success-modal');       
            $('.ajax-success-modal .content .cart-page').html(data); 

            if( window.dpl_upsell ){
              if( handle != '/collections/?view=related'){
                $('.ajax-success-modal .ajax-load-content').load(''+handle+'');
              }
            }
            if (window.show_multiple_currencies) {
              //Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
            }

            lynkco.initCartQty();
            lynkco.initUpdateCart(); 
            lynkco.updateDropdownCart();

            setTimeout(function(){
              lynkco.translateBlock('.ajax-container');

              if($('.ajax-load-content').children().length) {
                lynkco.initSliderPopupAddToCart($('.ajax-load-content .col-12 > .row'));
              }
            },1000);


          });

          $('html').addClass('popup-cart');

        },
        error: function(xhr) {
          lynkco.hideLoading();
          $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
          lynkco.showModalError('.ajax-error-modal');
        }
      });
    },
    
    initCartQty: function() {    
      $('.quantity .button').on('click',function(event) {
        event.preventDefault();
        jQuery(this).each(function() {
          var productItem = jQuery(this).parents('.product-item');
          var productId = jQuery(productItem).attr('id');
          productId = productId.match(/\d+/g);

          var oldValue = jQuery('#updates_' + productId + '').val(),
              newVal = 1;

          if (jQuery(this).hasClass('inc')) {
            newVal = parseInt(oldValue) + 1;
          } else if (oldValue > 1) {
            newVal = parseInt(oldValue) - 1;
          }

          jQuery('#updates_' + productId + '').val(newVal);
        });

        return false;
      });

    },

    initUpdateCart: function(){            
      $('.cart-form .update').on('click', function(event) {      
        event.preventDefault();
        var cartButton = $(this);
        var productItem = jQuery(this).parents('.product-item');
        var productId = jQuery(productItem).attr('id');
        productId = productId.match(/\d+/g);

        var Price = $(this).parents('.product-details').find('.price'),
            quantity = jQuery('input#updates_' + productId + '').val();

        lynkco.doAjaxUpdateCart(productId, quantity, cartButton, Price, productItem);

      }); 

      $('.cart-form .remove ').on('click', function(event) {
        event.preventDefault();
        var productItem = jQuery(this).parents('.product-item'),
            productId = jQuery(productItem).attr('id');

        productId = productId.match(/\d+/g);
        Shopify.removeItem(productId, function(cart) {

          lynkco.doUpdateDropdownCart(cart);

          $(productItem).remove();

          $('.total-price .price').html(Shopify.formatMoney(cart.total_price, window.money_format));

          if (lynkco.checkNeedToConvertCurrency()) {       
           // Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
          }

          if ($('.cart-left ul li').children().length > 0) {
            $('.no-items').hide();
            $('.cart-form').show();
          } 

          else {             
            $('.cart-form').hide();
            $('.no-items').show();
          }

        });
      });


    },

    doAjaxUpdateCart: function(productId, quantity, cartButton, Price, productItem){
      var checkInv = $(cartButton).data('line'),
          price = parseFloat( Price.data('price') )*quantity,
          price2 = parseFloat( Price.data('price') )*checkInv;

      $.ajax({
        type: "post",
        url: "/cart/change.js",
        data: 'quantity=' + quantity + '&id=' + productId,
        dataType: 'json',
        beforeSend: function() {
          cartButton.find('i').removeClass('fa-check').addClass('fa-circle-o-notch fa-spin');
        },
        success: function(cart) {
          if(quantity == 0){
            productItem.remove();
            if ($('.cart-form .cart-left ul li').children().length > 0) {
              $('.cart-form .no-items').hide();
              $('.cart-form .cart-form').show();
            } 

            else {             
              $('.cart-form .cart-form').hide();
              $('.cart-form .no-items').show();
            }
          }

          cartButton.find('i').removeClass('fa-circle-o-notch fa-spin').addClass('fa-check');

          setTimeout(function() {cartButton.find('i').removeClass('fa-check')},2000);

          Price.html(Shopify.formatMoney(price, window.money_format));  

          $('.total-price .price').html(Shopify.formatMoney(cart.total_price, window.money_format));

          if(quantity > checkInv){

            var title = $(productItem).find('.product-name > span').html();

            $(productItem).find('.extra').css('border-color','red');

            $('input#updates_' + productId + '').val(checkInv);

            Price.html(Shopify.formatMoney(price2, window.money_format));

            $('.ajax-error-message').text('You can only add '+ checkInv +' '+ title +' to your cart.');

            lynkco.showModalError('.ajax-error-modal');
          }
          else{
            $(productItem).find('.extra').css('border-color','#dcdcdc');
          }

          lynkco.updateDropdownCart();

        },
        error: function(xhr) {          
          cartButton.find('i').removeClass('fa-circle-o-notch fa-spin').addClass('fa-exclamation-circle');
          setTimeout(function() {cartButton.find('i').removeClass('fa-exclamation-circle')},5000);
          $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
          lynkco.showModalError('.ajax-error-modal');
        }
      });

    },

    initQuickView: function() {
      $('body').off('click.initQuickView', '.quickview-button a').on('click.initQuickView', '.quickview-button a', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var product_handle = $(this).attr('id');

        Shopify.getProduct(product_handle, function(product) {
          var template = $('#quickview-template').html();

          $('.quick-view').html(template); 

          var quickview = $('.quick-view');

          // -----  product-title
          var productTitleElm = quickview.find('.product-title a');

          productTitleElm.html(lynkco.translateText(product.title));

          productTitleElm.attr('href', product.url);

          productTitleElm.attr('title', lynkco.translateText(product.title));

          var viewDetailEml = quickview.find('.view-detail');

          viewDetailEml.attr('href', product.url);

          // -------Price Varies
          var groupPricesElm = quickview.find('.group-prices');
          var minPriceElm = groupPricesElm.find('.price-min');
          var maxPriceElm = groupPricesElm.find('.price-max');
          var minPrice = product.price_min;
          var maxPrice = product.price_max;

          if(product.price_varies) {
            groupPricesElm.show();
            minPriceElm.html(Shopify.formatMoney(minPrice, window.money_format));
            maxPriceElm.html(Shopify.formatMoney(maxPrice, window.money_format));
          }
          else {
            groupPricesElm.remove();
          };

          // -----------product invetory
          if (quickview.find('.product-inventory').length) {
            var variant = product.variants[0];
            var inventoryInfo = quickview.find('.product-inventory span');

            if (variant.available) {
              if (variant.inventory_management != null) {
                inventoryInfo.text(window.inventory_text.in_stock);
              }
              else {
                inventoryInfo.text(window.inventory_text.many_in_stock);
              }
            }

            else {
              inventoryInfo.text(window.inventory_text.out_of_stock);
            }
          };

          // -----------product type
          if (quickview.find('.product-type').length) {
            quickview.find('.product-type span').text(product.type);
          };

          // ----------  product Vendor 
          if (quickview.find('.vendor-product').length) {
            quickview.find('.vendor-product span').text(product.vendor);
          };

          //countdown for quickview
          if (product.description.indexOf("[countdown]")) {
            var countdownTime = product.description.match(/\[countdown\](.*)\[\/countdown\]/);

            if (countdownTime && countdownTime.length > 0) {
              quickview.find(".countdown").show();

              quickview.find(".quickview-clock").countdown(countdownTime[1], function(event) {
                $(this).html(event.strftime(''
                                            + '<span>%D</span>d  :  '
                                            + '<span>%H</span>h  :  '
                                            + '<span>%M</span>m  :  '
                                            + '<span>%S</span>s'));
              });
            }
          };

          // -----------product description
          if (quickview.find('.short-description').length) {
            var description = product.description.replace(/(<([^>]+)>)/ig, "");
            var description = description.replace(/\[countdown\](.*)\[\/countdown\]/g, "");

            if (window.multi_lang) {
              if (description.indexOf("[lang2]") > 0) {
                var descList = description.split("[lang2]");

                if (jQuery.cookie("language") != null) {
                  description = descList[translator.current_lang - 1];
                }
                else {
                  description = descList[0];
                }
              }
            };

            description = description.split(" ").splice(0, 28).join(" ") + "...";
            quickview.find('.short-description').text(description);
          }

          else {
            quickview.find('.short-description').remove();
          };

          // -------product Label
          var label = $('#product-'+ product.id +' .product-label').html();
          quickview.find('.product-label').html(label);

          // -------product price
          var quickViewPriceElm = quickview.find('.price');
          var productPrice = product.price;

          quickViewPriceElm.html(Shopify.formatMoney(productPrice, window.money_format));

          // -----------if has compare price
          var quickViewComparePriceElm = quickview.find('.compare-price');
          var comparePrice = product.compare_at_price_max;
          var priceSaveElm = quickview.find('.product-label .label-sale');

          if (product.compare_at_price > product.price) {
            quickViewComparePriceElm.html(Shopify.formatMoney(comparePrice, window.money_format)).show();

            quickViewPriceElm.addClass('on-sale');

            var roundqv = Math.round((1- ( variant.price/variant.compare_at_price))*100);
            priceSaveElm.html('-'+roundqv+"%");
            priceSaveElm.show();
          }

          else {
            quickViewComparePriceElm.html('').hide();
            quickViewPriceElm.removeClass('on-sale');
            priceSaveElm.hide();
          }

          // -----------id product 
          quickview.find('.product-item').attr('id', 'product-' + product.id);
          quickview.find('.variants').attr('data-id', 'product-actions-' + product.id);
          var dataHandle = $('#product-'+ product.id +' .product-grid-image').data('handle');
          quickview.find('.variants').attr('data-handle', dataHandle);
          quickview.find('.variants select').attr('id', 'product-select-' + product.id);

          if (quickview.find('.addwishlist').length) {
            var wishw = $('.grid-item #product-'+ product.id +' .addwishlist');
            var wish = $(wishw).html();
            var pr = quickview.find('.addwishlist');
            $(pr).html(wish);
            var a = $(pr).find('.wishlist-btn');
            var b = $(wishw).find('.wishlist-btn');
            var c = $(pr).find('.wishlist-btn:not(.btn-active)');            
            $(a).click(function() {
              $(b).toggleClass("btn-active");
              $(b).find(".wishlist_text").text(window.inventory_text.add_wishlist);
            });
            $(c).click(function() {
              $(b).find(".wishlist_text").text(window.inventory_text.remove_wishlist);
            });
          };


          //out of stock
          if (!product.available) {
            quickview.find("select, input, .total-price, .qty-group, .variants label").remove();
            quickview.find(".add-to-cart-btn").text(window.inventory_text.unavailable).addClass('disabled').attr("disabled", "disabled");;
          }

          else {
            var quickViewTotalPriceElm = quickview.find('.total-price .total-money');
            var productPrice = product.price;

            quickViewTotalPriceElm.html(Shopify.formatMoney(productPrice, window.money_format));

            // ------------swatch
            if (window.use_color_swatch) {
              lynkco.createQuickViewVariantsSwatch(product, quickview);
            }
            else {
              lynkco.createQuickViewVariants(product, quickview);
            }
          };

          //quantity
          quickview.find('.button').off('click.changeQtt').on('click.changeQtt', function(e) {
            e.preventDefault();
            e.stopPropagation();

            var oldValue = quickview.find(".quantity").val(),
                newVal = 1;

            if($(this).hasClass('inc')) {
              newVal = parseInt(oldValue) + 1;
            }
            else if(oldValue > 1) {
              newVal = parseInt(oldValue) - 1;
            }

            quickview.find('.quantity').val(newVal);

            if (quickview.find('.total-price').length) {
              lynkco.updatePricingQuickview();
            }
          });

          if (window.show_multiple_currencies) {
          //  Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
          }

          lynkco.loadQuickViewSlider(product, quickview);
          lynkco.initQuickviewAddToCart();
          lynkco.translateBlock('.quick-view');                    

          $('.quick-view').show(); 
          $('.quick-view').css('opacity', 0);
          $('html').css({ "overflow": "hidden"});

          if ($('.quick-view .total-price').length > 0) {
            $('.quick-view input[name=quantity]').on('change', lynkco.updatePricingQuickview);
          }
        });

        return false;

      });

      $(document).off('click.closeQuickView').on('click.closeQuickView', '.quick-view .overlay, .close-window', function() {
        lynkco.closeQuickViewPopup();
        return false;
      });
    },

    convertToSlug: function(text) {
      return text
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    },

    createQuickViewVariantsSwatch: function(product, quickviewTemplate) {
      //multiple variants	
      if (product.variants.length > 1) {
        for (var i = 0; i < product.variants.length; i++) {
          var variant = product.variants[i];
          var option = '<option value="' + variant.id + '">' + variant.title + '</option>';

          quickviewTemplate.find('form.variants > select').append(option);
        };

        new Shopify.OptionSelectors("product-select-" + product.id, {
          product: product,
          onVariantSelected: selectCallbackQuickview
        });

        //start of quickview variant;
        var filePath = window.file_url.substring(0, window.file_url.lastIndexOf('?'));
        var assetUrl = window.asset_url.substring(0, window.asset_url.lastIndexOf('?'));
        var options = "";

        for (var i = 0; i < product.options.length; i++) {
          options += '<div class="swatch clearfix" data-option-index="' + i + '">';
          options += '<div class="header">' + product.options[i].name + '<em> *</em></div>';

          var is_color = false;

          if (/Color|Colour/i.test(product.options[i].name)) {
            is_color = true;
          };

          var optionValues = new Array();

          for (var j = 0; j < product.variants.length; j++) {
            var variant = product.variants[j];
            var value = variant.options[i];
            var valueHandle = lynkco.convertToSlug(value) || value;
            var forText = 'quick-view-swatch-' + i + '-' + valueHandle;

            if(variant.featured_image != null && window.use_variant_swatch== true){
              var variant_swatch = variant.featured_image.src;
            }else{
              var variant_swatch = filePath + valueHandle;
            }

            if (optionValues.indexOf(value) < 0) {
              //not yet inserted
              options += '<div data-value="' + value + '" class="swatch-element ' + (is_color ? "color" : "") + valueHandle + (variant.available ? ' available ' : ' soldout ') + '">';

              if (is_color) {
                options += '<div class="tooltip">' + value + '</div>';
              }
              options += '<input id="' + forText + '" type="radio" name="option-' + i + '" value="' + value + '" ' + (j == 0 ? ' checked ' : '') + (variant.available ? '' : ' disabled') + ' />';

              if (is_color) {
                options += '<label for="' + forText + '"><span class="bg" style="background-color: ' + valueHandle + '; background-size: cover; background-image: url(' + variant_swatch + '.png)"></span><span class="crossed-out"></span></label>';
              }
              else {
                options += '<label for="' + forText + '">' + value + '<span class="crossed-out"></span></label>';
              }
              options += '</div>';
              if (variant.available) {
                $('.quick-view .swatch[data-option-index="' + i + '"] .' + valueHandle).removeClass('soldout').addClass('available').find(':radio').removeAttr('disabled');
              }
              optionValues.push(value);
            };
          };
          options += '</div>';
        };

        quickviewTemplate.find('form.variants > select').after(options);

        changeSwatch(quickviewTemplate.find('.swatch :radio'));

        if (product.available) {
          Shopify.quickViewOptionsMap = {};
          Shopify.linkOptionSelectors(product, '.quick-view');
        };
      }

      //single variant
      else {
        quickviewTemplate.find('form.variants > select').remove();
        var variant_field = '<input type="hidden" name="id" value="' + product.variants[0].id + '">';
        quickviewTemplate.find('form.variants').append(variant_field);
      };
    },

    createQuickViewVariants: function(product, quickviewTemplate) {
      //multiple variants
      if (product.variants.length > 1) { 
        for (var i = 0; i < product.variants.length; i++) {
          var variant = product.variants[i];
          var option = '<option value="' + variant.id + '">' + variant.title + '</option>';

          quickviewTemplate.find('form.variants > select').append(option);
        }

        new Shopify.OptionSelectors("product-select-" + product.id, {
          product: product,
          onVariantSelected: selectCallbackQuickview
        });

        if (product.options.length == 1) {
          $('.selector-wrapper:eq(0)').prepend('<label>' + product.options[0].name + '</label>');

          for (var text = product.variants, r = 0; r < text.length; r++ ) {
            var s = text[r];

            if (!s.available) {
              $('.single-option-selector option').filter(function() {
                return $(this).html() === s.title 
              }).remove();
            }
          };
        }
        else if(product.options.length > 1) {
          $('.selector-wrapper').append('<span class="icon-dropdown"><i class="fa fa-angle-down"></i></span>'); 
        };

        $('.quick-view .selectize-input input').attr("disabled", "disabled");

        quickviewTemplate.find('form.variants .selector-wrapper label').each(function(i,v) {
          $(this).html(product.options[i].name);
        });
      }

      //single variant
      else { 
        quickviewTemplate.find('form.variants > select').remove();

        var variant_field = '<input type="hidden" name="id" value="' + product.variants[0].id + '">';

        quickviewTemplate.find('form.variants').append(variant_field);
      };
    },

    updatePricingQuickview: function() {
      var regex = /([0-9]+[.|,][0-9]+[.|,][0-9]+)/g;
      var unitPriceTextMatch = $('.quick-view .price').text().match(regex);

      if (!unitPriceTextMatch) {
        regex = /([0-9]+[.|,][0-9]+)/g;
        unitPriceTextMatch = $('.quick-view .price').text().match(regex);
      }

      if (unitPriceTextMatch) {
        var unitPriceText = unitPriceTextMatch[0];
        var unitPrice = unitPriceText.replace(/[.|,]/g, '');
        var quantity = parseInt($('.quick-view input[name=quantity]').val());
        var totalPrice = unitPrice * quantity;

        var totalPriceText = Shopify.formatMoney(totalPrice, window.money_format);
        regex = /([0-9]+[.|,][0-9]+[.|,][0-9]+)/g;     
        if (!totalPriceText.match(regex)) {
          regex = /([0-9]+[.|,][0-9]+)/g;
        } 
        totalPriceText = totalPriceText.match(regex)[0];

        var regInput = new RegExp(unitPriceText, "g");
        var totalPriceHtml = $('.quick-view .price').html().replace(regInput, totalPriceText);

        $('.quick-view .total-price span').html(totalPriceHtml);
      };       
    },


    loadQuickViewSlider: function(product, quickviewTemplate) {
      var quickViewSliderFor = quickviewTemplate.find('.quickview-featured-image');
      var count = 0;

      for (i in product.images) {
        if (count < product.images.length) {
          var featuredImage = Shopify.resizeImage(product.images[i], '1024x1024');
          var thumb = '<div class="thumb"><a href="' + product.url + '" title="' + product.title + '"><img src="' + featuredImage + '"  /></a></div>'

          quickViewSliderFor.append(thumb);
          count = count + 1;
        }
      };

      clearTimeout(lynkco.lynkcoTimeout);

      var counter = 0;
      var imgTags = quickviewTemplate.find('.quickview-featured-image img');
      var imgTags2 = quickviewTemplate.find('.quickview-featured-image');

      imgTags.on('load', function() {

        lynkco.lynkcoTimeout = setTimeout(function() {
          lynkco.initQuickviewMoreview(quickViewSliderFor);
          counter++;
          if (counter === imgTags.length) {
            var heightImg = imgTags2.outerHeight();
            var productShop = quickviewTemplate.find('.product-shop'),
                productShopHeight = productShop.outerHeight();

            if(heightImg < productShopHeight) {
              productShop.css('max-height', heightImg);
              $('.quick-view .product-img-box').css('height', heightImg);
              $('.quick-view .content').css('max-height', heightImg); 

              lynkco.lynkcoTimeout = setTimeout(function() {
                $('.quick-view').css('opacity', 1);
              }, 300);
            }
            else {
              $('.quick-view').css('opacity', 1);
            }

          }
        }, 300);
      });    

    },

    initQuickviewMoreview: function(sliderFor) {
      if (!sliderFor.hasClass('slick-initialized')) {
        sliderFor.slick({
          dots: true,
          slidesToScroll: 1,
          verticalSwiping: false,
          nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 17 33" xml:space="preserve"><g id="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="_x38_e584754-6657-46f1-a9d8-2cfd6623b552"><g><polygon points="14.9,14.5 0,0 0,3.7 11.1,14.5 13.2,16.5 11.1,18.5 0,29.3 0,33 14.9,18.5 17,16.5 "/></g></g></g></svg></button>',
          prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 33"><g id="7f9a1925-e8c7-4614-8787-3c6095a9f6e1" data-name="Layer 2"><g id="c9b7920a-81fa-4bfe-ad13-4da717c6854b" data-name="Layer 1"><g id="c2d982ff-0cf6-4220-b365-47f30d708fea" data-name="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="f51d455e-6b9c-4c4e-96db-a5004582beda" data-name="8e584754-6657-46f1-a9d8-2cfd6623b552"><polygon points="0 16.5 2.1 18.5 17 33 17 29.3 5.9 18.5 3.8 16.5 5.9 14.5 17 3.7 17 0 2.1 14.5 0 16.5"/></g></g></g></g></svg></button>'
        });
      };
    },

    initQuickviewAddToCart: function() {
      if ($('.quick-view .add-to-cart-btn').length) {
        $('.quick-view .add-to-cart-btn').off('click.quickViewAddToCart').on('click.quickViewAddToCart', function(e) {
          e.preventDefault();
          e.stopPropagation();

          var handle = $(this).closest('.variants').data('handle');

          if ($(this).attr('disabled') != 'disabled') {

            if (!window.ajax_cart) {
              $(this).closest('form').submit();
            } 

            else {
              var variant_id = $('.quick-view select[name=id]').val();

              if (!variant_id) {
                variant_id = $('.quick-view input[name=id]').val();
              };

              var quantity = $('.quick-view input[name=quantity]').val();

              if (!quantity) {
                quantity = 1;
              };

              lynkco.doAjaxAddToCart(variant_id, quantity, handle);
              lynkco.closeQuickViewPopup();
            };
          };
        });
      };
    },

    closeQuickViewPopup: function() {
      $('.quick-view').fadeOut(500);
      $('html').css({ "overflow": ""});
    },

    closeLookBookPopup: function(){
      $('.lookbook-modal').fadeOut(100);
    },

    initLookBookProduct: function(){
      $(document).on('click','.lookbook-item .pr-lb', function(){
        var handle = $(this).data('handle'),
            position = $(this);

        lynkco.doAjaxLookBook(handle, position);

        $('.lookbook-modal .close-modal').on('click',function(){
          lynkco.closeLookBookPopup();
        });        
      });
    },

    doAjaxLookBook: function(handle, position){
      if(window.innerWidth > 1024){
        var offSet = $(position).offset(),
            top= offSet.top,
            left = offSet.left,
            content = position.closest('.lazy-images-contain').innerWidth(),
            newtop = top - 200 + "px",
            newleft = left - 300 + "px";

        if(left < 350) {
          newleft = (left - 300) + 350 + "px";
        }
      }
      else{
        var offSet = $(position).offset(),
            top= offSet.top,
            left = offSet.left,
            newtop = top,
            newleft = left + 20 + "px";
      }

      $.ajax({
        url:'/products/'+handle+'?view=json',
        success: function(data) {
          $('.lookbook-modal').fadeIn(300).css({'left': newleft, 'top': newtop });;
          $('.lookbook-content').html(data);
          lynkco.translateBlock('.lookbook-content');
        },
        error: function(xhr, text) {
          $('.lookbook-modal').fadeOut(100);
          $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
          lynkco.showModalError('.ajax-error-modal');
        }
      });
    },

    translateText: function(str) {
      if (!window.multi_lang || str.indexOf("|") < 0)
        return str;

      if (window.multi_lang) {
        var textArr = str.split("|");
        if (translator.isLang2())
          return textArr[1];
        return textArr[0];
      }          
    },

    translateBlock: function(blockSelector) {
      if (window.multi_lang && translator.isLang2()) {
        translator.doTranslate(blockSelector);
      }
    },

    checkNeedToConvertCurrency: function() {
      //return window.show_multiple_currencies && Currency.currentCurrency != shopCurrency;
      return false;
    },

    initMobileMenu: function(){
      var width = window.innerWidth;                     
      var heightHeader = $('.header').outerHeight(); 	
      var heightTop = $('.top-header').outerHeight(); 
      var heightbottom = $('.bottom-header').outerHeight(); 

      if(width < 1025) {
        $('.mb-customer, .wrapper-top-cart, .navigation').css('top',heightHeader);

        $( window ).scroll(function() {
          if($('.bottom-header').hasClass('is_stuck')){
            $('.mb-customer, .wrapper-top-cart, .navigation').css('top',heightbottom);
          }
          else{
            $('.mb-customer, .wrapper-top-cart, .navigation').css('top',heightHeader);
          }
        });

        $('.menu-mobile .menuToggle').off('click').on('click', function(e) {
          var navigation = $('.navigation');

          $('html').toggleClass('menu-open');

          if($('html').hasClass('menu-open')) {
            $('html').css({ "overflow": "hidden"});
          }
          else {
            $('html').css({ "overflow": ""});
            $('.navigation .site-nav .site-nav-dropdown.open-menu, .navigation .site-nav .site-nav-dropdown .inner ul.dropdow-lv2.open-menu').removeClass('open-menu').css({ "overflow": ""});
            $('.navigation .site-nav .icon-dropdown').removeClass('mobile-toggle-open');
          }

          $('.wrap-overlay').on('click', function(){            
            $('html').removeClass('menu-open');
            $('html').css({ "overflow": ""});
            $('.navigation .site-nav .site-nav-dropdown.open-menu, .navigation .site-nav .site-nav-dropdown .inner ul.dropdow-lv2.open-menu').removeClass('open-menu').css({ "overflow": ""});
            $('.navigation .site-nav .icon-dropdown').removeClass('mobile-toggle-open');
          });

          if( $('.header-search').hasClass('search-open') || $('html').hasClass('customer-open') || $('html').hasClass('opencart')){
            $('.header-search').removeClass('search-open');    
            $('html').removeClass("customer-open");            
            $('html').removeClass('opencart');
          }
        });

        $('.header-search .searchToggle').off('click').on('click', function(){

          $('.header-search').toggleClass('search-open');
          $('.header-search .search-form input.input-group-field').focus();

          if($('html').hasClass('menu-open') || $('html').hasClass('customer-open') || $('html').hasClass('opencart')){
            $('html').removeClass('menu-open');  
            $('html').removeClass("customer-open"); 
            $('html').removeClass('opencart');
          }

        });

        $('.mobile-items .userToggle').off('click').on('click', function(){

          $('html').toggleClass('customer-open');

          $('.wrap-overlay').on('click', function(){
            $('html').removeClass('customer-open');
          });

          if($('html').hasClass('menu-open') || $('.header-search').hasClass('search-open') || $('html').hasClass('opencart') ){
            $('html').removeClass('menu-open');       
            $('.header-search').removeClass("search-open");        
            $('html').removeClass('opencart');
          }

        });

        $('.hd-option').insertAfter($('.navigation .site-nav'));                 
      }

      else{
        $('.wrapper-top-cart').css('top',0);
        $('.wrap-overlay').css('top',0);

        if($('.header-layout-3').length) {
          $('.lang-groups').insertAfter($('.hd-multi-cur .lang-block .fa-angle-down'));
          $('.currency-groups').insertAfter($('.hd-multi-cur .currency-block .fa-angle-down'));
        }

        else{
          $('.hd-option').insertAfter($('.hd-multi-cur button.btn'));
        }
      }
    },

    linkClickDropdownMenu: function() {
      var menuMobile = $('.site-nav .dropdown > a, .site-nav .second-menu');
      var heightHeader = jQuery('.header').outerHeight(); 
      var heightbottom = $('.bottom-header').outerHeight(); 

      menuMobile.off('click.current').on('click.current', function(e) {
        var isClickOneTime = $(this).attr('is-click-1-time');

        if(isClickOneTime !== 'true') {
          e.preventDefault();
          e.stopPropagation();

          $(this).attr('is-click-1-time', 'true');

          $(this).next().addClass('open-menu');

          if($('.bottom-header').hasClass('is_stuck')){
            $(this).next().css('top',heightbottom);
          }
          else{
            $(this).next().css({ "top": heightHeader});
          };


          $(this).children('.icon-dropdown').addClass("mobile-toggle-open");
          $(this).closest('.navigation').css({ "overflow": "hidden"});
          $(this).closest('.site-nav-dropdown').css({ "overflow": "hidden"});
          $('.open-menu').animate({scrollTop: 0}, 400);
        };
      });

      var menuMbTitle = $('.menu-mb-title');

      menuMbTitle.off('click.closeMenu').on('click.closeMenu', function() {
        $(this).parent().removeClass('open-menu');
        $(this).parent().prev().children('.icon-dropdown').removeClass('mobile-toggle-open');

        $(this).closest('.navigation').css({ "overflow": ""});
        $(this).closest('.site-nav-dropdown').css({ "overflow": ""});
      })
    },

    initDropdownMenuMobile: function() {
      if(window.innerWidth < 1025) {
        var heightHeader = jQuery('.header').outerHeight(); 
        var heightbottom = $('.bottom-header').outerHeight(); 

        var iconDropdown = $('.site-nav .icon-dropdown:not(.no-event)');

        iconDropdown.off('click.dropdownMenu').on('click.dropdownMenu', function(e) {
          e.preventDefault();
          e.stopPropagation();

          if($(this).hasClass('mobile-toggle-open')) {
            $(this).parent().next().removeClass('open-menu');
            $(this).removeClass("mobile-toggle-open");  

            $(this).closest('.navigation').css({ "overflow": ""});
            $(this).closest('.site-nav-dropdown').css({ "overflow": ""});
          }

          else {              
            $(this).parent().next().addClass('open-menu');
            $(this).addClass("mobile-toggle-open");

            if($('.bottom-header').hasClass('is_stuck')){
              $(this).parent().next().css('top',heightbottom);
            }
            else{
              $(this).parent().next().css({ "top": heightHeader});
            };

            $(this).closest('.navigation').css({ "overflow": "hidden"});
            $(this).closest('.site-nav-dropdown').css({ "overflow": "hidden"});

            $('.open-menu').animate({scrollTop: 0}, 400);
          }
        });

        lynkco.linkClickDropdownMenu();
      }

      else {
        $('.site-nav-dropdown').css({"opacity": "", "display": "", "visibility": "", "height": "", "overflow": ""});
      };
    },

    OpenCart: function(){
      $('.cartToggle').on('click', function(){
        $('html').toggleClass('opencart');
        $('.wrap-overlay, .close-cart, .text-continue .btn').on('click', function(){
          $('html').removeClass('opencart');
        });

        if($('html').hasClass('menu-open') || $('.header-search').hasClass('search-open') || $('html').hasClass('customer-open') ){
          $('html').removeClass('menu-open');       
          $('.header-search').removeClass("search-open");    
          $('html').removeClass("customer-open")
        }

      });
    },

    MultiOption: function(){
      if($('.header-layout-1').length) {
        var sortbyTextLang =$('.lang-switcher').find('.active').text().trim();
        var lang = sortbyTextLang.replace(/(<([^>]+)>)/ig, "");

        lang = lang.substr(0,3);
        $(".hd_lang").text(lang);
      }

      if($('.header-layout-3').length) {
        var sortbyTextLang =$('.lang-switcher').find('.active').text().trim();

        $(".hd_lang").text(sortbyTextLang);
      }

      var sortbyText = $('#currencies').find('.active').text().trim();

      $(".hd_currency").text(sortbyText);

      var icon_img = $('.lang-switcher').find('.active img').attr('src');

      $('.hd-multi-cur .icon-lang img').attr({ src: icon_img });

      $('#currencies li').on('click', function(){
        var sortbyText = $('#currencies').find('.active').text();

        $(".hd_currency").text(sortbyText);
      });


      if(!$('.header-layout-3').length) {
        $(document).click(function(e){
          var mult = $(".hd-multi-cur .btn");

          if (!mult.is(e.target) && mult.has(e.target).length === 0 ){
            $('.hd-multi-cur .hd-option').slideUp(300);
            $('html').removeClass('open-lang');
          }
        });

        $('.hd-multi-cur .btn').on('click', function(){
          $('.hd-multi-cur .hd-option').slideToggle(300);
          $('html').toggleClass('open-lang');

        }); 
      }          
    },

    initColorSwatchGrid: function() {
      navigator.sayswho= (function(){
        var ua= navigator.userAgent, tem, 
            M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if(/trident/i.test(M[1])){
          tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
          return 'IE '+(tem[1] || '');
        }
        if(M[1]=== 'Chrome'){
          tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
          if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
        }
        M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
        if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
        return M.join(' ');
      })();

      function GetIEVersion( browser ) {
        var Idx = browser.indexOf("Edge");
        if (Idx != -1) 
          return 1;

        var Idx = browser.indexOf("MSIE");
        if (Idx > 0) 
          return parseInt(sAgent.substring(Idx+ 5, sAgent.indexOf(".", Idx)));
        else if (!!navigator.userAgent.match(/Trident\/7\./)) 
          return 11;
        else
          return 0;
      }
      if (!GetIEVersion(navigator.sayswho) > 0){
        $('.item-swatch li').find('label').each(function(i, val){
          $(this).removeAttr('data-imgie');
        });
      }
      $(document).on('click', '.item-swatch li label', function(){

        $(".item-swatch li label").removeClass("active");
        $(this).addClass("active");


        if (GetIEVersion(navigator.sayswho) > 0){
          if(!$('.view-mode a.view-two').hasClass('active')){
            var newImage = $(this).data('imgie');
          } else{
            var newImage = $(this).data('img');
          }
        }else{
          var newImage = $(this).data('img');
        }
        $(this).parents('.grid-item, .image-banner').find('.product-grid-image img.images-one').attr({ src: newImage }); 
        return false;
      });

    },

    slideshow: function() {       
      var slideshow =  $(".home-slideshow .sl-wrp, .lookbook_page .sl-wrp");

      if(slideshow.length){
         slideshow.not('.slick-initialized').slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplay: slideshow.data('auto'), 
          autoplaySpeed: slideshow.data('speed'),
          adaptiveHeight: false,
          arrows: true,
          nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 17 33" xml:space="preserve"><g id="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="_x38_e584754-6657-46f1-a9d8-2cfd6623b552"><g><polygon points="14.9,14.5 0,0 0,3.7 11.1,14.5 13.2,16.5 11.1,18.5 0,29.3 0,33 14.9,18.5 17,16.5 "/></g></g></g></svg></button>',
          prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 33"><g id="7f9a1925-e8c7-4614-8787-3c6095a9f6e1" data-name="Layer 2"><g id="c9b7920a-81fa-4bfe-ad13-4da717c6854b" data-name="Layer 1"><g id="c2d982ff-0cf6-4220-b365-47f30d708fea" data-name="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="f51d455e-6b9c-4c4e-96db-a5004582beda" data-name="8e584754-6657-46f1-a9d8-2cfd6623b552"><polygon points="0 16.5 2.1 18.5 17 33 17 29.3 5.9 18.5 3.8 16.5 5.9 14.5 17 3.7 17 0 2.1 14.5 0 16.5"/></g></g></g></g></svg></button>',
          speed : 1000,
          dots: true,
          fade:true,
          responsive: [
            {
              breakpoint: 1024,
              settings: {
                arrows:false,
              }
            }
          ]
        }).slick('slickPause');
        
        setTimeout(function() {
         slideshow.slick('slickPlay');
        },3000);
      }
    },

    featuredproduct: function(widgetProduct){
      widgetProduct.each(function(){
        var featured_product =  $(this).find('.products-grid');

        if(featured_product.length){
          featured_product.not('.slick-initialized').slick({
            slidesToShow: featured_product.data('row'),
            slidesToScroll: featured_product.data('row'),
            arrows: true,
            nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 17 33" xml:space="preserve"><g id="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="_x38_e584754-6657-46f1-a9d8-2cfd6623b552"><g><polygon points="14.9,14.5 0,0 0,3.7 11.1,14.5 13.2,16.5 11.1,18.5 0,29.3 0,33 14.9,18.5 17,16.5 "/></g></g></g></svg></button>',
            prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 33"><g id="7f9a1925-e8c7-4614-8787-3c6095a9f6e1" data-name="Layer 2"><g id="c9b7920a-81fa-4bfe-ad13-4da717c6854b" data-name="Layer 1"><g id="c2d982ff-0cf6-4220-b365-47f30d708fea" data-name="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="f51d455e-6b9c-4c4e-96db-a5004582beda" data-name="8e584754-6657-46f1-a9d8-2cfd6623b552"><polygon points="0 16.5 2.1 18.5 17 33 17 29.3 5.9 18.5 3.8 16.5 5.9 14.5 17 3.7 17 0 2.1 14.5 0 16.5"/></g></g></g></g></svg></button>',       
            speed : 1000,
            responsive: [
              {
                breakpoint: 1025,
                settings: {
                  slidesToShow: 4,
                  slidesToScroll: 4      
                }
              },
              {
                breakpoint: 1024,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 3,
                  dots: true,
                  arrows: false
                }
              },
              {
                breakpoint: 767,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 2,
                  dots: true,
                  arrows: false
                }
              }
            ]
          });
        }
      });
    },

    brands: function(){
      $('.slider-brand-wrapper').each(function(){
        var brand_slider =  $(this).find('.slide-brand');
        if(brand_slider.length){
          brand_slider.not('.slick-initialized').slick({
            slidesToShow: brand_slider.data('row'),
            slidesToScroll: brand_slider.data('row'),
            arrows: true,
            nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 17 33" xml:space="preserve"><g id="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="_x38_e584754-6657-46f1-a9d8-2cfd6623b552"><g><polygon points="14.9,14.5 0,0 0,3.7 11.1,14.5 13.2,16.5 11.1,18.5 0,29.3 0,33 14.9,18.5 17,16.5 "/></g></g></g></svg></button>',
            prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 33"><g id="7f9a1925-e8c7-4614-8787-3c6095a9f6e1" data-name="Layer 2"><g id="c9b7920a-81fa-4bfe-ad13-4da717c6854b" data-name="Layer 1"><g id="c2d982ff-0cf6-4220-b365-47f30d708fea" data-name="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="f51d455e-6b9c-4c4e-96db-a5004582beda" data-name="8e584754-6657-46f1-a9d8-2cfd6623b552"><polygon points="0 16.5 2.1 18.5 17 33 17 29.3 5.9 18.5 3.8 16.5 5.9 14.5 17 3.7 17 0 2.1 14.5 0 16.5"/></g></g></g></g></svg></button>',
            speed : 1000,   
            dots: false,
            responsive: [
              {
                breakpoint: 1025,
                settings: {
                  slidesToShow: 4,
                  slidesToScroll: 4      
                }
              },
              {
                breakpoint: 1024,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 3,
                  dots: false,
                  arrows: true
                }
              },
              {
                breakpoint: 767,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 2,
                  dots: false,
                  arrows: true
                }
              }
            ]
          });
        }
      });
    },

    Slickslider: function(dataslick, row){
      dataslick.not('.slick-initialized').slick({
        slidesToShow: row,
        slidesToScroll: row,
        arrows: true,
        nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 17 33" xml:space="preserve"><g id="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="_x38_e584754-6657-46f1-a9d8-2cfd6623b552"><g><polygon points="14.9,14.5 0,0 0,3.7 11.1,14.5 13.2,16.5 11.1,18.5 0,29.3 0,33 14.9,18.5 17,16.5 "/></g></g></g></svg></button>',
        prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 33"><g id="7f9a1925-e8c7-4614-8787-3c6095a9f6e1" data-name="Layer 2"><g id="c9b7920a-81fa-4bfe-ad13-4da717c6854b" data-name="Layer 1"><g id="c2d982ff-0cf6-4220-b365-47f30d708fea" data-name="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="f51d455e-6b9c-4c4e-96db-a5004582beda" data-name="8e584754-6657-46f1-a9d8-2cfd6623b552"><polygon points="0 16.5 2.1 18.5 17 33 17 29.3 5.9 18.5 3.8 16.5 5.9 14.5 17 3.7 17 0 2.1 14.5 0 16.5"/></g></g></g></g></svg></button>',        
        speed : 1000,  
        responsive: [
          {
            breakpoint: 1025,
            settings: {
              slidesToShow: 4,
              slidesToScroll: 4      
            }
          },
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              dots: true,
              arrows: false
            }
          },
          {
            breakpoint: 767,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              dots: true,
              arrows: false
            }
          }
        ]
      });
    },

    ProductTabs: function(){
      $('.home-best-seller').each(function(){
        var sectionID = $(this).data('id'),
            dataUrl = $(this).find('.tab-active').data('href'),
            dataProducts = $(this).find('.tab-content .active .product-grids'),
            row = $(this).find('.tab-content .active').data('row');

        $.ajax({
          url: dataUrl,
          type:'GET',
          success: function(data){
            if(dataUrl == '/collections/?view=json'){
              $('.product-tab-bottom .loading').text('Please link to collctions');
            }
            $(dataProducts).html($(data).find('.grid-items').html());            
            lynkco.Slickslider(dataProducts, row);
            lynkco.initColorSwatchGrid();

            if (window.show_multiple_currencies) {
             // Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
            }
            lynkco.translateBlock(".home-best-seller");
          },
          error: function (msg) {
            $('.product-tab-bottom .loading').text('Please link to collctions');
          },
        });

      });

      var selected = $('.home-best-seller .nav-tabs li a:not(.tab-active)');

      $(selected).on('click', function(event){
        var dataUrl = $(this).data('href');
        var dataID =  $(this).attr('href');
        var dataPR = $(dataID).find('.product-grids');
        var row = $(dataID).data('row');

        if($(dataPR).hasClass('slick-initialized')){
          event.preventDefault();
        }

        else{
          $.ajax({
            url: dataUrl,
            type:'GET',
            success: function(data){
              if(dataUrl == '/collections/?view=json'){
                $(dataPR).find('.loading').text('Sorry, there are no products in this collection');
              }
              $(dataPR).html($(data).find('.grid-items').html());
              lynkco.Slickslider(dataPR, row);
              lynkco.initColorSwatchGrid();

              if (window.show_multiple_currencies) {
              //  Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
              }
            },
            error: function (msg) {
              $('.product-tab-bottom .loading').text('Sorry, there are no products in this collection');
            },
          });
        }


      });
    },

    initScrollDown: function(){
      $('.parallax-one-image').each(function(){
        var target = $(this).parents('.shopify-section').next('.shopify-section').attr('id');
        $(this).find('.scroll-down').attr('href', '#'+ target +'');
      });

      $('.scroll-down').on('click', function(event) {
        var scroll = $(this.getAttribute('href'));
        if( scroll.length ) {
          event.preventDefault();

          $('html, body').stop().animate({
            scrollTop: scroll.offset().top
          }, 500);
        }

      })
    },

    initShuffleList: function(listRow, gridItem) {
      var listCollections = $(listRow);

      if(listCollections.length) {
        var Shuffle = window.Shuffle;
        var element = listCollections;
        var sizer = element.find('.my-sizer-element');

        var shuffleInstance = new Shuffle(element, {
          itemSelector: gridItem,
          sizer: sizer
        });
      };
    },

    dropDownSubCategory: function() {
      $('.sidebar .caret').on('click', function(e){
        var mn = $(this).parent('li');
        if($(mn).hasClass('active')) {
          $(this).next().slideUp(200);
          $(mn).removeClass('active');
        }
        else{
          $(this).next().slideDown(200);
          $(mn).addClass('active');
        }
      });
    },

    setActiveViewMode: function() {
      var viewMode = $('.view-mode'),
          viewAs = viewMode.find('a:not(".view-one")'),
          viewAsActive = viewMode.find('a.active:not(".view-one")');

      var windowWidth = $(window).width();

      if(windowWidth < 768) {
        if(viewAsActive.hasClass('view-three') || viewAsActive.hasClass('view-four') || viewAsActive.hasClass('view-five') ) {
          viewAsActive.removeClass('active');
          viewMode.find('.view-two').addClass('active');
        }
      }

      else if(windowWidth < 1200 && windowWidth >= 768) {
        if(viewAsActive.hasClass('view-four') || viewAsActive.hasClass('view-five')) {
          viewAsActive.removeClass('active');
          viewMode.find('.view-three').addClass('active');
        }
      }

      lynkco.viewAs();
    },

    viewAs: function() {
      var productColl = $('.product-collection'),
          gridItem = productColl.find('.grid-item'),
          imgBanner = productColl.find('.image-banner'),
          mySizeEms = productColl.find('.my-sizer-element'),
          bannerColle = productColl.find('.banner-collection');

      var viewMode = $('.view-mode'),
          viewAs = viewMode.find('a'),
          viewAsActive = viewMode.find('a.active');

      if(viewAsActive.hasClass('view-two')) {
        gridItem.removeAttr('class').addClass('grid-item col-6 col-md-6 col-lg-6 col-xl-6');            
        imgBanner.removeAttr('class').addClass('image-banner grid-item col-6 col-md-6 col-lg-6 col-xl-6'); 
        bannerColle.removeAttr('class').addClass('image-banner col-6 banner-collection banner-2 col-md-6 col-lg-6 col-xl-6');  
      }
      else if(viewAsActive.hasClass('view-three')) {
        gridItem.removeAttr('class').addClass('grid-item col-6 col-md-4 col-lg-4 col-xl-4');         
        imgBanner.removeAttr('class').addClass('image-banner grid-item col-6 col-md-4 col-lg-4 col-xl-4'); 
        bannerColle.removeAttr('class').addClass('image-banner col-6 banner-collection banner-3 col-md-8 col-lg-8 col-xl-8');
      }
      else if(viewAsActive.hasClass('view-four')) {
        gridItem.removeAttr('class').addClass('grid-item col-6 col-md-4 col-lg-4 col-xl-3');         
        imgBanner.removeAttr('class').addClass('image-banner grid-item col-6 col-md-4 col-lg-4 col-xl-3'); 
        bannerColle.removeAttr('class').addClass('image-banner col-6 banner-collection banner-4 col-md-6 col-lg-6 col-xl-6');
      }
      else if(viewAsActive.hasClass('view-five')) {
        gridItem.removeAttr('class').addClass('grid-item col-6 col-md-4 col-lg-4 col5');         
        imgBanner.removeAttr('class').addClass('image-banner grid-item col-6 col-md-4 col-lg-4 col5'); 
        bannerColle.removeAttr('class').addClass('image-banner col-6 banner-collection banner-5 col5-40');
      };

      mySizeEms.addClass('my-sizer-element');
    },

    InitViewAs: function(){
      lynkco.setActiveViewMode();

      $(document).on('click','.view-mode a',function(){
        var productColl = $('.product-collection'),
            gridItem = productColl.find('.grid-item'),
            imgBanner = productColl.find('.image-banner'),
            mySizeEms = productColl.find('.my-sizer-element'),
            bannerColle = productColl.find('.banner-collection');

        $('.view-mode a').removeClass('active');
        $(this).addClass('active');

        if( $(this).hasClass('view-one')){
          var paging = $(".filter-show > button span").text();

          Shopify.queryParams.view = "list" + paging; 
          lynkco.toolbarAjaxClick();
        }

        else if( $(this).hasClass('view-grid')){
          Shopify.queryParams.view = paging;
          lynkco.toolbarAjaxClick();
        }               

        else if( $(this).hasClass('view-two')){
          gridItem.removeAttr('class').addClass('grid-item col-6 col-md-6 col-lg-6 col-xl-6'); 
          imgBanner.removeAttr('class').addClass('image-banner grid-item col-6 col-md-6 col-lg-6 col-xl-6'); 
          bannerColle.removeAttr('class').addClass('image-banner col-6 banner-collection banner-2 col-md-6 col-lg-6 col-xl-6');          
        }
        else if( $(this).hasClass('view-three')){
          gridItem.removeAttr('class').addClass('grid-item col-6 col-md-4 col-lg-4 col-xl-4');           
          imgBanner.removeAttr('class').addClass('image-banner grid-item col-6 col-md-4 col-lg-4 col-xl-4');
          bannerColle.removeAttr('class').addClass('image-banner col-6 banner-collection banner-3 col-md-8 col-lg-8 col-xl-8');
        }
        else if( $(this).hasClass('view-four')){
          gridItem.removeAttr('class').addClass('grid-item col-6 col-md-4 col-lg-4 col-xl-3');           
          imgBanner.removeAttr('class').addClass('image-banner grid-item col-6 col-md-4 col-lg-4 col-xl-3'); 
          bannerColle.removeAttr('class').addClass('image-banner col-6 banner-collection banner-4 col-md-6 col-lg-6 col-xl-6');
        }
        else if( $(this).hasClass('view-five')){
          gridItem.removeAttr('class').addClass('grid-item col-6 col-md-4 col-lg-4 col5');           
          imgBanner.removeAttr('class').addClass('image-banner grid-item col-6 col-md-4 col-lg-4 col5'); 
          bannerColle.removeAttr('class').addClass('image-banner col-6 banner-collection banner-5 col5-40');
        };

        mySizeEms.addClass('my-sizer-element');

        clearTimeout(lynkco.lynkcoTimeout);

        lynkco.lynkcoTimeout = setTimeout(function() {
          lynkco.initShuffleList('.collections-mansory', '.collections-mansory .grid-item');
          lynkco.initShuffleList('.collections-banner-mansory', '.collections-banner-mansory .image-banner');
        }, 300);                  
      });
    },

    InitsidebarFilter: function(){
      $(document).on('click', '.halo-fillter', function(){
        $('html').toggleClass('filter-open');

        $('.wrap-overlay, .close-filter a').on('click', function(){
          $('html').removeClass('filter-open');
        });

      });
    },

    initProductMoreview: function() {   
      if ($('.product .product-img-box').hasClass('horizontal')) {
        lynkco.initHorizontallMoreview($('.product .slider-for'), $('.product .slider-nav'));
      }

      else if ($('.product .product-img-box').hasClass('vertical')) {
        if($('.product').hasClass('grouped-product')) {
          lynkco.initVerticalMoreviewGroupedPr($('.grouped-product .slider-for'), $('.product .slider-nav'));
        }

        else if (!$('.vertical-tab-fullwidth').length) {
          if(!$('.product-sidebar').length) {
            lynkco.initVerticalMoreview($('.product .slider-for'), $('.product .slider-nav'));
          }
          else {
            lynkco.initVerticalMoreviewHasSibebar($('.product .slider-for'), $('.product .slider-nav'));
          };          
        };        
      };

    },

    initHorizontallMoreview: function(sliderFor, sliderNav) {
      if (!sliderFor.hasClass('slick-initialized') && !sliderNav.hasClass('slick-initialized')) {
        sliderFor.slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          fade: true,
          verticalSwiping: false,
          asNavFor: sliderNav
        });

        sliderNav.slick({
          infinite: true,
          slidesToShow: 5,
          slidesToScroll: 1,
          asNavFor: sliderFor,
          verticalSwiping: false,
          dots: false,
          focusOnSelect: true,
          nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 17 33" xml:space="preserve"><g id="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="_x38_e584754-6657-46f1-a9d8-2cfd6623b552"><g><polygon points="14.9,14.5 0,0 0,3.7 11.1,14.5 13.2,16.5 11.1,18.5 0,29.3 0,33 14.9,18.5 17,16.5 "/></g></g></g></svg></button>',
          prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 33"><g id="7f9a1925-e8c7-4614-8787-3c6095a9f6e1" data-name="Layer 2"><g id="c9b7920a-81fa-4bfe-ad13-4da717c6854b" data-name="Layer 1"><g id="c2d982ff-0cf6-4220-b365-47f30d708fea" data-name="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="f51d455e-6b9c-4c4e-96db-a5004582beda" data-name="8e584754-6657-46f1-a9d8-2cfd6623b552"><polygon points="0 16.5 2.1 18.5 17 33 17 29.3 5.9 18.5 3.8 16.5 5.9 14.5 17 3.7 17 0 2.1 14.5 0 16.5"/></g></g></g></g></svg></button>',        
          responsive: [
            {
              breakpoint: 1200,
              settings: {
                slidesToShow:4,
                slidesToScroll: 1
              }
            },

            {
              breakpoint: 360,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1
              }
            }
          ]
        });
      };
    },

    initVerticalMoreview: function(sliderFor, sliderNav) {
      if (!sliderFor.hasClass('slick-initialized') && !sliderNav.hasClass('slick-initialized')) {
        sliderFor.slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          fade: true,
          verticalSwiping: false,
          asNavFor: sliderNav
        });

        sliderNav.slick({
          infinite: true,
          slidesToShow: 5,
          slidesToScroll: 1,
          vertical: true,
          asNavFor: sliderFor,
          verticalSwiping: false,
          dots: false,
          focusOnSelect: true,
          nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 17 33" xml:space="preserve"><g id="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="_x38_e584754-6657-46f1-a9d8-2cfd6623b552"><g><polygon points="14.9,14.5 0,0 0,3.7 11.1,14.5 13.2,16.5 11.1,18.5 0,29.3 0,33 14.9,18.5 17,16.5 "/></g></g></g></svg></button>',
          prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 33"><g id="7f9a1925-e8c7-4614-8787-3c6095a9f6e1" data-name="Layer 2"><g id="c9b7920a-81fa-4bfe-ad13-4da717c6854b" data-name="Layer 1"><g id="c2d982ff-0cf6-4220-b365-47f30d708fea" data-name="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="f51d455e-6b9c-4c4e-96db-a5004582beda" data-name="8e584754-6657-46f1-a9d8-2cfd6623b552"><polygon points="0 16.5 2.1 18.5 17 33 17 29.3 5.9 18.5 3.8 16.5 5.9 14.5 17 3.7 17 0 2.1 14.5 0 16.5"/></g></g></g></g></svg></button>',        
          responsive: [
            {

              breakpoint: 992,
              settings: {
                slidesToShow: 4,
                slidesToScroll: 1,
                vertical: false
              }
            },
            {
              breakpoint: 360,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                dots: false,
                vertical: false
              }
            }
          ]
        });
      };
    },

    initVerticalMoreviewHasSibebar: function(sliderFor, sliderNav) {
      if (!sliderFor.hasClass('slick-initialized') && !sliderNav.hasClass('slick-initialized')) {
        sliderFor.slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          fade: true,
          verticalSwiping: false,
          asNavFor: sliderNav
        });

        sliderNav.slick({
          infinite: true,
          slidesToShow: 3,
          slidesToScroll: 1,
          vertical: true,
          asNavFor: sliderFor,
          verticalSwiping: false,
          dots: false,
          focusOnSelect: true,
          nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 17 33" xml:space="preserve"><g id="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="_x38_e584754-6657-46f1-a9d8-2cfd6623b552"><g><polygon points="14.9,14.5 0,0 0,3.7 11.1,14.5 13.2,16.5 11.1,18.5 0,29.3 0,33 14.9,18.5 17,16.5 "/></g></g></g></svg></button>',
          prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 33"><g id="7f9a1925-e8c7-4614-8787-3c6095a9f6e1" data-name="Layer 2"><g id="c9b7920a-81fa-4bfe-ad13-4da717c6854b" data-name="Layer 1"><g id="c2d982ff-0cf6-4220-b365-47f30d708fea" data-name="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="f51d455e-6b9c-4c4e-96db-a5004582beda" data-name="8e584754-6657-46f1-a9d8-2cfd6623b552"><polygon points="0 16.5 2.1 18.5 17 33 17 29.3 5.9 18.5 3.8 16.5 5.9 14.5 17 3.7 17 0 2.1 14.5 0 16.5"/></g></g></g></g></svg></button>',        
          responsive: [
            {

              breakpoint: 992,
              settings: {
                slidesToShow: 4,
                slidesToScroll: 1,
                vertical: false
              }
            },
            {
              breakpoint: 360,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                dots: false,
                vertical: false
              }
            }
          ]
        });
      };
    },

    initVerticalMoreviewGroupedPr: function(sliderFor, sliderNav) {
      if (!sliderFor.hasClass('slick-initialized') && !sliderNav.hasClass('slick-initialized')) {
        sliderFor.slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          fade: true,
          verticalSwiping: false,
          asNavFor: sliderNav
        });

        sliderNav.slick({
          infinite: true,
          slidesToShow: 5,
          slidesToScroll: 1,
          vertical: true,
          asNavFor: sliderFor,
          verticalSwiping: false,
          dots: false,
          focusOnSelect: true,
          nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 17 33" xml:space="preserve"><g id="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="_x38_e584754-6657-46f1-a9d8-2cfd6623b552"><g><polygon points="14.9,14.5 0,0 0,3.7 11.1,14.5 13.2,16.5 11.1,18.5 0,29.3 0,33 14.9,18.5 17,16.5 "/></g></g></g></svg></button>',
          prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 33"><g id="7f9a1925-e8c7-4614-8787-3c6095a9f6e1" data-name="Layer 2"><g id="c9b7920a-81fa-4bfe-ad13-4da717c6854b" data-name="Layer 1"><g id="c2d982ff-0cf6-4220-b365-47f30d708fea" data-name="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="f51d455e-6b9c-4c4e-96db-a5004582beda" data-name="8e584754-6657-46f1-a9d8-2cfd6623b552"><polygon points="0 16.5 2.1 18.5 17 33 17 29.3 5.9 18.5 3.8 16.5 5.9 14.5 17 3.7 17 0 2.1 14.5 0 16.5"/></g></g></g></g></svg></button>',        
          responsive: [
            {

              breakpoint: 1200,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1
              }
            },
            {

              breakpoint: 992,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                arrows: false,
                dots: true
              }
            },
            {

              breakpoint: 768,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                arrows: false,
                dots: true
              }
            },

            {

              breakpoint: 520,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                arrows: false,
                dots: true
              }
            },

            {
              breakpoint: 380,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
                dots: true
              }
            }
          ]
        });
      };
    },

    initZoom: function() {
      if ($(window).width() >= 1025 ) {
        $('.contain-images-pr .fancybox').zoom();
      }
      else {    
        $('.contain-images-pr .fancybox').trigger('zoom.destroy');
      }             
    },

    initFancyboxProductPage: function() {
      $('[data-fancybox="images"]').fancybox({
        loop : true,
        autoCenter: true,
        openSpeed: 700,
        closeSpeed: 700,
        nextSpeed: 500,
        prevSpeed: 500,
        thumbs: false
      });
    },

    initStickyAddtoCart: function(){

      if ($('#grouped-add-to-cart').length){
        $('.sticky_form .sticky-item.extra').remove();
      }

      var p = $('#product-selectors option:selected').val();
      var t = $('.sticky_form .pr-swatch[data-value="'+p+'"]').text();
      $('.pr-selectors .pr-active').text(t);
      $('.sticky_form .pr-swatch[data-value="'+p+'"]').addClass('active');


      $( ".swatch .swatch-element" ).each(function(e) {
        var dav = $(this).data("value");
        $('.swatch input.text[data-value="'+dav+'"]').appendTo($(this))
      });


      $( ".selector-wrapper" ).change(function() {
        var n =$("#product-selectors").val();
        $( ".sticky_form .pr-selectors li" ).each(function( e ) {
          var t =$(this).find('a').data('value');
          if(t == n){
            $(this).find('a').addClass('active')
          } else{
            $(this).find('a').removeClass('active')
          }
        });
        $( "#product-selectors" ).change(function() {
          var str = "";
          $( "#product-selectors option:selected" ).each(function() {
            str += $( this ).data('imge');
          });
          $('.sticky_form .pr-img img').attr("src",str );
        }).trigger( "change" );

        if($('.sticky_form .pr-swatch').hasClass('active')){
          var h = $('.sticky_form .pr-swatch.active').text();
          $('.sticky_form .action input[type=hidden]').val(n);
          $('.sticky_form .pr-active').text(h);
          $('.sticky_form .pr-active').attr('data-value', n);
        }

      });

      $(document).click(function(e){
        var container = $(".sticky_form .pr-active");
        if (!container.is(e.target) && container.has(e.target).length === 0){
          $('.sticky_form').removeClass('open-sticky');
        }
      });

      $('.sticky_form .pr-active').on('click', function(){
        $('.sticky_form').toggleClass('open-sticky');
      });

      $('.sticky_form .pr-swatch').on('click', function(e){        
        $('.sticky_form .pr-swatch').removeClass('active');
        $(this).addClass('active');


        $('.sticky_form').toggleClass('open-sticky');


        var text = $(this).text(),
            value = $(this).data('value');

        $('.sticky_form .action input[type=hidden]').val(value);
        $('.sticky_form .pr-active').attr('data-value', value);
        $('.sticky_form .pr-active').text(text);
        $( '.swatch input.text[data-v="'+value+'"]' ).parent().find('.tric').click();

        if($(this).hasClass('sold-out')){
          $('.sticky-add-to-cart').val(window.inventory_text.sold_out).addClass('disabled').attr('disabled', 'disabled');
        }
        else{
          $('.sticky-add-to-cart').removeClass('disabled').removeAttr('disabled').val(window.inventory_text.add_to_cart);
        }

        var newImage = $(this).data('img');
        $('.pr-img img').attr({ src: newImage }); 
        return false;

      });

      $(document).on('click', '.sticky-add-to-cart', function(event) {
        event.preventDefault();
        if ($('#grouped-add-to-cart').length){
          $('#grouped-add-to-cart').click();
        }else{
          $('#product-add-to-cart').click();
        }
        return false;
      });

      var height = $('.product').outerHeight();

      $(window).scroll(function () {
        var scrollTop = $(this).scrollTop();
        if (scrollTop > height) {
          $('body').addClass('show_sticky');
        }
        else {
          $('body').removeClass('show_sticky');
        }
      });    
    },

     initEventPopupNextPrevProduct: function() {
      var nextPrevBlock = $('.next-prev-product');
      var iconNextPrev = nextPrevBlock.find('.popup-pro');
      var currentEl;
      if(iconNextPrev.length && iconNextPrev.is(':visible')) {
        if(!('ontouchstart' in document)) {
          iconNextPrev.hover(function() {            
            $(this).find('.modal-pro').toggle();                                      
          });

          iconNextPrev.mouseleave(function() {
            if ($(this).find('.modal-pro').is(':visible')) {
              $(this).find('.modal-pro').hide();
            };
          });
        }
        else {
          iconNextPrev.off('click').on('click', function(e) {
            if (currentEl != this) {
            e.preventDefault();
            e.stopPropagation();
              currentEl = this;
            }
            var modalSibling = $(this).siblings('.popup-pro').find('.modal-pro');

            if(modalSibling.is(':visible')) {
              modalSibling.hide();
            }

            $(this).find('.modal-pro').toggle();  
          });

          $(document).on('click', function(e) {
            if(!$(e.target).closest('.modal-pro').length && iconNextPrev.children('.modal-pro').is(':visible')) {
              iconNextPrev.children('.modal-pro').hide();
            }
          });
        };      	
      }
    },

    initLookbookProductDescription: function() {
      var productLookbook = $('.product-lookbook:not(.grouped-lb)');
      var glyphIcon = productLookbook.find('.glyphicon');
      var glyphIconSlt = '.product-lookbook .glyphicon';

      if(glyphIcon.length) {
        $(document).on('click', glyphIconSlt, function(e){
          e.preventDefault();
          e.stopPropagation();

          var context = $(this).data('text'),
              position = $(this);

          lynkco.doAjaxLookbookProductDescription(context, position);

          $('.lookbook-modal .close-modal').on('click',function(){
            lynkco.closeLookBookPopup();
          });

        });
      }
    },

    doAjaxLookbookProductDescription: function(context, position){
      if(window.innerWidth > 1024){
        var offSet = $(position).offset(),
            top= offSet.top,
            left = offSet.left,
            content = position.closest('.lookbook-modal').innerWidth(),
            newtop = top - 50 + "px",
            newleft = left - 300 + "px";

        if((left - 300) < 10) {
          newleft = (left - 200) + content + "px";
        }
        //             newtop = top - 100 + "px",
        //             newleft = left - 100 + "px";
      }
      else{
        var offSet = $(position).offset(),
            top= offSet.top,
            left = offSet.left,
            newtop = top,
            newleft = left + 20 + "px";
      };

      $('.lookbook-content').html(context); 
      $('.lookbook-modal').addClass('lb-des').fadeIn(500).css({'left': newleft, 'top': newtop });           
    }, 

    initGroupedAddtoCart: function(){      
      $('.group_option select').change(function(){
        var optionValue1 = $(this).val(),
            optionImg = $(this).find('option:selected').data('img'),
            optionprice = $(this).find('option:selected').data('price');


        $(this).parents('.group_option').find('input[type=hidden]').val(optionValue1);
        $(this).parents('.group_product').find('.group-img img').attr({ src: optionImg });

        $(this).parents('.group_product').find('.group-price').html(Shopify.formatMoney(optionprice, window.money_format));
        console.log(Shopify.formatMoney(optionprice, window.money_format));
        if (lynkco.checkNeedToConvertCurrency()) {
        //  Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
        }
      });

      $(".group_content .button").on('click', function(e) {

        var oldValue = $(this).parents('.group_option').find('.group_number').val(),
            newVal = 0;

        if($(this).hasClass('group_inc')) {
          newVal = parseInt(oldValue) + 1;
        }
        else if(oldValue > 1) {
          newVal = parseInt(oldValue) - 1;
        }

        $(this).parents('.group_option').find('.group_number').val(newVal);
      });

      $('#grouped-add-to-cart').on('click', function(e) {
        e.preventDefault();
        var handle = $(this).parent('.groups-btn').data('handle');

        Shopify.queue = [];
        jQuery('.group_content .group_number').each(function() {
          var DataId = $(this).parents('.extra').find('input[type=hidden]').attr('value'),
              DataQty = $(this).val();
          if ( DataQty > 0 && DataId !== '') {
            Shopify.queue.push({
              variantId: DataId,
              quantity: parseInt(DataQty, 10) || 0
            });
          }
        });

        Shopify.moveAlong = function() {


          if (Shopify.queue.length) {
            var request = Shopify.queue.shift();
            $.ajax({
              type: 'POST',
              url: '/cart/add.js',
              data: {quantity: request.quantity, id:request.variantId},
              dataType: 'json',
              beforeSend: function() {
                lynkco.showLoading();
              },
              success:function(cart) {
                lynkco.hideLoading();
                Shopify.moveAlong();
              },
              error: function(xhr, text) {
                lynkco.hideLoading();
                $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                lynkco.showModalError('.ajax-error-modal');
              }
            });
          }

          else {

            if ($(this).attr('disabled') != 'disabled') {

              if (!window.ajax_cart) {
                $(this).closest('form').submit();
              } 

              else {
                var variant_id = $('#add-to-cart-form select[name=id]').val();

                if (!variant_id) {
                  variant_id = $('#add-to-cart-form input[name=id]').val();
                }

                var quantity = $('#add-to-cart-form input[name=quantity]').val();

                if (!quantity) {
                  quantity = 1;
                }

                lynkco.doAjaxAddToCart(variant_id, quantity, handle);
              }
            }
            return false;
          }

        };

        Shopify.moveAlong();
      });

    },

    initInfiniteScrolling: function() {
      if ($('.infinite-scrolling').length > 0) {
        $(document).on('click', '.infinite-scrolling a',function(e) {
          e.preventDefault();
          if (!$(this).hasClass('disabled')) {
            lynkco.doInfiniteScrolling();
          }
        });
      }
      window.infinitPos = 0;
      $(window).scroll(function(event) {
        if ($(".infinite-scrolling").length>0) {
          var pos = $(".infinite-scrolling").offset().top;
          if ($(this).scrollTop() > (pos - 600) && $(".infinite-scrolling").length>0
              && $(".infinite-scrolling a:eq(0)").is(":visible")
              && $(this).scrollTop() - window.infinitPos > 600
             ) {
            window.infinitPos = $(this).scrollTop();
            $(".infinite-scrolling a").trigger("click");
            event.stopPropagation();
            event.preventDefault();
          }
        }
      });
    },

    doInfiniteScrolling: function() {
      var currentList = $('.block-row .products-grid');

      if (!currentList.length) {
        currentList = $('.block-row .product-list');
      }
      if (currentList) {
        var showMoreButton = $('.infinite-scrolling a').first();

        $.ajax({
          type: 'GET',
          url: showMoreButton.attr("href"),
          beforeSend: function() {
            lynkco.showLoading();
            $('.loading-modal').show();
          },
          success: function(data) {
            lynkco.hideLoading();

            var products = $(data).find(".block-row .products-grid");

            if (!products.length) {
              products = $(data).find(".block-row .product-list");
            }

            if (products.length) {
              var collContent = currentList.closest('.collections-content-product');
              var viewAsActive = collContent.find('.view-mode .active');              
              var child = products.children(),
                  imgBanner = products.children('.image-banner'),
                  mySizeEms = products.children('.my-sizer-element'),
                  bannerColle = products.children('.banner-collection');

              if(child.find('.has-banner').length) {
                child.find('.has-banner').remove();
              }

              if(viewAsActive.hasClass('view-two')) {
                child.removeAttr('class').addClass('grid-item col-6 col-md-6 col-lg-6 col-xl-6'); 
                imgBanner.removeAttr('class').addClass('image-banner grid-item col-6 col-md-6 col-lg-6 col-xl-6'); 
                bannerColle.removeAttr('class').addClass('image-banner col-6 banner-collection banner-2 col-md-6 col-lg-6 col-xl-6');  
              }
              else if(viewAsActive.hasClass('view-three')) {
                child.removeAttr('class').addClass('grid-item col-6 col-md-4 col-lg-4 col-xl-4'); 
                imgBanner.removeAttr('class').addClass('image-banner grid-item col-6 col-md-4 col-lg-4 col-xl-4'); 
                bannerColle.removeAttr('class').addClass('image-banner col-6 banner-collection banner-3 col-md-8 col-lg-8 col-xl-8');
              }
              else if(viewAsActive.hasClass('view-four')) {
                child.removeAttr('class').addClass('grid-item col-6 col-md-4 col-lg-4 col-xl-3'); 
                imgBanner.removeAttr('class').addClass('image-banner grid-item col-6 col-md-4 col-lg-4 col-xl-3'); 
                bannerColle.removeAttr('class').addClass('image-banner col-6 banner-collection banner-4 col-md-6 col-lg-6 col-xl-6');
              }
              else if(viewAsActive.hasClass('view-five')) {
                child.removeAttr('class').addClass('grid-item col-6 col-md-4 col-lg-4 col5'); 
                imgBanner.removeAttr('class').addClass('image-banner grid-item col-6 col-md-4 col-lg-4 col5'); 
                bannerColle.removeAttr('class').addClass('image-banner col-6 banner-collection banner-5 col5-40');
              }

              mySizeEms.addClass('my-sizer-element');

              currentList.append(child);

              if(!window.template_suffix) {
                var childNew = currentList.append(child).children();

                childNew.each(function() {
                  if(!$(this).children().length) {
                    $(this).remove();
                  }
                });
              }

              clearTimeout(lynkco.lynkcoTimeout);

              lynkco.lynkcoTimeout = setTimeout(function() {
                lynkco.initShuffleList('.collections-mansory', '.collections-mansory .grid-item');
                lynkco.initShuffleList('.collections-banner-mansory', '.collections-banner-mansory .image-banner'); 
              }, 1000);

              lynkco.translateBlock(".main-content");

              //get link of Show more
              if ($(data).find('.infinite-scrolling').length > 0) {
                showMoreButton.attr('href', $(data).find('.infinite-scrolling a').attr('href'));
              } else {
                //no more products
                showMoreButton.hide();
                showMoreButton.next().show();
              }

              //currency
              if (window.show_multiple_currencies && window.shop_currency != jQuery(".currencies").val()){
              //  Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
              }

              //product review
              if ($(".spr-badge").length > 0) {
                return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
              }                            
            }
          },
          error: function(xhr, text) {
            lynkco.hideLoading();
            $('.loading-modal').hide();
            $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
            lynkco.showModal('.ajax-error-modal');
          },

          dataType: "html"
        });
      }
    },

    hieghtGalleryProduct: function (){
      var desProduct = $('.product-gallery .prod-gallery-top .prod-gallery-des');
      var galleryImg = $('.product-gallery .product-photo-container');
      var height_gallery_des = desProduct.outerHeight();
      var height_gallery_img = galleryImg.outerHeight();

      if( window.innerWidth > 767 ){

        if(height_gallery_des > height_gallery_img){
          desProduct.css('max-height', height_gallery_img);
        }

        else{
          $('.product-gallery .prod-gallery-top').css('height', height_gallery_img);
          $('.product-gallery .product-photo-container .thumb').addClass('not-height');
          desProduct.css('max-height', '');
        };

      }
    },

    initWishList: function(e){      
      var ListWishList = $('.wishlist-content'),
          button = $('.wishlist-btn'),
          itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];


      localStorage.setItem('items', JSON.stringify(itemsArray));

      var data = JSON.parse(localStorage.getItem('items'));

      if (itemsArray.length > 0) {
        itemsArray = JSON.parse(localStorage.getItem('items'));       
      };

      var currentpage = 1;
      var pagecount = 0;

      lynkco.translateBlock(".wishlist-page");

      var dataWishlist = function(ProductHandle) {
        jQuery.getJSON('/products/'+ProductHandle+'.js', function(product) {
          var productHTML = '';
          var price_min = Shopify.formatMoney(product.price_min, window.money_format);

          productHTML += '<div class="grid-item"  data-product-handle="'+product.handle+'" data-id="'+ product.id +'">';
          productHTML += '<div class="row2">';
          productHTML += '<div class="product-image col-md-2"><a href="'+product.url +'"><image src="'+product.featured_image +'" /></a></div>';
          productHTML += '<div class="product-bottom col-md-4">';
          productHTML += '<a class="product-title" href="'+product.url +'">'+product.title+'</a>';
          productHTML += '<div class="product-vendor">'+ product.vendor +'</div>';
          productHTML += '</div>';
          productHTML += '<div class="price-box col-md-2">'+ price_min +'</div>';
          productHTML += '<div class="col-md-3 wishlist-action"><form action="/cart/add" method="post" class="variants" enctype="multipart/form-data">';
          productHTML += '<input type="hidden" name="id" value="'+ product.variants[0].id +'" />  ';
          if (product.available) {
            if (product.variants.length == 1) {
              productHTML += '<input class="btn add-to-cart-btn1" type="submit" value="'+window.inventory_text.add_to_cart+'"/>'; 
            } 
            if (product.variants.length > 1){
              productHTML += '<a class="btn add-to-cart-btn1" href="'+product.url +'">'+window.inventory_text.select_options+'</a>';
            }
          } else {
            productHTML += '<input class="btn add-to-cart-btn1" disabled="disabled" type="submit" value="'+window.inventory_text.unavailable+'"/>';
          }
          productHTML += '</form></div>';
          productHTML += '<div class="btn-remove col-md-1"><a class="btn-active" href="#" data-id="'+ product.id +'"><svg class="closemnu" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="357px" height="357px" viewBox="0 0 357 357" style="enable-background:new 0 0 357 357;" xml:space="preserve"><g><g><polygon points="357,35.7 321.3,0 178.5,142.8 35.7,0 0,35.7 142.8,178.5 0,321.3 35.7,357 178.5,214.2 321.3,357 357,321.3 214.2,178.5"></polygon></g></g></svg></a></div>';
          productHTML += '</div></div>';
          productHTML.textContent = product; 
          ListWishList.append(productHTML).html();
          var currentpage = 1;
          var pagecount = 0;
          function showpage(page) {
            $('.wishlist-page .grid-item').hide();
            $('.wishlist-page .grid-item').eq((page-1)*3).show().next().show().next().show();
            $('#pagin').find('a').removeClass('current').eq(page).addClass('current');
          }

          $(".wishlist-page #pagin").on("click", "a", function(event){

            event.preventDefault();

            if($(this).html() == "next") {
              currentpage++;
            }
            else if($(this).html() == "previous") {
              currentpage--;
            }
            else {
              currentpage = $(this).html();
            }

            if(currentpage < 1) {currentpage = 1;}

            if(currentpage > pagecount) {currentpage = pagecount;}
            showpage(currentpage);
          });

          $(function() {
            pagecount = Math.floor(($('.wishlist-page .grid-item').size()) / 3);
            if (($('.wishlist-page .grid-item').size()) % 3 > 0) {
              pagecount++;
            }

            $('.wishlist-page #pagin').html('<li><a>previous</a></li>');

            for (var i = 1; i <= pagecount; i++) {
              $('#pagin').append('<li><a class="current">' + i + '</a></li>');
            }

            $('.wishlist-page #pagin').append('<li><a>next</a></li>');

            showpage(1);
          });

        });        
      };

      var updateWishlist = function (self) {
        var ProductHandle = $(self).attr('data-product-handle');

        jQuery.getJSON('/products/'+ProductHandle+'.js', function(product) {
          itemsArray.push(ProductHandle);
          localStorage.setItem('items', JSON.stringify(itemsArray));
          dataWishlist(ProductHandle); 

          var x = itemsArray.length;  

          $('.wishlist .wishCount').text(x);
        });
      };

      var le = function (self){
        var x = itemsArray.length; 

        $('.wishlist .wishCount').text(x);
      };

      data.forEach(function(item) {
        dataWishlist(item);
      });

      $(document).on('click', '.wishlist-btn:not(.btn-active)', function(e){

        e.preventDefault();
        $(this).toggleClass('btn-active');
        $(this).find(".wishlist_text").text(window.inventory_text.remove_wishlist);
        updateWishlist(this);
      }); 

      $(document).on('click', '.btn-active', function(e){
        $(this).find(".wishlist_text").text(window.inventory_text.add_wishlist);
        e.preventDefault();	
        var ProductHandle = $(self).attr('data-product-handle'),
            removeIndex = itemsArray.indexOf(ProductHandle),
            dataID = $(this).data('id');

        $('.wishlist-content .grid-item').each(function(t){
          var compareID = $(this).data('id');

          if( dataID === compareID ){
            $(this).remove();
            function showpage(page) {
              $('.wishlist-page .grid-item').hide();
              $('.wishlist-page .grid-item').eq((page-1)*3).show().next().show().next().show();
              $('#pagin').find('a').removeClass('current').eq(page).addClass('current');
            }

            pagecount = Math.floor(($('.wishlist-page .grid-item').size()) / 3);
            if (($('.wishlist-page .grid-item').size()) % 3 > 0) {
              pagecount++;
            }

            if(currentpage < 1) {currentpage = 1;}
            if(currentpage > pagecount) {currentpage = pagecount;}

            $('.wishlist-page #pagin').html('<li><a>previous</a></li>');

            for (var i = 1; i <= pagecount; i++) {
              $('#pagin').append('<li><a class="current">' + i + '</a></li>');
            }

            $('.wishlist-page #pagin').append('<li><a>next</a></li>');
            showpage(currentpage);               
          }

          if ($('.wishlist-content .grid-item').css('display') === 'block'){
            $('.wishlist-content .grid-item').eq(0).next().show().next().show();
          }
        });

        itemsArray.splice(removeIndex, 1);
        localStorage.setItem('items', JSON.stringify(itemsArray));
        $(this).removeClass('btn-active');
        le();         
      }); 

      $('.wishlist-btn').each(function () {
        var ProductHandle = $(this).attr('data-product-handle');

        if (itemsArray.indexOf(ProductHandle) > -1) {
          $(this).addClass('btn-active');
          $(this).find(".wishlist_text").text(window.inventory_text.remove_wishlist);
        }
      });
      le();
    },

    isStuckMobile: function(){
      var verticalTabFullWith = $('.vertical-tab-fullwidth'),
          productRelateRight = verticalTabFullWith.find('.product-related-right'),
          hasStuch = verticalTabFullWith.find('.has-stuch'),
          productImgBox = verticalTabFullWith.find('.product-img-box'),
          productDetail = verticalTabFullWith.find('.prod-del'),
          noStuck = verticalTabFullWith.find('.not-stuck'),
          heightDetail = verticalTabFullWith.find('.product-shop').outerHeight(),
          heightImg = verticalTabFullWith.find('.contain-images-pr').outerHeight();

      if($(window).width() < 1200) {
        productRelateRight.removeClass('stuck');
        hasStuch.addClass('release-container');
        $('.product-detail-right').addClass('release-container');
        $(verticalTabFullWith).find('.row').removeClass('release-container');
      }      
      else {
        productRelateRight.addClass('stuck');
        hasStuch.removeClass('release-container');
        $('.product-detail-right').removeClass('release-container');

      };

      if($(window).width() < 767) {
        productDetail.removeClass('stuck release');
        noStuck.removeClass('stuck release');
      }

      else {
        productDetail.addClass('stuck release');
        noStuck.addClass('stuck release');
      };

      if (heightDetail > heightImg) {
        productDetail.removeClass('stuck');
      }
      else {
        productDetail.addClass('stuck');
      };
    },

    initWindowLoad: function() {
      var recenly = $('.recently-viewed-products');
      var footer = $('.footer');
      var topRecenly = recenly.offset().top;
      var topFooter = footer.offset().top;
      var heightTop = footer.outerHeight();

      if (recenly.length) {
        var top = topRecenly;
      }
      else {
        var top = topFooter;
      };

      $( window ).load(function() {
        if($(window).scrollTop() > top) {
          $('body,html').animate({
            scrollTop: top - heightTop - 100
          }, 300);
        }
        else {
          $('body,html').animate({
            scrollTop: $(window).scrollTop()+100
          }, 300);
        }
      });
    },

    initDropdownFooterMenu: function() {
      var footerTitle = $('.footer .footer-top .column-footer:not(.no-dropdown) h3');

      if(window.innerWidth < 768) {
        if(footerTitle.length) {
          footerTitle.off('click.slideToggle').on('click.slideToggle', function() {
            $(this).next().slideToggle();
          });
        }
      }
      else {
        $('.footer .footer-top .column-footer:not(.no-dropdown) h3 ~ ul, .footer .footer-top .column-footer:not(.no-dropdown) h3 ~ .ft-location').css({"display": ""});
      }
    },

    LayoutHeader3: function(){
      $(".header-layout-3  .icon-open, .search-fix").on('click', function(){
        $('.header-layout-3 .search-form').toggleClass('open-search');
        $('html').toggleClass('open-search');   

        $('.header-layout-3 .closemnu').on('click', function(){
          $('.header-layout-3 .search-form').removeClass('open-search');
          $('html').removeClass('open-search');
        });
      });

      $('.header-layout-3 .mobile-customer .userToggle').click(function(){
        $('html').toggleClass('opencustomer');
        $('.mb-customer').toggleClass("open");

        $('.wrap-overlay, .close-customer').click( function(){
          $('html').removeClass('opencustomer');
          $('.mb-customer').removeClass("open");
        });
      });
    },

    initStuck: function() {
      $('.stuck').each(function() {
        if ($(this).css('position') === 'fixed'){
          $(this).addClass('is_stuck');
        }

        else if ($(this).css('position') === 'absolute'){
          $(this).removeClass('is_stuck');
        }

        else if ($(this).css('position') === 'relative'){
          $(this).removeClass('is_stuck');
        }
      });
    },

    fixedTop: function(){
      $(window).stuck();

      lynkco.initStuck();

      $( window ).scroll(function() {
        lynkco.initStuck();
      });
    },

    initScrollTop: function() {
      $(window).scroll(function() {
        if ($(this).scrollTop() > 220) {
          $('#back-top').fadeIn(400);
        }

        else {
          $('#back-top').fadeOut(400);
        }
      });

      $('#back-top').off('click.scrollTop').on('click.scrollTop', function(e) {
        e.preventDefault();
        e.stopPropagation();

        $('html, body').animate({scrollTop: 0}, 400);
        return false;
      });
    },

    initSliderNavFull: function(sliderNavFull) {
      if(!sliderNavFull.hasClass('slick-initialized')) {
        sliderNavFull.slick({
          infinite: true,
          slidesToShow: 4,
          slidesToScroll: 1,
          vertical: true,
          verticalSwiping: false,
          dots: false,
          focusOnSelect: true,
          nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 17 33" xml:space="preserve"><g id="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="_x38_e584754-6657-46f1-a9d8-2cfd6623b552"><g><polygon points="14.9,14.5 0,0 0,3.7 11.1,14.5 13.2,16.5 11.1,18.5 0,29.3 0,33 14.9,18.5 17,16.5 "/></g></g></g></svg></button>',
          prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 33"><g id="7f9a1925-e8c7-4614-8787-3c6095a9f6e1" data-name="Layer 2"><g id="c9b7920a-81fa-4bfe-ad13-4da717c6854b" data-name="Layer 1"><g id="c2d982ff-0cf6-4220-b365-47f30d708fea" data-name="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="f51d455e-6b9c-4c4e-96db-a5004582beda" data-name="8e584754-6657-46f1-a9d8-2cfd6623b552"><polygon points="0 16.5 2.1 18.5 17 33 17 29.3 5.9 18.5 3.8 16.5 5.9 14.5 17 3.7 17 0 2.1 14.5 0 16.5"/></g></g></g></g></svg></button>',        
          responsive: [
            {

              breakpoint: 1200,
              settings: {
                slidesToShow: 4,
                slidesToScroll: 1,
              }
            },
            {

              breakpoint: 992,
              settings: {
                slidesToShow: 4,
                slidesToScroll: 1,
                vertical: false,
              }
            },
            {

              breakpoint: 768,
              settings: {
                slidesToShow: 1,
                dots: true,
                arrows: false,
                vertical: false,
                slidesToScroll: 1
              }
            }       
          ]
        });
      };
    },

    initProductFullWidthMoreview: function() {          
      if($(window).width() > 767) {
        var verticalTabFullWith = $('.vertical-tab-fullwidth'),
            panelGroup = verticalTabFullWith.find('.panel-group'),
            tabTitle = panelGroup.find('.panel-title a'),
            productShop = verticalTabFullWith.find('.product-shop'),
            tabTitleSlt = '.vertical-tab-fullwidth .panel-title a',
            heightpanelbt =$(verticalTabFullWith).find('.panel-group').outerHeight();

        $('body').on('click', tabTitleSlt, function() {
          var self = $(this);
          var tabContent = self.closest('.panel-heading').siblings('.panel-collapse');
          var top = $( ".prod-del.stuck" ).next();
          var position =parseInt($(top).attr("data-top"));
          var positiontong = position + heightpanelbt;
          clearTimeout(lynkco.lynkcoTimeout);

          lynkco.lynkcoTimeout = setTimeout(function() {
            var heightpanel= $(verticalTabFullWith).find('.panel-group').outerHeight(),
                tongheight= positiontong-heightpanel;
            top.css("top",tongheight+'px');
            if(tabContent.is(':visible')) {

              var heightContent = tabContent.outerHeight();
              var height = productShop.outerHeight() + heightContent;


              var productDetail = verticalTabFullWith.find('.prod-del');
              var heightDetail = productShop.outerHeight();
              var heightImg = verticalTabFullWith.find('.contain-images-pr').outerHeight();

              if (heightDetail > heightImg) {
                productDetail.removeClass('stuck');
              }
              else {
                productDetail.addClass('stuck');
              };                            

              $('html, body').animate({
                scrollTop: self.closest('.panel').offset().top -50
              }, 300);
            }

            else {

              var heightContent = tabContent.outerHeight();
              var height = productShop.outerHeight() - heightContent;
              var heightSideNav = verticalTabFullWith.find('.contain-images-pr .slider-nav').outerHeight();


              var productDetail = verticalTabFullWith.find('.prod-del');
              var heightDetail = productShop.outerHeight();
              var heightImg = verticalTabFullWith.find('.contain-images-pr').outerHeight();

              if (heightDetail > heightImg) {
                productDetail.removeClass('stuck');
              }
              else {
                productDetail.addClass('stuck');
              }; 

              $('html, body').animate({
                scrollTop: self.closest('.panel-group').offset().top - 50
              }, 300);
            }
          }, 1000);

          lynkco.initStuck();
        });


        var btnReviewSlt = '.vertical-tab-fullwidth .spr-summary-actions-newreview';

        $('body').on('click', btnReviewSlt, function() {
          var self = $(this);
          var heightTabContent = self.closest('.panel-collapse').outerHeight();
          var reviewContent = self.closest('.spr-header').siblings('.spr-content');
          var top = $( ".prod-del.stuck" ).next();
          var position =parseInt($(top).attr("data-top"));
          var positiontong = position + heightpanelbt;

          clearTimeout(lynkco.lynkcoTimeout);

          lynkco.lynkcoTimeout = setTimeout(function() {
            var heightpanel= $(verticalTabFullWith).find('.panel-group').outerHeight(),
                tongheight= positiontong-heightpanel;
            top.css("top",tongheight+'px');
            if(reviewContent.is(':visible')) {

              var heightContent = heightTabContent + reviewContent.outerHeight();
              var height = productShop.outerHeight() + heightContent;


              var productDetail = verticalTabFullWith.find('.prod-del');
              var heightDetail = productShop.outerHeight();
              var heightImg = verticalTabFullWith.find('.contain-images-pr').outerHeight();

              if (heightDetail > heightImg) {
                productDetail.removeClass('stuck');
              }
              else {
                productDetail.addClass('stuck');
              };                            

              $('html, body').animate({
                scrollTop: self.closest('.panel').offset().top
              }, 300);
            }

            else {

              var heightContent = self.closest('.panel-collapse').outerHeight();
              var height = productShop.outerHeight() + heightContent;


              $('html, body').animate({
                scrollTop: 0
              }, 300);
            }
          }, 700);

        });

        var variantImg = verticalTabFullWith.find('.contain-images-pr [href*="#img-"]');

        variantImg.on('click', function(e) {
          e.preventDefault();

          $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top
          }, 300);
        });

        clearTimeout(lynkco.lynkcoTimeout);

        lynkco.lynkcoTimeout = setTimeout(function() {
          if($('.vertical-tab-fullwidth .slider-for').hasClass('slick-initialized')) {
            $('.vertical-tab-fullwidth .slider-for').slick('unslick');    
            $('.vertical-tab-fullwidth .slider-for').find('.slick-list').removeAttr('style');            
          };

          if($('.vertical-tab-fullwidth .slider-nav').hasClass('slick-initialized')) {                        
            $('.vertical-tab-fullwidth .slider-nav').slick('unslick');    
            $('.vertical-tab-fullwidth .slider-nav').find('.slick-list').removeAttr('style');
          };

          lynkco.initSliderNavFull($('.vertical-tab-fullwidth .slider-nav'));

        }, 50);
      }

      else {
        clearTimeout(lynkco.lynkcoTimeout);

        lynkco.lynkcoTimeout = setTimeout(function() {
          if($('.vertical-tab-fullwidth .slider-nav').hasClass('slick-initialized')) {
            $('.vertical-tab-fullwidth .slider-nav').slick('unslick');    
            $('.vertical-tab-fullwidth .slider-nav').find('.slick-list').removeAttr('style');  
          };

          if($('.vertical-tab-fullwidth .slider-for').hasClass('slick-initialized')) {
            $('.vertical-tab-fullwidth .slider-for').slick('unslick');    
            $('.vertical-tab-fullwidth .slider-for').find('.slick-list').removeAttr('style');            
          };

          lynkco.initSliderNavFull($('.vertical-tab-fullwidth .slider-for'));

        }, 50);
      };            
    },

    HomeLeftSidebar: function(){      
      var widthBody = $('.body-left-sidebar').outerWidth(),
          widthMega = $('.navigation .mega-menu .site-nav-dropdown'),
          width = window.innerWidth;

      if(width > 1660) {
        $(widthMega).css('min-width', widthBody);
      }
      else if(width < 1661 && width > 1025){
        $(widthMega).css('min-width', widthBody-350);
      }
      else{
        $(widthMega).css('min-width', 'auto');
      }      
    },

    menuDestok: function(){
      var icon = $('.menu-mobile .menuToggle'),
          menu_left = $(".navi-left-sidebar"),
          width = window.innerWidth;

      if(width > 1025) {
        $(icon).click(function(){
          $(menu_left).toggleClass("menu-open");
          $('html').toggleClass('menu-destop');

          $('.wrap-overlay, .close_menu').on('click', function(){
            $(menu_left).removeClass("menu-open");
            $('html').removeClass('menu-destop');
          });
        });
      }
    },

    Page_brands: function(){
      $(".brands-list .brand").each(function(){
        var chi = $(this).find(".azbrands-title h3").text().trim();
        var ch = $(this).find("ul.brandgrid li:eq(0)").text().charAt(0);
        $('.azbrandstable').children().each(function(){
          if( $(this).find('a').text().trim() == chi){
            if( !$(this).find('a').hasClass('readonly') )
              $(this).find('a').addClass('readonly');
            return;
          }
        });
        if($(this).find(".azbrands-title").length == 0){
          $(this).find("ul.brandgrid").children().appendTo('.brand-' + ch + " ul.brandgrid");
          $(this).remove();
        }
      });

      $('.azbrandstable .vendor-letter a.readonly').click(function(){
        var v = $(this).text();
        $('.brands-list .brand').hide().filter(function(e){
          var n =  $(this).find('h3').text();
          return n == v;
        }).show();
        $('.azbrandstable .all-brand a').click(function(){
          $(".brands-list .brand").show();
        });
      });
      $('.azbrandstable a.readonly').click(function(){
        $('.azbrandstable a').removeClass('active');
        var $this = $(this);
        if (!$this.hasClass('active')) {
          $this.addClass('active');
        }
        var topbrand = $('.header').outerHeight();
        $('html, body').animate({scrollTop: topbrand}, 400);
      });

      $('.logo-brands').each(function(){
        var brand_slider =  $(this).find('.slide-logo');
        if(brand_slider.length){
          brand_slider.not('.slick-initialized').slick({
            slidesToShow: brand_slider.data('row'),
            slidesToScroll: brand_slider.data('row'),
            arrows: true,
            nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 17 33" xml:space="preserve"><g id="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="_x38_e584754-6657-46f1-a9d8-2cfd6623b552"><g><polygon points="14.9,14.5 0,0 0,3.7 11.1,14.5 13.2,16.5 11.1,18.5 0,29.3 0,33 14.9,18.5 17,16.5 "/></g></g></g></svg></button>',
            prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 33"><g id="7f9a1925-e8c7-4614-8787-3c6095a9f6e1" data-name="Layer 2"><g id="c9b7920a-81fa-4bfe-ad13-4da717c6854b" data-name="Layer 1"><g id="c2d982ff-0cf6-4220-b365-47f30d708fea" data-name="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="f51d455e-6b9c-4c4e-96db-a5004582beda" data-name="8e584754-6657-46f1-a9d8-2cfd6623b552"><polygon points="0 16.5 2.1 18.5 17 33 17 29.3 5.9 18.5 3.8 16.5 5.9 14.5 17 3.7 17 0 2.1 14.5 0 16.5"/></g></g></g></g></svg></button>',
            speed : 1000,   
            dots: false,
            responsive: [
              {
                breakpoint: 1025,
                settings: {
                  slidesToShow: 4,
                  slidesToScroll: 4      
                }
              },
              {
                breakpoint: 1024,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 3,
                  dots: false,
                  arrows: false
                }
              },
              {
                breakpoint: 767,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 2,
                  dots: false,
                  arrows: false
                }
              }
            ]
          });
        }
      });


    },

    orderAddToCart: function() {
      $('body').on('click', '.product-des-order .show-options', function(ev) {
        ev.preventDefault() 
        $(this).removeClass("show-variants").addClass("hide_options").val(window.inventory_text.hide_options)
      })
      $('body').on('click', '.hide_options', function(ev) {
        ev.preventDefault() 
        $(this).removeClass("hide_options").addClass("show-options").val(window.inventory_text.show_options)
      })

      if ($('.order-add-to-cart-btn').length > 0) {
        lynkco.initCart();
        $('.order-add-to-cart-btn').click(function(event) {
          event.preventDefault();
          var cartButton = $(this);
          if ($(this).attr('disabled') != 'disabled') {
            var productItem = $(this).parents('.product-item');
            var productId = $(productItem).attr('id');
            productId = productId.match(/\d+/g);
            if (!window.ajax_cart) {
              $('#product-actions-' + productId).submit();
            } else {
              var variant_id = $('#product-actions-' + productId + ' select[name=id]').val();
              if (!variant_id) {
                variant_id = $('#product-actions-' + productId + ' input[name=id]').val();

              }
              var quantity = $('#updates_' + productId + '').val();

              if (!quantity) {
                quantity = 1;
              }
              var title = $(productItem).find('.product-title').html();
              var image = $(productItem).find('.product-grid-image img').attr('src');
              lynkco.orderAjaxAddToCart(variant_id, quantity, title, image,cartButton);
              cartButton.next('.ajaxified-cart-feedback').show();
            }
          }
          return false;
        });
      }
    },

    optionAddToCart: function() {
      if ($('.form-add-to-cart').length > 0) {
        lynkco.initCartvariant();
        $(document).on('click', '.form-add-to-cart', function(event) {
          var pro_id = $(this).attr('id');
          var cartButton = $(this);
          var variantItem = $(this).parents('.options-items');
          var variantId = $(variantItem).attr('id');
          variantId = variantId.match(/\d+/g);
          event.preventDefault();

          if ($(this).attr('disabled') != 'disabled') {

            if (!window.ajax_cart) {
              $('#product-actions-' + variantId).submit();
            } else {
              var quantity = $('#variant_' + variantId + '').val();
              quantity = parseInt(quantity);                         
              lynkco.optionAjaxAddToCart(pro_id, quantity,cartButton);
              cartButton.next('.ajaxified-cart-feedback').show();
            }
          }
          return false;
        });
      }
    },

    orderAjaxAddToCart: function(variant_id, quantity, title, image, cartButton) {
      $.ajax({
        type: "post",
        url: "/cart/add.js",
        data: 'quantity=' + quantity + '&id=' + variant_id,
        dataType: 'json',

        beforeSend: function() {
          window.setTimeout(function() { cartButton.val(window.inventory_text.adding +"..."); }, 100);
        },

        success: function(msg) {
          window.setTimeout(function() { cartButton.val(window.inventory_text.thank_you); }, 600);
          window.setTimeout(function() { cartButton.val(window.inventory_text.add_more + "..."); }, 1000);

          lynkco.updateDropdownCart();
          cartButton.addClass('add_more');
          cartButton.next('.ajaxified-cart-feedback').text(window.inventory_text.cart_feedback);
        },

        error: function(xhr, text) {
          window.setTimeout(function() { cartButton.val(window.inventory_text.add_to_cart); }, 400);
          $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
          lynkco.showModalError('.ajax-error-modal');
        }
      });
    },  

    optionAjaxAddToCart: function(pro_id, quantity, cartButton) {
      var post_data = { id: pro_id, quantity: quantity }
      $.ajax({
        type: "post",
        url: "/cart/add.js",
        data: post_data,
        dataType: 'json',
        async: false,

        beforeSend: function() {
          window.setTimeout(function() { cartButton.val(window.inventory_text.adding +"..."); }, 100);
        },
        success: function(msg) {
          window.setTimeout(function() { cartButton.val(window.inventory_text.thank_you); }, 600);
          window.setTimeout(function() { cartButton.val(window.inventory_text.add_more + "..."); }, 1000);
          lynkco.updateDropdownCart();
          cartButton.addClass('add_more');
          cartButton.next('.ajaxified-cart-feedback').text(window.inventory_text.cart_feedback);
        },
        error: function(xhr, text) {
          window.setTimeout(function() { cartButton.val(window.inventory_text.add_to_cart); }, 400);
          $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
          lynkco.showModalError('.ajax-error-modal');
        }
      });
    },

    initCart: function() {    
      $('.pro-qty .button').on('click',function(event) {
        event.preventDefault();
        $(this).each(function(e) {
          var productItem = $(this).parents('.inner-top');
          var productId = $(productItem).attr('id');
          productId = productId.match(/\d+/g);
          var oldValue = $('#updates_' + productId + '').val(),
              newVal = 1;
          if ($(this).hasClass('inc')) {
            newVal = parseInt(oldValue) + 1;
          } else if (oldValue > 1) {
            newVal = parseInt(oldValue) - 1;
          }
          $('#updates_' + productId + '').val(newVal);
        });

        return false;
      });
    },

    initCartvariant: function() {    
      $('.product-options .button').on('click',function(event) {
        event.preventDefault();
        $(this).each(function(e) {
          var productItem = $(this).parents('.options-items');
          var productId = $(productItem).attr('id');
          productId = productId.match(/\d+/g);
          var oldValue = $('#variant_' + productId + '').val(),
              newVal = 1;
          if ($(this).hasClass('inc')) {
            newVal = parseInt(oldValue) + 1;
          } else if (oldValue > 1) {
            newVal = parseInt(oldValue) - 1;
          }
          $('#variant_' + productId + '').val(newVal);
        });

        return false;
      });
    },
    initbrowser: function() {
      navigator.sayswho= (function(){
        var ua= navigator.userAgent, tem, 
            M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if(/trident/i.test(M[1])){
          tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
          return 'IE '+(tem[1] || '');
        }
        if(M[1]=== 'Chrome'){
          tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
          if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
        }
        M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
        if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
        return M.join(' ');
      })();

      function GetIEVersion( browser ) {
        var Idx = browser.indexOf("Edge");
        if (Idx != -1) 
          return 1;

        var Idx = browser.indexOf("MSIE");
        if (Idx > 0) 
          return parseInt(sAgent.substring(Idx+ 5, sAgent.indexOf(".", Idx)));
        else if (!!navigator.userAgent.match(/Trident\/7\./)) 
          return 11;
        else
          return 0;
      }

      if (GetIEVersion(navigator.sayswho) > 0){ 
        $('body').addClass('browser-ie');
        $('.product-image').find('img').removeClass('lazyload lazyautosizes lazyloaded'); 
        $(document).on('click','.view-mode a',function(){
          if( $(this).hasClass('view-one')){
            $('.product-image').find('img').removeClass('lazyload lazyautosizes lazyloaded');
            $('.product-image').find('img').each(function(i, val){
              if($(this).data('srcie') != undefined){
                $(this).attr('src', $(this).data('srcie'));
              }
            });
          }


          if( $(this).hasClass('view-two')){
            $('.product-image').find('img').addClass('lazyload');
          }

          else if( $(this).hasClass('view-three')){
            if(!$('body').hasClass('bd-full')){
              $('.product-image').find('img').each(function(i, val){
                if($(this).data('srcie') != undefined){
                  $(this).attr('src', $(this).data('srcie'));
                }
              });
              $('.product-image').find('img').removeClass('lazyload lazyautosizes lazyloaded');
            } else{
              $('.product-image').find('img').addClass('lazyload');
            }
          }

          else if( $(this).hasClass('view-four')){
            if(!$('body').hasClass('bd-full')){
              $('.product-image').find('img').removeClass('lazyload lazyautosizes lazyloaded');
              $('.product-image').find('img').each(function(i, val){
                if($(this).data('srcie') != undefined){
                  $(this).attr('src', $(this).data('srcie'));
                }
              });
            } else{
              $('.product-image').find('img').removeClass('lazyload lazyautosizes lazyloaded');
              $('.product-image').find('img').each(function(i, val){
                if($(this).data('srcief') != undefined){
                  $(this).attr('src', $(this).data('srcief'));
                }
              });

            }
          }
          else if( $(this).hasClass('view-five')){
            $('.product-image').find('img').removeClass('lazyload lazyautosizes lazyloaded');
            $('.product-image').find('img').each(function(i, val){
              if($(this).data('srcie') != undefined){
                $(this).attr('src', $(this).data('srcie'));
              }
            });
          }
        });
      } else{
        $('.product-image').find('img').each(function(i, val){
          $(this).removeAttr('data-srcie');
          $(this).removeAttr('data-srcief');
        });
      }
    },
  }

  })(jQuery);

$(document).on("change keyup" , "#recipient-name, #recipient-email, #gift-message, #sender-name" , function(){
  var v_1 = $("#recipient-name").val().trim();
  var v_2 = $("#recipient-email").val().trim();
  var v_4 = $("#gift-message").val().trim();
  var v_5 = $("#sender-name").val().trim();
  
  if(v_1 != "" && v_2 != "" && v_4 != "" && v_5 != ""){
      $(".preview-btn").removeClass("disabled");
      $('#add_gift').removeAttr("disabled");
  }else{
      $(".preview-btn").addClass("disabled");
      $('#add_gift').attr("disabled","")
  }
});

$(document).on("click", ".preview-btn:not(.disabled), #add_gift" , function(){
  var v_1 = $("#recipient-name").val().trim();
  var v_2 = $("#recipient-email").val().trim();
  var v_4 = $("#gift-message").val().trim();
  var v_5 = $("#sender-name").val().trim();
  var optionseleted = $('#product-selectors').find('option:selected').attr('v_price');
  $('.reciever').text(v_1);
  $('.message').text(v_4);
  $('.sender-name').text(v_5);
  $('.price-inner').text(optionseleted);
  $(".gift-card-popup-main").show();
  $(".translucent-black-bg").show();
});

$(document).on("click", ".edit-btn , .close-me" , function(){
  $(".gift-card-popup-main").hide();
  $(".translucent-black-bg").hide();
});

$(document).on("click", ".add-btn" , function(){
  $(".gift-card-popup-main").hide();
  $(".translucent-black-bg").hide();
  $('#grouped-add-to-cart').trigger('click');
});