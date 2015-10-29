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
            res.json({status : 1});
            break;
        case "2":
            generator.writeSample2(device);
            res.json({status : 1});
            break;
        case "3":
            generator.writeSample3(device);
            res.json({status : 1});
            break;
        default:
            res.status = 404;
            res.send("No socket");
    }
})

.get('/train', function(req, res) {
    dt.train(function() {
        res.json("{status : 1}");
    });
})

.get('/predict/:device', function(req, res) {
    var device = req.params['device'],
        prediction = dt.predict(device);

    res.send({ status : 1, device : prediction });
});

module.exports = router;
