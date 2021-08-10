// const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');

/**
 * this function takes a single argument: a path to a PPM file and reads it
 * @function openPPM
 * @param {*} fileName , file with extension
 */
function openPPM(fileName) {
    const fs = require('fs');
    const contents = fs.readFileSync(fileName, 'utf-8');

    let data = contents.split(/\r\n|\n/);

    data = data.filter(line => line.trim().substring(0, 1) !=='#').join(' ');

    data = data.split(/\s/);
    data = data.filter(element => element.trim() !== '');
    // console.log(data);

    let width = data[1];
    let height = data[2];
    let pixelSize = (width * height) * 3;
    // console.log(pixelSize);

    let expectedSize = data.length - 4;
    // console.log(expectedSize);
    
    if ((data[0] == 'P3') && (data[3] == 255) && (pixelSize == expectedSize)) {
        
        for (let i =1; i < data.length; i++) {
            data[i] = parseInt(data[i]);
        }
        return data; 
    } else {
        return [];
    }
}

/**
 * this function returns the width of the ppm array
 * @function getWidth
 * @param {*} arr , 1D array
 */
function getWidth(arr) {
    let imgWidth = arr[1];
    return imgWidth;
}
/**
 * this function returns the height of the ppm array
 * @function getHeight
 * @param {*} arr , 1D array
 */
function getHeight(arr) {
    let imgHeight = arr[2];
    return imgHeight;
}
/**
 * this function returns the max val of the ppm file
 * @function getMaxval
 * @param {*} arr 
 */
function getMaxval(arr) {
    let maxVal = arr[3];
    return maxVal;
}
/**
 * this function removes the header and returns the array
 * @function removeHeader
 * @param {*} arr , 1D array
 */
function removeHeader(arr) {
    let newArr = [...arr];
    for (let i = 0; i < 4; i++) {
        newArr.shift();
    }
    return newArr;
}
/**
 * this function takes in two arguments and 
 * retuns a new single channel image array
 * @function singleChannelImageArray
 * @param {*} ppmValuesArray , array with only PPM values and no header
 * @param {*} color , color to be passed either red, green or blue
 */
function singleChannelImageArray(ppmValuesArray, color = 'red') {   
    let len = ppmValuesArray.length;
    let newArr = [];

    for (let counter = 0; counter < len; counter++) {
        if ((color == 'red') && (counter % 3 == 0)) {
            newArr.push(ppmValuesArray[counter]);
        } else if ((color == 'green') && (counter % 3 == 1)) {
            newArr.push(ppmValuesArray[counter]);
        } else if ((color == 'blue') && (counter % 3 == 2)) {
            newArr.push(ppmValuesArray[counter]);
        }
    }
    return newArr;
}

/**
 * this function takes in 5 arguments from the 5 parameters below and
 * returns true if the file gets written into a new file with only red,
 * green or blue pixels
 * @function singleChannelImage
 * @param {*} ppmValuesArray , array with only PPM values and no header
 * @param {*} width , width of the PPM file
 * @param {*} height , height of the PPM file
 * @param {*} imageOut , output file
 * @param {*} color , color to be passed either red, green or blue
 */
function singleChannelImage(ppmValuesArray, width, height, imageOut, color = 'red') {
    const fs = require('fs');
    const wtfile = fs.createWriteStream(imageOut);

    let arr = [...ppmValuesArray];
    let magicNum = 'P3';
    let maxVal = 255;
    let headerInfo = [`${magicNum}`, `${width}`, `${height}`, `${maxVal}`];

    headerInfo.forEach(headerVal => {
        wtfile.write(`${headerVal}\r\n`);
    });
    
    // let remainder = 0;
    let length = arr.length;
    
    if (color == 'red') {
        for (let count = 0; count < length; count++) {
            let elements = arr[count];
            if (count % 3 == 0) {
                // process.stdout.write(`${elements} `);
                // process.stdout.write(`0 0\r\n`);
                wtfile.write(`${elements} `);
                wtfile.write(`0 0\r\n`);
            }
        }
        return true;
    } else if (color == 'green') {
        for (let count = 0; count < length; count++) {
            let elements = arr[count];
            if (count % 3 == 1) {
                // process.stdout.write(`0 `);
                // process.stdout.write(`${elements} `);
                // process.stdout.write(`0\r\n`);

                wtfile.write(`0 `);
                wtfile.write(`${elements} `);
                wtfile.write(`0\r\n`);
            }
        }
        return true;
    } else if (color == 'blue') {
        for (let count = 0; count < length; count++) {
            let elements = arr[count];
            if (count % 3 == 2) {
                // process.stdout.write(`0 0 `);
                // process.stdout.write(`${elements}\r\n`);

                wtfile.write(`0 0 `);
                wtfile.write(`${elements}\r\n`);
            }
        }
        return true;
    }
    return false;
}

