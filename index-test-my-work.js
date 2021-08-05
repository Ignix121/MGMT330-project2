/*
For the Final Project, the npm test command will provide a limited number of 
tests for you. You want to use npm test to see if you are headed in the right 
direction, but you will also want to call your functions and test them 
against other PPM files and inputs.

Use your index.js file to call your functions and test them against different 
files and inputs. As an example, I am providing you a look at what my 
index.js file looks like for testing purposes. 

Part of testing means trying different inputs. For the Final Project this 
means different PPM files and parameters to your functions. You want to 
make sure your functions can handle a range of inputs (including bad inputs).

I have provided you a test set of PPM files, but you might also want to 
consider creating your own to test your functions.
*/

// This is our module we are writing to read and 
// manipulate PPM files.
const ppm = require('./modules/paint.js');

// Read in a sample PPM file named 01.ppm
const ppmfile = './csl-image-file.ppm';
let fileContents = ppm.openPPM(ppmfile);
console.log(`[CHECK:] Ensure all but magic number are integer values and not in quotes.`);
console.log({fileContents});
console.log(`[CHECK:] Checks below for ${ppmfile} PPM image file.`)
console.log(`[CHECK:] Width must be 336: ${ppm.getWidth(fileContents)}`);
console.log(`[CHECK:] Height nust be 252: ${ppm.getHeight(fileContents)}`);
console.log(`[CHECK:] Maxval must be 255: ${ppm.getMaxval(fileContents)}`);

console.log(`[CHECK:] Values below must all be integer values and not include header values...`);
console.log(`[CHECK:] First few values are 58, 57, 71, 109, 109, ...`);
let imageNoHeader = ppm.removeHeader(fileContents);
console.log(imageNoHeader.slice(0, 5));

let redArray = ppm.singleChannelImageArray(imageNoHeader, 'red');
let greenArray = ppm.singleChannelImageArray(imageNoHeader, 'green');
let blueArray = ppm.singleChannelImageArray(imageNoHeader, 'blue');

console.log(`[CHECK:] First few values of red are 58, 109, 81, 4, 8, ...`);
console.log(redArray.slice(0, 5));

console.log(`[CHECK:] First few values of green are 57, 109, 81, 5, 9, ...`);
console.log(greenArray.slice(0, 5));

console.log(`[CHECK:] First few values of blue are 71, 121, 91, 10, 11, ...`);
console.log(blueArray.slice(0, 5));

// Write out a red image to a file.
let redImage = './csl-image-file-RED.ppm';
console.log(`[CHECK:] Check to see if you have a file named ${redImage} that is a "red" version of the image when opened in Photoshop...`);
let writeImage = ppm.singleChannelImage(imageNoHeader, 
        ppm.getWidth(fileContents), 
        ppm.getHeight(fileContents), 
        redImage, 
        'red');

let greenImage = './csl-image-file-GREEN.ppm';
console.log(`[CHECK:] Check to see if you have a file named ${greenImage} that is a "green" version of the image when opened in Photoshop...`);
writeImage = ppm.singleChannelImage(imageNoHeader, 
        ppm.getWidth(fileContents), 
        ppm.getHeight(fileContents), 
        greenImage, 
        'green');

let blueImage = './csl-image-file-BLUE.ppm';
console.log(`[CHECK:] Check to see if you have a file named ${blueImage} that is a "blue" version of the image when opened in Photoshop...`);
writeImage = ppm.singleChannelImage(imageNoHeader, 
        ppm.getWidth(fileContents), 
        ppm.getHeight(fileContents), 
        blueImage, 
        'blue');

let greyscaleImage = './csl-image-file-GREY.ppm';
console.log(`[CHECK:] Check to see if you have a file named ${greyscaleImage} that is a black-and-white/greyscale version of the image when opened in Photoshop...`);
writeImage = ppm.toGreyscale(imageNoHeader, 
        ppm.getWidth(fileContents), 
        ppm.getHeight(fileContents),
        greyscaleImage);

return;
// Build an array with the file contents...
let fileAsArray = ppm.cleanData(fileContents);

// Get the header values of our PPM file.
let header = ppm.getHeader(fileAsArray);

// Get the magic number of the PPM file.
let magic = ppm.getMagicNumber(header);

// Print out PPM details to see if our functions 
// are pulling out the right values.
//console.log({fileContents}, {header}, {magic});

// Get width and height and print out...
let dimensions = ppm.getDimensions(header);
//console.log({dimensions});

// Get maxval and print out...
let max = ppm.getMaxval(header);
//console.log({max});

