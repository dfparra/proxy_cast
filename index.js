
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var server = express();
var $http = require('axios');
var logger = require('./logger');
var authorize = require('./auth');

var port = process.env.PORT || 8080;
var apiKey = process.env.API || require('./config').apiKey;
var baseUrl = 'https://api.forecast.io/forecast/';

//plugins middleware
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));
server.use(cors());
server.use(logger);
server.use(authorize);

//test route
server.get('/forecast/hourly/:lat,:lon', function(req, res){
  $http.get(baseUrl+ apiKey+'/'+req.params.lat+','+req.params.lon)
        .then(function(response){
          var resObj = {
            latitude: response.data.latitude,
            longitude: response.data.longitude,
            hourly: response.data.hourly,

          };
          res.status(200).json(resObj); //The respnse was succesful and here is the info
        })
        .catch(function(error){
          // console.log(error);
          res.status(500).json({
            msg: error
          });
        });
});

server.get('/forecast/daily/:lat,:lon', function(req, res){
  $http.get(baseUrl + apiKey + '/' + req.params.lat + ',' + req.params.lon)
        .then(function(response){
          var overSummary = response.data.daily.summary;
          var overIcon = response.data.daily.icon;
          var dailyData = response.data.daily.data;
          var dailyArr = [];
          for(var i = 0; i < dailyData.length; i+=1){
            var o = {
              icon: dailyData[i].icon,
              tempMax: dailyData[i].temperatureMax,
              tempMin: dailyData[i].temperatureMin,
              humidity: dailyData[i].humidity,
              precipProb: dailyData[i].precipProbability
            };
            dailyArr.push(o);
          }

          var resObj = {
            latitude: response.data.latitude,
            longitude: response.data.longitude,
            summary: overSummary,
            icon: overIcon,
            daily: dailyArr
          };
          res.status(200).json(resObj);
        })
        .catch(function(err){
          res.status(500).json({
            msg: err
          });
        });
  // $http.get(baseUrl+ apiKey+'/'+req.params.lat+','+req.params.lon)
  //       .then(function(response){
  //         var resObj = {
  //           latitude: response.data.latitude,
  //           longitude: response.data.longitude,
  //           daily1: response.data.daily.data[0].time,
  //           daily2:response.data.daily.data[1].time,
  //
  //         };
  //         res.status(200).json(resObj); //The respnse was succesful and here is the info
  //       })
  //       .catch(function(error){
  //         // console.log(error);
  //         res.status(500).json({
  //           msg: error
  //         });
  //       });
});

server.get('/forecast/minutely/:lat,:lon', function(req, res){
  $http.get(baseUrl+ apiKey+'/'+req.params.lat+','+req.params.lon)
        .then(function(response){
          var resObj = {
            latitude: response.data.latitude,
            longitude: response.data.longitude,
            minutely: response.data.minutely,

          };
          res.status(200).json(resObj); //The respnse was succesful and here is the info
        })
        .catch(function(error){
          // console.log(error);
          res.status(500).json({
            msg: error
          });
        });
});


//listen
server.listen(port, function(){
  console.log('Now running on port..', port);
});
