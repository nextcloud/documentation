// This use the highlight,js plugin, for more information use the link above
// https://highlightjs.org/

// TODO Use workers for better performance

define(['jquery', 'lodash', 'highlight'],
	function ($, _, hljs) {
		$(document).ready(function() {
			'use strict';
			var codeHighlight = {
				init: function() {
					hljs.initHighlightingOnLoad();
				},
			};
			codeHighlight.init();
		});
	});
