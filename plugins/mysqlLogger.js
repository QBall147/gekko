//
// MySQL Advice Logger v0.1 
// This plugin was designed to allow advice output to a MySQL database
// Created by z3hyn
// 

var log = require('../core/log');
var moment = require('moment');
var _ = require('lodash');
var mysql =  require('mysql');

var connection =  mysql.createConnection({
  	//MySQL Server Address
        host : "localhost",
        //MySQL Username
  	user : "gekko",
        //MySQL Password
  	password: "lamepassword"
});


var Actor = function() {
  this.price = 'N/A';
  this.marketTime = {format: function() {return 'N/A'}};
  _.bindAll(this);
}

Actor.prototype.processTrade = function(trade) {
  this.price = trade.price;
  this.marketTime = moment.unix(trade.date);
};
console.log('logging advice to MySQL');
Actor.prototype.processAdvice = function(advice) {
  
  connection.connect();
  connection.query("use trade_info");
  var marketprice = this.price;
  var markettime = this.marketTime.format('YYYY-MM-DD HH:mm:ss');
  var marketposition = advice.recommandation;
  var strQuery = "insert into tbladvice (market_price, market_advice, market_time) VALUES ?";
  var values = [
	[marketprice, marketposition, markettime]
	       ];
  connection.query(strQuery, [values], function(err, result) {
    // Do something after the query succeeds
    console.log()
    log.info('MySQL database successfully updated');
  });
  
  //Removed to prevent: Error: Cannot enqueue Handshake after invoking quit.
  //connection.end(function(err){
    // Do something after the connection closes
    //log.info('Database connection closed');
    //console.log()
  //});

};

module.exports = Actor;

