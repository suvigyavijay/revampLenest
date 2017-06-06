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

		$('#eddPrint').click(function() {
			printDiv('printableArea');
		})


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
		            notes: weekNote(i)
		        };
		        $rootScope.eddOutput.push(weekObject);
		        startDate.setDate(startDate.getDate() + 7);
		    }

		    // console.log(htmloutput);

		    $('#eddTable').html(generateHTMLOutput($rootScope.eddOutput));
		    // $('.eddRem').keyup(function(event) {
		    // 	console.log("executing..");
		    // 	$rootScope.eddOutput[this.attr("id").substring(6)].notes = this.val();
		    // });

		}

		}

		function generateHTMLOutput(output) {
			var htmloutput = "<tr> <th>Week</th> <th>Date </th> <th>Trimester</th> <th>Remarks</th> </tr>";
			for (var i=0; i<output.length; i++)
		    	htmloutput += '<tr> <td>Week '+ output[i].week +'</td> <td>'+ output[i].dateString +'</td> '+ weekTDGen(output[i].week) +' <td> <textarea style="width:100%" rows=1 id="eddRem'+output[i].week+'">'+ output[i].notes +'</textarea></td> </tr>';
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

		function weekNote(week) {
			if (week==12)
				return "Nuchal Scan/FTS";
			if (week==19)
				return "Anomaly Scan";
			if (week==24)
				return "Inj. TT";
			if (week==26)
				return "CBC,MGTT,Urine R";
			if (week==27)
				return "3D Scan";
			if (week==28)
				return "Inj. TDap/Inj.Flu Vacc.";
			if (week==34)
				return "Growth Scan";
			if (week==34)
				return "Doppler Flow (sos)";
			return "";
		}

		function weekTDGen(week) {
			if (week==1)
				return "<td rowspan=13 style='vertical-align:middle'>First Trimester</td>";
			if (week==14)
				return "<td rowspan=14 style='vertical-align:middle'>Second Trimester</td>";
			if (week==28)
				return "<td rowspan=15 style='vertical-align:middle'>Third Trimester</td>";
			return "";
		}

		function printDiv(divName) {
		     var printContents = document.getElementById(divName).innerHTML;
		     var originalContents = document.body.innerHTML;

		     document.body.innerHTML = printContents;

		     window.print();

		     document.body.innerHTML = originalContents;
		}

    }])
        
;
