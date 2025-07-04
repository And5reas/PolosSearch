// utils.js
export function formatarDistancia(metros) {
  return metros >= 1000 ? (metros / 1000).toFixed(1) + ' km' : metros + ' m';
}

export function interpolacaoLinearInversa(x, inMin, inMax, outMin, outMax) {
  return (x > inMin && x < inMax) ? Math.round(outMax - ((x - inMin) * (outMax - outMin)) / (inMax - inMin)) : 7;
}

export function normalizeString(text) {
  // 1. Deixar em upperCase
  const upper = text.toUpperCase();

  // 2. Remove acentuações
  const semAcentos = upper.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // 3. Remove caracteres especiais, mantendo letras, números e espaços
  const limpo = semAcentos.replace(/[^a-zA-Z0-9\s]/g, "");

  return limpo
}