var express = require('express');
var router = express.Router();
var generator = require('../../data-generator.js');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
})
.get('/sample/:socket',function (req, res) {
	var socket = req.params['socket'];
	switch(socket){
		case "1":
			debugger;
			generator.writeSample1();
			break;
		case "2": 
			generator.writeSample2();
			break;
		case "3": 
			generator.writeSample3();
			break;
		default:
			res.status = 404;
			res.send("No socket");
	}
	
})
;

module.exports = router;