/**
 * this function writes into a new file a greyscaled PPM file and
 * returns true if it gets read and written
 * @function toGreyscale
 * @param {*} ppmValuesArray ,array with only PPM values and no header
 * @param {*} width ,width of the PPM file
 * @param {*} height ,height of the PPM file
 * @param {*} imageOut , output file
 */
function toGreyscale(ppmValuesArray, width, height, imageOut) {
    const fs = require('fs');
    const wtfile = fs.createWriteStream(imageOut);

    let magicNum = 'P3';
    let maxVal = 255;
    let headerInfo = [`${magicNum}`, `${width}`, `${height}`, `${maxVal}`];

    headerInfo.forEach(headerVal => {
        wtfile.write(`${headerVal}\r\n`);
    });

    let arr = [...ppmValuesArray];

    let sum = 0;
    let avg = 0;
    let count = 0;
    do {
        sum = arr[count] + arr[count+1] + arr [count+2];
        avg = Math.round(sum/3);
        wtfile.write(`${avg} ${avg} ${avg}\r\n`);
        count = count+3;
    } while (count < arr.length);
    return true;
}

/**
 * this function returns true if the file with an inverted color values
 * get written successfully
 * @param {*} ppmValuesArray ,array with only PPM values and no header 
 * @param {*} width ,width of the PPM file
 * @param {*} height ,height of the PPM file
 * @param {*} maxval ,maximum value of the PPM file
 * @param {*} imageOut ,output file
 */
function toInverted(ppmValuesArray, width, height, maxval, imageOut) {
    const fs = require('fs');
    const wtfile = fs.createWriteStream(imageOut);

    let magicNum = 'P3';
    // let maxval = 255;
    let headerInfo = [`${magicNum}`, `${width}`, `${height}`, `${maxval}`];

    headerInfo.forEach(headerVal => {
        wtfile.write(`${headerVal}\r\n`);
    });

    let arr = [...ppmValuesArray];
    arr.forEach(elt => {
        let newVal = maxval - elt;
        wtfile.write(`${newVal} `);
    });
    return true;
}

/**
 * this function changes color temperature of the given image file and
 * writes it to a new file and returns true if successful
 * @param {*} ppmValuesArray ,array with only PPM values and no header
 * @param {*} width ,width of the PPM file
 * @param {*} height ,height of the PPM file
 * @param {*} maxval , maximum value of the PPM file
 * @param {*} imageOut ,output file
 * @param {*} tempChange ,value by which the pixel values change
 */
function adjustTemp(ppmValuesArray, width, height, maxval, imageOut, tempChange) {
    const fs = require('fs');
    const wtfile = fs.createWriteStream(imageOut);

    let arr = [...ppmValuesArray];
    let magicNum = 'P3';
    // let maxval = 255;
    let headerInfo = [`${magicNum}`, `${width}`, `${height}`, `${maxval}`];

    headerInfo.forEach(headerVal => {
        wtfile.write(`${headerVal}\r\n`);
    });

    // default value of 30 if no value is specified or 
    //if an invalid value is specified.
    if ((tempChange >= (-1)*maxval) && (tempChange <= maxval)) {
        tempChange = tempChange;
    } else {
        tempChange = 30;
    }
    let count = 0;
    if ((tempChange >= 0) && (tempChange <= maxval)) {
        arr.forEach(elt => {
            if (count % 3 === 0) {
                let red = Math.min(maxval, elt + tempChange);
                wtfile.write(`${red} `);
            } else if (count % 3 === 1) {
                wtfile.write(`${elt} `);
            } else if (count % 3 === 2) {
                let blue = Math.max(0, elt - tempChange);
                wtfile.write(`${blue}\r\n`);
            }
            count++;
        });
        return true;
    } else if ((tempChange <= 0) && (tempChange >= (-1)*maxval)) {
        arr.forEach(elt => {
            if (count % 3 === 0) {
                let red = Math.max(0, elt + tempChange);
                wtfile.write(`${red} `);
            } else if (count % 3 === 1) {
                wtfile.write(`${elt} `);
            } else if (count % 3 === 2) {
                let blue = Math.min(maxval, elt - tempChange);
                wtfile.write(`${blue}\r\n`);
            }
            count++;
        });
        return true;
    }
    return false;
}

