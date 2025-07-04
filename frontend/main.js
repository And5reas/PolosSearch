import * as api from './src/js/api.js';
import * as map from './src/js/mapa.js';
import { btnBuscar, inputRaio, selectCidade } from './src/js/elements.js';

async function handleSearch() {
    const cidade = await api.buscarCidade(JSON.parse(selectCidade.value))

    map.setarRaio(cidade);

    api.buscarPolosProx(cidade.lat, cidade.lon, inputRaio.value)
    .then(geojson => map.carregarPolos(geojson));
}

// Carregando informações que dependem de APIs
api.IBGE().then(res => {
    res.forEach(IBGE_API => {
        const { nome, microrregiao } = IBGE_API;
        let uf = '';
        try {
            uf = microrregiao.mesorregiao.UF.sigla;
        } catch {
            uf = IBGE_API["regiao-imediata"]["regiao-intermediaria"].UF.sigla;
        }
        const option = document.createElement('option');
        option.value = JSON.stringify({ nome, uf });
        option.textContent = `${nome} - ${uf}`;
        selectCidade.appendChild(option);
    });
});

api.buscarEnderecosPolos()
.then(geojson => map.carregarPolos(geojson, true));

btnBuscar.addEventListener('click', () => {
    if (!selectCidade.value) {
        location.reload();
        return;
    }

    handleSearch();
});

selectCidade.addEventListener('change', () => {
    handleSearch();
});