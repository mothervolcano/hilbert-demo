


export function getParametersLength( str: string ): number {

	const paramStr = getParameterString( str );

	if ( paramStr !== null ) {

		return paramStr.length + 2;

	} else {

		return -1;
	}

};


export function getParameterString( str: string ): string | 'incomplete' | null {

	if ( typeof str === 'undefined' || str === '' ) {
    	
    	throw new Error('Empty or undefined string');
  	}

  	const openingIndex = str.indexOf('(');
  	const closingIndex = str.indexOf(')');

	if ( openingIndex >= 0 && closingIndex > 0 ) {

		// TODO: handle the case when we have nothing in between parenthesis eg.: "()"

		return str.substring( openingIndex + 1, closingIndex );

	} else if ( closingIndex === -1 ) {

		// TODO: return an informative error message to give the chance to the caller to try again with a longer string as the input

		return 'incomplete';

	} else {

		return null
	}

};


export function renderSequence( sequence: string ) {

	
}



export function parseParameters( str: string ) {

	return []
}