var app = require('../../server/server.js');
var https = require("http"); 
var q = require('q');
var fs      = require('fs');
var path    = require('path');
var momentTz = require('moment-timezone');
var bcrypt = require('bcrypt');
var loopback = require('loopback');
var nodemailer = require('nodemailer');
var config = require('../../server/config');
//var st = require('passport-google-oauth');

module.exports = function(PecunioUser) {
  
	/**
	  * Typical remote method to get account users of an account owner!!
	  * @param {object} userData   [User info with user id]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return boolean...
	  *
	  */
    PecunioUser.getAccountUsers = function(userData, cb) {
      
      var Affiliate = app.models.Affiliates;
      var User = app.models.PecunioUser;
      var RoleMapping = app.models.RoleMapping;
      
      
      var getUser = function(uid){
          var d = q.defer();
          User.find({where: {id : uid}}, function(err, data){

            RoleMapping.find({where: {principalId : data[0].id}}, function(err,roledata){
                data[0].role = roledata[0].roleId;
                d.resolve(data); 
            });               
          });
          return d.promise;
      };

      Affiliate.find({where: {accountOwnerId : userData.id}}, function(err, users) {
         
            var tempArr = [];
            var userArr = [];
            
            users.forEach(function(eachUser){
                
                if(eachUser.accountOwnerId != 0){

                  var d1 = q.defer();
                  tempArr.push(d1.promise);

                  getUser(eachUser.userId).then(function(userData){
                    
                    eachUser.username = userData[0].username;
                    eachUser.email = userData[0].email;
                    eachUser.entityType = PecunioUser.getEntity(userData[0].entityType);
                    eachUser.realm = userData[0].realm;
                    eachUser.role = userData[0].role;
                    eachUser.status = userData[0].status;
                    if(eachUser.status!=2){
                      userArr.push(eachUser);
                    }
                    
                    d1.resolve(userArr);

                  });
                }
                                
            });
            
            q.all(tempArr).then(function(resultSet){
            
              cb(null, resultSet);

            });
          
      });
          
    };
     
    PecunioUser.remoteMethod(
        'getAccountUsers', 
        {
          accepts: [{arg: 'userData', type: 'object' , http: { source: 'body'}}],
          returns: {arg: 'users', type: 'object'},
          http: {verb: 'post'}
        }
    );

    

    /**
	  * Typical remote method validator for Unique Email!!
	  * @param {object} userData
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return boolean...
	  *
	  */
    PecunioUser.getRoles = function(userData, cb) {
      
      var Role = app.models.Role;
            
      Role.find(function(err, data){

          cb(null, data);            
      });
                  
    };
     
    PecunioUser.remoteMethod(
        'getRoles', 
        {
          accepts: [{arg: 'userData', type: 'object' , http: { source: 'body'}}],
          returns: {arg: 'roles', type: 'object'},
          http: {verb: 'get'}
        }
    );

    /**
	  * Typical remote method validator for Unique Email!!
	  * @param {object} userData   [user data with accountOwnerId]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return boolean...
	  *
	  */
    PecunioUser.getGroups = function(userData, cb) {
      
      var Group = app.models.Group;
      
      Group.find({where: {accountOwnerId:userData.accountOwnerId, status:{between: [0, 1]}}, 
          order: "name ASC" 
          }, function(err, data){
          cb(null, data);            
      });
                  
    };
     
    PecunioUser.remoteMethod(
        'getGroups', 
        {
          accepts: [{arg: 'userData', type: 'object' , http: { source: 'body'}}],
          returns: {arg: 'groups', type: 'object'},
          http: {verb: 'post'}
        }
    );

    /**
	  * Typical remote method validator for Unique Email!!
	  * @param {object} userData   [user data with user id]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return boolean...
	  *
	  */
    PecunioUser.getDomains = function(userData, cb) {
      
      var Domain = app.models.PublisherDomain;
      
      Domain.find({where: {publisherId:userData.publisherId}}, function(err, data){
          
          cb(null, data);            
      });
                  
    };
     
    PecunioUser.remoteMethod(
        'getDomains', 
        {
          accepts: [{arg: 'userData', type: 'object' , http: { source: 'body'}}],
          returns: {arg: 'domains', type: 'object'},
          http: {verb: 'post'}
        }
    );

    /**
	  * Typical remote method validator for Unique Email!!
	  * @param {object} userData   [user data with user id]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return boolean...
	  *
	  */
    PecunioUser.getDomain = function(data, cb) {
      
      var Domain = app.models.PublisherDomain;
      
      Domain.find({where: {id:data.id}}, function(err, data){
          
          cb(null, data);            
      });
                  
    };
     
    PecunioUser.remoteMethod(
        'getDomain', 
        {
          accepts: [{arg: 'data', type: 'object' , http: { source: 'body'}}],
          returns: {arg: 'domain', type: 'object'},
          http: {verb: 'post'}
        }
    );

    /**
	  * Typical remote method validator for Unique Email!!
	  * @param {object} userData   [user data with user id, status]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return boolean...
	  *
	  */
    PecunioUser.changeStatus = function(userData, cb) {
      
      var User = app.models.PecunioUser;
      var currentDt = PecunioUser.getCurrentDate();
      User.update({"id" : userData.id}, {"status": userData.status, "lastUpdated": currentDt}, function(err,data){
           if(err){
             cb(err); 
           } else{
            
             cb(null, data);
           }  
        });
    };
     
    PecunioUser.remoteMethod(
        'changeStatus', 
        {
          accepts: [{arg: 'userData', type: 'object' , http: { source: 'body'}}],
          returns: {arg: 'user', type: 'object'},
          http: {verb: 'post'}
        }
    ); 

    /**
	  * Typical remote method validator for Unique Email!!
	  * @param {object} userData   [User data with user id, user realm]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return boolean...
	  *
	  */
    PecunioUser.changeGroup = function(userData, cb) {
      
      var User = app.models.PecunioUser;
      
      var currentDt = PecunioUser.getCurrentDate();

     
      User.update({"id" : userData.id}, {"realm": userData.realm, "lastUpdated": currentDt}, function(err,data){
           if(err){
             cb(err); 
           } else{
            
             cb(null, data);
           }  
        });
     

      
    };
     
    PecunioUser.remoteMethod(
        'changeGroup', 
        {
          accepts: [{arg: 'userData', type: 'object' , http: { source: 'body'}}],
          returns: {arg: 'user', type: 'object'},
          http: {verb: 'post'}
        }
    ); 

    /**
	  * Typical remote method validator for Unique Email!!
	  * @param {object} userData   [Role info of an user]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return boolean...
	  *
	  */
    PecunioUser.changeRole = function(userData, cb) {
      
      var RoleMapping = app.models.RoleMapping;
      
      var currentDt = PecunioUser.getCurrentDate();

     
      RoleMapping.update({"principalId" : userData.id}, {"roleId": userData.role, "lastUpdated": currentDt}, function(err,data){
         if(err){
           cb(err); 
         } else{
          
           cb(null, data);
         }  
      });
      
    };
     
    PecunioUser.remoteMethod(
        'changeRole', 
        {
          accepts: [{arg: 'userData', type: 'object' , http: { source: 'body'}}],
          returns: {arg: 'user', type: 'object'},
          http: {verb: 'post'}
        }
    ); 
    
    /**
	  * Typical remote method validator for Unique Email!!
	  * @param {object} userData   [User info with user id]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return boolean...
	  *
	  */
    PecunioUser.deleteUser = function(userData, cb) {
      
      var User = app.models.PecunioUser;
      var query;

      var t = momentTz().tz("America/New_York");
      t.set('hour', 0);
      t.set('minute', 0);
      t.set('second', 0);
      t.set('millisecond', 0);
      var currentDt = t.utc().valueOf();

     
      User.update({"id" : userData.id}, {"status": 2, "lastUpdated": currentDt}, function(err,data){
           if(err){

             cb(err); 

           } else{
            
             cb(null, data);
           }  
        });
           
    };
     
    PecunioUser.remoteMethod(
        'deleteUser', 
        {
          accepts: [{arg: 'userData', type: 'object' , http: { source: 'body'}}],
          returns: {arg: 'user', type: 'object'},
          http: {verb: 'post'}
        }
    ); 

    /**
	  * Typical remote method create account user!!
	  * @param {object} userData   [User info to create a new account user]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return boolean...
	  *
	  */
    PecunioUser.createAccountUser = function(userData, cb) {
      
      var User = app.models.PecunioUser;
      var Affiliate = app.models.Affiliates;
      var RoleMapping = app.models.RoleMapping;
     
      var currentDt = PecunioUser.getCurrentDate();
      
      userData.user.id = "";
      /*var fullName = userData.affiliate.fullName;
      var fullNameArr = fullName.split(' ');
      var username = '';
      fullNameArr.forEach(function(eachName){

         username+=eachName;
      });*/
      userData.user.username = userData.user.email;
      userData.user.password = userData.user.username;
      userData.user.entityType = 2;

      userData.user.status = 1;
      userData.user.created = currentDt;
      userData.user.lastUpdated = currentDt;

      var Usercreate = function(user) {
          var def = q.defer();
          User.create(user, function(err,data){
           if(err){ 
             def.reject(err); return false; 
           } else{
             def.resolve(data);
           }
          });
          return def.promise;
      };

      var Affiliatecreate = function(affiliate) {
          var def = q.defer();
          
          Affiliate.create(affiliate, function(err,data){
             if(err){ 
                def.reject(err); return false; 
             } else{
                def.resolve(data);
             }
          });
          return def.promise;
      };

      var RoleMappingCreate = function(dataSet) {
          var d = q.defer();
          RoleMapping.create(dataSet, function(err,data){
           if(err){
             d.reject(err); return false; 
           } else{
             d.resolve(data);
           }
          });
          return d.promise;
      };
      
      // as validation is already defined in base user model
      var uservalid =  User(userData.user);
      uservalid.isValid(function(valid){
        if(valid){

          Usercreate(userData.user).then(function(result) {
            
            var def1 = q.defer();
            var def2 = q.defer();
            var tempArr = [];
            tempArr.push(def1.promise);
            tempArr.push(def2.promise);

            
            userData.affiliate.id = "";
            userData.affiliate.userId = result.id;
            userData.affiliate.created = currentDt;
            userData.affiliate.lastUpdated = currentDt;
          
            Affiliatecreate(userData.affiliate).then(function(resData){
      
              def1.resolve(resData);
                            
            },function(err){
              
              cb(err);
            });
            
            var roleMapData = {"principalType":"USER","principalId":result.id, "roleId":userData.role};
            
            RoleMappingCreate(roleMapData).then(function(resData){

              def2.resolve(resData);
              
            },function(err){
              
              cb(err);
            });

            q.all(tempArr).then(function(resArr){
             
              cb(null,resArr[0]);
            });
          }, function(err) {
            
            cb(err);

          });

        } else {
          cb(uservalid.errors);
        }
      });
     
           
    };
     
    PecunioUser.remoteMethod(
        'createAccountUser', 
        {
          accepts: [{arg: 'userData', type: 'object' , http: { source: 'body'}}],
          returns: {arg: 'user', type: 'object'},
          http: {verb: 'post'}
        }
    ); 

    /**
	  * Typical remote method to create a password link and send it to the user email!!
	  * @param {object} emailData   [User email data]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return boolean...
	  *
	  */
    PecunioUser.sendCreatePasswordLink = function(emailData, cb) {
     
     
      if(emailData){
        var ctx = loopback.getCurrentContext();
        var currentUser = ctx && ctx.get('currentUser');
        
        var User = app.models.PecunioUser;
        
        var transporter = nodemailer.createTransport(config.smtpmailsetting);
        var emailBody = fs.readFileSync('server/emailtemplate/createPassword.html',"utf8");
        emailBody = emailBody.replace("###LINK###", emailData.changePasswordlink);
        
        var fromEmail = currentUser.email;
         
        User.findById(emailData.uId, function(error, subusers){
          if(subusers){
            var toMail = subusers.email;
            var resp = {};
            emailBody = emailBody.replace("###USERNAME###", subusers.username);
            var mailOptions = {
                  from: fromEmail, // sender address
                  to: toMail, 
                  subject: "Create Password", // Subject line
                  html: emailBody // html body
              };
            
            transporter.sendMail(mailOptions, function(error){
                var def = q.defer();
                if(error){
                  
                    //cb(error);
                    resp["isSent"] = false;
                    resp["data"] = error;
                    def.resolve(resp);
                }else{
                  var obj = {"mailsentto": toMail};
                    resp["isSent"] = true;
                    resp["data"] = obj;
                    
                    //def.resolve(resp);
                    cb(null,resp);
                }
            });
          }
         
        });
        
      }
           
    };
     
    PecunioUser.remoteMethod(
        'sendCreatePasswordLink', 
        {
          accepts: [{arg: 'emailData', type: 'object' , http: { source: 'body'}}],
          returns: {arg: 'status', type: 'object'},
          http: {path: '/sendCreatePasswordLink', verb: 'post'}
        }
    ); 

    /**
	  * Typical remote method to edit account user!!
	  * @param {object} userData   []
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return boolean...
	  *
	  */
    PecunioUser.editAccountUser = function(userData, cb) {
      
      var User = app.models.PecunioUser;
      var Affiliate = app.models.Affiliates;
      var RoleMapping = app.models.RoleMapping;
     
      var currentDt = PecunioUser.getCurrentDate();
      
      userData.user.lastUpdated = currentDt;
      
      /*var fullName = userData.affiliate.fullName;
      var fullNameArr = fullName.split(' ');
      var username = '';
      fullNameArr.forEach(function(eachName){
         username+=eachName;
      });*/
      userData.user.username = userData.user.email;

      var UserUpdate = function(user) {
          var def = q.defer();
          User.update({"id" : user.id}, user, function(err,data){
             if(err){ 
               def.reject(err); return false; 
             } else{
               def.resolve(data);
             }
          });
          return def.promise;
      };

      var AffiliateUpdate = function(affiliate) {
          var def = q.defer();
          Affiliate.update({"userId" : affiliate.userId}, affiliate, function(err,data){
             if(err){ 
                def.reject(err); return false; 
             } else{

                def.resolve(data);
             }
          });
          return def.promise;
      };

      var RoleMappingUpdate = function(role) {
          var d = q.defer();
          RoleMapping.update({"principalId" : role.principalId}, role, function(err,data){
             if(err){
               d.reject(err); return false; 
             } else{
               d.resolve(data);
             }
          });
          return d.promise;
      };
      
      // as validation is already defined in base user model
      var uservalid =  User(userData.user);
      uservalid.isValid(function(valid){
        if(valid){

          UserUpdate(userData.user).then(function(result) {
            
            var def1 = q.defer();
            var def2 = q.defer();
            var tempArr = [];
            tempArr.push(def1.promise);
            tempArr.push(def2.promise);

            userData.affiliate.lastUpdated = currentDt;
          
            AffiliateUpdate(userData.affiliate).then(function(resData){
      
              def1.resolve(resData);
                            
            },function(err){
              
              cb(err);
            });
            
            var roleMapData = {"principalType":"USER","principalId":userData.user.id, "roleId":userData.role};
            
            RoleMappingUpdate(roleMapData).then(function(resData){

              def2.resolve(resData);
              
            },function(err){
              
              cb(err);
            });

            q.all(tempArr).then(function(resArr){
             
              cb(null,true);
            });
          }, function(err) {
            
            cb(err);

          });

        } else {
          cb(uservalid.errors);
        }
      });
     
           
    };
     
    PecunioUser.remoteMethod(
        'editAccountUser', 
        {
          accepts: [{arg: 'userData', type: 'object' , http: { source: 'body'}}],
          returns: {arg: 'user', type: 'boolean'},
          http: {verb: 'post'}
        }
    ); 

    /**
	  * Typical remote method to get account user data!!
	  * @param {object} userData   [User info containing user id]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return boolean...
	  *
	  */
    PecunioUser.getAccountUser = function(userData, cb) {
      
      var Affiliate = app.models.Affiliates;
      var User = app.models.PecunioUser;
      var RoleMapping = app.models.RoleMapping;
      
      var getUser = function(uid){
          var d = q.defer();
          User.find({where: {id : uid}}, function(err, data){

            if(err){
                cb(err); 
            } else{
                d.resolve(data);
            }  
            
          });
          return d.promise;
      }

      var getAffiliate = function(userId){
          var d = q.defer();
          
          Affiliate.find({where: {userId : userId}}, function(err, data){

            if(err){
             cb(err); 
             } else{
               d.resolve(data);
             }  
            
          });
          return d.promise;
      }

      var getRole = function(userId){
          var d = q.defer();
          
          RoleMapping.find({where: {principalId : userId}}, function(err, data){

            if(err){
             cb(err); 
             } else{
               d.resolve(data);
             }  
            
          });
          return d.promise;
      }

      
      var finalDataArr;
      getUser(userData.id).then(function(user){
          
          getAffiliate(user[0].id).then(function(affiliate){

            getRole(user[0].id).then(function(role){

                var finalData = {'user':user[0], 'affiliate':affiliate[0], 'role':role[0]};
                cb(null, finalData);  
            });

          });
      });
     
          
    };
     
    PecunioUser.remoteMethod(
        'getAccountUser', 
        {
          accepts: [{arg: 'userData', type: 'object', required: true, http: { source: 'body'}}],
          returns: {arg: 'user', type: 'object'},
          http: {verb: 'post'}
        }
    );

    /**
	  * Typical remote method whether email exist or not!!
	  * @param {object} userData   [User Info with email data]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return {object} userData
	  *
	  */
    PecunioUser.checkEmailExists = function(userData, cb) {
      
      var User = app.models.PecunioUser;
      
      
      User.find({where: {email : userData.email} }, function(err, user) {
         if(err){
           cb(err); 
         } else{
          
           cb(null, user[0]);
         }  
      });
          
    };
     
    PecunioUser.remoteMethod(
        'checkEmailExists', 
        {
          accepts: [{arg: 'userData', type: 'object' , http: { source: 'body'}}],
          returns: {arg: 'userData', type: 'object'},
          http: {verb: 'post'}
        }
    );

    /**
    * Typical remote method whether fb id exist or not!!
    * @param {object} userData   [User Info with fb data]
    * @param {Function} cb       [callback function to send the response back to client side]
    * 
    * @return {object} userData
    *
    */
    PecunioUser.checkFaceBookId = function(userData, cb) {
      
      var Affiliate = app.models.Affiliates;
      var User = app.models.PecunioUser;
      
      Affiliate.find({where: {facebook : userData.facebook} }, function(err, user) {
         
         if(err){
           cb(err); 
         } else{
           
           if(user.length > 0){
              User.find({where: {id : user[0].userId} }, function(err, data) {
               
                cb(null, data[0]);
              });
           }else{
            
            cb(null, user[0]);
           }
           
         }  
      });

    };
     
    PecunioUser.remoteMethod(
        'checkFaceBookId', 
        {
          accepts: [{arg: 'userData', type: 'object' , http: { source: 'body'}}],
          returns: {arg: 'userData', type: 'object'},
          http: {verb: 'post'}
        }
    );

    /**
    * Typical remote method whether fb id exist or not!!
    * @param {object} userData   [User Info with fb data]
    * @param {Function} cb       [callback function to send the response back to client side]
    * 
    * @return {object} userData
    *
    */
    PecunioUser.checkGoogleAppId = function(userData, cb) {
      
      
      var Affiliate = app.models.Affiliates;
      var User = app.models.PecunioUser;
      
      Affiliate.find({where: {googlePlus : userData.googlePlus} }, function(err, user) {
         
         if(err){
           cb(err); 
         } else{
           
           if(user.length > 0){
              User.find({where: {id : user[0].userId} }, function(err, data) {
                
                cb(null, data[0]);
              });
           }else{
            
            cb(null, user[0]);
           }
           
         }  
      });
          
    };
     
    PecunioUser.remoteMethod(
        'checkGoogleAppId', 
        {
          accepts: [{arg: 'userData', type: 'object' , http: { source: 'body'}}],
          returns: {arg: 'userData', type: 'object'},
          http: {verb: 'post'}
        }
    );

    /**
	  * Typical remote method to change password of an user!!
	  * @param {object} userData   [User info containing new password]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return {object} user
	  *
	  */
    PecunioUser.changePassword = function(userData, cb) {
      
      var User = app.models.PecunioUser;
      var currentDt = PecunioUser.getCurrentDate();

      var query = {password : userData.password};
     
      var def = q.defer();
      bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(userData.password, salt, function(err, hash) {
          
              
              def.resolve({'pass' : hash});

          });
      });

      def.promise.then(function(res){

        userData.password = res.pass;
        User.update({"id" : userData.id}, {"password": userData.password, "lastUpdated": currentDt}, function(err,data){
           if(err){
             cb(err); 
           } else{
            
             cb(null, data);
           }  
        });
      });

      
    };
     
    PecunioUser.remoteMethod(
        'changePassword', 
        {
          accepts: [{arg: 'userData', type: 'object' , http: { source: 'body'}}],
          returns: {arg: 'user', type: 'object'},
          http: {verb: 'post'}
        }
    ); 
    
    /**
	  * Typical remote method to register a new user( Account owner )!!
	  * @param {object} userData   [User Info to register a new user]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return {object} user
	  *
	  */
  PecunioUser.register = function(userData, cb) {
      
      
      var currentDt = PecunioUser.getCurrentDate();
      
      userData.user.id = "";
      userData.user.status = 1;
      /*var fullName = userData.affiliate.fullName;
      var fullNameArr = fullName.split(' ');
      var username = '';
      fullNameArr.forEach(function(eachName){
         username+=eachName;
      });*/
      userData.user.username = userData.user.email;
      userData.user.realm = 0;
      userData.user.created = currentDt;
      userData.user.lastUpdated = currentDt;

      
      var User = app.models.PecunioUser;
      var Affiliate = app.models.Affiliates;
      var RoleMapping = app.models.RoleMapping;
      var Company = app.models.Company;
      var Finance = app.models.Finance;
      var Hash = app.models.UserHash;
      var AffiliatePartner = app.models.AffiliatePartner;

      var Usercreate = function(user) {
          var def = q.defer();
          User.create(user, function(err,data){
           if(err){ 
             def.reject(err); return false; 
           } else{
              var FD_ENDPOINT = config.reviveSetting.hostname; 
              var postUser = function(){
                  var postBody =   {
                      "advertiserName":data.username,
                      "contactName":data.username,
                      "emailAddress":data.email,
                      "username":data.username,
                      "password":data.password
                  }
                  
                  var dataBody = JSON.stringify(postBody);
                  
                  var params = {
                      hostname : FD_ENDPOINT ,
                      path : config.reviveSetting.restApi+"/adv/new", 
                      method: "POST",
                      headers: {"Content-type": "application/json","Content-Length": dataBody.length},
                      auth : config.reviveSetting.authentication    ////'admin:aDw!nLtT[0#Se'
                  }
                  
                  var respn = {};
                  var err = {};
                  var req = https.request(params, function(res){
                      
                      if(res.statusCode == 200 ){
                        respn['isSuccess'] = true;
                        
                      }else {
                        respn['isSuccess'] = false;
                      }        
                  });
                  var e = req.write(dataBody);
                  req.end();
              }();

             def.resolve(data);
           }
          });
          return def.promise;
      };

      var Affiliatecreate = function(affiliate) {
          var def = q.defer();
          
          Affiliate.create(affiliate, function(err,data){
             if(err){ 
                def.reject(err); return false; 
             } else{

                def.resolve(data);
             }
          });
          return def.promise;
      };

      var RoleMappingCreate = function(dataSet) {
          
          var d = q.defer();
          RoleMapping.create(dataSet, function(err,data){
           if(err){
             d.reject(err); return false; 
           } else{
             
             d.resolve(data);
           }
          });
          return d.promise;
      };

      var CompanyCreate = function(company) {
          
          var d = q.defer();
          Company.create(company, function(err,data){
           if(err){
            
             d.reject(err); return false; 
           } else{
             
             d.resolve(data);
           }
          });
          return d.promise;
      };

      var FinanceCreate = function(finance) {
          
          var d = q.defer();
          Finance.create(finance, function(err,data){
           if(err){
            
             d.reject(err); return false; 
           } else{
             
             d.resolve(data);
           }
          });
          return d.promise;
      };

      var HashCreate = function(userId) {
          
          var d = q.defer();
          var randomId   = (Math.floor(Math.random()*90000) + 10000).toString();
          var slotId = bcrypt.hashSync(randomId, 2);
          
          Hash.create({userId : userId, hash : slotId}, function(err,data){
             if(err){
              
               d.reject(err); return false; 
             } else{
              
               d.resolve(data);
             }
          });
          return d.promise;
      };

      var AffiliatePartnerCreate = function(affiliateData) {
          var def = q.defer();
          
          AffiliatePartner.create(affiliateData, function(err,data){
             if(err){ 
              
                def.reject(err); return false; 
             } else{

                def.resolve(data);
             }
          });
          return def.promise;
      };

      //As base model is user following checking will be done automatically
      //User.validatesUniquenessOf('email', {message: 'Email already exists'});
      //User.validatesFormatOf('email', {with: re, message: 'Must provide a valid email'});
      //User.validatesUniquenessOf('username',  {message: 'User already exists'});
      
      // as validation is already defined in base user model
      var uservalid =  User(userData.user);
      uservalid.isValid(function(valid){
        if(valid){

          Usercreate(userData.user).then(function(result) {
            
            var def1 = q.defer();
            var def2 = q.defer();
            var def3 = q.defer();
            var def4 = q.defer();
            var def5 = q.defer();
            var def6 = q.defer();
            var tempArr = [];
            tempArr.push(def1.promise);
            tempArr.push(def2.promise);
            tempArr.push(def3.promise);
            tempArr.push(def4.promise);
            tempArr.push(def5.promise);
            tempArr.push(def6.promise);

            userData.affiliate.id = "";
            userData.affiliate.userId = result.id;
            userData.affiliate.accountOwnerId = 0;
            userData.affiliate.created = currentDt;
            userData.affiliate.lastUpdated = currentDt;
            
            Affiliatecreate(userData.affiliate).then(function(resData){
             
              
              def1.resolve(resData);
                            
            },function(err){
              
              cb(err);
            });
            
            var roleMapData = {"principalType":"USER","principalId":result.id, "roleId":1};
            
            RoleMappingCreate(roleMapData).then(function(resData){

              def2.resolve(resData);
              
            },function(err){
              
              cb(err);
            });

            var company = {"companyName" : userData.affiliate.organisation, "userId":result.id};
           
            CompanyCreate(company).then(function(compData){
              
              def3.resolve(compData);
              
            },function(err){
              
              cb(err);
            });

            var finance = {"accountHolderName" : userData.affiliate.fullName, "userId":result.id};
            

            FinanceCreate(finance).then(function(financeData){
              
              def4.resolve(financeData);
              
            },function(err){
              
              cb(err);
            });

            var AffiliatePartnerData = {"uid" : result.id, "companyName":userData.affiliate.organisation, "email" : result.email};
           
            AffiliatePartnerCreate(AffiliatePartnerData).then(function(affData){
              
              def5.resolve(affData);
              
            },function(err){
              
              cb(err);
            });

            
            HashCreate(result.id).then(function(hashData){
              
              def6.resolve(hashData);
              
            },function(err){
              
              cb(err);
            });

            q.all(tempArr).then(function(resArr){
              
              cb(null,resArr[0]);
            });
          }, function(err) {
            
            cb(err);

          });

        } else {
          cb(uservalid.errors);
        }
      });
     
             
  };
  PecunioUser.remoteMethod(
      'register',
      {
        accepts: [{arg: 'userData', type: 'object' , required: true, http: { source: 'body' }}],
        returns: {arg: 'user', type: 'object'},
        http: {path: '/register', verb: 'post'}
      }
  );

    /**
	  * Typical remote method get user data!!
	  * @param {object} userData   [User info with userId to get user personal information]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return {object} user
	  *
	  */
    PecunioUser.getPersonalData = function(userData, cb) {
      
      var Affiliate = app.models.Affiliates;
      var User = app.models.PecunioUser;
      var RoleMapping = app.models.RoleMapping;
      
      
      var getUser = function(uid){
          var d = q.defer();
          User.find({where: {id : uid}}, function(err, data){

            if(err){
                cb(err); 
            } else{
                d.resolve(data);
            }  
            
          });
          return d.promise;
      }

      var getAffiliate = function(userId){
          var d = q.defer();
          
          Affiliate.find({where: {userId : userId}}, function(err, data){

            if(err){
             cb(err); 
             } else{
               d.resolve(data);
             }  
            
          });
          return d.promise;
      }

      var getRole = function(userId){
          var d = q.defer();
          
          RoleMapping.find({where: {principalId : userId}}, function(err, data){

            if(err){
             cb(err); 
             } else{
               d.resolve(data);
             }  
            
          });
          return d.promise;
      }

      var getAccountOwnerEmail = function(ownerId){
          var d = q.defer();
          
          User.find({where: {id : ownerId}}, function(err, data){

            if(err){
             cb(err); 
             } else{
               d.resolve(data);
             }  
            
          });
          return d.promise;
      }

      var finalDataArr;
      getUser(userData.id).then(function(user){
          
          getAffiliate(user[0].id).then(function(affiliate){

            getRole(user[0].id).then(function(role){

                getAccountOwnerEmail(affiliate[0].accountOwnerId).then(function(accOwner){
                  
                    var finalData = {'user':user[0], 'affiliate':affiliate[0], 'role':role[0], 'accountOwner':accOwner[0]};
                    
                    cb(null, finalData);  
                });
                
            });

          });
      });
          
    };
     
    PecunioUser.remoteMethod(
        'getPersonalData', 
        {
          accepts: [{arg: 'userData', type: 'object', required: true, http: { source: 'body'}}],
          returns: {arg: 'user', type: 'object'},
          http: {verb: 'post'}
        }
    );

    /**
	  * Typical remote method edit Personal Data of an user!!
	  * @param {object} userData   [User info to update user data]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return {object} user
	  *
	  */
    PecunioUser.editPersonalData = function(userData ,cb) {
      
      var User = app.models.PecunioUser;
      var Affiliate = app.models.Affiliates;
      
      var currentDt = PecunioUser.getCurrentDate();
      var user = {};
      var affiliate = {};
      user = userData.user;
      user.lastUpdated = currentDt;

      affiliate = userData.affiliate;
      affiliate.lastUpdated = currentDt;
     
     
      var userUpdate = function(user){
        
        var d = q.defer();
        User.update({"id" : user.id}, user, function(err,data){
           if(err){
             cb(err); 
           } else{
            
             d.resolve(data);
           }  

        });
        return d.promise;
      }
      
      var affiliateUpdate = function(affiliate, id){
        
        var d = q.defer();
        Affiliate.update({"userId" : id}, affiliate, function(err,data){
           if(err){
             cb(err); 
           } else{
             d.resolve(data);
           }  

        });
        return d.promise;
      }
      
      userUpdate(user).then(function(resData){
       
         affiliateUpdate(affiliate, user.id).then(function(affiliate){

            var finalData = {'user':user, 'affiliate':affiliate};
            cb(null, finalData);
         });
      });
    };
     
    PecunioUser.remoteMethod(
        'editPersonalData', 
        {
          accepts: [{arg: 'userData', type: 'object' , required: true, http: { source: 'body'}}],
          returns: {arg: 'user', type: 'object'},
          http: {verb: 'post'}
        }
    );  
    
    /**
	  * Method to set the currentdate using moment
	  * @return currentDt
	  *
	  */
    PecunioUser.getCurrentDate = function(){
      var t = momentTz().tz("America/New_York");
      t.set('hour', 0);
      t.set('minute', 0);
      t.set('second', 0);
      t.set('millisecond', 0);
      var currentDt = t.utc().valueOf();
      return currentDt;
    }
    
    /**
	  * Typical remote method to get entity!!
	  * @param {integer} entityType
	  * 
	  * @return {string} entity
	  *
	  */
    PecunioUser.getEntity = function(entityType){

      var entity;
      switch(entityType) {
          case 0:
              entity = "BETREIBER";
              break;
          case 1:
              entity = "KUNDE";
              break;
          case 2:
              entity = "AFFILIATE";
              break;
          case 3:
              entity = "CALLCENTER";
              break;    
          default:
              entity = "";
      }

      return entity;
    }
    /**
	  * Typical remote method to get role name from Role table!!
	  * @param {object} userData   [User info to get role]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return {object} role
	  *
	  */
    PecunioUser.getRoleName = function(userData, cb){

      var Role = app.models.Role;
      
      Role.find({where: {id : userData.roleId}}, function(err, data){
          if(err){
              
              cb(err); 
          } else{
              
              cb(null, data[0]);
          }  
      });
    };
     
    PecunioUser.remoteMethod(
        'getRoleName', 
        {
          accepts: [{arg: 'userData', type: 'object' , required: true, http: { source: 'body'}}],
          returns: {arg: 'role', type: 'object'},
          http: {verb: 'post'}
        }
    ); 

    /**
	  * Typical remote method to save group data in the Group table!!
	  * @param {object} data       [Group data to save group]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return {object} group
	  *
	  */
    PecunioUser.saveGroup = function(data, cb){
      
      var Group = app.models.Group;
      if(data.id > 0){
        Group.update({"id" : data.id}, data, function(err,data){
           if(err){
             cb(err); 
           } else{
             
             cb(null, data[0]);
           }  

        });
      }else{
        Group.create(data, function(err, data){
            if(err){
                cb(err); 
            } else{
                
                cb(null, data[0]);
            }  
        });
      }
      
    };
     
    PecunioUser.remoteMethod(
        'saveGroup', 
        {
          accepts: [{arg: 'data', type: 'object' , required: true, http: { source: 'body'}}],
          returns: {arg: 'group', type: 'object'},
          http: {verb: 'post'}
        }
    );   

    /**
	  * Typical remote method to delete a group in the Group table!!
	  * @param {object} data       [Group info for deletion]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return {boolean} group
	  *
	  */
    PecunioUser.deleteGroup = function(data, cb) {
      
      var Group = app.models.Group;
      
      Group.update({"id" : data.id}, {"status": 2}, function(err,data){
           if(err){

             cb(err); 

           } else{
            
             cb(null, true);
           }  
        });
           
    };
     
    PecunioUser.remoteMethod(
        'deleteGroup', 
        {
          accepts: [{arg: 'data', type: 'object' , required: true, http: { source: 'body'}}],
          returns: {arg: 'group', type: 'boolean'},
          http: {verb: 'post'}
        }
    ); 

    /**
	  * Typical remote method to get group of an user from Group table!!
	  * @param {object} userData	[user data]
	  * @param {Function} cb       	[callback function to send the response back to client side]
	  * 
	  * @return {object} group
	  *
	  */
    PecunioUser.getGroup = function(userData, cb) {
      
      var Group = app.models.Group;
      
      Group.find({where: {id:userData.id}}, function(err, data){
          
          cb(null, data);            
      });
                  
    };
     
    PecunioUser.remoteMethod(
        'getGroup', 
        {
          accepts: [{arg: 'userData', type: 'object' , http: { source: 'body'}}],
          returns: {arg: 'group', type: 'object'},
          http: {verb: 'post'}
        }
    );

    /**
	  * Typical remote method to get company data from Comapny table!!
	  * @param {object} userData	[user data]
	  * @param {Function} cb       	[callback function to send the response back to client side]
	  * 
	  * @return {object} company
	  *
	  */
    PecunioUser.getCompany = function(userData, cb) {
      
      var Company = app.models.Company;
      
      Company.find({where: userData}, function(err, data){
          
          cb(null, data);            
      });
                  
    };
     
    PecunioUser.remoteMethod(
        'getCompany', 
        {
          accepts: [{arg: 'userData', type: 'object' , http: { source: 'body'}}],
          returns: {arg: 'comapny', type: 'object'},
          http: {verb: 'post'}
        }
    );
    /**
	  * Typical remote method to save company data in Company table!!
	  * @param {object} data       [Company info]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return {object} company
	  *
	  */
    PecunioUser.saveCompany = function(data, cb){

      var Company = app.models.Company;
      Company.update({"id" : data.id}, data, function(err,data){
         if(err){
           
           cb(err); 
         } else{
           cb(null, data[0]);
         }  
      });      
    };
    PecunioUser.remoteMethod(
        'saveCompany', 
        {
          accepts: [{arg: 'data', type: 'object' , required: 'true', http: { source: 'body'}}],
          returns: {arg: 'comapny', type: 'object'},
          http: {verb: 'post'}
        }
    );

    /**
	  * Typical remote method to get finance data from Finance table!!
	  * @param {object} userData	[User Info]
	  * @param {Function} cb       	[callback function to send the response back to client side]
	  * 
	  * @return {object} finance
	  *
	  */
    PecunioUser.getFinance = function(userData, cb) {
      
      var Finance = app.models.Finance;
      
      Finance.find({where: userData}, function(err, data){
          
          cb(null, data);            
      });
                  
    };
     
    PecunioUser.remoteMethod(
        'getFinance', 
        {
          accepts: [{arg: 'userData', type: 'object' , required: 'true', http: { source: 'body'}}],
          returns: {arg: 'finance', type: 'object'},
          http: {verb: 'post'}
        }
    );

    /**
	  * Typical remote method to save finance data in Finance table!!
	  * @param {object} data       [Finance data]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return {object} finance
	  *
	  */
    PecunioUser.saveFinance = function(data, cb){
      
      var Finance = app.models.Finance;
     
  
      Finance.update({"id" : data.id}, data, function(err,data){
         if(err){
           
           cb(err); 
         } else{
           
           cb(null, data);
         }  
      });  
      
          
    };
    PecunioUser.remoteMethod(
        'saveFinance', 
        {
          accepts: [{arg: 'data', type: 'object' , required: 'true', http: { source: 'body'}}],
          returns: {arg: 'finance', type: 'object'},
          http: {verb: 'post'}
        }
    );
    
    /**
	  * Typical remote method to get user role!!
	  * @param {object} userData	[User Id]
	  * @param {Function} cb       	[callback function to send the response back to client side]
	  * 
	  * @return {object} role
	  *
	  */
    PecunioUser.getRole = function(userData, cb){

      var RoleMapping = app.models.RoleMapping;
     
      RoleMapping.find({where: {principalId : userData.id}}, function(err, data){
          if(err){
              
              cb(err); 
          } else{
              
              cb(null, data[0]);
          }  
      });
    };
     
    PecunioUser.remoteMethod(
        'getRole', 
        {
          accepts: [{arg: 'userData', type: 'object' , required: true, http: { source: 'body'}}],
          returns: {arg: 'role', type: 'object'},
          http: {verb: 'post'}
        }
    ); 

    /**
	  * Typical remote method to save all logos at a time after uploading multiple logos!!
	  * @param {object} companyData	[company info]
	  * @param {Function} cb       	[callback function to send the response back to client side]
	  * 
	  * @return {boolean} state
	  *
	  */
    PecunioUser.saveAllLogo = function(companyData, cb) {
      
      var Company = app.models.Company;
      var currentDt = PecunioUser.getCurrentDate();

      Company.update({"userId" : companyData.id}, {"logo" : companyData.fileName, "currentLogo" : companyData.currentLogo, "lastUpdated" : currentDt}, function(err,data){
          if(err){
            
            cb(err); 
          } else{
            cb(null, data);
          }  
      });

    };
     
    PecunioUser.remoteMethod(
        'saveAllLogo', 
        {
          accepts: [{arg: 'companyData', type: 'object' , http: { source: 'body'}}],
          returns: {arg: 'state', type: 'boolean'},
          http: {verb: 'post'}
        }
    ); 

    /**
	  * Typical remote method to delete Logo files!!
	  * @param {object} fileobj		[Logo file info]
	  * @param {Function} cb       	[callback function to send the response back to client side]
	  * 
	  * @return {string} status
	  *
	  */
    PecunioUser.deleteLogoFile = function(fileobj, cb) {

      var deleteTmpFile = function(fileobj){
        var def = q.defer();
        var filepath = "client/uploads/logo/";
        var tempFileList = [];
        var filesList = fs.readdirSync('client/uploads/logo/');
        var msg;
        // filter out the specific files
        for (var i in filesList) {
          if(filesList[i] == fileobj.filename){
            tempFileList.push(filesList[i]);
          }
        }
        if(tempFileList.length > 0 ){
          var j = tempFileList.length;
          
            var fileLocation = filepath+tempFileList[0];
            fs.unlink(fileLocation, function (err) {
              j--;
                if(err){
                  return false;
                } else{
                  msg = "success";
                  def.resolve(msg);
                }  
            });
        }
        else{
          msg = "No Files";
          def.resolve(msg);
        }

        return def.promise;
      } 
      
      deleteTmpFile(fileobj).then(function(data){
        
         cb(null, data);
      });

    };

    PecunioUser.remoteMethod(
        'deleteLogoFile', 
        {
          accepts: [{arg: 'fileobj', type: 'object' , http: { source: 'body'}}],
          returns: {arg: 'status', type: 'string'},
          http: {verb: 'post'}
        }
    ); 

    /**
	  * Typical remote method to save Avatar( profile image )!!
	  * @param {object} affiliateData	[Affiliate information]
	  * @param {Function} cb       		[callback function to send the response back to client side]
	  * 
	  * @return {boolean} state
	  *
	  */
    PecunioUser.saveAvatar = function(affiliateData, cb) {
      var Affiliate = app.models.Affiliates;
      var currentDt = PecunioUser.getCurrentDate();

      Affiliate.update({"userId" : affiliateData.id}, {"image" : affiliateData.fileName, "lastUpdated" : currentDt}, function(err,data){
          if(err){
            
            cb(err); 
          } else{
            cb(null, data);
          }  
      });

    };
     
    PecunioUser.remoteMethod(
        'saveAvatar', 
        {
          accepts: [{arg: 'affiliateData', type: 'object' , http: { source: 'body'}}],
          returns: {arg: 'state', type: 'boolean'},
          http: {verb: 'post'}
        }
    );

    /**
	  * Typical remote method to get profile image of a user!!
	  * @param {integer} userId    [User Id]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return {object} userData
	  *
	  */
    PecunioUser.getImage = function(userId, cb) {
      
      var Affiliate = app.models.Affiliates;
           
      Affiliate.find({where: {userId:userId}}, function(err, data){
          if(err){
            
            cb(err); 
          } else{
            
            cb(null, data[0]);
          }             
      });
                  
    };
     
    PecunioUser.remoteMethod(
        'getImage', 
        {
          accepts: [{arg: 'userId', type: 'Number' , http: { source: 'body'}}],
          returns: {arg: 'userData', type: 'object'},
          http: {verb: 'post'}
        }
    );

    /**
	  * Typical remote method for all logos of an account-owner's company!!
	  * @param {integer} userId    [User Id]
	  * @param {Function} cb       [callback function to send the response back to client side]
	  * 
	  * @return {object} logoData
	  *
	  */
    PecunioUser.getLogos = function(userId, cb) {
      
      var Company = app.models.Company;
            
      Company.find({where: {userId : userId}}, function(err, data){
          if(err){
            cb(err); 
          } else{
            cb(null, data);
          }             
      });
                  
    };
     
    PecunioUser.remoteMethod(
        'getLogos', 
        {
          accepts: [{arg: 'userId', type: 'Number' , http: { source: 'body'}}],
          returns: {arg: 'logoData', type: 'object'},
          http: {verb: 'post'}
        }
    );


    /**
    * Typical remote method for all logos of an account-owner's company!!
    * @param {integer} userId    [User Id]
    * @param {Function} cb       [callback function to send the response back to client side]
    * 
    * @return {object} logoData
    *
    */
    /*PecunioUser.createAccessToken = function(userData, cb) {
      var AccessToken = app.models.AccessToken;
      var currentDt = PecunioUser.getCurrentDate();
      
      var user = {
                  "id": "",
                  "ttl": 1209600,
                  "created": currentDt,
                  "userId": userData.id
            
      AccessToken.create(user, function(err,data){
         if(err){ 
           cb(null, err);
         } else{
           console.log(data);
           cb(null, data);
         }
      });
      
                  
    };
     
    PecunioUser.remoteMethod(
        'createAccessToken', 
        {
          accepts: [{arg: 'userData', type: 'obejct' , http: { source: 'body'}}],
          returns: {arg: 'token', type: 'object'},
          http: {verb: 'post'}
        }
    );*/


 } 