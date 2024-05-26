<?php
	/**
	 * Dictionary Model.
	 *
	 * Model that holds user related functionality.
	 *
	 * @package		wordle_word_finder/php
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
		const TABLE_NAME = 'wordle_word_finder_dictionary';

		public function normalizeWords() {
			// specify database table
			$this->database->table( 'wordle_word_finder_entries' );

			// set fetch mode
			$this->database->fetch( Database::PDO_FETCH_MULTI );

			// return results
			$words = $this->database->runSelectQuery();

			$words = array_column( $words, 'word' );
			$words = array_unique( $words );

			foreach ( $words as $word ) {
				$trimmedWord = strtolower( trim( str_replace( ' ', '', $word ) ) );

				if ( strlen( $trimmedWord ) == 5 && !preg_match('/[^A-Za-z]/', $trimmedWord ) ) {
					$this->insertWord( $trimmedWord, $trimmedWord[0], $trimmedWord[1], $trimmedWord[2], $trimmedWord[3], $trimmedWord[4] );
				}
			}

			die( 'done' );
		}

		public function insertWord( $word, $char1, $char2, $char3, $char4, $char5 ) {
			$insertData = array( // data to insert with the array keys being the column names
				'word' => $word,
				'char1' => $char1,
				'char2' => $char2,
				'char3' => $char3,
				'char4' => $char4,
				'char5' => $char5
			);

			// specify database table
			$this->database->table( self::TABLE_NAME );

			// return results
			return $this->database->runInsertQuery( $insertData );			
		}

		public function getWords() {
			// normalize
			$sql = '
				SELECT
					word
				FROM 
					wordle_word_finder_dictionary 
				';

			$where = array();
			$params = array();

			foreach ( $_POST['letters'] as $key => $letter ) {
				$letterNumber = $key + 1;

				if ( isset( $letter['equal'] ) && $letter['equal'] ) {
					$pdoKey = ':letter' . $letterNumber;
					$params[$pdoKey] = $letter['equal'];
					$where[] = 'char' . $letterNumber . '=' . $pdoKey;
				} elseif ( isset( $letter['not_equal'] ) && $letter['not_equal'] ) {
					$pdoLetterNotEqualsIn = '';

					foreach ( $letter['not_equal'] as $notEqualKey => $notEqualLetter ) { 
						$pdoKey = ':letter' . $letterNumber . 'NotEqual' . $notEqualKey . 'In' . $notEqualLetter;
						$pdoLetterNotEqualsIn .= ( $pdoLetterNotEqualsIn ? ',' : '' ) . $pdoKey;
						$params[$pdoKey] = $notEqualLetter;
					}

					$where[] = 'char' . $letterNumber . ' not in (' . $pdoLetterNotEqualsIn . ')';
				}
			}

			if ( isset( $_POST['word']['contains'] ) && $_POST['word']['contains'] ) {
				foreach ( $_POST['word']['contains'] as $key => $letter ) {
					$pdoKey = ':contains' . $key;
					$params[$pdoKey] = '%' . $letter . '%';
					$where[] = 'word LIKE ' . $pdoKey;
				}
			}

			if ( $where ) {
				$sql .= 'WHERE ' . implode( ' AND ', $where );
			}

			// set fetch mode
			$this->database->fetch( Database::PDO_FETCH_MULTI );

			// get results
            $words = $this->database->runCustomQuery( $sql, $params );

            // return our data as json
			echo json_encode( array_column( $words,'word' ) );
		}
	}
?>