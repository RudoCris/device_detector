var express = require('express');
var router = express.Router();
var generator = require('../../data-generator.js');
var dt = require('../lib/td.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
})

.get('/sample/:socket/:device',function (req, res) {
    var socket = req.params['socket'],
        device = req.params['device'];

    switch(socket){
        case "1":
            generator.writeSample1(device);
            res.json({success : true});
            break;
        case "2":
            generator.writeSample2(device);
            res.json({success : true});
            break;
        case "3":
            generator.writeSample3(device);
            res.json({success : true});
            break;
        default:
            res.status = 404;
            res.json({success : false, message : "No device found"});
    }
})

.get('/train', function(req, res) {
    dt.train(function() {
        res.json({success : true});
    });
})

.get('/predict/:device', function(req, res) {
    var device = req.params['device'],
        prediction = dt.predict(device);

    res.json({ success : true, device : prediction });
})

.get('/listdevices', function(req, res) {
    res.json({
        success : true,
        devices : dt.listDevices().map(function(deviceName) { return { id : deviceName, name : deviceName, icon : null }; })
    });
})

.get('/adddevice/:device', function(req, res) {
    var deviceName = req.params['device'];
    dt.addDevice(deviceName);
    res.json({success : true});
})

.get('/removedevice/:device', function(req, res) {
    var deviceName = req.params['device'];
    dt.removeDevice(deviceName);
    res.json({success : true});
})

.get('/deviceprofile/:device', function(req, res) {
    var deviceName = req.params['device'],
        profile = dt.getDeviceProfile(deviceName);

    profile = profile.map(function(value, idx) {
        return {
            id   : idx,
            value : value
        };
    });

    res.json({ success : true, profile : profile });
});

module.exports = router;
