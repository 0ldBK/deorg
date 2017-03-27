'use strict';
(function () {
    function startCraft(receip, captcha) {
        var data = {
            url: 'craft.php',
            method: 'POST',
            query: {craftid: receip, count: 1},
            data: {'g-recaptcha-response': captcha || ''},
            type: 'text'
        };
        config.request(data, function (error, response) {
            if (error) {
                setTimeout(function () {
                    startCraft(receip, captcha);
                }, 1000);
            }
            try {
                response = JSON.parse(response);
            } catch (error) {
                console.error(error, 'Failed to parse JSON');
                return;
            }

            if (response && response.data) {
                var dom = new DOMParser().parseFromString(response.data, 'text/html'),
                    siteKey = dom.querySelector('[data-sitekey]');

                if (siteKey) {
                    config.recognize({captcha: siteKey.getAttribute('data-sitekey'), url: location.href}, function (error, result) {
                        if (error) {
                            config.message('Не удается распознать капчу!', 'Автокрафт', 'red');
                            return;
                        }

                        startCraft(receip, result);
                    });
                }
            } else if (response.ok) {
                location.href='/craft.php';
            }
        });
    }

    // .noty_text = Начато производство «Железо» в количестве 1 шт.
    var tpl = document.createElement('div'),
        craft = config.get('craft'),
        notyText = document.querySelector('.noty_text'),
        razdel = document.querySelector('a.active[href^="?razdel"]');

    if (notyText) {
        if (notyText.innerText.indexOf('Недостаточно ресурсов') !== -1 ||
            notyText.innerText.indexOf('Необходимый инструмент') !== -1) {
            config.launcher('craft started', false);
            config.set('craft', null);
            // config.launcher('Закончили крафт! включаем автохаоты', 'autobattle');
            craft = null;
            // return;
        }
        if (craft && notyText.innerHTML.indexOf('Начато производство') !== -1) {
            notyText.innerHTML = 'Начато производство «' + craft.name + '» в количестве ' + craft.total + ' шт.'
        }
    }
    tpl.innerHTML = '<div style="color: red;display: none;"></div>' +
        '<input type="number" value="0"><span style="cursor: pointer">' +
        '<img src="http://i.oldbk.com/i/up.gif" width="11" height="11" border="0">' +
        '</span>';

    if (!document.getElementById('itemall') && craft) {
        if (craft.progress) {
            craft.progress = false;
            craft.left -= 1;
        }

        if (craft.left > 0 && craft.name) {
            if (config.checkRepair()) {
                return;
            }

            var hasRazdel = document.querySelector('a[href^="' + craft.razdel.url + '"]');
            if (craft.razdel && hasRazdel && razdel && razdel.getAttribute('href') !== craft.razdel.url &&
                hasRazdel.innerText.trim() === craft.razdel.name) {
                location.href = '/craft.php' + craft.razdel.url;
                return;
            } else if (razdel && razdel.innerText.trim() === craft.razdel.name) {
                config.launcher('craft started', 'autocraft');
                startCraft(craft.recipe);
                return;
            } else {
                return;
            }
        } else if (craft.left <= 0) {
            config.launcher('craft started', false);
            config.set('craft', null);
            craft = null;
        }
    }

    [].forEach.call(document.querySelectorAll('.dress-item li:nth-child(2)'), function (li) {
        if (document.getElementById('itemall')) {
            var itemLeft = document.getElementById('itemleft'),
                itemTotal = itemLeft.parentElement.previousElementSibling,
                cancel = document.querySelector('.dress-item li:last-child a');

            if (!craft || !itemLeft || !itemTotal) {
                return;
            }

            craft.progress = true;
            itemTotal.innerHTML = 'Заказано предметов: ' + craft.total + ' шт.';
            itemLeft.innerHTML = craft.total - craft.left;
            cancel.setAttribute('onclick', '');
            cancel.addEventListener('click', function (event) {
                event.preventDefault();
                if (confirm('При отмене производства потраченные на старт производства ресурсы будут потеряны. \nВы уверены?')) {
                    config.launcher('craft started', false);
                    config.set('craft', null);
                    location.href = '?cancel=1';
                }
            });
            var compeleAndStop = document.createElement('li');
            compeleAndStop.innerHTML = '<a href="#">Закончить и остановить</a>';
            compeleAndStop.querySelector('a').addEventListener('click', function (event) {
                event.preventDefault();
                if (confirm('Закончить этот крафт и остановить массовое производство?\n' +
                        'Осталось ' + craft.left + ' шт. из ' + craft.total)) {
                    config.launcher('craft started', false);
                    config.set('craft', null);
                    location.href = '/craft.php';
                }
                return false;
            });
            cancel.parentNode.parentNode.appendChild(compeleAndStop);
            setTimeout(function () {
                location.href = location.href;
            }, 20000);
            return;
        }

        var craftTpl = tpl.cloneNode(true),
            errorDiv = craftTpl.querySelector('div[style]'),
            input = craftTpl.querySelector('input[type="number"]'),
            btn = craftTpl.querySelector('span'),
            addCountImg = li.querySelector('img'),
            makeLink = li.querySelector('a[onclick^="startcraft(event"]');

        if (!addCountImg || !makeLink) {
            return;
        }
        var onClick = 'return ' + addCountImg.getAttribute('onclick').split(';')[0],
            recipe = new Function('AddCount', onClick)(function (event, receipe, name, count) {
                return {
                    recipe: receipe,
                    name: name,
                    max: +count
                };
            });

        if (recipe.max === -1) {
            errorDiv.style.display = '';
            [input, btn, makeLink, addCountImg].forEach(function (el) {
                if (el) {
                    el.style.display = 'none';
                }
            });
            errorDiv.innerHTML = 'Не одет инструмент.';
            li.appendChild(craftTpl);
            return;
        }

        input.value = recipe.max;
        btn.addEventListener('click', function (event) {
            event.preventDefault();
            var value = +input.value;
            if (!value) {
                return;
            }
            recipe.total = value;
            recipe.left = value;
            recipe.razdel = {
                name: razdel.innerText.trim(),
                url: razdel.getAttribute('href')
            };

            config.set('craft', recipe);
            config.launcher('craft started', 'autocraft');
            startCraft(recipe.recipe);
            return false;
        });
        li.appendChild(craftTpl);
    });
    [].forEach.call(document.querySelectorAll('img[alt="Произвести несколько штук"]'), function (el) {
        el.remove();
    });
})();
