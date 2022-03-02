/**
 * Handle global site javascript functionality.
 *
 * @author Justin Stolpe
 */
var wordleWordFinderGlobals = {
	/**
	 * Base url for the site.
	 *
	 * @var string
	 */
	baseUrl : '',

	/**
	 * Flag for if mobile
	 *
	 * @var boolean
	 */
	isMobile : false,

	/**
	 * Initialize global javascript functionality.
	 *
	 * @param object params
	 *		params {
 	 *			baseUrl: string Base url for the site.
 	 * 			isMobile: boolean true if site is in mobile mode false if not
 	 *		}
	 * @return void
	 */
	initialize : function( params ) {
		// save baseUrl to object
		wordleWordFinderGlobals.baseUrl = params.baseUrl;

		// save isMobile to object
		wordleWordFinderGlobals.isMobile = params.isMobile;
	}
}