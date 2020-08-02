
//Create the Leaflet map, set view and zoom levels
map = L.map('mapid').setView([38.754, -77.441],16,);
lyrOSM = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
//     attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
// //setting max and min zoom (starts with a comma after attribution informaiton
    maxZoom: 19,
    minZoom: 3
}).addTo(map);

//adding the layers for switching views
var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }),
    Esri_WorldTopoMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
});

var baseLayers = {
    "Imagery": Esri_WorldImagery,
    "TopoMap": Esri_WorldTopoMap
};



var baseball = L.geoJSON.ajax('data/baseball.geojson').addTo(map);
var basketball = L.geoJSON.ajax('data/basketball.geojson').addTo(map);
var football = L.geoJSON.ajax('data/football.geojson').addTo(map);
var park = L.geoJSON.ajax('data/park.geojson').addTo(map);
var picnic = L.geoJSON.ajax('data/picnic.geojson').addTo(map);
var playground = L.geoJSON.ajax('data/playground.geojson').addTo(map);
var restroom = L.geoJSON.ajax('data/restroom.geojson').addTo(map);
var soccer = L.geoJSON.ajax('data/soccer.geojson').addTo(map);
var trail = L.geoJSON.ajax('data/trail.geojson').addTo(map);
var waterpark = L.geoJSON.ajax('data/waterpark.geojson').addTo(map);

var objOverlays = {
    "Baseball": baseball,
    "Basketball": basketball,
    "Football": football,
    "Park Boundary": park,
    "Picnic Area": picnic,
    "Playground": playground,
    "Restrooms": restroom,
    "Soccer": soccer,
    "Trail": trail,
    "Waterpark": waterpark
};
L.control.layers(baseLayers, objOverlays).addTo(map);


//data layers
var poi = L.geoJSON.ajax('data/poi_reproject.geojson', {
    color: 'null',
    onEachFeature: onEachFeature
}).addTo(map);

function onEachFeature(feature, layer) {
    content = '<b>' + feature.properties.Activity + '</b>' + "<br>Note:" + feature.properties.Note;
    layer.bindTooltip(content);
}

//remove leaftlet intial zoom buttons to allow for combined + / zoom to extent / - button
map.removeControl(map.zoomControl);

//adding a scale to bottom left of the map
ctlscale = L.control.scale({position:'bottomright', maxWidth:300}).addTo(map);

//pass the name of the div / sidebar - to put the search component area and possibly legend
//sidebar was removed to allow for buttons surrounding the map allowing for a better view of the map.
//this line needs to remain it is linked to the modal prompt
ctlSidebar = L.control.sidebar('sidebar').addTo(map);

//the button icon is not showing up. using bootstrap glypicon graphic
ctlEasyButton = L.easyButton('<img src="images/arrow.png">', function() {
   // alert('you just clicked the html entity \&target;');
    ctlSidebar.toggle();
//add information for when hover over the icon
}, 'Open / Close for Search Options and additional information').addTo(map);


//search control for POI
var searchControl = new L.Control.Search({
   //dataType: "json",
   container: 'search-container',
   layer: poi,
   propertyName: 'Location',
   textPlaceholder: 'Choose Activity and Site',
   initial: true,
   collapsed: false,
   autoResize: false,


  moveToLocation: function(latlng) {
      console.log(latlng +" Coordinates");
      map.setView(latlng, 18); // set the zoom
  }

});
map.addControl( searchControl );



//used for opening centering of map with the home button
var lat = 38.754;
var lng = -77.441;
var zoom = 17.0;

// custom zoom bar control that includes a Zoom Home function
L.Control.zoomHome = L.Control.extend({
    options: {
        position: 'topleft',
        zoomInText: '+',
        zoomInTitle: 'Zoom in',
        zoomOutText: '-',
        zoomOutTitle: 'Zoom out',
        zoomHomeText: '<img src="images/home1.png">',
        zoomHomeTitle: 'Zoom home'
    },


    onAdd: function (map) {
        var controlName = 'gin-control-zoom',
            container = L.DomUtil.create('div', controlName + ' leaflet-bar'),
            options = this.options;

        this._zoomInButton = this._createButton(options.zoomInText, options.zoomInTitle,
            controlName + '-in', container, this._zoomIn);
        this._zoomHomeButton = this._createButton(options.zoomHomeText, options.zoomHomeTitle,
            controlName + '-home', container, this._zoomHome);
        this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle,
            controlName + '-out', container, this._zoomOut);

        this._updateDisabled();
        map.on('zoomend zoomlevelschange', this._updateDisabled, this);

        return container;
    },

    onRemove: function (map) {
        map.off('zoomend zoomlevelschange', this._updateDisabled, this);
    },

    _zoomIn: function (e) {
        this._map.zoomIn(e.shiftKey ? 3 : 1);
    },

    _zoomOut: function (e) {
        this._map.zoomOut(e.shiftKey ? 3 : 1);
    },

    _zoomHome: function (e) {
        map.setView([lat, lng], zoom);
    },

    _createButton: function (html, title, className, container, fn) {
        var link = L.DomUtil.create('a', className, container);
        link.innerHTML = html;
        link.href = '#';
        link.title = title;

        L.DomEvent.on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
            .on(link, 'click', L.DomEvent.stop)
            .on(link, 'click', fn, this)
            .on(link, 'click', this._refocusOnMap, this);

        return link;
    },

    _updateDisabled: function () {
        var map = this._map,
            className = 'leaflet-disabled';

        L.DomUtil.removeClass(this._zoomInButton, className);
        L.DomUtil.removeClass(this._zoomOutButton, className);

        if (map._zoom === map.getMinZoom()) {
            L.DomUtil.addClass(this._zoomOutButton, className);
        }
        if (map._zoom === map.getMaxZoom()) {
            L.DomUtil.addClass(this._zoomInButton, className);
        }
    }
});

// add the new control to the map
var zoomHome = new L.Control.zoomHome();
zoomHome.addTo(map);

// add location control to global name space for testing only
// on a production site, omit the "lc = "!
lc = L.control.locate({
    strings: {
        title: "Show me where I am!",

    }
}).addTo(map);
