(function ($) {
  
  /**
   * jQuery In This Post
   * This plugin adds the functionality of displaying a summary of topics of the posts
   * version: 0.0.1
   */
  $.fn.inThisPost = function(options) {
        
    // Here we set our defaults, used accros the plugin, we will break through all of them
    var settings = $.extend({
      
      // This option lets you add a "extra space" in the scrolling
      // Default: 50 (px)
      offset: 50,
      
      // Use this option to define the starting level of titles to get.
      // Remeber that this also sets the sublevel to get, so if you set startingLevel as h2
      // the sublevel will be set to h3.
      // Default: 'h2'
      startingLevel: 'h2',
      
      // Here you can choose if you want to display subitems also.
      // Like said in the option above, if your startingLevel was h2, the subitems loaded
      // will be h3 and so on.
      // Deafult: true (can also be false)
      subItems: true,
      
      // This option is used to define the header element so we can decide when to display
      // the summary bar
      // Default: '.post-header, .entry-header'
      pageHeader: '.post-header, .entry-header',
      
      // This option lets you change the title used on the start of the bar
      // Default: 'In this Post:'
      title: 'In this Post:',
      
      // Use this options to select the comment block, if you want that to be displayed
      // You can also set to false, if you want to hide the comments section
      // Default: '#comments' (can also be set to false)
      comments: '#comments',
      
      // If you select the comments in the option above, you can also set the label
      // Default: 'Comments'
      commentsLabel: 'Comments',
      
      // This options let you select where you want the bar to appear
      // can be set to 'top' or 'bottom'
      // Default: 'top'
      position: 'top',
      
    }, options);
    
    // The main block where we are going to find our topics
    var container = this;
    
    // This variable will contain the elements once we loop the DOM
    var items = [];
    
    // We let the user set the startingLevel using the element, like 'h2',
    // but for pratical purposes we need a number
    var startingLevel = parseInt(settings.startingLevel.replace(/\D/g,''), 10);
    
    // Variable containing our plugins' methods
    var methods = {
      
      // Init
      init: function() {
        
        // Run loadList
        this.loadList();
        
        // Generate the block that displays the summary
        this.generateBlock();
        
        // Binds the scrolling functions to the links
        this.scrollTo('[data-content-target]');
        
        // Adds other scroll functionality like the scrollSpy and Sticky
        this.onScroll();
        
        // Return the original object (the container) to allow chaining jQuery functions
        return container;
        
      },
      
      // We use this method to slugfy the titles, so we can create ids later
      slugfy: function (text) {
        return text.toString().toLowerCase()
          .replace(/\s+/g, '-')           // Replace spaces with -
          .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
          .replace(/\-\-+/g, '-')         // Replace multiple - with single -
          .replace(/^-+/, '')             // Trim - from start of text
          .replace(/-+$/, '');            // Trim - from end of text
      },
      
      // Sticky feature
      onScroll: function() {
        
        // On Scroll
        $(window).on('scroll', function() {
          methods.sticky();
          methods.scrollSpy();
        });
        
        // Sticky 
        this.sticky();
        this.scrollSpy();
        
      },
      
      // Scroll spy to set active
      scrollSpy: function() {
        
        // get all of our items
        $('[data-content-id]').each(function() {
                  
          // how much it scrolled
          var windowTop = $(window).scrollTop();
          
          // div top
          var divTop = $(this).offset().top - settings.offset - $('.content-index-block').outerHeight() - 10;
          
          // new target
          var target = $('[data-content-target="'+ $(this).attr('data-content-id') +'"]');
          
          // Set active to the target
          if (windowTop > divTop) {
            
            // Target
            $('.content-index-block a').removeClass('active');
            target.toggleClass('active');
              
          } // endif
          
        }); // each
        
      },
      
      // The sticky manager function
      sticky: function() {
        
        // target
        var target = $('.content-index-block');
        
        // Adds to the container the relative position needed
        target.parent().css('position', 'relative');
        
        // div top
        var divTop = $(settings.pageHeader).offset().top;
        
        // TODO: Check if the header div exists to prevent bug
        
        // how much it scrolled
        var windowTop = $(window).scrollTop();

        if (windowTop > divTop) {target.slideDown('fast');}
        else {target.slideUp('fast');}
          
      },
      
      // Get our subitems
      getSubitems: function(item, startingLevel) {
        
        item.nextUntil('h' + startingLevel).filter('h' + (startingLevel + 1)).each(function() {
            
          // Redeclare
          var subitem = $(this);

          // Adds our custom id to this item and their level as data-level
          subitem.attr('data-content-id', methods.slugfy(subitem.text()));
          subitem.attr('id', methods.slugfy(subitem.text()));
          subitem.attr('data-content-parent', methods.slugfy(item.text()));

          // adds to our array as well
          items.push(subitem);

        });
        
      },
      
      // Load List
      loadList: function() {
        
        // Adds the top of the page
        container.find('h1:first-child').each(function() {
          
          // our contextual this
          var item = $(this);

          // Title of the section
          var title = item.text();

          // Adds our custom id to this item and their level as data-level
          item.attr('data-content-id', methods.slugfy(title));
          item.attr('id', methods.slugfy(title));
          
          // Adds them to our variable
          items.push(item);
          
        });
        
        // Scrap titles up to the levels variable
        container.find('h' + startingLevel).each(function() {

          // our contextual this
          var item = $(this);

          // Title of the section
          var title = item.text();

          // Adds our custom id to this item and their level as data-level
          item.attr('data-content-id', methods.slugfy(title));
          item.attr('id', methods.slugfy(title));
          
          // Adds them to our variable
          items.push(item);
          
          // Run our subitems depending on the subItems argument
          if (settings.subItems === true) {
            methods.getSubitems(item, startingLevel);
          }

        }); // find
        
        // Adds comments block
        if (settings.comments !== false) {
          
          // Adds the comment block
          $(settings.comments).each(function() {
            
            // our contextual this
            var item = $(this);

            // Title of the section
            var title = settings.commentsLabel;

            // Adds our custom id to this item and their level as data-level
            item.attr('data-content-id', methods.slugfy(title));
            item.attr('id', methods.slugfy(title));

            // Adds them to our variable
            items.push(item);
            
          });
          
        } // endif
        
      },
      
      // Create our function that handling scrolling
      scrollTo: function(target) {
        
        // Bind each element to a click function using on
        $(target).on('click', function(e) {
          
          // As they may be links, we need to prevent their default behavior
          e.preventDefault();
          
          // Now we check if we are already in that localtion, if thats the case
          // no need to rescroll
          if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') && location.hostname === this.hostname) {
            
            // Sets the target element, based on the passed
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            
            // If our target exists, finally scrolls
            if (target.length) {
              
              $('html, body').animate({
                scrollTop: target.offset().top - settings.offset - $('.content-index-block').outerHeight()
              }, 1000);
              return false;
              
            } // endif
            
          } // endif
          
        });
        
      },
      
      // Generate our block
      generateBlock: function() {
        
        // Main block
        var block = $('<ul class="content-index-block" data-title="'+ settings.title +'"></ul>');

        // Now we add our blocks individually
        $.each(items, function(index, item) {
          
          // We need to retrieve the ID
          var id = item.attr('data-content-id');
          
          // If the title is a comments block we need to display our label instead
          var title = settings.comments !== false && id === settings.comments.replace('#', '') ? settings.commentsLabel : item.text();
          
          // list emelemnt that will contain the link
          var list = $('<li data-content-list="'+ id +'"></li>');
          
          // trigger link
          var trigger = $('<a href="#'+ id +'" data-content-target="'+ id +'">'+ title +'</a>');
          
          // Put our trigger inside list
          list.append(trigger);
          
          // If its not a child items
          if (item.attr('data-content-parent') === undefined) {
            
            // if thats the case
            var subList = $('<ul></ul>');
            
            // Mount the block
            list.append(subList);
            
            // adds to the block
            block.append(list);
            
          } // endif;
          
          // else: case where the item is a subitem
          else {
            
            // We create our parent option so we can add the elements
            var parent = block.find('[data-content-list="'+ item.attr('data-content-parent') +'"] > ul');
            
            // Adds this item to the parent
            parent.append(list);
            
          } // endelse;
          
        }); // endeach;
        
        // Adds a theme
        block.addClass('content-index-display-inline');
        
        // Set the position based on the user preferences
        block.css(settings.position, 0);
        
        // Attachs the block we generated to the body
        $('body').prepend(block);
        
      }
      
    }; // end of methods;
    
    // Now thats all set, we initialize our plugin and we're ready to go!
    methods.init();
    
  };
  
  // Run
//    $('.post').inThisPost({
//      startingLevel: 'h3',
//      position: 'bottom',
//      subItems: true,
//      title: 'We you are:',
//    });

}(jQuery));