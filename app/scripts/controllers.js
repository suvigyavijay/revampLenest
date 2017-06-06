'use strict';

var globalVar;

angular.module('lenestApp')
    .controller('MainController', ['$scope', function($scope) {
        

    }])

    .controller('sampleController', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {
    	
    }])

    .controller('eddController', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {
		
		$('#duedate').val(new Date().toISOString().substring(0,10));

		$scope.functionRun = false;

		$('#eddButton').click(function(event) {
			$scope.generateCalendar($('#duedate').val());
			$(this).attr("disabled", "disabled");
		});

		$('#eddReset').click(function() {
			$('#eddTable').html("<tr> <th>Week</th> <th>Date </th> <th>Trimester</th> <th>Remarks</th> </tr>");
			$('#eddButton').removeAttr("disabled");
			$scope.functionRun = false;
			$rootScope.eddOutput = [];
		});


		$scope.generateCalendar = function (inputDate) {
		
		if (!$scope.functionRun) {

		    $scope.functionRun = true;
		    var dueDate = new Date(inputDate);
		    var startDate = new Date(inputDate);
		    startDate.setDate(startDate.getDate() - 40 * 7);
			$rootScope.eddOutput = [];

		    // var weekObject = {
		    // 	week: 1,
		    // 	dateString: "",
		    // 	trimester: "",
		    // 	notes: ""
		    // }

		    for (var i = 1; i < 43; i++) {
		        var temp1 = new Date(startDate);
		        var temp2 = new Date(startDate);
		        temp1.setDate(temp1.getDate() + 1);
		        temp2.setDate(temp2.getDate() + 7);
		        var weekObject = {
		            week: i,
		            dateString: temp1.toDateString().substring(4) + " - " + temp2.toDateString().substring(4),
		            trimester: getTrimester(i),
		            notes: ""
		        };
		        $rootScope.eddOutput.push(weekObject);
		        startDate.setDate(startDate.getDate() + 7);
		    }

		    // console.log(htmloutput);

		    $('#eddTable').html(generateHTMLOutput($rootScope.eddOutput));
				console.log("ran");
				return;
		    // $('.eddRem').keyup(function(event) {
		    // 	console.log("executing..");
		    // 	$rootScope.eddOutput[this.attr("id").substring(6)].notes = this.val();
		    // });

		}

		}

		function generateHTMLOutput(output) {
			console.log(output.length);
			var htmloutput = "<tr> <th>Week</th> <th>Date </th> <th>Trimester</th> <th>Remarks</th> </tr>";
			for (var i=0; i<output.length; i++)
		    	htmloutput += '<tr> <td>Week '+ output[i].week +'</td> <td>'+ output[i].dateString +'</td> <td>'+ output[i].trimester +'</td> <td><textarea style="width:100%" rows=2 id="eddRem'+ output[i].week +'"></textarea></td> </tr>';
		    console.log("hey");
		    return htmloutput;
		}

		function getTrimester(week) {
		    if (week >= 1 && week <= 13)
		        return "First Trimester";
		    if (week >= 14 && week <= 27)
		        return "Second Trimester";
		    if (week >= 28)
		        return "Third Trimester";

		}
    }])
        
;
