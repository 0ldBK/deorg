<?php
$query = parse_url($_SERVER['HTTP_REFERER']);
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Origin: http://".$query['host']);
header("Connection: keep-alive");
session_start();


//if($_SESSION['access'] < 1) die('for users only');


/*
name => array(
	compose => array(
		name => count
	),
	img => image,
	require => list of requirements,
	count => how items will be created
)

*/

$items = array(

    'Вода' => array(
		'price' => 0.5,
		'img' => 'http://i.oldbk.com/i/sh/craft_water.gif'
	),
	'Мука' => array(
		'price' => 0.5,
		'img' => 'http://i.oldbk.com/i/sh/craft_flour.gif'
	),
	'Масло подсолнуха' => array(
		'price' => 1,
		'img' => 'http://i.oldbk.com/i/sh/craft_sunfloweroil.gif'
	),
	'Мёд' => array(
		'price' => 1,
		'img' => 'http://i.oldbk.com/i/sh/craft_honey.gif'
	),
	'Хмель' => array(
		'price' => 1,
		'img' => 'http://i.oldbk.com/i/sh/craft_hop.gif'
	),
	'Доска осины' => array(
		'compose' => array(
			'Вода' => 1,
			'Бревно осины' => 1
		),
		'img' => 'http://i.oldbk.com/i/sh/craft_aspenplank.gif',
		'require' => array(
			'ulevel' => 4,
			'prof' => 'woodworker',
			'plevel' => 1
		),
		'making' => array(
			'count' => 1,
			'time' => 300,
			'diff' => 1,
			'exp' => 1
		),
	),


	'Тост' => array(
		'compose' => array(
			'Вода' => 1,
			'Мука' => 1,
			'Масло подсолнуха' => 1
		),
		'img' => 'http://i.oldbk.com/i/sh/zavtrak_4tost.gif',
		'require' => array(
			'ulevel' => 4,
			'prof' => 'cook',
			'plevel' => 1
		),
		'making' => array(
			'count' => 1,
			'time' => 600,
			'diff' => 2,
			'exp' => 2
		),

	),

	'Медовуха' => array(
		'compose' => array(
			'Вода' => 1,
			'Мёд' => 4,
			'Доска осины' => 1,
			'Хмель' => 1
		),
		'img' => 'http://i.oldbk.com/i/sh/eda_3.gif',
		'require' => array(
			'ulevel' => 4,
			'prof' => 'cook',
			'plevel' => 1
		),
		'making' => array(
			'count' => 1,
			'time' => 1200,
			'diff' => 3,
			'exp' => 3
		)
	),


);

$item = $items[$_GET['item']];

function getIngr($item) {
	if($item['compose']) {		return $item['compose'];	} else {		return false;
	}
}


if($item) {
	$create = array();
    $ingr = getIngr($item);
	foreach($ingr as $name => $count) {		$items[$name]['count'] = $count;
		$items[$name]['name'] = $name;		$create[] = $items[$name];

		$ingr2 = getIngr($items[$name]);

		if($ingr2) {			foreach($ingr2 as $name2 => $count2) {				$items[$name2]['count'] = $count2;
				$items[$name2]['name'] = $name2;
				$create[] = $items[$name2];
			}
		}
	}
    print_r($item);

	print_r($create);



}


?>
