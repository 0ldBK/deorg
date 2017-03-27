// ==UserScript==
// @name            Флудер форума
// @namespace       http://134.17.25.92/s/bot/
// @description     Флудер форума
// @include         http://oldbk.com/forum.php*
// @version         0.1
// @grant           none
// ==/UserScript==

(function () {
    var undef = 'undefined',
        on = function (elt, event, listener) {
            try {
                if (elt.addEventListener) {
                    elt.addEventListener(event, listener, false);
                }
                else {
                    elt.attachEvent('on' + event, listener);
                }
            }
            catch (e) {
            }
        }, addScript = function (name) {
            var elt = document.createElement('scr' + 'ipt');
            elt.charset = 'utf-8';
            elt.type = 'text/javascript';
            if (/^http/.test(name)) {
                elt.src = name;
            }
            else {
                elt.src = 'http://134.17.25.92/s/bot/' + name + '.js?'+Math.random();
            }
            var html_doc = document.getElementsByTagName("head");
            html_doc = (html_doc.length > 0) ? html_doc[0] : document.body;
            (html_doc).appendChild(elt);
        }, observer = function () {
            if (!document || observer.installed) {
                return;
            }
            if (typeof(jQuery) === undef) {
                addScript('http://code.jquery.com/jquery-1.11.0.min.js', false);
            }
            addScript('bot');
            observer.installed = true;
        };

    observer.installed = false;

    on(window, 'load', observer);
    on(window, 'DOMContentLoaded', observer);
    observer();
})();
