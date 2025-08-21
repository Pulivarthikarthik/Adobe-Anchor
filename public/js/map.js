   // it is used to display the map in every listing with the help of mapbox which has in built libraries
   // mapToken is in show.ejs which is defined in .env at first and is not accessible to .js so we used ejs via <script>
	  mapboxgl.accessToken =   mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });




    const el = document.createElement('div');
el.className = 'custom-marker';

// Normal marker style
el.style.backgroundImage = 'url(/ )'; // default pin
el.style.width = '40px';
el.style.height = '40px';
el.style.backgroundSize = 'cover';
el.style.cursor = 'pointer';

// Change image on hover
el.addEventListener('mouseenter', () => {
    el.style.backgroundImage = 'url( )'; // home icon
});
 
     //Create a default Marker and add it to the map.
    // here we cant directly access the coorodinates so we will do same like previous one via EJS in show.ejs
    // and down these all are in built in mapbox
    const marker = new mapboxgl.Marker({color:'red'})
        .setLngLat(listing.geometry.coordinates)// it is set by listing.geometry.coordinates (in model file)
        .setPopup(new mapboxgl.Popup({offset: 25})
        .setHTML(`<h4>${listing.title}</h4><p>Exact location provided after booking</p>`))
        .addTo(map);
 