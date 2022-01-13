mapboxgl.accessToken = 'pk.eyJ1IjoicndlaXNiZXJnZXIiLCJhIjoiY2t5NmNiOGs2MGl5eTJua3lwY3EwM2VjaSJ9.not_oFtQ3yNH5Ah_0n39VQ';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-71.101,42.348],
    zoom: 12.5
});

// Trying to get a bus icon
// var geojson = {
// 	type:'FeatureCollection',
// 	features: [{
// 		type: 'Feature',
// 		geometry: {
// 			type: 'Point',
// 			coordinates: [[-71.101,42.358]]
// 		},
// 		properties: {
// 			title: 'Mapbox',
// 			description: 'bus'
// 		}
// }]
// }

let currentMarkers = [];

async function run(){
    // get bus data    
	const locations = await getBusLocations();
	// console.log(new Date());
	// console.log(locations);
	
	for (let i = 0; i < currentMarkers.length; i++) {
      currentMarkers[i].remove();
    }
	currentMarkers = [];

	locations.forEach(location => {
		const el = document.createElement('div');
			el.className = 'busMarker';
		const marker = new mapboxgl.Marker(el)
			.setLngLat(location)
			.addTo(map);

		currentMarkers.push(marker);
	});

	// console.log(currentMarkers)

	setTimeout(run, 15000);
	
}

// Request bus data from MBTA and returns object for locations
async function getBusLocations(){
	const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
	const response = await fetch(url);
	const json     = await response.json(); 

console.log(json.data)
	// create an array of arrays for bus locations
	let length = json.data.length;
	let busLocations = [];
	for (let i=0; i<length; i++) {
		var newLocation= [];
		newLocation.push(json.data[i].attributes.longitude);
		newLocation.push(json.data[i].attributes.latitude);
		busLocations.push(newLocation)
	}

	console.log(busLocations);
	return busLocations;	
};

run();


