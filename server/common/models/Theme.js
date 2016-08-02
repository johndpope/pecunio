var app = require('../../server/server.js');
var q = require("q");
var https = require("http");
var path    = require('path');
var config = require('../../server/config');
var express = require('express');
var fs      = require('fs');
var momentTz = require('moment-timezone');
var _ = require('underscore');
var bcrypt = require('bcrypt');
var loopback = require('loopback');


module.exports = function(Theme) {

   /**
    * Function for save theme data
    * @param  {[object]}
    * @param  {saveThemeData}
    * @return {[object]}
    */
    Theme.saveThemeData = function(themeData, cb) {
      
      var AdTemplateModel = app.models.AdTemplateDataModel;
      var AdMappingDataModel = app.models.AdMappingDataModel;
      var PublisherCampaign = app.models.PublisherCampaign;
      var currentDt = Theme.getCurrentDate();
      
      if (themeData) {

          var FD_ENDPOINT = config.reviveSetting.hostname;  ///revive.opendingo.com
          themeData.crdate = currentDt;
          themeData.updated = currentDt;
          themeData.status = 1;

          /**
           * Function for get basic templates from AdTemplate table
           * @param  {getTemplates}
           * @return {[object]}
           */
          var getTemplates = function(cb){
            var d = q.defer();
            AdTemplateModel.find({}, function(err, data) {
              if(err) {
                cb(err);
              } else {
                d.resolve(data);
              }
            });
            return d.promise;
          }

          /**
           * Function for Save data on partner_forms table
           * @param  {[object]}
           * @return {[object]}
           */
          var saveFormTemplate = function(templateData){
              var partner_forms = app.models.PartnerForms;
              
              var ad = {};
              var def1 = q.defer();
              var randomId   = (Math.floor(Math.random()*90000) + 10000).toString();
              var slotId = bcrypt.hashSync(randomId, 2);
              var ctx = loopback.getCurrentContext();
              var currentUser = ctx && ctx.get('currentUser');

                ad['crdate'] = currentDt;
                ad['tstamp'] = currentDt;
                ad['branch'] = '';
                ad['slotId'] = slotId;
                ad['affiliatePartnerUid'] = currentUser.id;
                ad['affiliateTypeUid'] = 1;
                ad['mainColor'] = themeData.headlineColor;
                ad['textColor'] = themeData.textColor;
                ad['backgroundColor'] = themeData.secondaryColor;
                ad['borderColor'] = themeData.primaryColor;
                ad['buttonColor'] = themeData.tertiaryColor;
                ad['schemaType'] = 0;
                ad['buttonBg'] = themeData.primaryColor;
                ad['buttonBgRadial'] = '';
                ad['buttonTextNoshadow'] = 0;
                ad['checkBg'] = '#73c08f';
                ad['xsellingBu'] = 0;
                ad['xsellingPflege'] = 0;
                ad['domain'] = 'www.test.com';
                ad['sparteUid'] = templateData.productId;
                ad['privacy'] = 'http://www.pecunio.de/ueber-uns/impressum#datenschutz';
                ad['campaignId'] = '';
                ad['showBonus'] = 0;
                ad['footerColor'] = '';

              partner_forms.create(ad, function(err,data){
                  if(err){
                    cb(err); 
                  } else{
                      def1.resolve(data);
                  }
              });
              return def1.promise;
          }

          /* var saveOtherTemplate = function(templateData){


          } */

          /**
           * Function for getting campaign Id from PublisherCampaign table
           * @param  {[Number]}
           * @return {[object]}
           */
          var getCampaignId = function(prodId){
            var ctx = loopback.getCurrentContext();
            var currentUser = ctx && ctx.get('currentUser');
            var d_id = themeData.domainId;
            var pubId = currentUser.id;

            var d = q.defer();
            PublisherCampaign.find({where: {and: [ {publisherId: pubId}, {domainId: d_id}, {productId: prodId} ]}}, function(err, data) {
              if(err) {
                cb(err);
              } else {
                d.resolve(data);
              }
            });
            return d.promise;
          }

          /**
           * Function for save banners into revive server
           * @param  {[Number]}
           * @param  {[Number]}
           * @param  {[Number]}
           * @return {[object]}
           */
          var insertAdOnRevive = function(insertedAdId, slotId, campaignId){
             
              var def1 = q.defer();
              var postString;
              var postBody = {};
              var htmltemplate = "<iframe frameborder='0' src='http://pecunio.opendingo.com/repo/dev-ad/forms/form_14kv8901m7/index.php?slot_id="+slotId+"'></iframe>";
              //var bannerName = "banner-"+insertedAdId;
              var bannerName = "banner-"+'2'+"-"+themeData.domainId+"-"+insertedAdId; //2- for the categoryId

              postBody =   {
                    "campaignId":campaignId,
                    "bannerName":bannerName,
                    "storageType":"html",
                    "htmlTemplate": htmltemplate
              };
              postString = JSON.stringify(postBody);
              var params = {
                  hostname : FD_ENDPOINT ,
                  path : config.reviveSetting.restApi+"/bnn/new", 
                  method: "POST",
                  headers: {"Content-type": "application/json","Content-Length": postString.length},
                  auth : config.reviveSetting.authentication    ////'admin:aDw!nLtT[0#Se'
              }
              var response = {};
              var err = {};
              var req = https.request(params, function(res){
                res.on('data', function (chunk) {
                  if(res.statusCode == 200 ){
                    response['isSuccess'] = true;
                  }else {
                    response['isSuccess'] = res.statusMessage;
                  }
                  // start get the last inserted ID
                  getReviveAdList(campaignId).then(function(list){
                             // filter out last inserted row
                             var filterTerm = "banner-"+'2'+"-"+themeData.domainId+"-"+insertedAdId;
                             var filterRow = {};
                             filterRow = _.findWhere(list, {bannerName: filterTerm});
                             // filter out last inserted row
                       def1.resolve(filterRow); 
                  });
                  // end get the last inserted ID
                });
                res.on('end', function() {
                  // setTimeout(function(){ console.log("Timeout"); }, 4000);
                });
              });
              var e = req.write(postString);
              req.end(); 
              return def1.promise;
          }

          /**
           * Function for getting Ad list from revive server
           * @param  {[Number]}
           * @return {[array]}
           */
          var getReviveAdList = function(campaignId){
            var def1 = q.defer();
            var cnt1 = 0;
            var temp1 = [];
            var response1 = {};
            var err1 = {};
            var listparams = {
                hostname : FD_ENDPOINT ,
                path : config.reviveSetting.restApi+"/bnn/cam/"+campaignId, 
                method: "GET",
                headers: {"Content-type": "application/json"},
                auth : config.reviveSetting.authentication    ////'admin:aDw!nLtT[0#Se'
            }
            var req1 = https.request(listparams, function(res){
                res.on('data', function (chunk) {
                    var newdata = chunk.toString("ascii");
                    temp1.push(newdata);
                 });
                res.on('end', function() {
                    var dataLen = temp1.length;
                    var dataChildren = '';
                    if(dataLen > 1){
                      for(var i=0;i<dataLen;i++){
                        dataChildren += temp1[i];
                      }
                    }else{
                      dataChildren = temp1[0];
                    }
                    var arrRes = JSON.parse(dataChildren);
                    def1.resolve(arrRes);
                });
                res.on('error', function(exception) { 
                  //Console.log("error here : "+exception); 
                });
            }).end();
            return def1.promise;
          }

          /**
           * Function for saving map data into AdMapping table
           * @param  {[object]}
           * @param  {[number]}
           * @param  {[number]}
           * @return {[object]}
           */
          var saveAdZoneMappingInfo = function(resp, categoryId, templateId){
            var adMappingDetails = {};
            var def1 = q.defer();

            //saving to AdZoneMapping table
            adMappingDetails['userId'] = resp.ad_Details.affiliatePartnerUid;
            adMappingDetails['adId'] = resp.ad_Details.uid;
            adMappingDetails['templateId'] = templateId;
            adMappingDetails['categoryId'] = categoryId;
            adMappingDetails['isDeleted'] = 0;
            adMappingDetails['reviveAdid'] = resp.revive_adDetails.bannerId;
            adMappingDetails['status'] = 0;
          
            AdMappingDataModel.create(adMappingDetails, function(err,data){
                   if(err){  
                      def1.reject(err);
                      return false; 
                   } 
                   else{ 
                      def1.resolve(data); 
                   }
                });
            return def1.promise;
          }
          
          /**
           * Function for saving data into theme table and continue to get data from dependencies tables 
           * and save other dependencies tables
           * @param  {[object]}
           * @param  {Object}
           * @return {[object]}
           */
          Theme.create(themeData, function(err,data){
              if(err){
                cb(err); 
              } else{
                getTemplates().then(function(tempData){

                  var formData = {};
                  var otherData = {};
                  var tempArr = [];
                  var adInfo = {};
                  
                  formData = _.where(tempData, {categoryId: 2});
                  otherData = _.reject(tempData, function(tempData){ return tempData.categoryId == 2; });
                  
                  //if(formData){
                    formData.forEach(function(eachData){
                      var d2 = q.defer();
                      tempArr.push(d2.promise);
                      saveFormTemplate(eachData).then(function(resdata){
                        adInfo['ad_Details'] = resdata;
                        getCampaignId(eachData.productId).then(function(rescampaignid){
                          rescampaignid.forEach(function(eachcampaignid){
                            insertAdOnRevive(resdata.uid, resdata.slotId, eachcampaignid.reviveCampaignId).then(function(res){
                              adInfo['revive_adDetails'] = res;
                              saveAdZoneMappingInfo(adInfo, eachData.categoryId, eachData.id).then(function(resmapdata){
                                  d2.resolve(resmapdata);
                              });
                            });
                          });
                        });
                      });
                    });
                    
                    q.all(tempArr).then(function(resultSet){
                      cb(null, resultSet.length);
                    });
                //  }

                  /*if(otherData != undefined && otherData != ''){
                    otherData.forEach(function(eachData){
                      saveOtherTemplate(otherData).then(function(){
                      });
                    }
                  }*/
                });
              }  
          });
      }
    };

    Theme.remoteMethod(
        'saveThemeData', 
        {
          accepts: [{arg: 'themeData', type: 'object' , required: true, http: { source: 'body'}}],
          returns: {arg: 'theme', type: 'object'},
          http: {verb: 'post'}
        }
    );

    /**
     * Function for getting current time
     * @return {[number]}
     */
    Theme.getCurrentDate = function(){
      var t = momentTz().tz("America/New_York");
      t.set('hour', 0);
      t.set('minute', 0);
      t.set('second', 0);
      t.set('millisecond', 0);
      var currentDt = t.utc().valueOf();
      return currentDt;
    }
   
    /**
     * Function for checking Existing theme for the domain
     * @param  {[number]}
     * @param  {checkDomainTheme}
     * @return {[boolean]}
     */
    Theme.checkDomainTheme = function(domainId, cb) {
      var query = {domainId : domainId, status : 1};
      Theme.count(query, function(err, count) {
        if(err) {
          cb(err);
        } else {
          if(count > 0) {
            cb(null, false);
          } else {
            cb(null, true);
          } 
        }
      });
    };
     
    Theme.remoteMethod(
        'checkDomainTheme', 
        {
          accepts: [{arg: 'domainId', type: 'Number' , http: { source: 'body'}}],
          returns: {arg: 'notExists', type: 'boolean'},
          http: {verb: 'post'}
        }
    );
};
