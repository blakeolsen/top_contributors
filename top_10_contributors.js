var request = require('request')
var math = require('math')
var _ = require('lodash')
var json = require('./package.json')
var path = require('path')


function run(project) {
    function logger(error, data) {
	var sorted = _.sortBy(data, function (committer) {
		return -committer.contributions;
	    });
	
	var names = _.map(sorted, 'name');
	var nums = _.map(sorted, 'contributions');
	console.log(sorted.length);
	console.log('Top contributors for ' + project);
	for (var i = 0; i < sorted.length; i++) {
	    console.log(i+1 + " " + names[i] + " " + nums[i]);
	};
    }

    var url = 'https://api.github.com/repos/' + project + '/contributors';

    var options = {
	headers : {
	    'User-Agent': json.name + '/' + json.version
	},
	json : true
    };

    request(url,options,
	    function (error, response, data) {
		var data_extract = [];
		for (var i = 0; i < math.min(10, data.length); i++) {
		    var values = { 
			'name' : data[i].login,
			'contributions' : data[i].contributions
		    };
		    data_extract.push(values);
		}
		return logger(error,data_extract); 
	    }
	    )
	}
  


var program = require('commander');
program
    .version('0.0.1')
    .on('--help',
        function () {
            console.log('  Usage:');
            console.log('');
            console.log('    $ top-contributors "repo/name"');
            console.log('');
        })
    .parse(process.argv);
var project = program.args[0];
run(project);
