/**
 * @Description
 * Controller for viewing the support page
 *
 * @author Gargi Chakraborty <gargi.chakraborty@netzrezepte.de> 
 */

'use strict';

PecunioApp

.controller('SupportController',
	['$rootScope',
	 '$scope',
	 '$http',
	 '$state',
	 '$timeout', 
	 'supportFactory',
	 'LoopBackAuth',
	 '$translate',

     function(
     	$rootScope, 
     	$scope, 
     	$http,
     	$state, 
     	$timeout,
     	supportFactory,
     	LoopBackAuth,
     	$translate
    ) {

	$scope.supportDeatils = '';
	$scope.sortType     = 'created_at'; // set the default sort type
 	$scope.sortReverse  = true;  // set the default sort order

 	if(LoopBackAuth.currentUserData === null){
        $state.go('login')
    }

	$scope.$on('$viewContentLoaded', function() {
		$('#cke_1_bottom').css('display','none');
		$scope.arrTickets = [];
		$scope.orgArr = [];
		
		//fresh desk ticket status
		$scope.ticketStatus = [{"status":"Offen","value":2},{"status":"Ausstehend","value":3},{"status":"Gelöst","value":4},{"status":"Geschlossen ","value":5}];
		
		
		/**
		 * Sort ticket list
		 * 
		 * @param  integer statuscode
		 * @return array 
		 */
		$scope.sortTickets = function(val){
			$scope.newArr = [];
			$scope.arrTickets = $scope.orgArr;
			for(var eachTicket in $scope.arrTickets){
				if($scope.arrTickets[eachTicket].status == val){
					$scope.newArr.push($scope.arrTickets[eachTicket]);
				}
			}
			if($scope.newArr.length > 0 ){$scope.arrTickets = $scope.newArr;}else{$scope.arrTickets = [];}
			
		}
		
		/**
		 * Get all tickets
		 * posted by current user (if admin)
		 * or by account owner (if other than admin)
		 *
		 * @return array
		 */
    	$scope.getSupportTickets = function(){
		supportFactory
			.getTickets()
			.then(function(response){
				
				$('#tickspin2').css('display','none');
				if(response.isTickets == true){
					$scope.arrTickets = $scope.orgArr = response.tickets;
					/*$scope.newArr = $scope.arrTickets.sort(function(a,b) { 
						return parseInt(a.status) - parseInt(b.status) } 
					);*/
				}
			});
    	};
    	$scope.getSupportTickets();
		/**
		 * Post tickets to freshdesk
		 * 
		 * @type {Boolean}
		 */
		$scope.showMsg = false;
    	$scope.addTickets = function(){
    		var obj = {"title":$scope.ticket.title,"content":$scope.ticket.content,"topic":$scope.ticket.topic,"usermail":LoopBackAuth.currentUserData.email };
    		supportFactory
    			.postTickets(obj)
    			.then(function(resp){
    				$scope.showMsg = true;
    				if(resp.posttickets.isTickectCreated == true){
    					$scope.msg = $translate.instant('TICKET_CREATED_SUCC');
    					$scope.iscr = 0;
    					$scope.ticket.title = $translate.instant('HEADING');
    					$scope.ticket.topic = "";
    					$scope.ticket.content = $translate.instant('MSG');
    					$scope.getSupportTickets();
    				}else{
    					$scope.msg = $translate.instant('TICKET_CREATED_FAILD');
    					$scope.iscr = 1;
    				}
    			});
    	}
		
		/**
		 * Get all replies posted 
		 * against  a ticket
		 * 
		 * @param  {integer}  {ticketId}     [ticket's display id]
		 * @param  {Boolean} {isDetailsOpen} [is the area to display reply is open]
		 * 
		 * @return array              [all replies]
		 */
		$scope.getNote = function(ticketId,isDetailsOpen){
			if(isDetailsOpen == true && ticketId){
				//$('#tickspinr_'+ticketId).css('display','block');
				$scope.hasReply = false;
				$scope.flag = ticketId;
				supportFactory
					.getTicketReply(ticketId)
					.then(function(resp){
						if(resp.isReply == true){
							$scope.hasReply = true;
							$scope.replies = resp.replies.notes;
							$scope.reqsId = resp.replies.requester_id;
						}else{
							$scope.hasReply = false;
						}
						
					});
			}
			
		};
		
		/**
		 * Post reply to a ticket
		 * 
		 * @param {integer} [tId] [ticket id]
		 */
		$scope.reply = {};
		$scope.showRpl = false;
		$scope.addReply = function(tId){
			var tckId = $('#ticktid_'+tId).val();
			var reqstrId = $('#requesterid_'+tId).val();
			if($scope.reply.message){
			var obj = {'ticketId':tckId,'requesterId':reqstrId,'replymsg':$scope.reply.message };
			supportFactory
				.postTicketReply(obj)
				.then(function(resp){
					$scope.showRpl = true;
					if(resp.status.isReplied == true){
						$scope.msg = $translate.instant('REPLY_POSTED_SUCC');
    					$scope.isrpl = 0;
    					$scope.reply.message = $translate.instant('MSG');
    					$scope.getNote(tckId,true);
					}else{
						$scope.msg = $translate.instant('REPLY_POSTED_FAILD');
    					$scope.isrpl = 1;
					}
					
					setTimeout(function(){
    					jQuery("#addrepl").fadeOut(1600);
    					$scope.showRpl = false;
    				}, 15000);
				});
			}
		};
		
		
		/**
		 * Get all folders/categories
		 * 
		 */
		
		supportFactory
			.getCategoryFolders()
			.then(function(response){
				if(response.hasFolders == true){
					$scope.folders = response.folders;
					$scope.folder_id = $scope.folders[0].id;
					$scope.getArticles($scope.folder_id);
				}
		});
		/**
		 * Get all articles posted 
		 * under specific category
		 * 
		 * @param  {integer} {folderId} [ Id of respective category/folder ]
		 * @return array         [All articles under category]
		 */
		$scope.getArticles = function(folderId){
			if(folderId){
				supportFactory
			  	.getTips(folderId)
			  	.then(function(response){
			  		if(response.hasTips == true){
			  			$('#tickspin1').css('display','none');
			  			$scope.arrArticle = response.articles;
			  		}
			  	});
			}
		};
		
		
		$rootScope.settings.layout.pageSidebarClosed = false; 
    	Metronic.initAjax(); // initialize core components
       // Layout.setSidebarMenuActiveLink('set', $('#sidebar_menu_link_profile')); // set profile link active in sidebar menu

    });
	$rootScope.settings.layout.pageSidebarClosed = false;
}]); 