const UTILITIES = {

	trimString: function(string, length) {
		if (string.length > length) {
			let trimmedString = string.substr(0, length);
			trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(' ')));
			return trimmedString + '...';
		} else {   	
			return string;
		}		
	},
};

module.exports = {
    trimString : UTILITIES.trimString
};
