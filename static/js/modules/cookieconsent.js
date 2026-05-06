define(['jquery'],
	function ($, _, enquire, Velocity, velocityUI, ScrollMagic) {
        $(document).ready(function(){
            var sCookieName = "cookiewarning";
            function createCookie(name, value, days) {
                if (days) {
                        var date = new Date();
                        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                        var expires = "; expires=" + date.toGMTString();
                } else var expires = "";
                        document.cookie = name + "=" + value + expires + "; path=/";
            }

            function readCookie(name) {
                    var nameEQ = name + "=";
                    var ca = document.cookie.split(';');
                    for (var i = 0; i < ca.length; i++) {
                            var c = ca[i];
                            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
                    }
                    return null;
            }

            // actually give cookie warning
            if (readCookie(sCookieName) != 1) {
                setTimeout(function () {
                    $("#cookieConsent").fadeIn(500);
                }, 2000);
            }

            $("#closeCookieConsent, .cookieConsentOK").click(function() {
                $("#cookieConsent").fadeOut(200);
                createCookie(sCookieName, 1, 365)
            });
        });
	});


