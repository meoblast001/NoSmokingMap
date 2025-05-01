var L = require('leaflet');
require('leaflet/dist/leaflet.css')   ;
/* This code is needed to properly load the images in the Leaflet CSS */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

console.debug(require('leaflet/dist/images/marker-icon.png'));

const map = L.map('map');
const defaultCenter = [52.520008, 13.404954];
const defaultZoom = 11;
const basemap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
});
const marker = L.marker(defaultCenter);

map.setView(defaultCenter,  defaultZoom);

basemap.addTo(map);
marker.addTo(map);