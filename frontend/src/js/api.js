// api.js
export async function buscarCidade(cidadeInfo) {
  const { nome, uf } = cidadeInfo;
  const res = await fetch(`https://nominatim.openstreetmap.org/search?city="${nome}"&state=${uf}&country=Brazil&format=json`);
  let r = await res.json();
  r[0]['lng'] = r[0]['lon'];
  return r[0];
}

export async function IBGE(estadoUF = '') {
  const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/${estadoUF === '' ? '' : `estados/${estadoUF}/`}municipios?orderBy=nome`);
  return await res.json();
}

export async function buscarPolosProx(lat, lng, raio) {
  const res = await fetch(`http://polossearch.com:3000/polos-proximos?lat=${lat}&lon=${lng}${raio ? `&raio=${raio * 1000}` : ''}`);
  return await res.json();
}

export async function buscarEnderecosPolos() {
  const res = await fetch('http://polossearch.com:3000/get-polos-enderecos');
  return await res.json();
}

export async function buscarPolos() {
  const res = await fetch('http://polossearch.com:3000/get-polos');
  return await res.json();
}

export async function deletarPolo(id) {
  const res = await fetch(`http://polossearch.com:3000/del-polo?id=${id}`, {
    method: 'DELETE'
  });
  return await res.json();
}

export async function atualizarPolo(polo) {
  const res = await fetch('http://polossearch.com:3000/update-polo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
      body: JSON.stringify(polo)
  });
  return await res.json();
}

export async function adicionarPolo(polo) {
  const res = await fetch('http://polossearch.com:3000/add-polo', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
      body: JSON.stringify(polo)
  });
  return await res.json();
}