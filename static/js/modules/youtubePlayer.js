// This use the plyr plugin, for more information use the link above
// https://github.com/sampotts/plyr

define(['jquery', 'lodash', 'plyr'],
	function ($, _, plyr) {
		$(document).ready(function() {
			'use strict';
			var YoutubePlayer = {
				init: function() {
					this.startPlayer();
					this.getCss();
				},

				getCss: function() {
					$('head').append('<link>');
					var css = $('head').children(':last');
					css.attr({
						rel:  'stylesheet',
						type: 'text/css',
						href: 'https://cdn.plyr.io/2.0.13/plyr.css'
					});
				},

				startPlayer: function() {
					plyr.setup({
					//Pass extra options here if needed
					});
				}
			};
			YoutubePlayer.init();
		});
	});
