<?php
	/**
	 *  NOTE: YOU SHOULD MOVE THIS FILE OUTSIDE OF WWW DIR 
	 *        AND UPDATE WITH YOUR OWN CREDS:D
	 */

	// environment type development or production
	defined( 'ENVIRONMENT' ) or define( 'ENVIRONMENT', 'development' );

	// site name
	define( 'SITE_NAME', 'wordle_word_finder' );

	// get protocol
	defined( 'PROTOCOL' ) or define( 'PROTOCOL', isset( $_SERVER['HTTPS'] ) && $_SERVER['HTTPS'] != 'off' ? 'https://' : 'http://' );

	// host path
	defined( 'PATH_TO_HOST' ) or define( 'PATH_TO_HOST', PROTOCOL . $_SERVER['HTTP_HOST'] );

	// url path to root
	defined( 'BASE_URL' ) or define( 'BASE_URL', PATH_TO_HOST . '/' . SITE_NAME . '/' );

	// href base url
	define( 'HREF_BASE_URL', BASE_URL );

	// url path to asssets like js/css/files
	defined( 'BASE_URL_ASSETS' ) or define( 'BASE_URL_ASSETS', BASE_URL . 'app/assets/' );

	// boolean for using database or not
	defined( 'USE_DATABASE' ) or define( 'USE_DATABASE', true );

	$databaseCreds = array( // database creds
		'hostname' => 'localhost',
		'username' => 'root',
		'password' => '',
		'database' => 'wordle_word_finder'
	);

	// used for ga tracking
	define( 'GOOGLE_ANALYTICS_ID', '' );