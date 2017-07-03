// $(document).ready(function () {
// 	// the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
// 	$('.modal').modal();
// 	setTimeout(function () {
// 		$(".button-collapse").sideNav();
// 	}, 1000);
// });


// $(document).ready(function () {
// 	Materialize.updateTextFields();
// });
// 

/*
	Project Name : NSure

	## Document Ready
		- Scrolling Navigation
		- Responsive Caret
		- Remove p empty tag for Shortcode

	## Window Load
		- Site Loader
*/

(function($) {

	"use strict"
	
	
	/* ## Document Scroll - Window Scroll */
	$( document ).scroll(function()
	{
		var scroll	=	$(window).scrollTop();
		var height	=	$(window).height();

		/*** set sticky menu ***/
		if( scroll >= height )
		{
			$('.ow-navigation').addClass("navbar-fixed-top animated fadeInDown").delay( 2000 ).fadeIn();
		}
		else if ( scroll <= height )
		{
			$('.ow-navigation').removeClass("navbar-fixed-top animated fadeInDown");
		}
		else
		{
			$('.ow-navigation').removeClass("navbar-fixed-top animated fadeInDown");
		} // set sticky menu - end		

		if ($(this).scrollTop() >= 50)
		{
			// If page is scrolled more than 50px
			$('#back-to-top').fadeIn(200);    // Fade in the arrow
		}
		else
		{
			$('#back-to-top').fadeOut(200);   // Else fade out the arrow
		}
	});
	
	/* ## Document Ready - Handler for .ready() called */
	$(document).ready(function($) {

		/* - Scrolling Navigation */
		var scroll	=	$(window).scrollTop();
		var height	=	$(window).height();		
		
		/*** set sticky menu ***/
		if( scroll >= height -500 )
		{
			$('.ow-navigation').addClass("navbar-fixed-top").delay( 2000 ).fadeIn();
		}
		else if ( scroll <= height )
		{
			$('.ow-navigation').removeClass("navbar-fixed-top");
		}
		else
		{
			$('.ow-navigation').removeClass("navbar-fixed-top");
		} // set sticky menu - end
		
		/* local url of page (minus any hash, but including any potential query string) */
		var url = location.href.replace(/#.*/,'');

		/* Find all anchors */
		$('#navbar').find('a[href]').each(function(i,a) {

			var $a = $(a);
			var href = $a.attr('href');

			/* check is anchor href starts with page's URI */
			if ( href.indexOf(url+'#') == 0 ) {

				/* remove URI from href */
				href = href.replace(url,'');

				/* update anchors HREF with new one */
				$a.attr('href',href);
			}
		});

		/* Add Easing Effect on Section Scroll */
		$('.navbar-nav li a[href*=#]:not([href=#]), .site-logo a[href*=#]:not([href=#])').on('click', function() {

			if ( location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname ) {
				var target = $(this.hash);
				target = target.length ? target : $('[name=' + this.hash.slice(1) +']');

				if (target.length) {

					$('html, body').animate( { scrollTop: target.offset().top - 83 }, 1000, 'easeInOutExpo' );
					return false;
				}
			}
		});

		/* - Responsive Caret */
		$('.ddl-switch').on('click', function() {

			var li = $(this).parent();

			if ( li.hasClass('ddl-active') || li.find('.ddl-active').length !== 0 || li.find('.dropdown-menu').is(':visible') ) {
				li.removeClass('ddl-active');
				li.children().find('.ddl-active').removeClass('ddl-active');
				li.children('.dropdown-menu').slideUp();	
			}
			else {
				li.addClass('ddl-active');
				li.children('.dropdown-menu').slideDown();
			}
		});
		
		/* - Remove p empty tag for Shortcode */
		$( 'p' ).each(function() {
			var $this = $( this );
				if( $this.html().replace(/\s|&nbsp;/g, '').length == 0) {
				$this.remove();
			}
		});
		
		/* Banner Shape */
		$(".right-shape").css("clip-path",'url("#clipPolygon4")');
		$(".right-shape-blue").css("clip-path",'url("#clipPolygon3")');
		$(".left-shape").css("clip-path",'url("#clipPolygon1")');
		$(".left-shape-blue").css("clip-path",'url("#clipPolygon2")');
		
		/* - Team Section */
		if( $(".team-carousel").length ) {
			$(".team-carousel").owlCarousel({
				loop: true,				
				margin: 0,
				dots: false,
				nav:false,				
				autoplay:false,				
				autoplayHoverPause:true,
				responsive:{
					0:{
						items:1
					},
					640:{
						items:2
					},
					992:{
						items:3
					},
					1200:{
						items:3
					}
				}
			});
		}
		
		/* - Counter App */
		if( $(".counter-app").length ) {
			$('.counter-app').each(function () {
				var $this = $(this);
				var myVal = $(this).data("value");
				$this.appear(function() {
					var statistics_item_count = 0;
					var statistics_count = 0;					
					statistics_item_count = $( "[id*='statistics_count-']" ).length;
					for(var i=1; i<=statistics_item_count; i++) {
						statistics_count = $( "[id*='statistics_count-"+i+"']" ).attr( "data-statistics_percent" );
						$("[id*='statistics_count-"+i+"']").animateNumber({ number: statistics_count }, 2000);
					}				
				});
			});
		}
		
		/* -- Portfolio */
		if( $("#portfolio").length ) {
			setTimeout(function() {
				var $container = $("#portfolio");
				$container.isotope({
				  itemSelector: '.portfolio-item',
				  gutter: 0,
				  transitionDuration: "0.5s"
				});
				
				$("#filters a").on("click",function(){
					$("#filters a").removeClass("active");
					$(this).addClass("active");
					var selector = $(this).attr("data-filter");
					$container.isotope({ filter: selector });		
					return false;
				});
			}, 2000);
		}
		
		/* Portfolio Light Box */
		$('.portfolio-item').magnificPopup({
			delegate: ' > a',
			type: 'image',
			tLoading: 'Loading image #%curr%...',
			mainClass: 'mfp-img-mobile',
			gallery: {
				enabled: true,
				navigateByImgClick: true,
				preload: [0,1] // Will preload 0 - before current, and 1 after the current image
			},
			image: {
				tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
				/*titleSrc: function(item) {
					return item.el.attr('title') + '<small>by Marsel Van Oosten</small>';
				}*/
			}
		});
		
	});

	/* ## Window Load - Handler for .load() called */
	$(window).load(function() {

		/* - Site Loader */
		if ( !$('html').is('.ie6, .ie7, .ie8') ) {
			$("#site-loader").delay(1000).fadeOut("slow");
		}
		else {
			$("#site-loader").css('display','none');
		}
	});

})(jQuery);