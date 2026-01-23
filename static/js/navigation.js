$(document).ready(function() {
	'use strict';
	var HeaderApp = {
		init: function() {

			this.didScroll = false;
			this.menuOpened = false;
			this.enquireInitializedMobile = false;

			//Fade In animation
			$(this.variables.navigationId).velocity('transition.fadeIn', 1000 );
			this.animatedLogoSprite();

			enquire.register('screen and (max-width: 992px)', {
				match: _.bind(this.mobileEvent, this)
			});

			enquire.register('screen and (max-height: 700px)', {
				match: _.bind(this.showAndHideHeader, this)
			});

			enquire.register('screen and (min-width: 993px)', {
				match: _.bind(this.desktopDropdownEvent, this)
			});
		},

		variables : {
			toggleSelector: '#toggle',
			navigationId: '#nav',
			navigationSelector: '.nav',
			subMenuSelector: '#menuAnchor',
			sectionsSelector: '.nav__sections',
			sectionsContainerSelector: '.nav__sections-wrapper',
			sectionSelector: '.nav__section',
			navBackgroundSelector: '.nav__bg',
			navBackgroundWrapper: '.nav__bg-wrapper',
			rightNavigationSelector: '.right-buttons',
			linksSelector: '.nav__links',
			logoSelector: '.logo',
			mobileClass: 'mobile',
			activeClass: 'active',
			scrolledClass:'scrolled',
			backgroundAnimationClass: 'is-animatable',
			linksVisibleClass: 'is-visible',
			mobileBackgroundSelector: '.mobile-bg',
			mobileMenuClass: 'menu-open',
			showNavigationClass:'nav-down',
			hideNavigationClass: 'nav-up',
			playOnHoverClass: 'hoverPlay',
			stopAnimationClass: 'stopedAnimation',
			mobileBackgroundContainerSelector: '.mobile-bg-container',
		},

		toggleMobileMenu: function(event) {
			$(this.variables.linksSelector).hide().removeClass(this.variables.activeClass); //hide all submenus without animation
			$(event.currentTarget).toggleClass(this.variables.activeClass);
			$(this.variables.mobileBackgroundSelector).toggleClass(this.variables.activeClass);
			$(this.variables.sectionsSelector).toggleClass(this.variables.activeClass);
			$(this.variables.rightNavigationSelector).toggleClass(this.variables.activeClass);
			$(this.variables.logoSelector).toggleClass(this.variables.mobileMenuClass);
			$(this.variables.mobileBackgroundContainerSelector).toggleClass(this.variables.backgroundAnimationClass);
		},

		resetMobile: function() {
			$(this.variables.navigationId).removeClass(this.variables.mobileClass);
			$(this.variables.toggleSelector).off('click');
			$(this.variables.sectionSelector).off('click');
			$(this.variables.linksSelector).css('display', 'inherit').removeClass(this.variables.activeClass);
		},

		resetDesktop: function() {
			$(this.variables.sectionSelector).off('mouseover');
			$(this.variables.sectionSelector).off('mouseleave');
			$(this.variables.linksSelector).hide();
		},

		showSubMenu: function(event) {
			if ($(event.currentTarget).find(this.variables.linksSelector).hasClass(this.variables.activeClass)) {
				$(this.variables.linksSelector).slideUp().removeClass(this.variables.activeClass);

				return;
			}

			$(this.variables.linksSelector).slideUp().removeClass(this.variables.activeClass);
			$(event.currentTarget).find(this.variables.linksSelector).slideToggle().addClass(this.variables.activeClass);
		},

		mobileBgAnimation: function() {
			var windowDiameter = ($(window).width() * 2) * $(window).height() * 2,
				maxDiameter = (Math.sqrt(windowDiameter)) * 1.5;

			$(this.variables.mobileBackgroundSelector).css({
				'top': - maxDiameter / 2+ 'px',
				'right': - maxDiameter / 2 + 'px',
				'width': maxDiameter + 'px',
				'height': maxDiameter + 'px'
			});
		},

		showAndHideHeader: function(variables) {

			var navigationElement = document.querySelector('.nav');

			//I should pass the variable object inside the headroom
			this.headroom  = new Headroom(navigationElement, {
				offset: 510,
				tolerance : {
					up : 20,
					down : 20
				},

				onTop: function(variables) {
					$('#nav').removeClass('scrolled');
					$('.logo').removeClass('scrolled');
					$('.mobile-bg-container').addClass('visible');
				},

				onPin: function() {
					$('.menu').removeClass('hidedPrincipalNavigation');
					$('#nav').addClass('scrolled');
					$('.logo').addClass('scrolled');
				},

				onNotTop : function() {
					$('.mobile-bg-container').addClass('visible');
				},

				onUnpin: function() {
					$('.menu').addClass('hidedPrincipalNavigation');
					$('.mobile-bg-container').addClass('visible');
				}
			});
			this.headroom.init();
		},

		mobileEvent: function() {
			this.resetDesktop();
			if (!this.enquireInitializedMobile) {
				this.enquireInitializedMobile = true;
				this.createMenuButton();
			}
			$(window).on('resize', _.bind(this.mobileBgAnimation, this));
			this.mobileBgAnimation();
			$(this.variables.navigationId).addClass(this.variables.mobileClass);
			$(this.variables.toggleSelector).click(_.bind(this.toggleMobileMenu, this));
			$(this.variables.sectionSelector).click(_.bind(this.showSubMenu, this));
		},

		setBackgroundDropdown: function(background) {
			background.addClass(this.variables.backgroundAnimationClass);
		},

		backgroundDropdown: function(event) {
			var cssPadding = 30,
				background = $(this.variables.navBackgroundSelector),
				backgroundWrapper = $(this.variables.navBackgroundWrapper),
				selectedDropdown = $(event.currentTarget).find(this.variables.linksSelector),
				height = selectedDropdown.innerHeight(),
				width = selectedDropdown.innerWidth(),
				windowWidth = $(this.variables.navigationSelector).outerWidth(),
				navigationWidth = $('.nav .container').outerWidth(),
				marginNavigation = (windowWidth - navigationWidth) / 2,
				backgroundDropdownPosition = $(event.currentTarget).offset().left + cssPadding + ($(event.currentTarget).innerWidth() - cssPadding) /2 - width/2 - marginNavigation;

			setTimeout(_.bind(this.setBackgroundDropdown, this, background));
			backgroundWrapper.addClass(this.variables.linksVisibleClass);

			background.css({
				'-moz-transform': 'translateX(' + backgroundDropdownPosition + 'px)',
				'-webkit-transform': 'translateX(' + backgroundDropdownPosition + 'px)',
				'-ms-transform': 'translateX(' + backgroundDropdownPosition + 'px)',
				'-o-transform': 'translateX(' + backgroundDropdownPosition + 'px)',
				'transform': 'translateX(' + backgroundDropdownPosition + 'px)',
				'width': width + 'px',
				'height': height + 'px'
			});
		},

		desktopDropdownEvent: function() {
			this.resetMobile();
			$(this.variables.sectionSelector).on('mouseover', _.bind(this.backgroundDropdown, this));
			$(this.variables.sectionSelector).on('mouseleave', _.bind(this.destroyDropdown, this));
			this.showAndHideHeader();
		},

		// Clear dropdowns in mouse leave
		destroyDropdown: function(event) {
			var background = $(this.variables.navBackgroundSelector),
				backgroundWrapper = $(this.variables.navBackgroundWrapper);

			setTimeout(_.bind(function() {
				background.removeClass(this.variables.backgroundAnimationClass);
			},this));

			var backgroundWrapper = $(this.variables.navBackgroundWrapper);
			backgroundWrapper.removeClass(this.variables.linksVisibleClass);
		},


		//Bodymovin menu Animation
		createMenuButton: function() {
			var menuAnimation,
				animContainer = document.querySelectorAll('.container button')[0],
				params = {
					container: animContainer,
					renderer: 'svg',
					loop: false,
					autoplay: false,
					autoloadSegments: true,
					path: templateUrl + '/assets/img/menu/data.json'
				};
			menuAnimation = bodymovin.loadAnimation(params);
			menuAnimation.stop();

			$('.container button').click(function () {
				if(this.menuOpened) {
					menuAnimation.setDirection(-1);
				} else {
					menuAnimation.setDirection(0);
				}
				menuAnimation.play();
				this.menuOpened = !this.menuOpened;
			});
		},

		//Listen to scroll to change header opacity class
		toggleScrolledClass: function() {
			var bodyScrollTop = document.documentElement.scrollTop || document.body.scrollTop;


			if (bodyScrollTop !== 0) {
				$(this.variables.navigationId).addClass(this.variables.scrolledClass);
				$(this.variables.logoSelector).addClass(this.variables.scrolledClass);
			}

			else {
				$(this.variables.navigationId).removeClass(this.variables.scrolledClass);
				$(this.variables.logoSelector).removeClass(this.variables.scrolledClass);
			}
		},

		checkScroll: function() {
			if ($(this.variables.navigationId).length > 0) {
				$(window).on('scroll load resize', _.bind(this.toggleScrolledClass, this));
			}
		},

		animatedLogoSprite: function() {
			this.hoverLogo();
			$(this.variables.logoSelector).on('mouseover', _.bind(this.hoverLogo, this));
		},

		hoverLogo: function () {
			$(this.variables.logoSelector).removeClass(this.variables.stopAnimationClass);
			$(this.variables.logoSelector).addClass(this.variables.playOnHoverClass);
			setTimeout(_.bind(this.stopLogoAnimation, this), 2000);
		},

		stopLogoAnimation: function() {
			$(this.variables.logoSelector).removeClass(this.variables.playOnHoverClass);
			$(this.variables.logoSelector).addClass(this.variables.stopAnimationClass);
		}
	};
	HeaderApp.init();
});
