define(['jquery', 'lodash', 'enquire', 'scrollMagic', 'hammer', 'inview'],
	function ($, _, enquire, ScrollMagic, Hammer, isInView) {
		$(document).ready(function() {
			'use strict';
			var slideshow = {
				init: function() {

					enquire.register('screen and (max-width: 991px)', {
						match: _.bind(this.modulesBindMobile, this),
						unmatch: _.bind(this.cleanModulesMobile, this)
					});

					enquire.register('screen and (min-width: 992px)', {
						match: _.bind(this.modulesBindDesktop, this),
						unmatch: _.bind(this.cleanModulesDesktop, this)
					});
				},

				variables : {
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

				modulesBindDesktop: function() {
					this.slideshowDesktop();
					this.updateSlideshowImageSizes();
					$(window).resize(_.bind(this.updateSlideshowImageSizes, this));
				},

				modulesBindMobile: function() {
					this.slideshowMobile();
				},

				cleanModulesDesktop: function() {
					this.destroyMagicScrollOnMobile();
				},

				cleanModulesMobile: function() {
					this.removeInlineCssOnDesktop();
					this.removeInlineCssOnMobile();
				},

				slideshowTablet: function() {
					$('.image__mobile').hide();
					$(window).resize(_.bind(this.updateSlideshowImageSizes, this));
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

				indicatorSlideshow: function() {
					var visibleElement = $(this.variables.textTriggerSelector).parent();

					$(visibleElement).on('inview', function(event, isInView) {
						if (isInView) {
							var currentSlide = $(event.currentTarget).data('slide');
							var $indicator = $('.btn_carousel:nth-child(' + (parseInt(currentSlide) + 1)+')');
							var $active = $('.btn_carousel.active');
							var imageFeatures = $('.image-top');

							$active.removeClass('active');
							$indicator.addClass('active');
						}
					});
				},

				slideshowImagePosition: function(currentSlide) {
					var visibleElement = $(this.variables.textTriggerSelector).parent();

					$(visibleElement).on('inview', function(event, isInView) {
						if (isInView) {
							var currentSlide = $(event.currentTarget).data('slide');
							var imageFeatures = $('.image-top');
							var currentHeight = $('.image-top').height() / 4;

							if (currentSlide === 1) {
								imageFeatures.css({
									'top': '0' + 'px',
								});
							}

							if (currentSlide === 2) {
								imageFeatures.css({
									'top': '-' + currentHeight + 'px'
								});
							}

							if (currentSlide === 3) {
								imageFeatures.css({
									'top': '-' + currentHeight * 2 + 'px'
								});
							}

							if (currentSlide === 4) {
								imageFeatures.css({
									'top': '-' + currentHeight * 3 + 'px'
								});
							}
						}
					});
				},

				slideshowDesktop : function () {
					this.indicatorSlideshow();
					this.slideshowImagePosition();
					this.slideshowChangeImageDesktop();

					this.controller = new ScrollMagic.Controller();
					this.variables.SlideshowTextTriggerSelector.each(function() {

						var imageFeatures = $('.image-top');
						var animateImage = new ScrollMagic.Scene ({
							triggerElement: this,
							offset: '100%',
							reverse: true,
							triggerHook: 1
						})
							.addTo(this.controller);
					});

					var imagePin = new ScrollMagic.Scene ({
						triggerElement: '#imageTrigger',
						duration: '300%',
						triggerHook: 0
					})

						.setPin('#imageTrigger')
						.setClassToggle('.indicators', 'active') // add indicators to scene
						.addTo(this.controller);
				},

				slideshowMobile: function() {
					$(this.variables.slideshowIndicatorsSelector).addClass(this.variables.activeClass);
					this.slideshowImagePositionMobile();
					this.slideshowChangeImageMobile();
					this.indicatorSlideshow();
					this.updateSlideshowImageSizes();
					this.toggleTextSlideshowMobile();
					$(window).resize(_.bind(this.updateSlideshowImageSizes, this));

					$(this.variables.slideshowIndicatorsSelector).addClass(this.variables.activeClass);

					var sectionHeadingheight = $('#slideshow').find('.section--heading-1').height();
					var currentImageDevice = $('.image-back').height() + sectionHeadingheight + 200;
					$(this.variables.slideshowIndicatorsSelector).css({
						'top': currentImageDevice + 'px'
					});
					$(this.variables.indicatorSlideshow).on('click', _.bind(this.indicatorsAnchorMobile, this));
				},

				indicatorsAnchorMobile: function(event) {
					event.prevent;
				},

				updateSlideshowImageSizes: function() {
					var imageDeviceWidth = $('.image-back').width() * '0.9376733', // Using proportions to do the math
						imageDeviceHeight = $('.image-back').height() * '0.722727273', // Using proportions to do the math
						imageOnTopMargins = $('.image-back').width() * '0.0314'; // Using proportions to do the math


					$('.image-top-container').css({
						'width': imageDeviceWidth + 'px',
						'height': imageDeviceHeight + 'px',
						'top': imageOnTopMargins + 'px',
						'left': imageOnTopMargins + 'px'
					});
				},

				slideshowChangeImageMobile: function() {
					$('.image-top-container').find('.image__desktop').hide();
					$('.image-top-container').find('.image__mobile').show();
				},

				slideshowChangeImageDesktop: function() {
					$('.image-top-container').find('.image__desktop').show();
					$('.image-top-container').find('.image__mobile').hide();
				},

				toggleTextSlideshowMobile: function() {
					var firstText = $('.right-text-grey').first();
					firstText.addClass(this.variables.activeClass);

					var element = document.getElementById('slideshow');
					Hammer(element).on('swipeleft', _.bind(this.showNextTextSlideshow, this));
					Hammer(element).on('swiperight', _.bind(this.showPreviousTextSlideshow, this));
				},

				showNextTextSlideshow: function(event) {
					var lastElement = $('.right-text-grey').last(),
						visibleElement = $('.textTrigger').parent(),
						slidesCount = $('.right-text-grey').last().data('slide'),
						currentSlide = $('.right-text-grey.active').data('slide');

					if (slidesCount > currentSlide) {
						var currentText = $('.right-text-grey.active');
						var nextText = $('.right-text-grey.active').next();

						nextText.addClass('swipeleft active');
						currentText.removeClass('active');

						setTimeout(function() {
							nextText.removeClass('swipeleft');
						}, 200 );

					} else {
						nextText = $('.right-text-grey').first();
						var currentText = $('.right-text-grey.active');

						nextText.addClass('swipeleft active');
						currentText.removeClass('active');

						setTimeout(function() {
							nextText.removeClass('swipeleft');
						}, 200 );
					}
				},

				showPreviousTextSlideshow: function(event) {
					var currentText = $('.right-text-grey.active'),
						previousText = $('.right-text-grey.active').prev(),
						lastElement = $('.right-text-grey').last(),
						visibleElement = $('.textTrigger').parent(),
						slidesCount = $('.right-text-grey').first().data('slide'),
						NoMoreSlides = $('.right-text-grey.active').data('slide');

					if (slidesCount < NoMoreSlides) {
						var currentText = $('.right-text-grey.active'),
							previousText = $('.right-text-grey.active').prev();

						previousText.addClass('swiperight active');
						currentText.removeClass('active');

						setTimeout(function() {
							previousText.removeClass('swiperight');
						}, 200 );

					} else {
						previousText = $('.right-text-grey').last();
						currentText = $('.right-text-grey.active');

						previousText.addClass('active');
						currentText.removeClass('active');

						setTimeout(function() {
							previousText.removeClass('swiperight');
						}, 200 );
					}
				},

				slideshowImagePositionMobile: function() {
					var visibleElement = $('.textTrigger').parent();

					$(visibleElement).on('inview', function(event, isInView) {
						if (isInView) {
							var currentSlide = $(event.currentTarget).data('slide'),
								imageFeatures = $('.image-top'),
								slidesCount = $('.right-text-grey').last().data('slide'),
								imageTopHeight = $('.image__mobile').width() / slidesCount;

							if (currentSlide === 1) {
								imageFeatures.css({
									'left': '0' + 'px'
								});
							}

							if (currentSlide === 2) {
								imageFeatures.css({
									'left': - imageTopHeight + 'px'
								});
							}

							if (currentSlide === 3) {
								imageFeatures.css({
									'left': - imageTopHeight * 2 + 'px'
								});
							}

							if (currentSlide === 4) {
								imageFeatures.css({
									'left': - imageTopHeight *  3 + 'px'
								});
							}
						}
					});
				},

				destroyMagicScrollOnMobile: function(event, slideshowDesktop) {
					this.controller.destroy(true);
					this.controller = null;
					this.slideshowDesktopCss = $('.scrollmagic-pin-spacer').attr('style');
					$('.scrollmagic-pin-spacer').removeAttr('style');
				},

				removeInlineCssOnDesktop: function(destroyMagicScrollOnMobile) {
					$('.image__desktop').removeAttr('style');
					$('.scrollmagic-pin-spacer').css('style');
				},

				removeInlineCssOnMobile: function() {
					$(this.variables.slideshowIndicatorsSelector).removeAttr('style');
					$(this.variables.slideshowIndicatorsSelector).css('style');
				}
			};
			slideshow.init();
		});
	});
