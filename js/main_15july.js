
//Create the Leaflet map, set view and zoom levels
const parkLatitude = 38.754
const parkLongitude = -77.441
var map = L.map('mapid').setView([parkLatitude, parkLongitude],16,);
lyrOSM = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
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


//var baseball = L.geoJSON.ajax('data/baseball.geojson', {pointToLayer:returnBaseMarker}).addTo(map);
var baseball = L.geoJSON.ajax('data/baseball.geojson');
var basketball = L.geoJSON.ajax('data/basketball.geojson');
var football = L.geoJSON.ajax('data/football.geojson');
var park = L.geoJSON.ajax('data/park.geojson').addTo(map);
var picnic = L.geoJSON.ajax('data/picnic.geojson');
var playground = L.geoJSON.ajax('data/playground.geojson');
var restroom = L.geoJSON.ajax('data/restroom.geojson');
var soccer = L.geoJSON.ajax('data/soccer.geojson');
var trail = L.geoJSON.ajax('data/trail.geojson');
var waterpark = L.geoJSON.ajax('data/waterpark.geojson');
var poi = L.geoJSON.ajax('data/poi_reproject.geojson', {
    opacity:100,
    color: '',
    fill: '',
    onEachFeature: onEachFeature
});

function onEachFeature(feature, layer) {
    content = '<b>' + feature.properties.Activity + '</b>' + "<br>Note:" + feature.properties.Note;
    layer.bindTooltip(content);
}



var objOverlays = {
    "All": poi,
    //"All <img src='images/reddot.png' style='width:16px;height:16x;'>": poi,
    "Baseball": baseball,
    "Basketball": basketball,
    "Football":football,
    "Park Boundary": park,
    "Picnic Area": picnic,
    "Playground": playground,
    "Restrooms": restroom,
    "Soccer": soccer,
    "Trail": trail,
    "Waterpark": waterpark,
};
//L.control.layers(baseLayers).addTo(map);
L.control.layers(baseLayers, objOverlays).addTo(map);

//----------------------------------------------------------------------
/*// Add method to layer control class
L.Control.Layers.include({
    getActiveOverlays: function () {

        // Create array for holding active layers
        var active = [];

        // Iterate all layers in control
        this._layers.forEach(function (obj) {

            // Check if it's an overlay and added to the map
            if (obj.overlay && this._map.hasLayer(obj.layer)) {

                // Push layer to active array
                active.push(obj.layer);
                alert("The data was inserted "+ active);
            }
        });

        // Return array
        return active;
    }
});

var control = new L.Control.Layers(objOverlays),
    active = control.getActiveOverlays();*/


//----------------------------------------------------------------

/*//data layer for search box
var poi = L.geoJSON.ajax('data/poi_reproject.geojson', {
    opacity:100,
    color: '',
    fill: '',
    onEachFeature: onEachFeature
});

function onEachFeature(feature, layer) {
    content = '<b>' + feature.properties.Activity + '</b>' + "<br>Note:" + feature.properties.Note;
    layer.bindTooltip(content);
}*/


//remove leaftlet intial zoom buttons to allow for combined + / zoom to extent / - button
map.removeControl(map.zoomControl);

//pass the name of the div / sidebar - to put the search component area and possibly legend
//sidebar was removed to allow for buttons surrounding the map allowing for a better view of the map.
//this line needs to remain it is linked to the modal prompt
ctlSidebar = L.control.sidebar('sidebar').addTo(map);

//the button icon is not showing up. using bootstrap glypicon graphic
ctlEasyButton = L.easyButton('<img src="images/arrow.png">', function() {
    // alert('you just clicked the html entity \&target;');
    ctlSidebar.toggle();
//add information for when hover over the icon
}, 'Open / Close for Search Options, Reviews and additional information').addTo(map);




/*var searchControlLabel = L.layerGroup();
    searchControlLabel.addLayer(baseball);
    searchControlLabel.addLayer(football);
    searchControlLabel.addLayer(trail);

searchControlLabel.removeLayer(football);*/

