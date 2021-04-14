    mapboxgl.accessToken = mapToken ;
    const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: park.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // how close to zoom into coordinate
    });
    
    //add visual controls to each park map
   map.addControl(new mapboxgl.NavigationControl());

    new mapboxgl.Marker()
    .setLngLat(park.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset:25})
        .setHTML(
            '<h3>' + park.title + '</h3>'
        )
    )
    .addTo(map)

    