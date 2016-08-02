var momentTz = require('moment-timezone');
var app      = require('../../server/server.js');
var q        = require('q');
var config   = require('../../server/config');
var _  = require('underscore');
var express = require('express');
var http    = require('http');
var path    = require('path');
var fs      = require('fs');

module.exports = function(PublisherDomain) {
  
	/**
	  * Typical remote method for Create Domain !!
	  * @param {object} domainData [Domain Information]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return {object} domain
	  *
	  */
	
  PublisherDomain.createDomain = function(domainData, cb){
      var currentDt = PublisherDomain.getCurrentDate();
      
      var AdType = app.models.AdTypeDataModel;
      var Hash = app.models.UserHash;
      var getAdvertiserId = function(){
          var dd = q.defer();
          var params = {
            hostname : config.reviveSetting.hostname ,
            path : config.reviveSetting.restApi+"/adv/agc/1",   
            method: "GET",
            headers: {"Content-type": "application/json"},
            auth : config.reviveSetting.authentication  
          }
          
          var common = app.models.CommonModel;
          common.getDataFromApi(params,function(err,res){
            if(res){
              var advertiserId = 0;
              var advArr = res;   
              
              for(var prop in advArr){
                if(prop == 'agencies'){
                  var advDataArr = advArr['agencies']['data'];
                  advDataArr.forEach(function(eachAdv){
                    for(var inProp in eachAdv){
                        if(inProp == 'emailAddress'){
                          if(eachAdv[inProp] == domainData.email){
                            advertiserId = eachAdv['advertiserId'];
                            
                          }
                        }
                    }  
                  });
                }
              }
              
              dd.resolve(advertiserId);
          
            }else if(err){
              //console.log('ERR : '+err);
              cb(err);
              
            }
          });
          return dd.promise;
      }  
      var getHash = function(userId){
        var d = q.defer();
        Hash.find({where: {userId : userId}}, 
          function(err, data){

            if(err){
                  d.reject(err); return false; 
            } else{
                  d.resolve(data);
            } 
          }
        );  
        return d.promise;
      }
      getAdvertiserId(domainData).then(function(advId){

        getHash(domainData.publisherId).then(function(hashData){
            var tempArr = [];
            var domains = [];
            for(var i=0; i<domainData.domains.length; i++){
                domains.push({'domainName':domainData.domains[i]});
            }
            
            domains.forEach(function(eachDomain){
                var def = q.defer();
                tempArr.push(def.promise);
                if(eachDomain.domainName != ''){
                    PublisherDomain.create({"domainName" : eachDomain.domainName, publisherId : domainData.publisherId, reviveAdvId : advId, metaTag: '<meta name="pectechcheck" content="'+hashData[0].hash+'">', "created": currentDt, "updated": currentDt, "status":0 }, function(err,data){
                       
                       if(err){
                         cb(err); 
                       } else{
                          
                          def.resolve(data);
                          
                       }  
                    });
                }
              
            });
            q.all(tempArr).then(function(resData){
              
              cb(null, resData);

            });
        });
     });
    
  }

  PublisherDomain.remoteMethod(
        'createDomain', 
        {
          accepts: [{arg: 'domainData', type: 'object' , http: { source: 'body'}}],
          returns: {arg: 'domain', type: 'object'},
          http: {verb: 'post'}
        }
  );
  
	/**
	  * Typical remote method for search domain by looged in user(Publisher) from Publisher Domain table!!
	  * @param {object} searhData  [search criteria with publisher id]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return {object} domains
	  *
	  */
  
  PublisherDomain.searchDomainByPublisherId = function(searhData, cb){
      
	  PublisherDomain.find({where: {publisherId : searhData.publisherId}}, 
        function(err, data){

          if(err){
            cb(err); 
          } else{

            cb(null, data);

          }  
        }
      );  
  }

  PublisherDomain.remoteMethod(
        'searchDomainByPublisherId', 
        {
          accepts: [{arg: 'searhData', type: 'object' , http: { source: 'body'}}],
          returns: {arg: 'domains', type: 'object'},

          http: {verb: 'post'}

        }
  );
  
    /**
	  * Typical remote method for search domain by domain name from Publisher Domain table!!
	  * @param {object} searhData  [search criteria with doamin name and publisher id]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return {object} domain
	  *
	  */
  PublisherDomain.searchDomainByName = function(searhData, cb){
      
      
      PublisherDomain.find({where: {domainName : searhData.domain, publisherId : searhData.publisherId}}, 
        function(err, data){

          if(err){
              cb(err); 
          } else{
              if(data.length == 0)
                cb(null, false);
              else
                
                cb(null, data[0]);
          }  
        }
      );  
   }

   PublisherDomain.remoteMethod(
        'searchDomainByName', 
        {
          accepts: [{arg: 'searhData', type: 'object' , http: { source: 'body'}}],
          returns: {arg: 'domain', type: 'object'},
          http: {verb: 'post'}
        }
    );
   
    /**
	  * Typical remote method to get domain by domain name and logged in user id( publisher ) from Publisher Domain table!!
	  * @param {object} searhData  [search criteria with doaminname and publisher id]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return {object} domain
	  *
	  */
    PublisherDomain.getDomain = function(searhData, cb){
      
      PublisherDomain.find({where: {domainName : searhData.domain, publisherId : searhData.publisherId}}, 
        function(err, data){

          if(err){
              cb(err); 
          } else{
              if(data.length == 0)
                cb(null, false);
              else
                cb(null, data.domain);
          }  
        }
      );  
    }

    PublisherDomain.remoteMethod(
        'getDomain', 
        {
          accepts: [{arg: 'searhData', type: 'object' , http: { source: 'body'}}],
          returns: {arg: 'domain', type: 'object'},
          http: {verb: 'post'}
        }
    );
    
    /**
	  * Typical remote method to get hash data of logged in user from UserHash table!!
	  * @param {object} hashData   [User id]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return {object} user
	  *
	  */
    PublisherDomain.getHash = function(hashData, cb){

      var Hash = app.models.UserHash;
      
      Hash.find({where: {userId : hashData.userId}}, 
        function(err, data){

          if(err){
              cb(err); 
          } else{
              if(data.length == 0)
                cb(null, false);
              else
                
                cb(null, data[0]);
          }  
        }
      );  
    }

    PublisherDomain.remoteMethod(
        'getHash', 
        {
          accepts: [{arg: 'searhData', type: 'object' , http: { source: 'body'}}],
          returns: {arg: 'user', type: 'object'},
          http: {verb: 'get'}
        }
    );
    
    /**
	  * Typical remote method for technically approve of a registered domain !!
	  * @param {object} metaData   [Information to check meta tag]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return {boolean} meta
	  *
	  */
    PublisherDomain.technicalApproval = function(metaData, cb){

      var Hash = app.models.UserHash;
      var currentDt = PublisherDomain.getCurrentDate();
      
      var getDomain = function(metaData){
        var def = q.defer();
        
        PublisherDomain.find({where: {id : metaData.domainId}}, 
        function(err, data){

            if(err){
                def.reject(err); return false; 
            } else{
                def.resolve(data);
            } 

        });
        return def.promise;
      }

      var checkMeta = function(meta, hash){
        
        var def = q.defer();
        var tmpFilename = 'tech_temp_'+meta.id+'.html';
        var fileLocation = '';
        var filepath = "client/tmp/tmp_ads/";

        fileLocation = filepath+tmpFilename;
        var tmp = {};
        var file = fs.createWriteStream(fileLocation);

        var domainName = meta.domainName;
        var searchHttp = domainName.search("http://");
        if(searchHttp == -1){
          domainName = "http://"+domainName;
        } 
        
        var request = http.get(domainName, function(response) {
                var data = response.pipe(file);
                
                tmp["writable"]= data.writable;
                tmp["tmpFileName"] = tmpFilename;

                require('fs').readFile("client/tmp/tmp_ads/tech_temp_"+meta.id+".html", 'utf8', function (err,data) {
                  if (err) {
                    //return console.log(err);
                  }
                  
                  var n = data.indexOf(hash); 
                  
                  if(n == -1){
                    def.resolve(false);
                  }else{
                    def.resolve(true);
                  }
                  
                  /*require('fs').unlink("client/tmp/tmp_ads/tech_temp_"+meta.id+".html", function (err) {
                      def.reject(err); return; 
                  });*/
                });
                    
        }).on('error', function(e) {
          //console.log("Got error: " + e.message);
          def.resolve(e.message);
        });


        
        return def.promise;
      }

      Hash.find({where: {userId : metaData.userId}}, 
        function(err, hdata){

          if(err){
              cb(err); 
          } else{
            
            if(hdata.length == 0){
              cb(null, false);
            }  
            else{
              
              getDomain(metaData).then(function(data){
                
                checkMeta(data[0], hdata[0].hash).then(function(finalData){
                  
                  if(finalData == true){
                    PublisherDomain.update({"id" : metaData.domainId}, {"status": 1, "lastUpdated": currentDt}, function(err,data){
                       if(err){
                         //console.log(err);
                         cb(err); 
                       } else{
                        
                        cb(null, true);
                       }
                    });  
                  }else{
                    
                    PublisherDomain.update({"id" : metaData.domainId}, {"status": 3, "lastUpdated": currentDt}, function(err,data){
                       if(err){
                         //console.log(err);
                         cb(err); 
                       } else{
                        
                        cb(null, false);
                       }
                    });  
                  }
                  
                });

              });
            }  
          }  
        }
      );  
    }

    PublisherDomain.remoteMethod(
        'technicalApproval', 
        {
          accepts: [{arg: 'metaData', type: 'object' , http: { source: 'body'}}],
          returns: {arg: 'meta', type: 'boolean'},
          http: {verb: 'post'}
        }
    );

    /**
	  * Typical remote method for manual approval of a domain
	  * @param {object} domainData [domain info]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return {boolean} domainApprovalStatus
	  *
	  */
    
    PublisherDomain.manualApproval = function(domainData, cb){
      
        var currentDt = PublisherDomain.getCurrentDate();
        var FD_ENDPOINT = config.reviveSetting.hostname;  
        var PublisherCampaign = app.models.PublisherCampaign;
       
        var getDomain = function(domainData){
          var def = q.defer();
         
          PublisherDomain.find({where: {id : domainData.id}}, 
          function(err, data){

              if(err){
                  def.reject(err); return false; 
              } else{
                  def.resolve(data[0]);
              } 

          });
          return def.promise;
        }

        var postCampaigns = function(domainData){
            var def = q.defer();                          
            var common = app.models.CommonModel;
            var AdType = app.models.ProductType;
            getDomain(domainData).then(function(resData){

              AdType.find({}, function(err,adTypes){
                  
                  var typeArr = [];
                  adTypes.forEach(function(eachType){
                      
                      var postBody =   {
                          advertiserId: resData.reviveAdvId,
                          campaignName: resData.domainName+'/'+eachType.short, ////base url
                          priority: 1,
                          weight: 0
                      }
                      
                      var dataBody = JSON.stringify(postBody);
                     
                      var params = {
                          hostname : FD_ENDPOINT ,
                          path : config.reviveSetting.restApi+"/cam/new", 
                          method: "POST",
                          headers: {"Content-type": "application/json","Content-Length": dataBody.length},
                          auth : config.reviveSetting.authentication  
                      }
                     
                      var respn = {};
                      var err = {};
                      
                      if(eachType.short.length >0){
                          
                          common.postDataToApi(params,dataBody,function(err,res){
                              if(res){
                                
                                if(res.isCreated == true){
                                    respn["isSuccess"] = true;
                                    typeArr.push(eachType);
                                    
                                 }else{
                                    respn["isSuccess"] = false;
                                 }
                              }else if(err){
                                //console.log(err);
                                respn["isSuccess"] = false;
                              }
                            
                          });
                          
                      }
                                     
                  });
                  
              });
              
              def.resolve(resData); 
            });
            return def.promise;
        };

        var getCampaigns = function(campData){
            
            var advId = campData.advertiserId;
            var def = q.defer();
            var common = app.models.CommonModel;
           
            var params = {
                hostname : config.reviveSetting.hostname ,
                path : config.reviveSetting.restApi+"/cam/adv/"+advId,   
                method: "GET",
                headers: {"Content-type": "application/json"},
                auth : config.reviveSetting.authentication  
            }
            
            setTimeout(function(){
              common.getDataFromApi(params,function(err,res){
                if(res){
                    
                    def.resolve(res);
                }else{
                  def.reject(err); return false; 
                }
              });
            }, 2000);  
            return def.promise;

        };

        
        if(domainData.status == 2){
            PublisherDomain.update({"id" : domainData.id}, {"status": domainData.status, "lastUpdated": currentDt}, function(err,data){
             if(err){
               //console.log(err);
               cb(err); 
             } else{
                
                postCampaigns(domainData).then(function(pubDomainData){
                  
                  var getCampData = {"domainName":pubDomainData.domainName,"advertiserId" : pubDomainData.reviveAdvId};
                  
                  getCampaigns(getCampData).then(function(data){
                      var tempCampArr = [];
                      var d = q.defer();
                      
                      data.forEach(function(eachCamp){
                          
                          PublisherDomain.getProductId(eachCamp.campaignName).then(function(product){
                            
                            if(eachCamp.campaignName == pubDomainData.domainName+"/"+product.short){

                              var postCampData = {"publisherId":pubDomainData.publisherId,"reviveAdvId":pubDomainData.reviveAdvId,"domainId":pubDomainData.id,"productId":product.id, "reviveCampaignId" : eachCamp.campaignId, "campaignName":eachCamp.campaignName, "status":1, "created":currentDt, "updated":currentDt};
                              
                              tempCampArr.push(d.promise);
                              
                              PublisherCampaign.create(postCampData, function(err, data){
                                   if(err){
                                     cb(err); 
                                   } else{
                                      
                                      d.resolve(data);
                                   }  
                              });
                            }
                          });
                      });
                      
                  });
               });
               cb(null, true);
             }  
          });
        }else{

          PublisherDomain.update({"id" : domainData.id}, {"status": domainData.status, "lastUpdated": currentDt}, function(err,data){
             if(err){
               //console.log(err);
               cb(err); 
             } else{
                cb(null, false);
             }
          });  
        }
        
    }

    PublisherDomain.remoteMethod(
        'manualApproval', 
        {
          accepts: [{arg: 'domainData', type: 'object' , http: { source: 'body'}}],
          returns: {arg: 'domainApprovalStatus', type: 'boolean'},
          http: {verb: 'post'}
        }
    );

    /**
	  * Typical remote method to all domains filter by logged in user( publisher )
	  * @param {object} searhData  [search criteria with publisher id]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return {object} domain
	  *
	  */
    
    PublisherDomain.getDomainsByPublisherId = function(searhData, cb){

      PublisherDomain.find({where: {publisherId : searhData.publisherId}}, 
        function(err, data){

          if(err){
                cb(err); 
          } else{
              if(data.length == 0){
                cb(null, false);
              }
              else{
                cb(null, data);
              }  
          }  
        }
      );  
  }

  PublisherDomain.remoteMethod(
        'getDomainsByPublisherId', 
        {
          accepts: [{arg: 'searhData', type: 'object' , http: { source: 'body'}}],
          returns: {arg: 'domain', type: 'object'},
          http: {verb: 'post'}
        }
  );
  
    /**
	  * Typical remote method to get all domains 
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return {object} domains
	  *
	  */
  
  PublisherDomain.getAllDomains = function(cb){

      PublisherDomain.find({}, 
        function(err, data){

          if(err){
                cb(err); 
          } else{
                
                cb(null, data);
          }  
      });  
  }

  PublisherDomain.remoteMethod(
      'getAllDomains', 
      {
        //accepts: [{arg: 'searhData', type: 'object' , http: { source: 'body'}}],
        returns: {arg: 'domains', type: 'object'},
        http: {verb: 'get'}
      }
  );
  
    /**
	  * Typical remote method to technically approve the domain used for Pecunio Admin
	  * @param {object} domainData [doamin information]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return {boolean} domainApprovalStatus
	  *
	  */
  
  PublisherDomain.technicalApprovalForAdmin = function(domainData, cb){
    
      var currentDt = PublisherDomain.getCurrentDate();
      PublisherDomain.update({"id": domainData.domainId}, {"status": domainData.status, "lastUpdated": currentDt}, function(err,data){
         if(err){
           //console.log(err);
           cb(err); 
         } else{
          
          cb(null, true);
         }
      });  
  }

  PublisherDomain.remoteMethod(
        'technicalApprovalForAdmin', 
        {
          accepts: [{arg: 'domainData', type: 'object' , http: { source: 'body'}}],
          returns: {arg: 'domainApprovalStatus', type: 'boolean'},
          http: {verb: 'post'}
        }
  );
  
    /**
	  * PublisherDomain method to get current date from moment timezone
	  * 
	  * @return {string} currentDt
	  *
	  */
  
  PublisherDomain.getCurrentDate = function(){
    var t = momentTz().tz("America/New_York");
    t.set('hour', 0);
    t.set('minute', 0);
    t.set('second', 0);
    t.set('millisecond', 0);
    var currentDt = t.utc().valueOf();
    return currentDt;
  }
  
    /**
	  * PublisherDomain method to get product details from productType table 
	  * @param {string} campName
	  */
  
  PublisherDomain.getProductId = function(campName){
    var ProductType = app.models.ProductType;
    var pos = campName.lastIndexOf('/')+1;
    var product = campName.substring(pos);
    var d = q.defer();
    ProductType.find({where : {'short' : product}}, function(err,data){
      d.resolve(data[0]);
    });
    return d.promise;
  }
}
