var FFT = require('fft'),
    SVM = require('node-svm'),
    FS  = require('fs');

var DATA_SIZE = 1024;

var fft,
    data1, data2,
    fftData1 = [], fftData2 = [],
    gnuPlotScript1, gnuPlotScript2;

function generateDataSin(dataSize, factor, phase) {
    var i, result = [];

    for (i = 0; i < dataSize; ++i) {
        result[i] = Math.sin(Math.PI / 180 * i + (phase || 0)) * (factor || 1);
    }

    return result;
}

function generateDataCos(dataSize, factor, phase) {
    var i, result = [];

    for (i = 0; i < dataSize; ++i) {
        result[i] = Math.cos(Math.PI / 180 * i + (phase || 0)) * (factor || 1);
    }

    return result;
}


data1 = generateDataSin(DATA_SIZE, 1, 0);
data2 = generateDataSin(DATA_SIZE, 1, 90);

fft = new FFT.complex(DATA_SIZE, 0);

fft.simple(fftData1, data1, 'real');
fft.simple(fftData2, data2, 'real');

gnuPlotScript1 = [
    '#!/usr/bin/gnuplot --persist',
    'set title "FFT result"',
    'set xlabel "Ticks"',
    'set ylabel "FFT"',
    'plot "fftData1.data" with lines'
];

gnuPlotScript2 = [
    '#!/usr/bin/gnuplot --persist',
    'set title "FFT result"',
    'set xlabel "Ticks"',
    'set ylabel "FFT"',
    'plot "fftData2.data" with lines'
];

FS.writeFileSync('fftData1.data', fftData1.join("\n"));
FS.writeFileSync('fftData2.data', fftData2.join("\n"));
FS.writeFileSync('fftData1.plot', gnuPlotScript1.join("\n"));
FS.writeFileSync('fftData2.plot', gnuPlotScript2.join("\n"));