/**
 * this function changes the tint of the image file and
 * writes it to a new file and returns true if successful
 * @function adjustTint
 * @param {*} imageIn ,input file
 * @param {*} imageOut ,output file
 * @param {*} tintChange ,value by which the green pixel value changes
 */
function adjustTint (imageIn, imageOut, tintChange) {
    let newImgArray = openPPM(imageIn);
    let width = getWidth(newImgArray);
    let height = getHeight(newImgArray);
    let maxval = getMaxval(newImgArray);
    let pixelValuesOnly = removeHeader(newImgArray);

    const fs = require('fs');
    const wtfile = fs.createWriteStream(imageOut);

    let arr = [...pixelValuesOnly];
    let magicNum = 'P3';
    
    // let maxval = 255;
    let headerInfo = [`${magicNum}`, `${width}`, `${height}`, `${maxval}`];

    headerInfo.forEach(headerVal => {
        wtfile.write(`${headerVal}\r\n`);
    });

    // default value of 30 if no value is specified or 
    //if an invalid value is specified.
    if ((tintChange >= (-1)*maxval) && (tintChange <= maxval)) {
        tintChange = tintChange;
    } else {
        tintChange = 30;
    }
    let count = 0;
    if ((tintChange >= 0) && (tintChange <= maxval)) {
        arr.forEach(elt => {
            if (count % 3 === 0) {
                wtfile.write(`${elt} `);
            } else if (count % 3 === 1) {
                let green = Math.min(maxval, elt + tintChange);
                wtfile.write(`${green} `);
            } else if (count % 3 === 2) {
                wtfile.write(`${elt}\r\n`);
            }
            count++;
        });
        return true;
    } else if ((tintChange <= 0) && (tintChange >= (-1)*maxval)) {
        arr.forEach(elt => {
            if (count % 3 === 0) {
                wtfile.write(`${elt} `);
            } else if (count % 3 === 1) {
                let green = Math.max(0, elt + tintChange);
                wtfile.write(`${green} `);
            } else if (count % 3 === 2) {
                wtfile.write(`${elt}\r\n`);
            }
            count++;
        });
        return true;
    }
    return false;
}

/**
 * The function will write out to imageOut a version of the image
 * whose pixel tuples are averaged with their neighbors.
 * @param {*} imageIn , input file
 * @param {*} imageOut , output file
 */
