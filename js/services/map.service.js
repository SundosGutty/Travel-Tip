"use strict";

import { controller } from "../map.controller.js";
import { locService } from "./loc.service.js";
import { utilsService } from "./utils.js";

export const mapService = {
  initMap,
  addMarker,
  panTo,
  sendLocation,
  closeInfoWindow,
  initMarkers,

};

var gMap;
var currInfoWindow;
var gMarkers = [];


function initMap(lat = 32.0749831, lng = 34.9120554) {
  controller.renderLocs();
  console.log("InitMap");
  return _connectGoogleApi().then(() => {
    console.log("google available");
    const myLatLng = { lat, lng };
    gMap = new google.maps.Map(document.querySelector("#map"), {
      center: myLatLng,
      zoom: 15,
    });
    var locContent = "Click the map to get Lat/Lng!";

    let infoWindow = new google.maps.InfoWindow({
      content: locContent,
      position: myLatLng,
    });

    infoWindow.open(gMap);
    // Configure the click listener.
    gMap.addListener("click", (mapsMouseEvent) => {
      const pos = {
        lat: mapsMouseEvent.latLng.lat(),
        lng: mapsMouseEvent.latLng.lng(),
      };
      let info = editInfoWindow(pos);
      // Close the current InfoWindow.
      infoWindow.close();
      // Create a new InfoWindow.
      infoWindow = new google.maps.InfoWindow({
        position: mapsMouseEvent.latLng,
      });
      currInfoWindow = infoWindow;
      infoWindow.setContent(info);
      infoWindow.open(gMap);
    });
  });
}

function closeInfoWindow() {
  currInfoWindow.close();
}

function addMarker(loc) {
  var marker = new google.maps.Marker({
    draggable: true,
    position: loc,
    id: utilsService.makeId(),
    map: gMap,
    title: "Hello World!",
  });
  marker.addListener("click", toggleBounce);

  marker.addListener("dblclick", () => {
   locService.updateLoc(marker.position)
  });

  gMarkers.push(marker)
  return marker;

  function toggleBounce() {

      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(()=>{marker.setAnimation()}, 2000,null);
      }
}

function panTo(lat, lng) {
  var laLatLng = new google.maps.LatLng(lat, lng);
  gMap.panTo(laLatLng);
}

function _connectGoogleApi() {
  if (window.google) return Promise.resolve();
  const API_KEY = "AIzaSyAUa9etRbJHXatY5NPGcT4Qej9HqCsTqTg"; //TODO: Enter your API Key
  var elGoogleApi = document.createElement("script");
  elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
  elGoogleApi.async = true;
  document.body.append(elGoogleApi);

  return new Promise((resolve, reject) => {
    elGoogleApi.onload = resolve;
    elGoogleApi.onerror = () => reject("Google script failed to load");
  });
}

function editInfoWindow(pos) {
  console.log(pos);
  return `<ul class="info-list">
             <li>New location</li>
             <li><button class="save-btn" onclick="onSaveLocation({lat:${pos.lat},lng: ${pos.lng}})">Save Place</button></li></ul>`;
}

function initMarkers(locs){
  locs.forEach(loc => addMarker({ lat: loc.lat, lng: loc.lng }, loc.id))
}

function sendLocation(val) {
  return axios
    .get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${val}&key=AIzaSyAUa9etRbJHXatY5NPGcT4Qej9HqCsTqTg`
    )
    .then((res) => {
      let data = res.data.results[0].geometry.location;
      var laLatLng = new google.maps.LatLng(data.lat, data.lng);
      gMap.panTo(laLatLng);
    });
}
