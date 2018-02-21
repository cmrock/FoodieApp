$.ui.autocomplete.prototype._renderItem = function(ul, item) {
    //    item.label = item.label.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(this.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");
    return $("<li></li>")
    .data("item.autocomplete", item)
    .append('<a><i class="fa fa-plus-circle"></i> ' + item.label + "</a>")
    .appendTo(ul);
};

function tooltiper() {
    var targets = $('[rel~=tooltip]'),
    target = false,
    tooltip = false,
    title = false;

    targets.on('mouseenter', function()
    {
        target = $(this);
        tip = target.attr('title');
        tooltip = $('<div id="tooltip"></div>');

        if (!tip || tip == '')
            return false;

        target.removeAttr('title');
        tooltip.css('opacity', 0)
        .html(tip)
        .appendTo('body');

        var init_tooltip = function()
        {
            if ($(window).width() < tooltip.outerWidth() * 1.5)
                tooltip.css('max-width', $(window).width() / 2);
            else
                tooltip.css('max-width', 340);

            var pos_left = target.offset().left + (target.outerWidth() / 2) - (tooltip.outerWidth() / 2),
            pos_top = target.offset().top - tooltip.outerHeight() - 20;

            if (pos_left < 0)
            {
                pos_left = target.offset().left + target.outerWidth() / 2 - 20;
                tooltip.addClass('left');
            }
            else
                tooltip.removeClass('left');

            if (pos_left + tooltip.outerWidth() > $(window).width())
            {
                pos_left = target.offset().left - tooltip.outerWidth() + target.outerWidth() / 2 + 20;
                tooltip.addClass('right');
            }
            else
                tooltip.removeClass('right');

            if (pos_top < 0)
            {
                var pos_top = target.offset().top + target.outerHeight();
                tooltip.addClass('top');
            }
            else
                tooltip.removeClass('top');

            tooltip.css({
                left: pos_left,
                top: pos_top
            })
            .animate({
                top: '+=10',
                opacity: 1
            }, 50);
        };

        init_tooltip();
        $(window).resize(init_tooltip);

        var remove_tooltip = function()
        {
            tooltip.animate({
                top: '-=10',
                opacity: 0
            }, 50, function()
            {
                $(this).remove();
            });

            target.attr('title', tip);
        };

        target.on('mouseleave', remove_tooltip);
        tooltip.on('click', remove_tooltip);
    });
}

function slider() {
    //stick in the fixed 100% height behind the navbar but don't wrap it
    $('#slide-nav.navbar-inverse').after($('<div class="inverse" id="navbar-height-col"></div>'));
    $('#slide-nav.navbar-default').after($('<div id="navbar-height-col"></div>'));

    // Enter your ids or classes
    var toggler = '.navbar-toggle';
    var pagewrapper = '#page-content';
    var navigationwrapper = '.navbar-header';
    var menuwidth = '100%'; // the menu inside the slide menu itself
    var slidewidth = '80%';//80
    var menuneg = '-100%';
    var slideneg = '-80%';

    $("#slide-nav").on("click", toggler, function(e) {

        var selected = $(this).hasClass('slide-active');

        $('#slidemenu').stop().animate({
            left: selected ? menuneg : '0px'
        });

        $('#navbar-height-col').stop().animate({
            left: selected ? slideneg : '0px'
        });

        $(pagewrapper).stop().animate({
            left: selected ? '0px' : slidewidth
        });

        $(navigationwrapper).stop().animate({
            left: selected ? '0px' : slidewidth
        });
        $(this).toggleClass('slide-active', !selected);
        $('#slidemenu').toggleClass('slide-active');
        $('#page-content, .navbar, body, .navbar-header').toggleClass('slide-active');
        $(".navbar-header").css("position", "fixed") ;  //.css("width", "100%");
        $(".navbar-brand").css("width","10%");
    });
    var selected = '#slidemenu, #page-content, body, .navbar, .navbar-header';
    $(window).on("resize", function() {
        if ($(window).width() > 767 && $('.navbar-toggle').is(':hidden')) {
            //            console.log('removed slideactive');
            $(selected).removeClass('slide-active');
        }
    });
}
;


