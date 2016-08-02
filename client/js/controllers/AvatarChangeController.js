//'use strict';

PecunioApp
.controller('AvatarChangeController', 
	['$rootScope',
	 '$scope',
	 '$modal',
	 'LoopBackAuth',
	 '$state',
	 'FileUploader',
	 'Upload',
	 'userProfileFactory',
	 '$translate',
	 '$window',
	 function(
	 	$rootScope,
	 	$scope,
	 	$modal,
		LoopBackAuth,
		$state,
		FileUploader,
		Upload,
		userProfileFactory,
		$translate,
		$window
	 	){
	 	
		    /**
		     * Function for file Uploading for change Avatar
		     * 
		     * @return {[type]}
		     */
		    $scope.initUploadAdImage = function(){ 
		       
		        // create a uploader with options
		        var testuploader = $scope.uploader = new FileUploader({
		          $scope: $scope,                          
		          url: '/api/container/avatars/upload',
		          formData: [
		            { key: 'value' }
		          ]
		        });

		        // FILTERS
		        testuploader.filters.push({
		            name: 'imageFilter',
		            fn: function(item /*{File|FileLikeObject}*/, options) {
		                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
		                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
		            }
		        });

		        /**
		         * Function for delete file from the queue
		         * 
		         * @return {[type]}
		         */
		        testuploader.deleteFile = function() {
		            $scope.showMsg = false;
		            while(this.queue.length) {
		                this.queue[0].remove();
		            }
		            this.progress = 0;
		            $scope.showMsg = false;
		        };


		        // CALLBACKS
		        testuploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
		            $scope.showMsg = true;
		            $scope.mode = 1;
		            $scope.msg = $translate.instant('FILE_TYPE_MSG');
		        };
		        testuploader.onAfterAddingFile = function(fileItem) {
		            // renaming file to unique filename
		            var fileExtension = '.' + fileItem.file.name.split('.').pop();
		            var fileName = LoopBackAuth.currentUserData.username + "-" + LoopBackAuth.currentUserData.id;
		            fileItem.file.name = fileName + fileExtension;
		            $scope.AvatarFileName = fileItem.file.name;
		            $scope.showMsg = true;
		            $scope.mode = 0;
		            $scope.msg = $translate.instant('READY_TO_SAVE_MSG');
		        };
		        testuploader.onAfterAddingAll = function(addedFileItems) {
		        };
		        testuploader.onBeforeUploadItem = function(item) {
		        };
		        testuploader.onProgressItem = function(fileItem, progress) {
		        };
		        testuploader.onProgressAll = function(progress) {
		        };
		        testuploader.onSuccessItem = function(fileItem, response, status, headers) {
		        };
		        testuploader.onErrorItem = function(fileItem, response, status, headers) {
		        };
		        testuploader.onCancelItem = function(fileItem, response, status, headers) {
		        };
		        testuploader.onCompleteItem = function(fileItem, response, status, headers) {
		        };
		        testuploader.onCompleteAll = function() {
		            $scope.showMsg = false;
		            $scope.mode = 0;
		            var affiliateData = {
	                    "fileName": $scope.AvatarFileName,
	                    "id": LoopBackAuth.currentUserId
	                };
	                userProfileFactory.saveAvatar(affiliateData).then(function(res){
	                    jQuery(".modal").fadeOut();
	                    jQuery(".modal-backdrop").fadeOut();
	                    $window.location.reload();
	                });
		        };
		    }();
			
		    /**
		     * Function for close the modal
		     * @return {[type]}
		     */
			$scope.closeModal = function () {
				jQuery(".modal").fadeOut();
				jQuery(".modal-backdrop").fadeOut();
			};

		 	$scope.$on('$viewContentLoaded', function() {
		        // initialize core components
		        Metronic.initAjax();
		    });
			$rootScope.settings.layout.pageSidebarClosed = false;
}]);