//search control for POI
var searchControl = new L.Control.Search({
    //dataType: "json",
    container: 'search-container',
    layer: poi,
    //layer: searchControlLabel,
    propertyName: 'Location',
    textPlaceholder: 'Choose Activity and Site',
    initial: true,
    collapsed: false,
    autoResize: false,
    hideMarkerOnCollapse: true,


    moveToLocation: function(latlng) {
        console.log(latlng +" Coordinates");
        map.setView(latlng, 18); // set the zoom
        $("leaflet-pane leaflet-marker-pane img").css("display", "none");
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

//get corrdinates on map
//option to remove alert and just place inside the lat/long boxes with a note for user to click on the map
//maybe activate with button?
/*
map.on('click', function(e) {
    alert("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)
});

*/
//works just need to connect to the get location button and populate fields.
var getlat;
var getlng;


map.on('click', function(e) {
    console.log(e.latlng);  //So you can see if it's working
    getlat = e.latlng.lat
    getlng = e.latlng.lng;
    placeCoordinates(getlat, getlng);
});


placeCoordinates();
/*placeParkName();*/

// comment - form / inserting information into the review table on carto
$("#comment-form").submit(function(event) {
    event.preventDefault();
    // obtain values form input;
    var name = $("#name").val();
    var message = $("#message").val();
    var date = $("#date").val();
    var parkName = $("#ParkName").val();
    var lat1 = $("#lat").val();
    var long1 = $("#long").val();
    // https://sschoenborn.carto.com/api/v2/sql?q=
    // INSERT%20INTO%20review%20(comment,%20name,%20date,
    // %20park_name,%20the_geom)%20VALUES(%27home%27,%20%27Sarah%27,
    // %272020/05/09%27,%27Centennial%27,%27-77.441,38.754%27)&
    // api_key=4175dcc0408406889ae7c465ef2af9e9ae64709e
    var query=`INSERT INTO review (comment, name, date, park_name, latitude, longitude) VALUES('${message}','${name}','${date}','${parkName}',${lat1},${long1})`;
    var url = `https://sschoenborn.carto.com/api/v2/sql?q=${query}&api_key=4175dcc0408406889ae7c465ef2af9e9ae64709e`;
    //url = url.replace("\"", "\'");
    getData(encodeURI(url))
        .done(function(data){
            alert("The data was inserted" + JSON.stringify(data));
            $("#comment-form")[0].reset();
            placeCoordinates();
        })
        .fail(function(error){
            alert("The data was NOT inserted" + JSON.stringify(error));
        });

});


function getData (urlParam){
    return $.get(urlParam);
}


/*function placeParkName(){
    $("#ParkName").val("Signal Hill Park");
}*/


//put place holder in lat/lng fields
function placeCoordinates(latitude,longitude){
    $("#lat").val(latitude? parseFloat(latitude).toFixed(3): parseFloat(parkLatitude).toFixed(3));
    $("#long").val(longitude? parseFloat(longitude).toFixed(3): parseFloat(parkLongitude).toFixed(3));
}


// connected to review table and pulls all results in table
function getreview(){
    var sql = new cartodb.SQL({user: 'sschoenborn'});
    sql.execute("SELECT COMMENT, DATE FROM review")
        .done(function (data) {
            $("#main").css("display", "none");
            $("#comment-content").css("display", "block");
            $("#comment-content").html('');
            $("#comment-content").html(data.rows.map(x => `<div><h2>Review: ${x.comment}</h2><p>Date: ${fixDate(x.date)}</p></div>`));
            $("#comment-content").append($('<button>').text('Main Page').click(function(){
                $("#main").css("display", "block");
                $("#comment-content").css("display", "none");
            }));
            //console.log(data.rows);
        })
        .error(function (errors) {
            // errors contains a list of errors
            console.log("errors:" + errors);
        })
}

function fixDate(d){
    var arr = d.slice(0, d.indexOf('T')).split("-");
    return `${arr[1]}/${arr[2]}/${arr[0]}`;//.replaceAll("-","/");
}
/*function createMarkerObj (lat, lon)
{
    return {"type":"FeatureCollection", "features": [
            {"type":"Feature","geometry":{"type":"Point","coordinates":[lon, lat]},"properties":{"Review":"Review", "Note":"Some Review"}}
        ]};
}*/






