var FFT = require('fft'),
    SVM = require('node-svm'),
    FS  = require('fs'),
    PATH = require('path'),
    MKDIRP = require('mkdirp'),
    SEEDRANDOM = require('seedrandom'),
    UUID = require('node-uuid');

var SEED = 'HackatonRozetka',
    MAX_DEVICE_COMPLEXITY = 15,
    MIN_DEVICE_COMPLEXITY = 7,
    MAX_DEVICE_POWER = 7,
    MIN_DEVICE_POWER = 5,
    MAX_DEVICE_FREQ  = 1,
    MIN_DEVICE_FREQ  = 10,
    MAX_DEVICE_POWER_SPREAD = 1.1,
    MIN_DEVICE_POWER_SPREAD = 0.9,
    MAX_DEVICE_FREQ_SPREAD = 1.05,
    MIN_DEVICE_FREQ_SPREAD = 0.95,
    TOTAL_DEVICES = 15,
    DATA_SIZE = 256,
    OUTPUT_SIZE = 128,
    TRAINING_SAMPLE_SIZE = 10; // Multiplied by TOTAL_DEVICES

var devices,
    trainingData,
    clf,
    i;

// Returns seeded random number from 0 to 1
function rnd(min, max) {
    var generator = rnd.generator || (rnd.generator = SEEDRANDOM(SEED)),
        result;

    switch (true) {
        case min !== undefined && max !== undefined:
            result = min + Math.floor((max - min) * generator());
            break;
        case min !== undefined:
            result = Math.floor(min * generator());
            break;
        default:
            result = generator();
    }

    return result;
}

// Fast Fouriear transform
function fft(input, outputSize) {
    var fftComplex,
        inputLen = input.length,
        result = [],
        i, real, imag;

    outputSize = outputSize || inputLen;

    fftComplex = new FFT.complex(outputSize, 0);

    fftComplex.simple(result, input, 'real');

    // Process the fft output
    for (i = 0; i < (outputSize / 2) - 1; ++i) { // We only get back half the number of bins as we do samples
        imag = result[ (i * 2 ) + 0 ]; // Odd indexes are the imaginary values
        real = result[ (i * 2 ) + 1 ]; // Even indexes are the real values
        result[i] = Math.sqrt((real*real)+(imag*imag));
    }

    return result.slice(0, outputSize);
}

// Generates device function, which returns function recieving 1 parameter phase
function generateDeviceFn(){
    var i,
        complexity = rnd(MIN_DEVICE_COMPLEXITY, MAX_DEVICE_COMPLEXITY),
        device = [];

    for (i = 0; i < complexity; ++i) {

        device.push({
            power : rnd(MIN_DEVICE_POWER,  MAX_DEVICE_POWER),
            freq  : rnd(MIN_DEVICE_FREQ, MAX_DEVICE_FREQ)
        });
    }

    return function(i) {
        return device.reduce(function(previous, deviceEl) {
            return previous + /* power */ rnd(MIN_DEVICE_POWER_SPREAD, MAX_DEVICE_POWER_SPREAD) * deviceEl.power *
                              /* freq */  Math.sin(i * Math.PI / 180 * rnd(MIN_DEVICE_FREQ_SPREAD, MAX_DEVICE_FREQ_SPREAD) * deviceEl.freq);
        }, 0);
    };
}

function generateDevices(total, reportFn) {
    var result = [],
        device,
        i;

    for (i = 0; i < total; ++i) {
        device = {
            fn    : generateDeviceFn(),
            name  : 'Device_' + (i + 1),
            index : i
        };
        result.push(device);

        reportFn && reportFn(device);
    }

    return result;
}

function generateDeviceFFT(device, dataSize, fftSize) {
    var i, result = [];

    for (i = 0; i < dataSize; ++i) {
        result[i] = device.fn(i);
    }

    return fft(result, fftSize);
}

function generateDeviceFFTPlot(device, dataSize, fftSize, outputTo)
{
    var plot,
        fftData;

    plot = [
        '#!/usr/bin/gnuplot --persist',
        'set title "FFT result for device ' + device.name + '"',
        'set xlabel "Ticks"',
        'set ylabel "FFT"',
        'plot "' + device.name + 'FFT.data" with lines'
    ];

    fftData = generateDeviceFFT(device, dataSize, fftSize);

    FS.writeFileSync(outputTo + '/' + device.name + 'FFT.plot', plot.join("\n"));
    FS.writeFileSync(outputTo + '/' + device.name + 'FFT.data', fftData.join("\n"));
}

function generateDeviceSample (device, dataSize, fftSize, outputTo) {
    var fftData = generateDeviceFFT(device, dataSize, fftSize),
        dirPath = PATH.dirname(outputTo);

    if (!FS.exists(dirPath)) {
        MKDIRP.sync(dirPath, 0777);
    }

    FS.writeFileSync(outputTo, fftData.join("\n"));
}

function writeSample (data, outputTo) {
    // var samplePath = outputTo + '/' + device.name + '/' + UUID.v4(),
        var dirPath = PATH.dirname(outputTo);

    if (!FS.exists(dirPath)) {
        MKDIRP.sync(dirPath, 0777);
    }

    FS.writeFileSync(outputTo, data.join("\n")); 
}

function generateTrainingData(devices, samples, dataSize, fftSize, reportFn) {
    var i, ilen, j,
        device,
        sample,
        result = [];

    for (i = 0, ilen = devices.length; i < ilen; ++i) {
        device = devices[i];
        for (j = 0; j < samples; ++j) {
            sample = [generateDeviceFFT(device, dataSize, fftSize), device.index];
            result.push(sample);
            reportFn && reportFn(device, j, sample);
        }
    }

    return result;
}

devices = generateDevices(TOTAL_DEVICES, function(device) {
    console.log(device.name, 'generated');
});

// trainingData = generateTrainingData(devices, TRAINING_SAMPLE_SIZE, DATA_SIZE, OUTPUT_SIZE, function(device, i, sample) {
//     console.log('Training sample #', i, 'for device', device.name, 'generated');
// });

// // Training SVM
// console.log("Training");

// clf = new SVM.CSVC();
// clf.train(trainingData).done(function() {
//     console.log("Checking train results");
//     devices.map(function(device) {
//         var prediction = clf.predictSync(generateDeviceFFT(device, DATA_SIZE, OUTPUT_SIZE));
//         console.log("Prediction:", prediction, " - Actual:", device.index, " which corresponds to ", device.name);
//     });
// });

//generateDeviceFFTPlot(devices[0], DATA_SIZE, OUTPUT_SIZE, 'output');
//generateDeviceFFTPlot(devices[1], DATA_SIZE, OUTPUT_SIZE, 'output');
//generateDeviceFFTPlot(devices[2], DATA_SIZE, OUTPUT_SIZE, 'output');

module.exports = {
    writeSample1: function (deviceName, path) {
        path = path || 'devices/' + deviceName + '/' + UUID.v4();
        generateDeviceSample(devices[0], DATA_SIZE, OUTPUT_SIZE, path);
    },
    writeSample2: function (deviceName, path) {
        path = path || 'devices/' + deviceName + '/' + UUID.v4();
        generateDeviceSample(devices[1], DATA_SIZE, OUTPUT_SIZE, path);
    },
    writeSample3: function (deviceName, path) {
        path = path || 'devices/' + deviceName + '/' + UUID.v4();
        generateDeviceSample(devices[2], DATA_SIZE, OUTPUT_SIZE, path);
    },
    writeSample: function (deviceName, data, path) {
        path = path || 'devices/' + deviceName + '/' + UUID.v4();
        
        writeSample(data, path)
    }
};
