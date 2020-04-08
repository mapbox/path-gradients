const polyline = require('@mapbox/polyline');
const urlencode = require('urlencode');
const { createSpectrum, rgbToHexString, hexStringToRGB } = require('./colorUtils');

// In [lat, lng] order, which matches the polyline library. If your data is in the opposite order, use the swapLngLat function from coordsUtils.
const coords = [[41.91176, -87.632], [41.91307, -87.63279], [41.91323, -87.6323], [41.91329, -87.63203], [41.91331, -87.6318], [41.9133, -87.63153], [41.91328, -87.63123], [41.91319, -87.63083], [41.91309, -87.63049], [41.91301, -87.63027], [41.91254, -87.62928], [41.91238, -87.62894], [41.91231, -87.6287], [41.91225, -87.62842], [41.91223, -87.62827], [41.91222, -87.62806], [41.91223, -87.62778], [41.91227, -87.62728], [41.91231, -87.6269], [41.9123, -87.6267], [41.91227, -87.62657], [41.91222, -87.62649], [41.91217, -87.62644], [41.91212, -87.6264], [41.91189, -87.62633], [41.91145, -87.62619], [41.9104, -87.62597], [41.90941, -87.62592], [41.90922, -87.62589], [41.90888, -87.62582], [41.90783, -87.62558], [41.90649, -87.62524], [41.90517, -87.62492], [41.90404, -87.62464], [41.90313, -87.62437], [41.90283, -87.62426], [41.90254, -87.6241], [41.90233, -87.62393], [41.902, -87.62359], [41.90179, -87.62329], [41.90163, -87.62296], [41.90149, -87.62263], [41.90139, -87.62228], [41.90133, -87.62201], [41.90127, -87.6216], [41.90124, -87.62105], [41.90121, -87.62032], [41.90117, -87.62011], [41.9011, -87.61994], [41.90099, -87.61973], [41.90088, -87.61959], [41.90071, -87.61947], [41.89993, -87.61896], [41.89905, -87.61837], [41.89694, -87.61696], [41.89353, -87.61463], [41.89302, -87.61427], [41.89261, -87.6142], [41.89167, -87.61422], [41.89018, -87.61424], [41.88785, -87.61419], [41.88538, -87.61409], [41.88481, -87.61414], [41.88448, -87.6143], [41.88405, -87.61461], [41.88377, -87.61496], [41.8836, -87.61524], [41.88345, -87.61553], [41.88336, -87.61574], [41.8832, -87.61612], [41.88302, -87.61648], [41.88283, -87.61673], [41.8827, -87.61689], [41.88253, -87.61705], [41.88224, -87.61726], [41.88199, -87.61739], [41.88179, -87.61745], [41.88162, -87.61749], [41.88093, -87.61751], [41.88086, -87.62201]];

const startColor = '#FF512F';
const endColor = '#F09819';
const strokeWidth = 4;
const mapboxToken = ''; // add your Mapbox token here

const colorA = hexStringToRGB(startColor);
const colorB = hexStringToRGB(endColor);
const spectrumColors = createSpectrum(colorA, colorB, coords.length - 1);

function makePathWithGradient() {
  const pathStrings = [];

  for (let i = 0; i < coords.length - 1; i++) {
    const path = polyline.encode([coords[i], coords[i + 1]]);
    pathStrings.push(`path-${strokeWidth}+${spectrumColors[i]}(${path})`); // format from https://docs.mapbox.com/api/maps/#path
  }

  return pathStrings.join(',');
}

const firstCoord = coords[0];
const lastCoord = coords[coords.length - 1];
const startMarker = `pin-s-a+${rgbToHexString(colorA)}(${firstCoord[1]},${firstCoord[0]})`;
const endMarker = `pin-s-b+${rgbToHexString(colorB)}(${lastCoord[1]},${lastCoord[0]})`;

const pathWithGradient = makePathWithGradient() + ',' + startMarker + ',' + endMarker;

function makeOutput() {
  const args = process.argv.slice(2);

  const rawPathGradient = args.indexOf('-r') !== -1;
  if (rawPathGradient) {
    return pathWithGradient;
  }

  const makeFullUrl = args.indexOf('-f') !== -1;
  if (makeFullUrl) {
    return `https://api.mapbox.com/styles/v1/mapbox/light-v9/static/${urlencode(pathWithGradient)}/auto/700x700?access_token=${mapboxToken}`;
  }

  return urlencode(pathWithGradient);
}

console.log(makeOutput());
