"use strict";

import { storageService } from "./storage-service.js";
import { controller } from "../map.controller.js";
import { utilsService } from "./utils.js";

export const locService = {
  getLocs,
  saveLocation,
  deleteLoc,
  updateLoc,
};

const LOC_KEY = "locationsDB";
const locs = storageService.load(LOC_KEY) || [];

async function getLocs() {
  try {
    let locations = await storageService.load(LOC_KEY);
    if (locations || location.length) {
      return locations;
    } else {
      return [];
    }
  } catch (err) {
    console.log("err", err);
  }
}

function saveLocation(loc) {
  let placeName = prompt("Where are We?");

  const infoToSave = {
    name: placeName,
    id: utilsService.makeId(),
    lat: loc.lat,
    lng: loc.lng,
    marker: {lat: loc.lat,  lng: loc.lng},
    createdAt: new Date().toUTCString(),
    updatedAt: new Date().toUTCString(),
  };

  locs.push(infoToSave);
  storageService.save(LOC_KEY, locs);
  controller.renderLocs();
}

function deleteLoc(id) {
  const idx = locs.findIndex((loc) => {
    return loc.id === id;
  });
  console.log(idx);
  locs.splice(idx, 1);
  storageService.save(LOC_KEY, locs);
  controller.renderLocs();
}

function updateLoc(id, date) {
  const idx = locs.findIndex((loc) => {
    return loc.id === id;
  });
  let newName = prompt("Update Name here!");
  locs[idx].name = newName;
  locs[idx].updatedAt = date;
  console.log(locs[idx].name);
  storageService.save(LOC_KEY, locs);
  controller.renderLocs();
}
