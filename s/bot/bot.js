var SpamBot = function () {
    //this._dir = 'http://forum.bot/';
    this._dir = 'http://134.17.25.92/s/bot/';
    this.forum_id = null;
    this.message = null;
    this.opened = [];

    this.contentHTML = "<div id='bot'>" +
        "<textarea name='spam_text' id='spam_text'></textarea>" +
        "<input type='submit' id='submit'>" +
        "<div id='result'></div>" +
        "</div>";

    this.init = function () {

        this.buildHtml();

        this.forum_id = $('input[name=id]').val();

        if (this.forum_id) {
            this.findOpenedTopics();

            if(this.opened.length == 0){
                this.to('Нельзя спамить<br>');
                return;
            }

            this.to('Можно спамить<br>');
        } else {
            this.to('Нельзя спамить<br>');
        }
    };

    this.to = function (text, append) {

        append = append || false;

        if(!append){
            $('#result').html(text);
        } else {
            $('#result').append(text);
        }
    };

    this.buildHtml = function () {
        var self = this;
        $(document.head).append('<link rel="stylesheet" href="' + this._dir + '/bot.css">');
        $(document.body).append(this.contentHTML);

        $('#submit').on('click', function () {

            if (!self.forum_id) {
                return false;
            }

            if (self.opened.length == 0) {
                self.to('Некуда спамить<br>');
                return false;
            }

            var message = $('#spam_text').val();
            self.message = self.strEncode(message);

            if (self.message == '') {
                self.to('Empty message');
                return false;
            }

            self.spam();

        })
    };

    this.findOpenedTopics = function () {
        var pleft = $('.pleft');

        if (pleft.length > 0) {
            for (var i = 0; i < pleft.length; i++) {
                var href = $('a[href*=konftop]', pleft[i]).attr('href');
                var img = $('img[src*=topic_close]', pleft[i]);

                if (img.length == 0) {
                    this.opened.push(href);
                }
            }
        }
    };

    this.param = function (object, encoded) {
        var encodedString = '';
        for (var prop in object) {
            if (object.hasOwnProperty(prop)) {
                if (encodedString.length > 0) {
                    encodedString += '&';
                }
                if (!encoded)
                    encodedString += encodeURI(prop + '=' + object[prop]);
                else
                    encodedString += prop + '=' + object[prop];
            }
        }
        return encodedString;
    };

    this.strEncode = function (text, fallbackFunc) {
        var encodeFormFieldProc = {
            /**
             * Translation line: Main idea - Force browser Jscript engile to convert this to unicode using current page to build translation map
             */

            XlateLine: // DO NOT EDIT THE LINE BELLOW! It MUST contains single-byte characters with codes from 0x080 to 0xFF (Note: be careful with Copy-n-Paste!)
                'ЂЃ‚ѓ„…†‡€‰Љ‹ЊЌЋЏђ‘’“”•–—?™љ›њќћџ ЎўЈ¤Ґ¦§Ё©Є«¬­®Ї°±Ііґµ¶·ё№є»јЅѕїАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя',

            /**
             * Encodes text value in current browser codepage
             * like regular POST field form encoded when FORM tags posted
             * You can use this function instead of encodeURIComponent
             * @param {String} text Text to encode
             * @param {function} fallbackFunc [Optional] to be called to translate chars that not exist in current codepage
             * @return text param encoded like POST form param
             * @type String
             */

            encode: function (text, fallbackFunc) {
                if (this.isPageOnUTF8()) {
                    // Invalid context: We must not be called on UTF8 pages!
                    throw ('Script [encode_form_field.js] is designed for non-UTF8 pages only, use [encode_form_field_utf8_stub.js] on UTF8');
                    //return(encodeURIComponent(text));
                }

                if (fallbackFunc == null) {
                    // If no fallback is defined, use current default
                    fallbackFunc = this.encodeDefaultFallbackFunc;
                }

                text = '' + text; // Force text to be text

                var len = text.length;

                var result = '';

                var pos, text_char;

                for (var i = 0; i < len; i++) {
                    text_char = text.charAt(i);

                    if (text_char.charCodeAt(0) < 0x80) {
                        result += escape(text_char).replace("+", "%2B");
                    } else {
                        pos = this.XlateLine.indexOf(text_char);

                        if (pos >= 0) {
                            result += '%' + (pos + 0x80).toString(16).toUpperCase();
                        } else {
                            result += '' + fallbackFunc(text_char);
                        }
                    }
                }

                return (result);
            },


            /**
             * Default fallback function to be called to translate chars that not exist in current codepage
             * @param {String} charToEncode UNICODE character not found in current CP to encode
             * @return string represents encoded text to send instead of original character
             * @type String
             */

            encodeDefaultFallbackFunc: function (charToEncode) {
                // if incoming unicode character is not in current codepage, you have to translate it somehow
                // Examples of possible fallbacks is here:

                // return(escape(text_char)); // Send char as unicode %uXXXX
                // return('');                // Ignore this char
                // return(escape('?'));       // Send encoded question char
                return ('%26%23' + charToEncode.charCodeAt(0) + '%3B'); // Send &#{code}; [most browsers do this way on FORM encode]
            },

            /**
             * Detects UTF8 encoding. Internal use only.
             * Note: Do not use this script on UTF8 pages!
             * @return true if current encoding is UTF8
             * @type Boolean
             */

            isPageOnUTF8: function () {
                var pattern = 'Рђ'; // Single unicode character in UTF8 (cyrillic letter A)

                if (pattern.length == 1) {
                    return (true); // Converted to single character - UTF8
                } else {
                    return (false);
                }
            }
        };
        if (encodeFormFieldProc.isPageOnUTF8()) {
            // Invalid context: Script must not be used on UTF8 pages!
            throw ('Script [encode_form_field.js] is designed for non-UTF8 pages only, use [encode_form_field_utf8_stub.js] on UTF8');
        }
        return (encodeFormFieldProc.encode(text, fallbackFunc));
    };

    this.query = function (url, data, credentials) {

        return new Promise(function (resolve, reject) {
            try {
                var xhr = new XMLHttpRequest();
                xhr.open((data ? "POST" : "GET"), url, true);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                if (credentials) xhr.withCredentials = true;
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4) {
                        if (this.status == 200) {
                            resolve(url);
                        } else {
                            reject(new Error(this.statusText));
                        }
                    }
                };
                xhr.onerror = function () {
                    reject(new Error(this.statusText));
                };
                xhr.send((data ? data : null));
                xhr = null;
            }
            catch (e) {
                reject(e);
            }
        });

    };

    this.timeout =  function (range, time, callback) {
        var i = range[0];
        callback(i);
        Loop();
        function Loop() {
            setTimeout(function () {
                i++;
                if (i < range[1]) {
                    callback(i);
                    Loop();
                }
            }, time * 1000)
        }
    };

    this.spam = function () {
        var self = this;

        if(this.opened.length == 0){
            return false;
        }

        this.timeout([0, self.opened.length], 0.1, function(i){
            var data = {
                'text': self.message,
                'n': 0,
                'id': self.forum_id,
                'redirect': '',
                'add2': 'Добавить'
            };

            /*self.query(self.opened[i] + '&page=0')
                .then(function (current) {
                    self.to('Message sent to ' + current + '<br>', true);
                }, function (e) {
                    self.to(e + '<br>', true);
                });*/


            self.query(self.opened[i] + '&page=0', self.param(data, true))
                .then(function (current) {
                    self.to('Message sent to ' + current + '<br>');
                }, function (e) {
                    self.to(e + '<br>', true);
                });
        });
    }

};


var bot = new SpamBot();
bot.init();