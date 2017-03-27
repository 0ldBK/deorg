function getActive() {
	var active = document.querySelector('a.active');
	return +active && active.getAttribute('href').split('=')[1];
}

function recharge(settings) {
	if (getActive() !== 2) {
		location.href = '/repair.php?razdel=2';
	}

	var calc = document.getElementById('rechargecalc');
	if (calc.querySelectorAll('[color="red"]').length) {
		config.message('У вас недостаточно средств для перезарядки.', "Перезарядка", "red");
		config.set('cooldowns.badcharge', true);
		return
	}
	config.broadcast('/repair.php?razdel=2&dorecharge=' + encodeURIComponent(JSON.stringify(settings)), function () {
		config.set('cooldowns.badcharge', false);
		config.set('cooldowns.needcharge', false);
		config.message('Перезарядка закончена!.', "Ремонт", "green");
	});
}

function repair(settings) {
	if (getActive() !== 0) {
		location.href = '/repair.php?razdel=0';
	}
	var dressed = document.querySelector('a[href="?dressed=1"]');
	if (dressed && dressed.style['font-weight'] !== "") {
		location.href = '/repair.php?dressed=1';
	}

	var calc = document.getElementById('repaircalc');

	if (calc.querySelectorAll('[color="red"]').length) {
		config.message('У вас недостаточно средств для ремонта.', "Ремонт", "red");
		config.set('cooldowns.badrepair', true);
		return
	}

/*
	if (calc.innerText.indexOf('Ремонт не требуется') !== -1) {
		config.set('cooldowns.badrepair', false);
		config.set('cooldowns.needrepair', false);
		config.message('Ремонт не требуется!', "Ремонт", "green");
		return;
	}
*/

	config.broadcast('/repair.php?razdel=0&dorepair=' + encodeURIComponent(JSON.stringify(settings)), function () {
		config.set('cooldowns.badrepair', false);
		config.set('cooldowns.needrepair', false);
		config.message('Ремонт закончен!', "Ремонт", "green");
	});
}

(function () {
	var module = config.get('settings.launched', '');
	var rsettings = {"item_dressed":"on", "item_inventory":"on"};
	if (!module) {
		return;
	}

	if (config.get('cooldowns.needrepair')) {
		var repairtype = +config.get('settings.'+module+'.autorepair', 0);
		var repairarts = +config.get('settings.'+module+'.artrepair', 0);
		if(repairtype > 0) {
			rsettings['item_dressed'] = 'on'
			if(repairtype > 1) rsettings["item_critical"] = "on";
			if(repairarts < 1) rsettings["item_aeart"] = "on";
			repair(rsettings);
		}
	}

	if (module != 'autobattle' && config.get('cooldowns.needcharge')) {
		rsettings['item_dressed'] = 'on';
		rsettings['item_inventory'] = 'on';
		rsettings["item_kr"] = "on";
		rsettings["item_ekr"] = "on";
		rsettings["item_rep"] = "on";
		recharge(rsettings);
	}
})();
