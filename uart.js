var m = require('mraa'); //require mraa

var U = new m.Uart(0)

U.setBaudRate(9600);
U.setMode(8, 0, 1);
U.setFlowcontrol(false, false);

function getSample() {
	var data, sample = [];
	while(data = U.readStr(16)){
		if(data >= 0.1){
			for (var i = 0; i < 256; i++) {
				sample.push(parseFloat(data));
			}
		}
		return sample;
	}
}

module.exports = getSample;