const LOADER = {

	show: function(selector) {
		document.querySelector(selector).style.display = 'block';
	},

	hide: function(selector) {
		document.querySelector(selector).style.display = 'none';
	},
}

module.exports = {    
    show: LOADER.show,
    hide: LOADER.hide
};