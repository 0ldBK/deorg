function show(el) {
		var id = el.getAttribute('id');
		var status = document.getElementById('s'+id).style['display'];
		if(status == 'none') {
			el.innerHTML = 'hide';
			document.getElementById('s'+id).style['display'] = 'inline-block';
			document.getElementById('l'+id).style['display'] = 'none';
		} else {
			el.innerHTML = '+'+el.getAttribute('num');
			document.getElementById('s'+id).style['display'] = 'none';
			document.getElementById('l'+id).style['display'] = 'inline-block';
		}
	}