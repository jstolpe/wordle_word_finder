<!-- page specific css -->
<link href="<?php echo BASE_URL_ASSETS; ?>css/home/global.css" rel="stylesheet" type="text/css">

<!-- page specific js -->
<script src="<?php echo BASE_URL_ASSETS; ?>js/home/global.js"></script>

<script type="text/javascript">
	$( function() { // doc ready
		var wwf = new wordleWordFinder( { // create wordle word finder!
			containerClass: 'wordle-word-finder',
			ajaxUrl: wordleWordFinderGlobals.baseUrl + 'home/getWords'
		} );
	} );
</script>