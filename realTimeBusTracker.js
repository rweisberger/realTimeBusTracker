mapboxgl.accessToken = 'pk.eyJ1IjoicndlaXNiZXJnZXIiLCJhIjoiY2t5NmNiOGs2MGl5eTJua3lwY3EwM2VjaSJ9.not_oFtQ3yNH5Ah_0n39VQ';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-71.101,42.348],
    zoom: 12.5
});


let currentMarkers = [];

async function run(){
	const busInfo = await getBusLocations();
	let blueBusLocations = [];
	let redBusLocations = [];


	for (let i = 0; i < currentMarkers.length; i++) {
    	currentMarkers[i].remove();
    }

	currentMarkers = [];

	for (let i = 0; i < busInfo.length; i++) {
		if (busInfo[i][0] === 0) {
				let newLocation = [];
				newLocation.push(busInfo[i][1]);
				newLocation.push(busInfo[i][2]);
				blueBusLocations.push(newLocation);
			
			blueBusLocations.forEach(location => {
				const el = document.createElement('div');
					el.className = 'blueBusMarker';
				const marker = new mapboxgl.Marker(el)
					.setLngLat(location)
					.addTo(map);

				currentMarkers.push(marker);
			});
		}
	}
	for (let i = 0; i < busInfo.length; i++) {
		if (busInfo[i][0] === 1) {
				let newLocation = [];
				newLocation.push(busInfo[i][1]);
				newLocation.push(busInfo[i][2]);
				redBusLocations.push(newLocation);
			
			redBusLocations.forEach(location => {
				const el = document.createElement('div');
					el.className = 'redBusMarker';
				const marker = new mapboxgl.Marker(el)
					.setLngLat(location)
					.addTo(map);

				currentMarkers.push(marker);
			});
		}
	}
	console.log(currentMarkers)

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
	let busInfo = [];
	for (let i=0; i<length; i++) {
		var newBus= [];
		newBus.push(json.data[i].attributes.direction_id);
		newBus.push(json.data[i].attributes.longitude);
		newBus.push(json.data[i].attributes.latitude);
		busInfo.push(newBus)
	}

	console.log(busInfo);
	return busInfo;	
};

run();

