<?php
	/**
	 * Dictionary Model.
	 *
	 * Model that holds user related functionality.
	 *
	 * @package		wordle_word_finder/app
	 * @subpackage	models
	 * @author		Justin Stolpe
	 * @link		https://github.com/jstolpe/wordle_word_finder
	 */
	class DictionaryModel extends Model {
		/**
		 * Table name for the model.
		 *
		 * @var	string
		 */
		const TABLE_NAME = 'dictionary';

		/**
		 * Noramlize words in db.
		 *
		 * @return void
		 */
		public function normalize() {
			$this->database->table( 'entries' );
			$this->database->fetch( Database::PDO_FETCH_MULTI );
			$words = $this->database->runSelectQuery();
			$words = array_column( $words, 'word' );
			$words = array_unique( $words );

			foreach ( $words as $word ) {
				$trimmedWord = strtolower( trim( str_replace( ' ', '', $word ) ) );

				if ( strlen( $trimmedWord ) == 5 && !preg_match('/[^A-Za-z]/', $trimmedWord ) ) {
					$this->insertWord( $trimmedWord );
				}
			}
		}

		/**
		 * Insert a word into the table.
		 *
		 * @param string $word the word we are inserting.
		 * @return integer
		 */
		public function insertWord( $word ) {
			$insert = array( // insert data keys must be the column names in db
				'word' => $word,
				'char1' => $word[0],
				'char2' => $word[1],
				'char3' => $word[2],
				'char4' => $word[3],
				'char5' => $word[4]
			);

			// set the table for insert
			$this->database->table( self::TABLE_NAME );

			// run the insert
			return $this->database->runInsertQuery( $insert );
		}

		/**
		 * Get words based on the game board data structure from the front end.
		 *
		 * @return array
		 */
		public function getWords() {
			// initialize the sql
			$sql = '
				SELECT
					word
				FROM 
					dictionary 
			';

			// store our sql where data
			$where = array();

			// store our pdo params for query
			$params = array();

			foreach ( $_POST['letters'] as $key => $letter ) { // loop over letters
				// set letter key so it is not zero based
				$letterKey = $key + 1;

				if ( isset( $letter['equal'] ) && $letter['equal'] ) { // we know what the letter is
					// create pdo key
					$pdoKey = ':letter' . $letterKey;

					// map the pdo key to the actual value
					$params[$pdoKey] = $letter['equal'];

					// add our equals where clause
					$where[] = 'char' . $letterKey . '=' . $pdoKey;
				} elseif ( isset( $letter['not_equal'] ) && $letter['not_equal'] ) { // we have an array of what the letter is not
					$pdoLetterNotEqualsIn = '';

					foreach ( $letter['not_equal'] as $notEqualKey => $notEqualLetter ) {
						// create pdo key
						$pdoKey = ':letter' . $notEqualKey . 'In' . $notEqualLetter;
						
						// map the pdo key to the actual value
						$pdoLetterNotEqualsIn .= ( $pdoLetterNotEqualsIn ? ',' : '' ) . $pdoKey;
						$params[$pdoKey] = $notEqualLetter;
					}

					// add our not in  where clause
					$where[] = 'char' . $letterKey . ' not in (' . $pdoLetterNotEqualsIn . ')';
				}
			}

			if ( isset( $_POST['word']['contains'] ) && $_POST['word']['contains'] ) { // check if we know the word contains any letters
				foreach ( $_POST['word']['contains'] as $key => $letter ) { // loop over letters in the contains array
					// create pdo key
					$pdoKey = ':contains' . $key;
					
					// map the pdo key to the actual value
					$params[$pdoKey] = '%' . $letter . '%';

					// add our where like clause
					$where[] = 'word LIKE ' . $pdoKey;
				}
			}

			if ( $where ) { // we have where clauses
				// add on all where clauses to sql query string
				$sql .= 'WHERE ' . implode( ' AND ', $where );
			}

			// set fetch multi
			$this->database->fetch( Database::PDO_FETCH_MULTI );

			// get words from our query
			$words = $this->database->runCustomQuery( $sql, $params );

			// create array of only words returned
			$words = array_column( $words, 'word' );

			// echo out for ajax
			echo json_encode( $words );
		}
	}
?>