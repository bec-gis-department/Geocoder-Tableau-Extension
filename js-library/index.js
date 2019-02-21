(function() {
    var map = L.map('map').setView([30.171410, -96.922666], 12), 
        geocoders = {
            'Mapbox': L.Control.Geocoder.mapbox(LCG.apiToken),
        },
		//Kill this thing to remove the button... but be careful
        selector = L.DomUtil.get('geocode-selector'),
        control = new L.Control.Geocoder({ geocoder: null }),
        btn,
        selection,
        marker;
/*
Author: John R Lister - GIS Applications Developer
	So this is that little blue mapbox button... we dont need it it was just for the original selector 
	We need to remove it but just be careful to adjust the map variable to be able to load this puppy without the following function set Active
	I will get to this... but I am so bloody busy
	Its Javascript... this shit will whitescreen if it isn't done right
*/
    function select(geocoder, el) {
        if (selection) {
            L.DomUtil.removeClass(selection, 'selected');
        }

        control.options.geocoder = geocoder;
        L.DomUtil.addClass(el, 'selected');
        selection = el;
    }
	
	/*
	Author: John R Lister - GIS Applications Developer
		This is a cool little guy, when you click on the map it generates a geocoded marker.. kind reverse geocod'ish 
		Could be used in conjunction should you know exactly where the address is on a map without geocoding it
	*/
    for (var name in geocoders) {
        btn = L.DomUtil.create('button', '', selector);
        btn.innerHTML = name;
        (function(n) {
			//Fekkin listeners boiiiiii
            L.DomEvent.addListener(btn, 'click', function() {
                select(geocoders[n], this);
            }, btn);
        })(name);

        if (!selection) {
            select(geocoders[name], btn);
        }
    }
/*
Author: John R Lister - GIS Applications Developer
	The URL is structured like this:'https://api.mapbox.com/styles/v1/your username /your style id/tiles/256/{z}/{x}/{y}@2x?access_token=' + the Mapbox API Token defined in the config
*/
    L.tileLayer('https://api.mapbox.com/styles/v1/gisjohnbb/cjlzm452x6knl2ro2g61inwc9/tiles/256/{z}/{x}/{y}@2x?access_token=' + LCG.apiToken, { 
        attribution: '<a href="link to credits if you so wish">Terms & Feedback</a>'
    }).addTo(map);

    control.addTo(map);
/*
Author: John R Lister - GIS Applications Developer
	This shizzle adds the point to the map from the geocode... 
	for the GVEC example we obviously want your point data from tableau to populate, but Imma develope the piece that retrieves the XY as an array able to populate on this map
*/
    map.on('click', function(e) {
        control.options.geocoder.reverse(e.latlng, map.options.crs.scale(map.getZoom()), function(results) {
            var r = results[0];
            if (r) {
                if (marker) {
                    map.removeLayer(marker);
                }
                marker = L.marker(r.center).bindPopup(r.html || r.name).addTo(map).openPopup();
            }
        })
    });
})();