// Create an array with only the data...
// Print it out and ensure we only have data or pixel 
// values.
let cleanData = ppm.readData(fileAsArray);
console.log({cleanData});
//return;
// Pull out the red values for the image.
let red = ppm.getColor(cleanData, 'red');
//console.log({red});

// Write only the red values to a file. We can view
// the output file in PhotoShop to make sure our 
// function operates as expected.
ppm.write1DChannelImage(red, 'red', dimensions[0], dimensions[1], './01-red.ppm');

// Same as above, except this is the green channel.
let green = ppm.getColor(cleanData, 'green');
//console.log({green});
ppm.write1DChannelImage(green, 'green', dimensions[0], dimensions[1], './01-green.ppm');

// Same as above, except this is the blue channel.
let blue = ppm.getColor(cleanData, 'blue');
//console.log({blue});
ppm.write1DChannelImage(blue, 'blue', dimensions[0], dimensions[1], './01-blue.ppm');

//console.log( ppm.checkImage('./3x4-image.ppm') );
//console.log( ppm.checkImage('./3x4-image-bad-magic-number.ppm') );
//console.log( ppm.checkImage('./3x4-image-bad-pixel-count.ppm') );
//console.log( ppm.checkImage('./3x4-image-bad-maxval.ppm') );

// Create different 2D arrays based on a PPM file. Here 
// I am testing pulling out red, green and blue values into
// their own 2D array of the same dimensions as the image.
let redArr = ppm.build2DArray(red, dimensions[0], dimensions[1]);
let greenArr = ppm.build2DArray(green, dimensions[0], dimensions[1]);
let blueArr = ppm.build2DArray(blue, dimensions[0], dimensions[1]);
ppm.write2DChannelImage(blueArr, 'blue', './01-blue2D.ppm');

const edgeDetect1 = [
    [0, -1, 0],
    [-1, 4, -1],
    [0, -1, 0]
];
const edgeDetect2 = [
    [-1, -1, -1],
    [-1, 8, -1],
    [-1, -1, -1]
];
const sharpen = [
    [0, -1, 0],
    [-1, 5, -1],
    [0, -1, 0]
];

const blur = [
    [1/9, 1/9, 1/9],
    [1/9, 1/9, 1/9],
    [1/9, 1/9, 1/9]
];

let redArrSharp = ppm.applyKernel(redArr, sharpen);
let greenArrSharp = ppm.applyKernel(greenArr, sharpen);
let blueArrSharp = ppm.applyKernel(blueArr, sharpen);

ppm.write2DChannelImage(blueArrSharp, 'blue', './01-blue2D-sharp.ppm');
let channels = ppm.applyKernelAllChannels(redArrSharp, greenArrSharp, blueArrSharp, sharpen);
ppm.write2DRGBImage(channels[0], channels[1], channels[2], '01-all-color2D-sharp.ppm');

channels = ppm.applyKernelAllChannels(redArrSharp, greenArrSharp, blueArrSharp, edgeDetect1);
ppm.write2DRGBImage(channels[0], channels[1], channels[2], '01-all-color2D-edge1.ppm');

channels = ppm.applyKernelAllChannels(redArrSharp, greenArrSharp, blueArrSharp, edgeDetect2);
ppm.write2DRGBImage(channels[0], channels[1], channels[2], '01-all-color2D-edge2.ppm');

channels = ppm.applyKernelAllChannels(redArrSharp, greenArrSharp, blueArrSharp, blur);
ppm.write2DRGBImage(channels[0], channels[1], channels[2], '01-all-color2D-blur.ppm');
// Print out the arrays as a sanity check.
//console.log({redArr}, {greenArr}, {blueArr});

// Write a greyscale (black and white) image to the file 
// named 01-mono.ppm.
ppm.toMonochrome(redArr, greenArr, blueArr, './01-mono.ppm');
ppm.adjustImageTemp(redArr, greenArr, blueArr, max, 40, './01-mono-temp+40.ppm');
ppm.adjustImageTemp(redArr, greenArr, blueArr, max, -40, './01-mono-temp-40.ppm');
ppm.invertImage(redArr, greenArr, blueArr, max, './01-mono-invrt.ppm');
ppm.adjustImageTint(redArr, greenArr, blueArr, max, 40, './01-mono-tint+40.ppm');
ppm.adjustImageTint(redArr, greenArr, blueArr, max, -40, './01-mono-tint-40.ppm');
ppm.smoothImage(redArr, greenArr, blueArr, './01-mono-smooth.ppm');











