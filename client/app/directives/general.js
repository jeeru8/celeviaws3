app.directive('multiSelect', function() {
      
	function link(scope, element) {

		element.multiselect({
		
			nonSelectedText: 'Type',
		
			numberDisplayed: 1
		});
	}

	return {
		
		restrict: 'A',
		
		link: link
	};
});

app.directive('bootstrapSelectpicker', function(){

	function link(scope, element) {

		element.selectpicker('refresh');
	}

	return {
		
		restrict: 'A',
		
		link: link
	};
});
 
app.directive("compareTo", function() {
    
    return {
    
        require: "ngModel",
    
        scope: {
    
            otherModelValue: "=compareTo"
        },
    
        link: function(scope, element, attributes, ngModel) {
             
            ngModel.$validators.compareTo = function(modelValue) {
    
                return modelValue == scope.otherModelValue;
            };
 
            scope.$watch("otherModelValue", function() {
    
                ngModel.$validate();
            });
        }
    };
});