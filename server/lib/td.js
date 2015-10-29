var FS = require('fs'),
    SVM = require('node-svm'),
    GENERATOR = require('../../data-generator');

var SAMPLES_ROOT = 'devices';

var clf = new SVM.CSVC();

function train(cb)
{
    var devices = FS.readdirSync(SAMPLES_ROOT),
        trainData = [];

    devices = devices.sort();

    devices.forEach(function(deviceName) {

        var samples = FS.readdirSync(SAMPLES_ROOT + '/' + deviceName),
            deviceIndex = devices.indexOf(deviceName);

        samples.forEach(function(sampleName) {

            var sample = FS.readFileSync(SAMPLES_ROOT + '/' + deviceName + '/' + sampleName, 'utf8').split("\n").map(function(str) { return parseFloat(str); });
            trainData.push([ sample, deviceIndex ]);
        });
    });

    clf.train(trainData).done(cb);
}

function predict(deviceIndex)
{
    var sample,
        prediction,
        devices;

    switch (deviceIndex) {
    case "1":
        GENERATOR.writeSample1(null, 'tmp/sample.data');
        break;
    case "2":
        GENERATOR.writeSample2(null, 'tmp/sample.data');
        break;
    case "3":
        GENERATOR.writeSample3(null, 'tmp/sample.data');
        break;
    default:
        throw new Error('Unknown device');
    }

    sample = FS.readFileSync('tmp/sample.data', 'utf8').split("\n").map(function(str) { return parseFloat(str); });
    prediction = clf.predictSync(sample);

    devices = FS.readdirSync(SAMPLES_ROOT).sort();

    return devices[prediction] || 'Unknown device';
}

module.exports = {
    train : train,
    predict : predict
};