function on_startup_up() {

    $('.popup-with-zoom-anim').magnificPopup({
        type: 'inline',
        alignTop:true,
        //        fixedContentPos: false,
        //        fixedBgPos: true,
        //        overflowY: 'auto',
        closeBtnInside: true,
        preloader: false,
        //        midClick: true,
        removalDelay: 300,
        mainClass: 'my-mfp-zoom-in'
    });

    slider();
    //    $(window).scroll(function() {
    //        //        console.log($(window).scrollTop());
    //        if( $(window).scrollTop()  > $(window).height()/2 ) {
    //            var body = document.getElementsByTagName('body')[0];
    //            angular.element(body).scope().scroll();
    //
    //        }
    //    });


    $(window).resize(function() {
        //        var bodyheight = $(document).height();
        //        console.log( $(document).width());
        //        console.log($("#kitchen_panel").height(), $("#doyouhave_panel").height() )
        var body = document.getElementsByTagName('body')[0];
        angular.element(body).scope().check_mobile();
    //        $("#sidebar").height(bodyheight);        
    });


    $(".new_ing").autocomplete({
        autoFocus: true,
        'source': '/dyn/autoc',
        select: function(event, ui) {

            var body = document.getElementsByTagName('body')[0];
            angular.element(body).scope().ingredient_add(ui.item.value);
            angular.element(body).scope().$apply();

            setTimeout(function() {
                $('.new_ing').val('').focus();
            }, 100);


        },
        messages: {
            noResults: '',
            results: function() {
            }
        }
    });

    $("#new_exclusion").autocomplete({
        autoFocus: true,
        'source': '/dyn/autoc',
        select: function(event, ui) {

            var body = document.getElementsByTagName('body')[0];
            angular.element(body).scope().exclusion_add(ui.item.value);
            angular.element(body).scope().$apply();

            setTimeout(function() {
                $('#new_exclusion').val('').focus();
            }, 100);


        },
        messages: {
            noResults: '',
            results: function() {
            }
        }
    });


    //    $('#kitchenfooter').on('click', function(){
    //        $('#kitchenfooter').hide();
    //    });

    //    $('#kitchenfooter').hide();

    $('#kitchen_modal, #doyouhave_modal').on('hidden.bs.modal', function() {
        var body = document.getElementsByTagName('body')[0];
        if ($("#main_dropdown").is(":visible"))
            if ($("button.navbar-toggle").is(":visible")) {
                $(".navbar-collapse").removeClass("in").addClass("collapse");
                //                $(".navbar-toggle").click();
                angular.element(body).scope().sugg();
            }
        angular.element(body).scope().load_recipes();
    });
    
    
    $("#page-content").on("click", function(){
        if ($(".navbar-toggle").hasClass("slide-active")){
            $(".navbar-toggle").trigger("click");
        }
    });

    //    $("#exclusion_modal").on("hidden.bs.modal", function() {
    //        var body = document.getElementsByTagName('body')[0];
    //        angular.element(body).scope().load_recipes();
    //        angular.element(body).scope().sugg();
    //    });

    //    $('.categories li').on('click', function() {
    //        if ($("button.navbar-toggle").is(":visible"))
    //            $(".navbar-toggle").click();
    //    });


    //    $(document).on("click", ".kitchen .trash", function() {
    //        console.log($(this));
    //    });

    //    $('.ingredients_column').affix({
    //        offset: {
    //            top: '0px'
    //        }
    //    });


    $(".jumbotron h1").addClass('animated slideInDown');
    $(".jumbotron p").addClass('animated slideInLeft');
    $(".jumbotron a").addClass('animated slideInRight');

//    $('.grip').affix({
//        offset: {
//            top: '300px',
//            left: '23.5%'
//        }
//    });

}




function hideleft() {
    if ( $(".ingredients_column").hasClass("bounceOutLeft")  ) {
        $(".ingredients_column").removeClass('animated bounceOutLeft');
        $('.results_column').css("width", "").css("padding-left", "");
        $(".grip").css("left", "");
    } else {
        $(".ingredients_column").addClass('animated bounceOutLeft');
        setTimeout(function() {
            $('.results_column').css("width", "100%").css("padding-left", "40px");
        }, 400);
        $(".grip").css("left", "3px");
    }
}