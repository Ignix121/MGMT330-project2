/**
 * @file This file works with the image files,
 * makes changes to the pixel values to get different tones of the
 * image file like greyscale, inverted, adjust temperatures and tints and
 * writes it to a new file
 * @author PRAKAT BHATTA <pbhatta@unm.edu>
 * 
 */
const ppm = require('./modules/paint.js');
const api = require('./modules/api.js');


let ppmArray = ppm.openPPM('demo-254-8x6.ppm');
console.log({ppmArray});

let width = ppm.getWidth(ppmArray);
console.log({width});

let height = ppm.getHeight(ppmArray);
console.log({height});

let maxVal = ppm.getMaxval(ppmArray);
console.log({maxVal});

let pixelValuesOnly = ppm.removeHeader(ppmArray);
console.log({pixelValuesOnly});

let redArray = ppm.singleChannelImageArray(pixelValuesOnly, 'red');
console.log({redArray});

let greenArray = ppm.singleChannelImageArray(pixelValuesOnly, 'green');
console.log({greenArray});

let blueArray = ppm.singleChannelImageArray(pixelValuesOnly, 'blue');
console.log({blueArray});


// let newppmArray = ppm.openPPM('./demo-254-8x6-complex.ppm');
let newppmArray = ppm.openPPM('./csl-image-file.ppm');
// let newppmArray = ppm.openPPM('./demo-254-8x6-no-comment.ppm');
let width1 = ppm.getWidth(newppmArray);
let height1 = ppm.getHeight(newppmArray);
let maxval1 = ppm.getMaxval(newppmArray);
let pixelValuesOnly1 = ppm.removeHeader(newppmArray);
ppm.singleChannelImage(pixelValuesOnly1, width1, height1,'./sample-image-red.ppm', 'red');
ppm.singleChannelImage(pixelValuesOnly1, width1, height1,'./sample-image-green.ppm', 'green');
ppm.singleChannelImage(pixelValuesOnly1, width1, height1,'./sample-image-blue.ppm', 'blue');

console.log(ppm.singleChannelImage(pixelValuesOnly1, width1, height1,'./csl-image-file-RED.ppm', 'red'));
console.log(ppm.singleChannelImage(pixelValuesOnly1, width1, height1,'./csl-image-file-GREEN.ppm', 'green'));
console.log(ppm.singleChannelImage(pixelValuesOnly1, width1, height1,'./csl-image-file-BLUE.ppm', 'blue'));

console.log(ppm.toGreyscale(pixelValuesOnly1, width1, height1, './csl-image-file-GREY.ppm'));

ppm.toInverted(pixelValuesOnly1, width1, height1, maxval1, './sample-image-inv.ppm');

console.log(ppm.adjustTemp(pixelValuesOnly1, width1, height1, maxval1, './sample-image-warmTemp.ppm'));
let temp = -45;
console.log(ppm.adjustTemp(pixelValuesOnly1, width1, height1, maxval1, './sample-image-coolTemp.ppm', temp));

console.log(ppm.adjustTint('01.ppm', './sample-image-tint.ppm', -45));

let newImgArray = ppm.openPPM('./5x5-image-smooth-test.ppm');
let pixelValuesOnly2 = ppm.removeHeader(newImgArray);

ppm.toSmooth('./5x5-image-smooth-test.ppm', './sample-image-smooth.ppm');
// ppm.toSmooth('./csl-image-file.ppm', './csl-image-file-smooth.ppm');
// ppm.toSmooth('./3x4-image.ppm', './3x4-image-smooth.ppm');
