var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
})
.get('/sample/:size/:socket',function (req, res) {
	var size = req.params['size'];
	var socket = req.params['socket'];

	
})
;

module.exports = router;
