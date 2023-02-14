<!DOCTYPE html>
<html>
	<head>
		<!-- html title -->
		<title>
			<?php echo $html_title ;?>
		</title>

		<!-- charset -->
		<meta charset="utf-8">

		<!-- default meta -->
		<meta name="description" content="Wordle Word Finder will help you find next Wordle answer!" />
		<meta name="keywords" content="Wordle, Wordle Answer, Wordle Cheat, Wordle Solver, Wordle Word Finder, Dictionary, Word Finder" />
		<meta name="author" content="Justin Stolpe" />
		<meta name="robots" content="index, follow" />
		<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />

		<!-- og meta -->
		<meta property="og:title" content="Wordle Word Finder" />
		<meta property="og:description" content="Wordle Word Finder will help you find next Wordle answer!" />
		<meta property="og:url" content="https://wordlewordfinder.com" />
		<meta property="og:image" content="https://wordlewordfinder.com/php_site/app/assets/images/logo.png" />

		<!-- twitter meta -->
		<meta property="twitter:card" content="summary" />
		<meta property="twitter:site" content="@justin_stolpe" />
		<meta property="twitter:title" content="Wordle Word Finder" />
		<meta property="twitter:description" content="Wordle Word Finder will help you find next Wordle answer!" />
		<meta property="twitter:image" content="https://wordlewordfinder.com/php_site/app/assets/images/logo.png" />
		<meta property="twitter:image:alt" content="Wordle Word Finder" />

		<!-- seo -->
		<link rel="canonical" href="https://wordlewordfinder.com/">
		<link rel="shortcut icon" href="<?php echo BASE_URL_ASSETS; ?>images/favicon.ico" />
		<link rel="apple-touch-icon-precomposed" href="<?php echo BASE_URL_ASSETS; ?>images/logo.png" />

		<!-- css fonts -->
		<link rel="preconnect" href="https://fonts.gstatic.com">
		<link href="https://fonts.googleapis.com/css2?family=Roboto" rel="stylesheet">

		<!-- font awesome -->
		<script src="https://kit.fontawesome.com/ea6b8aae5d.js" crossorigin="anonymous"></script>

		<!-- jquery -->
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

		<!-- template js -->
		<script src="<?php echo BASE_URL_ASSETS; ?>js/templates/default/global.js"></script>

		<script type="text/javascript">
			$( function() {
				wordleWordFinderGlobals.initialize( { // initalize global javascript
					baseUrl: '<?php echo HREF_BASE_URL; ?>'
				} );
			} );
		</script>

		<?php if ( GOOGLE_ANALYTICS_ID ) : ?>
			<!-- Global site tag (gtag.js) - Google Analytics -->
			<script async src="https://www.googletagmanager.com/gtag/js?id=<?php echo GOOGLE_ANALYTICS_ID; ?>"></script>
			<script>
				window.dataLayer = window.dataLayer || [];
				function gtag(){dataLayer.push(arguments);}
				gtag( 'js', new Date() );

				gtag( 'config', '<?php echo GOOGLE_ANALYTICS_ID; ?>' );
			</script>
		<?php endif; ?>

		<!-- html page specific head html -->
		<?php echo $html_head; ?>
	</head>
	<body>
		<!-- main content html -->
		<div class="body-container">
			<?php echo $html_body; ?>
		</div>
	</body>
</html>