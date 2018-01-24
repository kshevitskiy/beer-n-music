//** Import utilities
const util = require('./utilities');

//** Import components
const modal = require('./components/modal');
const loader = require('./components/loader');


const appWrapper = document.getElementById('app');
const beerListWrapper = document.getElementById('beer-list');
const beersURL = 'https://api.punkapi.com/v2/beers?page=';
let page = 1;
const perPage = '&per_page=12';
const firstPageURL = beersURL + page + perPage;

//** Music
const SC = {

	base_url: 'https://api.soundcloud.com/tracks',
	client_id: 'l8b1LlbFBGgDJmPurEkqHuuUHDVckbWK',

	genre: function(value) {
		if(value <= 1) {
			return 'chillout';
		} else if(value >= 1 && value <= 3) {
			return 'techno';
		} else if(value >= 3 && value <= 6) {
			return 'deep';
		} else if(value >= 6 && value <= 12) {
			return 'rock';
		} else {
			return 'metal';
		}
	},

	buildUrl: function(value) {
		return SC.base_url + '?client_id=' + SC.client_id + '&genres=' + SC.genre(value);
	},

	renderTracks: function() {		
		const tracks = JSON.parse(this.responseText);					

		if (this.readyState === 4 && this.status === 200) {
			tracks.some( function(track, index) {
				if(track.artwork_url !== null) {

					let trackWrapper = document.createElement('li');
						trackWrapper.setAttribute('class', 'track');

					// Track markup
					let markup = `
						<figure class="track-cover-wrapper">
							<img src="${track.artwork_url}" alt="${track.title}" class="track__cover" />
						</figure>
						<div class="track-meta-wrapper">
							<div class="track__title">${track.title}</div>
							<a href="${track.permalink_url}" title="${track.title}" target="_blank" class="button button-soundcloud">Listen</a>
						</div>
					`;

					trackWrapper.innerHTML = markup;
					playlist.appendChild(trackWrapper);
				}
			
				return index === 4;
			});
		} else {
			console.log('Error with tracks loading');
		}
	}
};

const APP = {

	createXHR: function() {		
	    try {
	        return new XMLHttpRequest();
	    } catch (e) {
	        try {
	            return new ActiveXObject('Microsoft.XMLHTTP');
	        } catch (e) {
	            return new ActiveXObject('Msxml2.XMLHTTP');
	        }
	    }
	},

	fetch: function(url, requestListener, requestError) {
		const xhr = APP.createXHR();
		xhr.addEventListener('load', requestListener, false);
		xhr.addEventListener('error', requestError, false);

		xhr.open( 'GET', url, true );
		xhr.send();
	},

	requestError: function(err) {
		console.log('Error, please try again later', err);
	},

	beerList: function() {
		const beers = JSON.parse(this.responseText);
		loader.show('.beer-loader');

		if (this.readyState === 4 && this.status === 200) {
			beers.forEach( function(beer, index) {

				// Beer card markup
				let markup = `
					<img src="${beer.image_url}" alt="${beer.name}" class="beer-card__image" />
					<h3 class="beer-card__name h4">${util.trimString(beer.name, 15)}</h3>
					<p class="beer-card__tagline">${util.trimString(beer.tagline, 25)}</p>
				`;	

				let beerCard = document.createElement('li');
					beerCard.setAttribute('class', 'card beer-card animated fadeInUp');
					beerCard.setAttribute('title', beer.name);
					beerCard.setAttribute('data-id', beer.id);
					beerCard.innerHTML = markup;
				
				setTimeout(function() {
					loader.hide('.beer-loader');
					beerListWrapper.appendChild(beerCard);
				}, 1000);

				// Events
				APP.events.openSingleBeer(beerCard);
			});

			APP.loadMoreBeers();
		} else {
			loader.hide('.beer-loader');
		}
	},

	singleBeer: {

		load: function() {
			let id = this.getAttribute('data-id');
			let beerURL = 'https://api.punkapi.com/v2/beers/' + id;		

			// Get single beer and load modal
			modal.load();
			APP.fetch(beerURL, APP.singleBeer.render, APP.error);
		},

		render: function() {		
			let beer = JSON.parse(this.responseText);
				beer = beer[0];				

			if (this.readyState === 4 && this.status === 200) {

				// Single beer markup
				let markup = `
					<div class="beer animated fadeInUp">
						<figure class="beer-image-wrapper">
							<img src="${beer.image_url}" alt="${beer.name}" class="beer__image" />
						</figure>
						<div class="beer-content-wrapper">
							<header>
								<h2 class="beer__name">${beer.name}</h2>
								<p class="beer__tagline">${beer.tagline}</p>
								<div class="beer-meta">
									<span><b>IBU:</b> ${beer.ibu}</span>
									<span><b>ABV:</b> ${beer.abv}</span>
									<span><b>EBC:</b> ${beer.ebc}</span>
								</div>
							</header>
							<div class="beer__copy">
								<p>${beer.description}</p>					
							</div>
							<div class="beer-food">
								<h5>Best served with:</h5>
								<ul class="food-list">
								    ${beer.food_pairing.map(food => `<li class="food-list__item">${food}</li>`).join('')}
								</ul>				
							</div>
						</div>
					</div>
					<div class="playlist-wrapper animated fadeInUp">
						<header class="playlist-header">
							<h5>Playlist</h5>
						</header>
						<ul id="playlist"></ul>
					</div>
				`;

				let playlist = document.getElementById('playlist');
				let url = SC.buildUrl(`${beer.abv}`);				
				APP.fetch(url, SC.renderTracks, APP.error);

				modal.pushContent(markup);
			} else {
				loader.hide('.beer-loader');		
			}
		}
	},

	loadMoreBeers: function() {
		window.onscroll = function() {
			let offset = window.innerHeight + window.scrollY
			let height = document.body.scrollHeight;

			if (offset >= height) {
				page = ++page;
				let newPageURL = beersURL + page + perPage;
				APP.fetch(newPageURL, APP.beerList, APP.error);
			}
		};		
	},	

	events: {
		openSingleBeer: function(selector) {
			selector.addEventListener( 'click', APP.singleBeer.load );
		}
	},

	init: function() {	
		APP.fetch(firstPageURL, APP.beerList, APP.error);
	}
};

module.exports = {
    init : APP.init
};
