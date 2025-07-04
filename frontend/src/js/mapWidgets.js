// mapWidgets.js
export const iconPadrao = L.icon({
    iconUrl: 'src/imgs/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'src/imgs/marker-shadow.png',
    shadowSize: [41, 41],
    shadowAnchor: [12, 41]
});

export const iconProcurado0 = L.icon({
    iconUrl: 'src/imgs/marker-icon-desativado.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'src/imgs/marker-shadow.png',
    shadowSize: [41, 41],
    shadowAnchor: [12, 41]
});

export const iconProcurado = L.icon({
    iconUrl: 'src/imgs/marker-icon-fechado.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'src/imgs/marker-shadow.png',
    shadowSize: [41, 41],
    shadowAnchor: [12, 41]
});

export const pesquisaRaio = (point, raio) => L.circle([point.lat, point.lng], {
    radius: raio ? raio * 1000 : 100000,
    color: 'blue',
    fillColor: 'blue',
    fillOpacity: 0.1,
});