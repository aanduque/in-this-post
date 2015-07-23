(function ($) {

  $.fn.inThisPost = function(options) {
        
    // Our defaults
    var settings = $.extend({
      offset: 50,
      startingLevel: 'h2',
      pageHeader: '.post-header, .entry-header',
      title: 'In this Post:',
      comments: '#comments', // Can also be set to false
      commentsLabel: 'Comments',
      position: 'top',
    }, options);
    
    // Control variable for countign levels
    var level = 1;
    
    // The container from where we will scrap the contents
    var container = this;
    
    // Var containing our titles and subtitles
    var items = [];
    
    // starting level
    var startingLevel = parseInt(settings.startingLevel.replace(/\D/g,''));
    
    // function used to slugfy our ids
    var slugfy = function (text) {
      return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
    };
    
    // Variable containing our methods
    var methods = {
      
      // Init
      init: function() {
        
        // Run loadList
        this.loadList();
        
        // Generate our block
        this.generateBlock();
        
        // Bind the scroller
        this.scrollTo('[data-content-target]');
        
        // Adds the scroll functionality
        this.onScroll();
        
        // Return to allow chaining
        return container;
        
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
        
        // how much it scrolled
        var windowTop = $(window).scrollTop();

        if (windowTop > divTop) {target.slideDown('fast');}
        else {target.slideUp('fast');}
          
      },
      
      // Get our subitems
      getSubitems: function(item, startingLevel) {
        
        item.nextUntil('h' + startingLevel).not('p, span, div, pre').each(function() {
            
          // Redeclare
          var subitem = $(this);

          // Adds our custom id to this item and their level as data-level
          subitem.attr('data-content-id', slugfy(subitem.text()));
          subitem.attr('id', slugfy(subitem.text()));
          subitem.attr('data-content-parent', slugfy(item.text()));

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
          item.attr('data-content-id', slugfy(title));
          item.attr('id', slugfy(title));
          
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
          item.attr('data-content-id', slugfy(title));
          item.attr('id', slugfy(title));
          
          // Adds them to our variable
          items.push(item);
          
          // Run our subitems depending on the levels argument
          methods.getSubitems(item, startingLevel);

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
            item.attr('data-content-id', slugfy(title));
            item.attr('id', slugfy(title));

            // Adds them to our variable
            items.push(item);
            
          });
          
        } // endif
        
      },
      
      // Create our function that handling scrolling
      scrollTo: function(target) {
        
        $(target).on('click', function(e) {
          e.preventDefault();
          
          // Target
//          $('.content-index-block a').removeClass('active');
//          $(this).toggleClass('active');
          
          if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') && location.hostname === this.hostname) {
            
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            
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
        var block = $('<ul class="content-index-block"></ul>');

        // Now we add our blocks individually
        $.each(items, function(index, item) {
          
          // Important variables
          var id = item.attr('data-content-id');
          var title = settings.comments !== false && id === settings.comments.replace('#', '') ? settings.commentsLabel :  item.text();
          
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
            
          }
          
          // else: case where the item is a subitem
          else {
            
            // parent
            var parent = block.find('[data-content-list="'+ item.attr('data-content-parent') +'"] > ul');
            
            // Adds this item to the parent
            parent.append(list);
            
          } // else
          
        }); // each
        
        // Add to the the block deppending on the display type
        block.addClass('content-index-display-inline');
        
        // Append
        $('body').prepend(block);
        
      }
      
    };
    
    // Initialize
    methods.init();
    
  };
  
  // Run
  $('.post').inThisPost({
    startingLevel: 'h3',
  });

}(jQuery));