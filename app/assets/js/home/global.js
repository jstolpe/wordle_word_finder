/**
 * Handle word finder javascript functionality.
 *
 * @author Justin Stolpe
 */
var wordleWordFinder = ( function() {
    var wordleWordFinder = function( args ) {
        // give us our self
        var self = this;

        // set the board size
        self.numberOfRows = 'numberOfRows' in args ? args.numberOfRows : 6;
        self.numberOfColumns = 'numberOfColumns' in args ? args.numberOfColumns : 5;

        // set container from args
        self.containerClassTarget = 'containerClass' in args ? '.' + args.containerClass : '.wordle-word-finder';

        // set ajax url from args
        self.ajaxUrl = 'ajaxUrl' in args ? args.ajaxUrl : '';

        // status css
        self.statusClasses = [
            'status-grey',
            'status-green',
            'status-yellow'
        ];

        // array to hold our letters
        self.letters = [];

        // draw out the containers
        self.drawSkeleton();

        // draw the game board
        self.drawGameBoard();

        // draw the finder
        self.drawFinder()

        // draw the keyboard
        self.drawKeyBoard();

        // setup listeners
        self.setupEvents();
    }

    wordleWordFinder.prototype.setupBodyListener = function() {
        // give us our self
        var self = this;

        $( 'body' ).on( 'keyup', function( e ) { // body keyup listener for keys being pressed
            // get the letter from the letter code
            var theLetter = String.fromCharCode( e.which );

            // backspace key is code 8 set letter to "del" if pressed
            theLetter = 8 == e.which ? 'del' : theLetter;

            // enter key is code 13 set letter to "enter" if pressed
            theLetter = 13 == e.which ? 'enter' : theLetter;

            // update the tile with the letter
            self.updateTile( theLetter );
        } );
    };

    wordleWordFinder.prototype.setupOnScreenKeyBoardListener = function() {
        // give us our self
        var self = this;

        $( '.key, .key-text' ).on( 'click', function() { // on click for our html on screen keyboard
            // update the tile with the letter
            self.updateTile( $( this ).data( 'value' ) );

            gtag( 'event', 'key_press_' + $( this ).data( 'value' ), { // send click event to google analytics
                'event_category': 'button_click', // category
                'event_label': 'key', // label
            } );
        } );
    };

    wordleWordFinder.prototype.setupHelperListener = function() {
        // give us our self
        var self = this;

        $( '.question' ).on( 'click', function() { // on click for helper open
            $( '.help-container' ).show();

            gtag( 'event', 'help_open', { // send click event to google analytics
                'event_category': 'button_click', // category
                'event_label': 'help', // label
            } );
        } );    

        $( '.help-container' ).on( 'click', function() { // on click for helper close
            $( '.help-container' ).hide();

            gtag( 'event', 'help_close', { // send click event to google analytics
                'event_category': 'button_click', // category
                'event_label': 'help', // label
            } );
        } );
    };

    wordleWordFinder.prototype.setupTileListener = function() {
        // give us our self
        var self = this;

        $( '.board-row-tile' ).on( 'click', function() { // on click for each tile
            if ( $( this ).hasClass( 'filled' ) ) { // only allow clicks if the tile has a letter
                // get the status of the letter
                var letterStatus = $( this ).data( 'status' );

                // new tile status default to greay
                var newStatus = 'grey';

                // remove all status classes
                $( this ).parent().removeClass( self.statusClasses.join( ' ' ) );

                if ( 'grey' == letterStatus ) { // if current status is grey update to green
                    newStatus = 'green';
                } else if ( 'green' == letterStatus ) { // else if current status is green update to yellow
                    newStatus = 'yellow';
                }

                // add the new status class to the tile
                $( this ).parent().addClass( 'status' + '-' + newStatus );

                // update the data attribute with the new status
                $( this ).data( 'status', newStatus );

                // remove status classes from keyboard key
                $( '.key-' + $( this ).html().toLowerCase() ).removeClass( self.statusClasses.join( ' ' ) );

                // update keyboard key with new status
                $( '.key-' + $( this ).html().toLowerCase() ).addClass( 'status' + '-' + newStatus );

                gtag( 'event', 'board_' + newStatus, { // send click event to google analytics
                    'event_category': 'board_click', // category
                    'event_label': 'board', // label
                } ); 
            }
        } );
    };

    wordleWordFinder.prototype.setupFindButtonListener = function() {
        // give us our self
        var self = this;

        $( '.finder-results-button' ).on( 'click', function() { // on click for each tile
            // get words!
            self.findWords();

            gtag( 'event', 'find_words', { // send click event to google analytics
                'event_category': 'button_click', // category
                'event_label': 'button', // label
            } );
        } );
    };

    wordleWordFinder.prototype.findWords = function() {
        // give us our self
        var self = this;

        if ( self.ajaxUrl && 0 == self.letters.length % self.numberOfColumns ) { // make sure we have complete words and a url to the server
            $.ajax( { // hit the server with that data
                url: self.ajaxUrl,
                data: self.getRequestData(),
                dataType: 'json',
                type: 'post',
                success: function( data ) {
                    self.updateFinder( data );
                }
            } );
        } else { // something not quite right
            // show warning message
            self.showWarning( 'not enough letters' );
        }
    };

    wordleWordFinder.prototype.showWarning = function( message ) {
        // give us our self
        var self = this;

        // set the warning message
        $( '.warning-container' ).html( message );

        // show the warning class
        $( '.warning-container' ).show();

        setTimeout( function() { // wait for 1.5 seconds
            // hide the warning
            $( '.warning-container' ).hide();
        }, 1500 );
    };

    wordleWordFinder.prototype.updateFinder = function( data ) {
        // give us our self
        var self = this;

        // hide results
        $( '.finder-results' ).hide();

        // split all words into three arrays
        var wordColumns = splitArrayIntoChunks( data, data.length / 3 );

        // html for our column results
        var columnHtml = '';
       
        for ( var i = 0; i < wordColumns.length; i++ ) { // loop over word columns
            if ( wordColumns[i].length > 0 ) { // if the column has words
                // open results column div
                columnHtml += '<div class="finder-results-column">';

                for ( var k = 0; k < wordColumns[i].length; k++ ) { // loop over words in the column
                    // add word div to the column
                    columnHtml += '<div>' + wordColumns[i][k] + '</div>';
                }

                // close the column div
                columnHtml += '</div>';
            }
        }

        if ( columnHtml ) { // only if we have results
            // add the column html to the finder results container
            $( '.finder-results' ).html( columnHtml );

            // display the results
            $( '.finder-results' ).css( 'display', 'flex' );
        } else { // no results found
            // show a warning message
            self.showWarning( 'no words found' );
        }
    };

    wordleWordFinder.prototype.getRequestData = function() {
        // give us our self
        var self = this;

        // get request data structure
        var requestDataStructure = self.getRequestDataStructure();

        // get array of letter status
        var lettersStatus = [];

        $( '.board-row-tile' ).each( function() { // loop over tiles
            // add tiles status to the array
            lettersStatus.push( $( this ).data( 'status' ) );
        } );

        // create words from the letters array
        var words = splitArrayIntoChunks( self.letters, self.numberOfColumns );

        // create array of statuses for each tile
        var statuses = splitArrayIntoChunks( lettersStatus, self.numberOfColumns );

        for ( var i = 0; i < words.length; i++ ) { // loop over each word
            for ( var j = 0; j < words[i].length; j++ ) { // loop over each letter in the word
                // get the current letter
                var theLetter = words[i][j];

                // get the status for the letter
                var theStatus = statuses[i][j];

                if ( theStatus && 'green' == theStatus ) { // we have a status and it's green so we know what the letter is
                    // update the letter object setting the "equal" to the current letter
                    requestDataStructure.letters[j].equal = theLetter;
                } else if ( theStatus && 'yellow' == theStatus ) { // we have a status and it's yellow so we know the letter is in the word but wrong spot
                    if ( !requestDataStructure.letters[j].not_equal.includes( theLetter ) ) { // if letter is not already in the "not_equal" array for the letter
                        // add the letter to the not equals array for this tile
                        requestDataStructure.letters[j].not_equal.push( theLetter );
                    }

                    if ( !requestDataStructure.word.contains.includes( theLetter ) ) { // if letter is not already in the word contains array
                        // add current letter to the word contains array
                        requestDataStructure.word.contains.push( theLetter );
                    }
                } else if ( theStatus && 'grey' == theStatus && !requestDataStructure.word.contains.includes( theLetter ) ) { // we have status it is grey and it is not in the word contains array
                    for ( var k = 0; k < requestDataStructure.letters.length; k++ ) { // loop over all the letters in the data structure
                        if ( !requestDataStructure.letters[k].not_equal.includes( theLetter ) ) { // letter is not in the "not_equal" array
                            // add current letter to the "not_equals" array
                            requestDataStructure.letters[k].not_equal.push( theLetter );
                        }
                    }
                }
            }
        }

        // return data structure with data
        return requestDataStructure;
    };

    wordleWordFinder.prototype.getRequestDataStructure = function() {
        // give us our self
        var self = this;

        // array of letter objects
        var lettersDataStructure = [];

        for ( var i = 0; i < self.numberOfColumns; i++ ) { // loop over columns count
            lettersDataStructure.push( {
                equals: '',
                not_equal: []
            } );
        }

        return { // data structure for the request to the server
            letters: lettersDataStructure,
            word: {
                length: self.numberOfColumns,
                contains: []
            }
        };
    };

    wordleWordFinder.prototype.updateTile = function( theLetter ) {
        // give us our self
        var self = this;

        // get the current letter array index
        var letterIndex = self.letters.length > 0 ? self.letters.length - 1 : 0;

        if ( 'enter' == theLetter ) { // enter was pressed 
            // find words!
            self.findWords();
        } else if ( 'del' == theLetter && self.letters.length > 0 ) { // backspace pressed and we also need letters in our array
            // update tile html by clearing it
            self.updateTileHtml( '', letterIndex );

            // remove last letter from the letters array
            self.letters.splice( letterIndex, 1 );
        } else if ( 1 == theLetter.length && theLetter.match( /[a-z]/i ) && self.letters.length < 30 ) { // the letter is a-z and we are not max length
            // add letter to letters array
            self.letters.push( theLetter.toLowerCase() );
            
            // update tile html with new letter
            self.updateTileHtml( theLetter, self.letters.length - 1 );
        }
    };

    wordleWordFinder.prototype.updateTileHtml = function( theLetter, letterIndex ) {
        // give us our self
        var self = this;

        // get the tile with our index
        var tile = $( '.board-row-tile' )[letterIndex];

        // update tile html
        $( tile ).html( theLetter ? theLetter : '' );

        // update the data status attribute to be grey
        $( tile ).data( 'status', theLetter ? 'grey' : '' );

        if ( theLetter ) { // we are adding a letter
            // add the filled class
            $( tile ).addClass( 'filled' );

            // each new letter defaults to grey status
            $( tile ).parent().addClass( self.statusClasses[0] );

            // update keyboard key with status
            $( '.key-' + theLetter.toLowerCase() ).addClass( self.statusClasses[0] );
        } else { // we are removing a letter
            $( tile ).removeClass( 'filled' );

            // remove any status classes so the tile looks empty
            $( tile ).parent().removeClass( self.statusClasses.join( ' ' ) );

            // remove status from keyboard
            $( '.key-' + self.letters[letterIndex] ).removeClass( self.statusClasses.join( ' ' ) );
        }
    };

    wordleWordFinder.prototype.setupEvents = function() {
        // give us our self
        var self = this;

        // listener for html body interactions
        self.setupBodyListener();
    
        // listen for the on screen keyboard interactions
        self.setupOnScreenKeyBoardListener();

        // listen for tiles being clicked
        self.setupTileListener();

        // listener for find button
        self.setupFindButtonListener();

        // listener for helper
        self.setupHelperListener();
    };

    wordleWordFinder.prototype.drawSkeleton = function() {
        // give us our self
        var self = this;

        // skeleton html
        var skeletonHtml = '<div class="header">' +
            '<h1>' +
                'Wordle Word Finder' +
            '</h1>' +
            '<span class="fa fa-question-circle question">' +

            '</span>' +
        '</div>' +
        '<div class="warning-container">' +
    
        '</div>' + 
        '<div class="board-container">' + 
        
        '</div>' + 
        '<div class="finder-container">' + 
        
        '</div>' +
        '<div class="keyboard-container">' + 
        
        '</div>' + 
        '<div class="help-container">' +
            '<div class="help-contents">' +
                '<div class="header">' +
                    'How it Works' +
                    '<div class="help-close-container">' +
                        '<span class="fa fa-close help-close">' +

                        '</span>' +
                    '</div>' +
                '</div>' +
                '<div class="help">' +
                    '<ol class="help-list">' +
                        '<li>' +
                            'Fill in the grid with letters.' +
                        '</li>' +
                        '<li>' +
                            'Click on the letters to change their color.' +
                            '<div class="help-list-sub">' +
                                '<div class="help-list-green">' +
                                    
                                '</div>' +
                                ' Letter is in the correct spot.' +
                            '</div>' +
                            '<div class="help-list-sub">' +
                                '<div class="help-list-yellow">' +
                                    
                                '</div>' +
                                ' Letter is in the word but wrong spot.' +
                            '</div>' +
                            '<div class="help-list-sub">' +
                                '<div class="help-list-grey">' +
                                    
                                '</div>' +
                                ' Letter is not in the word in any spot.' +
                            '</div>' +
                        '</li>' +
                        '<li>' +
                            'Click on Find Words button to get possible words.' +
                        '</li>' +
                    '</ol>' +
                '</div>' +
            '</div>' +
        '</div>';

        // place the html in our container div
        $( self.containerClassTarget ).html( skeletonHtml );
    };

    wordleWordFinder.prototype.drawFinder = function() {
        // give us our self
        var self = this;

        // html for the finder
        var finderHtml = '<div class="finder-results-button">' +
            'Find Words' +
        '</div>' + 
        '<div class="finder-results">' +

        '</div>';

        // place the html in our finder container div
        $( '.finder-container' ).html( finderHtml );
    };

    wordleWordFinder.prototype.drawGameBoard = function() {
        // give us our self
        var self = this;

        // open div for our board
        var boardHtml = '<div class="board">';

        for ( var i = 0; i < self.numberOfRows; i++ ) { // loop over our rows
            // open div for the row
            boardHtml += '<div class="board-row">';

            for ( var j = 0; j < self.numberOfColumns; j++ ) { // loop over columns in the row
                // create the html for the cell
                boardHtml += '<div class="board-row-cell">' +
                    '<div class="board-row-tile" data-status="">' +
                    
                    '</div>' +
                '</div>';
            }

            // close our row div
            boardHtml += '</div>';
        }

        // close the board div
        boardHtml += '</div>';

        // place the html in our board container div
        $( '.board-container' ).html( boardHtml );
    };

    wordleWordFinder.prototype.drawKeyBoard = function() {
        // give us our self
        var self = this;

        // get keyboard rows
        var keyboardRows = getKeyboardKeys();

        // open keyboard div
        var keyboardHtml = '<div class="keyboard">';

        for ( var i = 0; i < keyboardRows.length; i++ ) { // loop over keyboard rows
            // open keyboard row div
            keyboardHtml += '<div class="keyboard-row">';
            
            for ( var j = 0; j < keyboardRows[i].length; j++ ) { // loop over each key in the row
                // check if the key is actually just a spacer
                var keyClass = '' == keyboardRows[i][j] ? 'key-spacer' : 'key';

                // check if the key is a text key like "enter" or "del"
                keyClass = keyboardRows[i][j].length > 1 ? 'key-text' : keyClass;

                // create the html for our key
                keyboardHtml += '<div class="' + keyClass + ' ' + keyClass + '-' + keyboardRows[i][j] + '" data-value="' + keyboardRows[i][j] + '">' +
                    keyboardRows[i][j].toUpperCase() +
                '</div>';
            }

            // close keyboard row div
            keyboardHtml += '</div>';
        }

        // close keyboard container div
        keyboardHtml += '</div>';

        // place the html in our keyboard container div
        $( '.keyboard-container'  ).html( keyboardHtml );
    };

    var getKeyboardKeys = function() {
       return [ // return array of keyboard rows and keys
            [ 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p' ],
            [ '', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', '' ],
            [ 'enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'del' ]
        ];
    };

    var splitArrayIntoChunks = function( array, length ) {
        // array of chunks with the specified length
        var chunks = [];

        // iterator
        var i = 0;

        while ( i < array.length ) { // loop over our array
            // splice our array so we get a chunk with the specified length
            chunks.push( array.slice( i, i += length ) );
        }

        // return all chunks
        return chunks;
    };

    // return our object
    return wordleWordFinder;
} )();