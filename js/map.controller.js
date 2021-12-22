import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'


export const controller = {
    renderLocs,

}


window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetUserPos = onGetUserPos;
window.onSaveLocation = onSaveLocation;
window.onSendSearch = onSendSearch;
window.onDeleteLoc = onDeleteLoc;
window.showWeather = showWeather;
window.onUpdateLoc = onUpdateLoc;

function onInit() {
    mapService.initMap()
    .then(() => {
        locService.getLocs()
            .then(mapService.initMarkers)
    })
        .catch(() => console.log('Error: cannot init map'));
    renderLocs()
}


// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}


function onAddMarker() {
    console.log('Adding a marker');
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}


function renderLocs() {
    locService.getLocs()
        .then(locs => {
            var strHtml = locs.map(loc => {
                document.querySelector('.user-pos').innerText = loc.name
                return `<ul>
                <li><h4>Location name: ${loc.name}</h4></li>
                <li>Lat: ${loc.lat}</li>
                <li>Lng: ${loc.lng}</li>
                <li>Created at: ${loc.createdAt}</li>
                <li>Updated at: ${loc.updatedAt}</li>
                <div class="btn-container">
                <li><button class="act-btn" onclick="onPanTo(${loc.lat}, ${loc.lng})">GO!</button></li>
                <li><button class="act-btn" onclick="onDeleteLoc('${loc.id}')">Delete!</button></li>
                <li><button class="act-btn" onclick="onUpdateLoc('${loc.id}')">Update!</button></li>
                </div>
           </ul>`
            }).join('')
            document.querySelector('.my-saved-locations').innerHTML = strHtml
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
            mapService.panTo(pos.coords.latitude, pos.coords.longitude)
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}


function onPanTo(lat, lng) {
    console.log('Panning the Map');
    mapService.panTo(lat, lng);
    showWeather(lat, lng)

}

function onSaveLocation(pos) {
    mapService.addMarker(pos)
    locService.saveLocation(pos)
    mapService.closeInfoWindow()
}

function onSendSearch(val) {
    mapService.sendLocation(val)
    document.querySelector('.user-pos').innerText = val.toUpperCase()
}

function onDeleteLoc(id) {
    locService.deleteLoc(id)
}

function onUpdateLoc(id) {
    var date = new Date().toUTCString()
    locService.updateLoc(id, date)
}

document.querySelector('#pac-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        document.querySelector('.controls').value = ''
    }
})
