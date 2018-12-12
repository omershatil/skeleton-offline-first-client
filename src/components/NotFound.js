import React from 'react';
import {Link} from 'react-router-dom';

/**
 * Handle page not found.
 * @returns {*}
 * @constructor
 */
export const NotFound = () => (
	<div>
		404 - <Link to="/">Page not found. Click to return to the main page</Link>
	</div>
);
