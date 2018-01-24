//** TODO. Optimize modal component

// const trigger = document.querySelector('.modal-toggle');
const modal = document.querySelector('.modal');
const modalContent = document.querySelector('.modal-content');
const closeButton = document.querySelector('.close-modal');

//** Import components
const loader = require('./loader');

const MODAL = {

	load: function() {
		document.body.style.overflow = 'hidden';		
		modal.classList.add('modal-loading');
		loader.show('.modal-loader');
	},

	isLoaded: function() {
		modal.classList.remove('modal-loading');
		loader.hide('.modal-loader');
	},

	toggleModal: function() {
		modal.classList.toggle('show-modal');
		MODAL.isLoaded();		
	},

	hideModal: function() {
		modal.classList.remove('modal-loading');
		modal.classList.remove('show-modal');
		document.body.removeAttribute('style');
	},

	pushContent: function(content) {
		if (content !== undefined) {
			modalContent.innerHTML = content;
			setTimeout(function() {				
				MODAL.toggleModal();
			}, 300);			
		} else {
			MODAL.toggleModal();			
		}
	},

	windowOnClick: function(event) {
        if (event.target === modal) {
            MODAL.hideModal();
        }
	},	

	events: function() {
		// trigger.addEventListener('click', MODAL.toggleModal);
		closeButton.addEventListener('click', MODAL.toggleModal);
		window.addEventListener('click', MODAL.windowOnClick);
	},

	init: function() {
		MODAL.events();
	}
}

module.exports = {    
    init : MODAL.init,
    load : MODAL.load,
    pushContent: MODAL.pushContent
};