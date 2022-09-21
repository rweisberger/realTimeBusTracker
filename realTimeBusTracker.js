mapboxgl.accessToken = 'pk.eyJ1IjoicndlaXNiZXJnZXIiLCJhIjoiY2t5NmNiOGs2MGl5eTJua3lwY3EwM2VjaSJ9.not_oFtQ3yNH5Ah_0n39VQ';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-71.101,42.348],
    zoom: 12.75
});


let currentMarkers = [];
let routeNum;

// see which route we want to get information for
const element = document.getElementById("routes-list");
	element.addEventListener("click", event => {
	routeNum = event.target.innerHTML;
    // console.log('The item ' + event.target.innerHTML + ' was just clicked')
	
	run();
});

async function run(){
	const busInfo = await getBusLocations();
	let blueBusLocations = [];
	let redBusLocations = [];

	for (let i = 0; i < currentMarkers.length; i++) {
    	currentMarkers[i].remove();
    }

	currentMarkers = [];
	if(busInfo.length === 0) {

	}

	for (let i = 0; i < busInfo.length; i++) {
		if (busInfo[i].direction === 0) {
				let newOutboundLocation = [];
				newOutboundLocation.push(busInfo[i].longitude, busInfo[i].latitude);
				blueBusLocations.push(newOutboundLocation);
			
			blueBusLocations.forEach(location => {
				const popup = new mapboxgl.Popup({
					closeButton: false,
					closeOnClick: true
					})
					.setText(`Outbound: ${busInfo[i].occupancy}`)
					map.on('mouseenter', 'map', function() {
						map.getCanvas().style.cursor = 'pointer';
						});
				
					map.on('mouseleave', 'map', function() {
						map.getCanvas().style.cursor = '';
						});
				const el = document.createElement('div');
					el.className = 'blueBusMarker';
				const marker = new mapboxgl.Marker(el)
					.setLngLat(location)
					.addTo(map)
					.setPopup(popup);

				currentMarkers.push(marker);
			});
		}
		if (busInfo[i].direction === 1) {
			let newLocation = [];
			newLocation.push(busInfo[i].longitude, busInfo[i].latitude);
			// newLocation.push(busInfo[i].latitude);
			redBusLocations.push(newLocation);
		
			redBusLocations.forEach(location => {
			const popup = new mapboxgl.Popup({
				closeButton: false,
				closeOnClick: true
				})
				.setText(`Inbound: ${busInfo[i].occupancy}`)
				map.on('mouseenter', 'map', function() {
					map.getCanvas().style.cursor = 'pointer';
					});
					map.flyTo({
						center: [busInfo[0].longitude, busInfo[0].latitude]
					})
				map.on('mouseleave', 'map', function() {
					map.getCanvas().style.cursor = '';
					});
			const el = document.createElement('div');
				el.className = 'redBusMarker';
			const marker = new mapboxgl.Marker(el)
				.setLngLat(location)
				.addTo(map)
				.setPopup(popup);

			currentMarkers.push(marker);
			});
		}
	}

	setTimeout(run, 15000);
}


// Request bus data from MBTA and returns object for locations
async function getBusLocations(){
	// const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
	const url = `https://api-v3.mbta.com/vehicles?filter[route]=${routeNum}&include=trip`;

	
	const response = await fetch(url);
	const json     = await response.json(); 

	// create an array of objects for bus locations
	let length = json.data.length;
	let busInfo = [];
	if(length === 0) {
		document.getElementById("alert").innerHTML = "No buses en route";
		console.log('no buses')
	} else {
		for (let i=0; i<length; i++) {
			let formatOccupancy = json.data[i].attributes.occupancy_status ? json.data[i].attributes.occupancy_status.toLowerCase().replaceAll('_', ' ') : 'Unknown';
			let newBus = ({direction: json.data[i].attributes.direction_id,
						longitude: json.data[i].attributes.longitude,
						latitude: json.data[i].attributes.latitude,
						occupancy: formatOccupancy
						});
			busInfo.push(newBus)
	}}
	
	return busInfo;	
};

// run();

