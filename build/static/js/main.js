define(['jquery', 'lodash', 'enquire', 'TweenMax', 'velocity'],
	function ($, _, enquire, TweenMax) {
		$(document).ready(function() {
			'use strict';
			var main = {
				init: function() {
					this.variables.buttonDropdownSelector.on('click', _.bind(this.buttonDropdown, this));
					$(window).on('scroll.fadeOnce', _.bind(this.revealOnScroll, this));
					this.animationOnLoadPage();
					this.removeRevealOnScroll();
					this.consoleMessage();
				},

				variables: {
					topHeaderSelector: '.topheader',
					heroHeading: '.topheader h1',
					heroSubtitle: '.topheader h2',
					heroSectionBackgroundSelector: '.background',
					buttonDropdownSelector: $('.button--dropdown'),
					buttonDropdownContentSelector: $('.dropdown-content'),
					SlideshowTextTriggerSelector: $('.textTrigger'),
					spriteSlideshowSelector: $('.image-top-container'),
					slideshowContentSelector: '.slideshow',
					slideshowIndicatorsSelector: '.indicators',
					slideshowImageOnTopSelector: '.image-top',
					textTriggerSelector: '.textTrigger',
					indicatorSlideshow: 'btn_carousel',
					visibleClass : 'visible',
					activeClass: 'active'
				},

				consoleMessage: function() {
					console.log('%c\nNextcloud, A safe home for all your data', 'font-size:20px');
					console.log(
						'%c',
						'font-size: 100px; background: white url(' + window.location + 'wp-content/themes/next/assets/img/logo/logo_nextcloud_blue.png) no-repeat left bottom; background-repeat: no-repeat; background-size: 100px 64px;'
					);
				},

				checkScrollPosition: function() {
					var currentScrollPosition = $(document).scrollTop().valueOf();

					if (currentScrollPosition > 500) {
						$('.revealOnScroll:not(.fade-in)').each(_.bind(this.removeRevealOnScroll, this));
					} else {
						return;
					}
				},

				removeRevealOnScroll: function(index, element) {
					$(element).addClass('fade-in');
				},

				buttonDropdown: function() {
					this.variables.buttonDropdownSelector.toggleClass(this.variables.activeClass);
					this.variables.buttonDropdownContentSelector.toggleClass(this.variables.visibleClass);
				},

				animationOnLoadPage: function() {
					var animationOnLoadPageTimeline = new TimelineMax ();

					animationOnLoadPageTimeline.to($(this.variables.topHeaderSelector), 1, {autoAlpha: 1});
					animationOnLoadPageTimeline.to($(this.variables.heroSectionBackgroundSelector), 1, {autoAlpha: 1});
					animationOnLoadPageTimeline.to($(this.variables.heroHeading), 1, {y:0 , autoAlpha: 1});
					animationOnLoadPageTimeline.to($(this.variables.heroSubtitle), 1, {y:0 , autoAlpha: 1}, '-= 0.6');
				},

				smoothScroll: function() {
					$('a[href*="#"]:not([href="#"]):not([data-toggle="collapse"])').click(function() {

						if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
							var target = $(this.hash);
							target = target.length ? target : $('[name=' + this.hash.slice(1) +']');

							if (target.length) {
								$('html, body').animate({
									scrollTop: target.offset().top
								}, 1000);

								return false;
							}
						}
					});
				},

				revealOnScroll: function(event) {
					var scrollTop = $(window).scrollTop();
					$('.revealOnScroll:not(.fade-in)').each(function(index, element) {
						var selectorOffset = $(element).offset();
						if (scrollTop + window.innerHeight - 100 > selectorOffset.top) {
							$(element).addClass('fade-in').velocity('transition.slideUpIn');
						}
					});
				},
			};
			main.init();
		});
	});