function toSmooth(imageIn, imageOut){
    let newImgArray = openPPM(imageIn);
    let width = getWidth(newImgArray);
    let height = getHeight(newImgArray);
    let maxval = getMaxval(newImgArray);
    let pixelValuesOnly = removeHeader(newImgArray);

    const fs = require('fs');
    const wtfile = fs.createWriteStream(imageOut);

    let magicNum = 'P3';
    let headerInfo = [`${magicNum}`, `${width}`, `${height}`, `${maxval}`];
    headerInfo.forEach(headerVal => {
        wtfile.write(`${headerVal}\r\n`);
    });

    let arr = [...pixelValuesOnly];
    
    let redArr2D = [];
    let redArr = singleChannelImageArray(arr, 'red');
    // console.log({redArr});
    while (redArr.length > 0) {
        redArr2D.push(redArr.splice(0,5))
    }
    console.log({redArr2D});

    let greenArr2D = [];
    let greenArr = singleChannelImageArray(arr, 'green');
    // console.log({greenArr});
    while (greenArr.length > 0) {
        greenArr2D.push(greenArr.splice(0,5))
    }
    console.log({greenArr2D});

    let blueArr2D = [];
    let blueArr = singleChannelImageArray(pixelValuesOnly, 'blue');
    // console.log({blueArr});
    while (blueArr.length > 0) {
        blueArr2D.push(blueArr.splice(0,5))
    }
    console.log({blueArr2D});
    
    let arr2D = [];
    let counter = 0;
    while (arr.length > 0) {
        arr2D.push(arr.splice(0, 3));
        counter++;
    }
    // console.log({arr2D});

    let redAvg = [];
    // let nTotal = 0;
    let distances = [-1, 0, 1];
    for (let i = 0; i < redArr2D.length; i++) {
        let newRow = [];
        for (let j = 0; j < redArr2D[i].length; j++) {
        let count = 0;
        let redSum = 0;
        if (count % 3 === 0) {
            distances.forEach(d_i => {
                distances.forEach(d_j => {
                    if ((i + d_i) < 0 || 
                        (j + d_j) < 0 || 
                        (i + d_i) >= redArr2D[i].length ||
                        (j + d_j) >= redArr2D.length) {
                    } else {
                        redSum += redArr2D[i + d_i][j + d_j];
                        count++;
                        // nTotal++;
                    }
                });
            });
        }
        let avgVal = Math.round(redSum/count);
        newRow.push(avgVal);
        }
    redAvg.push(newRow);
    }
    console.log({redAvg});

    let greenAvg = [];
    for (let i = 0; i < greenArr2D.length; i++) {
        let newRow = [];
        for (let j = 0; j < greenArr2D[i].length; j++) {
        let count = 0;
        let greenSum = 0;
        if (count % 3 === 0) {
            distances.forEach(d_i => {
                distances.forEach(d_j => {
                    if ((i + d_i) < 0 || 
                        (j + d_j) < 0 || 
                        (i + d_i) >= greenArr2D[i].length ||
                        (j + d_j) >= greenArr2D.length) {
                    } else {
                        greenSum += greenArr2D[i + d_i][j + d_j];
                        count++;
                    }
                });
            });
        }
        let avgVal = Math.round(greenSum/count);
        newRow.push(avgVal);
        }
    greenAvg.push(newRow);
    }
    console.log({greenAvg});

    let blueAvg = [];
    for (let i = 0; i < blueArr2D.length; i++) {
        let newRow = [];
        for (let j = 0; j < blueArr2D[i].length; j++) {
        let count = 0;
        let blueSum = 0;
        if (count % 3 === 0) {
            distances.forEach(d_i => {
                distances.forEach(d_j => {
                    if ((i + d_i) < 0 || 
                        (j + d_j) < 0 || 
                        (i + d_i) >= blueArr2D[i].length ||
                        (j + d_j) >= blueArr2D.length) {
                    } else {
                        blueSum += blueArr2D[i + d_i][j + d_j];
                        count++;
                    }
                });
            });
        }
        let avgVal = Math.round(blueSum/count);
        newRow.push(avgVal);
        }
    blueAvg.push(newRow);
    }
    console.log({blueAvg});

    // let newPixelArray = [];
    let pixelString = '';
    for (let i = 0; i < redAvg.length; i++) {
        // let empty = [];
        for (let j = 0; j < redAvg[0].length; j++) {
            pixelString = pixelString + redAvg[i][j] + ' ' + greenAvg[i][j] + ' ' + blueAvg[i][j] + '\n';
            // newPixelArray = redAvg[i][j] + ' ' + greenAvg[i][j] + ' ' + blueAvg[i][j] + '\n';
            // empty.push(redAvg[i][j]);
            // empty.push(greenAvg[i][j]);
            // empty.push(blueAvg[i][j]);
        }
        // newPixelArray.push(empty);
    }
    process.stdout.write(`${pixelString}\r\n`);
    // console.log({newPixelArray});
    wtfile.write(`${pixelString}\r\n`);
    return true;
    // return false;

    // let len = width * height;
    // for (let i = 0; i < height; i++){
    //     let emptyArray = [];
    //     for (let j = 0; j < width; j++){
    //         emptyArray.push(redAvg[i][j]);
    //         emptyArray.push(greenAvg[i][j]);
    //         emptyArray.push(blueAvg[i][j]);
    //     }
    //     newPixelArray.push(emptyArray);
    //     console.log({newPixelArray});
    // }
}

module.exports.openPPM = openPPM;
module.exports.getWidth = getWidth;
module.exports.getHeight = getHeight;
module.exports.getMaxval = getMaxval;
module.exports.removeHeader = removeHeader;
module.exports.singleChannelImageArray = singleChannelImageArray;
module.exports.singleChannelImage = singleChannelImage;
module.exports.toGreyscale = toGreyscale;
module.exports.toInverted = toInverted;
module.exports.adjustTemp = adjustTemp;
module.exports.adjustTint = adjustTint;
module.exports.toSmooth = toSmooth;
// module.exports.
// module.exports.