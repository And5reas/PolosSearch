// mapa.js
import * as widget from './mapWidgets.js';
import { buscarPolosProx } from './api.js';
import { popUpContent } from './components.js';
import { inputRaio } from './elements.js';
import { interpolacaoLinearInversa } from './utils.js'

const map = L.map('map');
const layer = L.layerGroup().addTo(map);

const bounds = [];

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

map.on('dblclick', function (e) {
    setarRaio(e.latlng);

    buscarPolosProx(e.latlng.lat, e.latlng.lng, inputRaio.value)
    .then(geojson => carregarPolos(geojson));
});

export function carregarPolos(geojson, fit = false) {
    if (geojson.features) {
        L.geoJSON(geojson, {
            pointToLayer: function (feature, latlng) {
                bounds.push([latlng.lat, latlng.lng]);
                return L.marker(latlng, { icon: feature.properties.status === 'R' ? widget.iconProcurado0 : widget.iconPadrao });
            },
            onEachFeature: function (feature, layer) {
                layer.bindPopup(popUpContent(feature.properties));
            },
        }).addTo(layer);

        if (fit) {
            // Ajusta o mapa para exibir todos os marcadores
            map.fitBounds(L.latLngBounds(bounds));
        }
    }
}

export function setarRaio(point) {
    layer.clearLayers();

    const marker = L.marker([point.lat, point.lng], { icon: widget.iconProcurado }).addTo(layer);

    layer.addLayer(widget.pesquisaRaio(point, inputRaio.value));

    map.flyTo([point.lat, point.lng], interpolacaoLinearInversa((inputRaio.value ? inputRaio.value * 1000 : 100000), 1000, 100000, 8, 12));

    marker.openPopup();
}