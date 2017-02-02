var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'nema'
    },
    port: 5000,
    //portSecure : 5443,
    db: 'mongodb://localhost/nema-db'
    // serverPath : 'https://localhost:5443/',
    // email : 'info%40flickty.com',
    // password : 'Flickty12345^',
    // twitter_consumer_key : 't873g9N4qfRClAm2zL94KmRyi',
    // twitter_consumer_secret : 'HU1ppHNfzWLCZuCArtZHiNRKLLlF5HUXFjRnRlhmoMHVDgTrD5'
    // db : 'mongodb://amresh:amresh@192.168.100.149:27017/selfieWin-development'
  }
};

module.exports = config[env];

//exporting object of config based on environment