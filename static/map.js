// Based on various pages on Google Maps Javascript API documentation except where noted otherwise

// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.

// Handle location updates
// From https://medium.com/risan/track-users-location-and-display-it-on-google-maps-41d1f850786e
const trackLocation = ({ onSuccess, onError = () => { } }) => {
    if ('geolocation' in navigator === false) {
      return onError(new Error('Geolocation is not supported by your browser.'));
    }
  
    // Use watchPosition for live updates
    return navigator.geolocation.watchPosition(onSuccess, onError);
};

const addMarkers = () => {
    // Get map bounds
    bounds = map.getBounds()
    bounds = bounds.toJSON()


    // Send AJAX request to server
    // (server updates plants array with plants in range)

    // place plants 
    var infowindow = new google.maps.InfoWindow();
    var contentString;
    for (var i = 0; i < plants.length; i++) {
        // console.log(plants[i])
        var lat = parseFloat(plants[i].lat);
        // console.log("lat: ", lat)
        // console.log("lng: ", lng)
        var lng = parseFloat(plants[i].lng);
        var title = plants[i].title;
        var titleURL = encodeURIComponent(title.trim());
        // console.log("title: " + title)
        // console.log(i, lat, lng);
        // console.log(titleURL)
        // console.log(plants[i].title)

        var marker = new google.maps.Marker({
            map: map,
            position: {
                lat: lat,
                lng: lng
            },
            title: title,
            clickable: true
        });

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {

                contentString = '<div id="content">'+
                '<div id="siteNotice">'+
                '</div>'+
                '<h1 id="firstHeading" class="firstHeading">'+
                plants[i].title+
                '</h1>'+
                '<div id="bodyContent">'+
                '<p><a href=plantdetails?common_name='+
                encodeURIComponent(plants[i].title.trim())+
                '>'+
                'Click here for more details</a></p>'+
                '</div>'+
                '</div>';
            
                infowindow.setContent(contentString);
                infowindow.open(map, marker);
            }
        })(marker, i));
}
}
  
function initMap() {
    // console.log('{{plants | safe}}')
    plants = '{{plants | safe}}'
    plants = JSON.parse(plants)

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.3471, lng: -74.6566},
        zoom: 17
    });
    locationMarker = new google.maps.Marker({
        map: map,
        icon: {
        //   url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        url: "/static/my_location.svg"
        }
    });

    // addMarkers()
  
      // Call trackLocation
      // From https://medium.com/risan/track-users-location-and-display-it-on-google-maps-41d1f850786e
    trackLocation({
        onSuccess: ({ coords: { latitude: lat, longitude: lng } }) => {
            locationMarker.setPosition({ lat, lng });
            map.panTo({ lat, lng });
        },
        onError: err =>
            alert(`Error: Failed to obtain location`)
    });

    google.maps.event.addListenerOnce(map, "bounds_changed", function(){
        // addMarkers();
        google.maps.event.addListener(map, "idle", addMarkers);
    });

}