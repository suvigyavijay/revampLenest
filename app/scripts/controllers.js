'use strict';

var globalVar;

angular.module('lenestApp')
    .controller('MainController', ['$scope', function($scope) {
        

    }])

    .controller('sampleController', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {
    	
    }])

    .controller('laparoController', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {
    	
    		var holder = document.getElementsByClassName('holder'),
			    tests = {
			      filereader: typeof FileReader != 'undefined',
			      dnd: 'draggable' in document.createElement('span'),
			      formdata: !!window.FormData,
			    }, 
			    support = {
			      filereader: document.getElementsByClassName('filereader'),
			      formdata: document.getElementsByClassName('formdata'),
			    },
			    acceptedTypes = {
			      'image/png': true,
			      'image/jpeg': true,
			      'image/gif': true
			    },
			    fileupload = document.getElementById('upload');

			"filereader formdata".split(' ').forEach(function (api) {
			    // FFS. I could have done el.hidden = true, but IE doesn't support
			    // hidden, so I tried to create a polyfill that would extend the
			    // Element.prototype, but then IE10 doesn't even give me access
			    // to the Element object. Brilliant.
			   //  support[api].each(function(index, el) {
			  	// console.log('hey2');
			   //  	$(el).addClass("hidden");
			   //  });
			    for (var i=0; i<support[api].length; i++) {
				    $(support[api][i]).addClass('hidden');
			    }
			  
			});

			function previewfile(file, holder) {
			  if (tests.filereader === true && acceptedTypes[file.type] === true) {
			    var reader = new FileReader();
			    reader.onload = function (event) {
			      var image = new Image();
			      image.src = event.target.result;
			      console.log($(holder).css("height"));
			      image.width = (parseInt($(holder).css("height").substring(0,3))-30); // a fake resize
			      // $('image').css('height') = 250; // a fake resize
			      holder.appendChild(image);
			      $(holder).children('img').each(function(index, el) {
			      	// $(el).css("width", "calc(100% - 20px)");
			      	$(el).css("height", $(el).css("width"));
			      });
			    };

			    reader.readAsDataURL(file);
			  }  else {
			    holder.innerHTML += '<p>Uploaded ' + file.name + ' ' + (file.size ? (file.size/1024|0) + 'K' : '');
			    console.log(file);
			  }
			}

			function readfiles(files, holder) {
			    // debugger;
			    var formData = tests.formdata ? new FormData() : null;
			    for (var i = 0; i < files.length; i++) {
			      if (tests.formdata) formData.append('file', files[i]);
			      previewfile(files[i], holder);
			    }

			}

			if (tests.dnd) { 
				for (var i=0; i<holder.length; i++) {
			  holder[i].ondragover = function () { $(this).addClass('hover'); return false; };
			  holder[i].ondragend = function () { $(this).addClass(''); return false; };
			  holder[i].ondrop = function (e) {
			    $(this).addClass('');
			    e.preventDefault();
			    readfiles(e.dataTransfer.files, this);
			  }
			}
			}

			function printDiv(printContents) {
			    // var printContents = document.getElementById(divName).innerHTML;
			    var originalContents = document.body.innerHTML;
			    document.body.innerHTML = printContents;
			    window.print();
			    document.body.innerHTML = originalContents;
			} 

			function genPrintOutput() {
				var imgs = $('#lapPics').find('img');
				var pname = $('#pName').val();
				var comments = [];
				$('#lapPics').find('textarea').each(function(index, el) {
					comments.push(el.value);
				});
				var html = '<div class="container"><h2 class="row"> Name: &nbsp;'+ pname +'</h2><br><div class="row"><table style="width:100%">'
				for (var i = 0; i < comments.length; i++) {
					// console.log($(img[i]).html());
					if (i%2==0)
						html+='<tr> <td class="text-center"><img src="'+ imgs[i].src +'" style="width:28vh; height:28vh"></td><td class="text-center"><img src="'+ imgs[i+1].src +'" style="width:28vh; height:28vh"></td></tr>';
					else
						html+='<tr> <td class="text-center">'+ comments[i-1] +'</td> <td class="text-center">'+ comments[i] +'</td> </tr>';

					
				}
				html+='</table></div> </div>';
				// $('body').html(html);
				// console.log(html);
				return html;
			}

			$('#laparoPrint').click(function() {
				// genPrintOutput();
				printDiv(genPrintOutput());
			});

    }])

    .controller('eddController', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {
		
		$('#duedate').val(new Date().toISOString().substring(0,10));

		$scope.functionRun = false;

		$('#eddButton').click(function(event) {
			$scope.generateCalendar($('#duedate').val());
			$(this).attr("disabled", "disabled");
			$('#eddPrint').removeAttr("disabled");
		});

		$('#eddReset').click(function() {
			$('#eddTable').html("<tr> <th>Week</th> <th>Date </th> <th>Trimester</th> <th>Remarks</th> </tr>");
			$('#eddButton').removeAttr("disabled");
			$scope.functionRun = false;
			$rootScope.eddOutput = [];
		});

		$('#eddPrint').click(function() {
			var printContents = "<h2>"+ $('#pName').val() +"</h2> <div class='row'> <div class='col-md-6'> EDD: &nbsp; "+ new Date($('#duedate').val()).toDateString().substring(4) +"</div> <div class='col-md-6'> LMP: &nbsp; "+ $('#lmp').val() +"</div> </div> <table class='table table-bordered table-striped'> <tr> <th>Week</th> <th>Date </th> <th>Trimester</th> <th>Remarks</th> </tr> "+ genPrintTable($rootScope.eddOutput) +"</table>";
			printDiv(printContents);
		})


		$scope.generateCalendar = function (inputDate) {
		
		if (!$scope.functionRun) {

		    $scope.functionRun = true;
		    var dueDate = new Date(inputDate);
		    var startDate = new Date(inputDate);
		    var monthDate = new Date(inputDate);
		    var month = 1;
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
		        console.log(monthDate, temp2, (temp2-monthDate));
		        if ((temp2-monthDate)>=2592000000){
		        	month++;
		        	monthDate.setDate(monthDate.getDate() + 30);
		        }
		        var weekObject = {
		            week: i,
		            month: month,
		            dateString: temp1.toDateString().substring(4) + " - " + temp2.toDateString().substring(4),
		            trimester: getTrimester(i),
		            notes: weekNote(i)
		        };
		        $rootScope.eddOutput.push(weekObject);
		        startDate.setDate(startDate.getDate() + 7);
		    }

		    $('#eddTable').html(generateHTMLOutput($rootScope.eddOutput));

		}

		}

		function generateHTMLOutput(output) {
			var htmloutput = "<tr><th>Month</th> <th>Week</th> <th>Date </th> <th>Trimester</th> <th>Remarks</th> </tr>";
			var month_counter = 0;
			var last_month = 0;
			var curr_month = 1;
			for (var i=0; i<output.length; i++) {
				// var month_html = '';
				// if (curr_month!=last_month) {
				// var j=i;
				// while (output[j].month==curr_month){
				// 	console.log(month_counter,output[j].month);
				// 	month_counter++;
				// 	j++;
				// }
				// 	month_html = '<td rowspan="'+ month_counter +'">Month '+ output[i].month +' </td> ';
				// 	last_month=curr_month;
				// }
		    	htmloutput += '<tr>'+ month_html +' <td>Week '+ output[i].week +'</td> <td>'+ output[i].dateString +'</td> '+ weekTDGen(output[i].week) +' <td> <textarea style="width:100%" rows=1 id="eddRem'+output[i].week+'">'+ output[i].notes +'</textarea></td> </tr>';
				curr_month = output[i].month;
		    	month_counter=0;
		    }
		    return htmloutput;
		}

		function genPrintTable(output) {
			var htmloutput = "";
			var month_counter = 0;
			var last_month = 1;
			for (var i=0; i<output.length; i++) {
				var month_html = '';
				if (output[i].month!=last_month){
					month_html = '<td rowspan="'+ month_counter +'">Month '+ output[i].month +' </td> ';
					last_month = output[i].month;
					month_counter = 0;
				}
		    	htmloutput += '<tr>'+ month_html +'<td>Week '+ output[i].week +'</td> <td>'+ output[i].dateString +'</td> '+ weekTDGen(output[i].week) +' <td>'+ $('#eddRem'+output[i].week).val() +'</td> </tr>';
				month_counter++;
			}
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

		function monthTDGen(i) {
			curr_month = $rootScope.eddOutput[i].month;
			while (curr_month<next_month) {

			}
		}

		function printDiv(printContents) {
		    // var printContents = document.getElementById(divName).innerHTML;
		    var originalContents = document.body.innerHTML;
		    document.body.innerHTML = printContents;
		    window.print();
		    document.body.innerHTML = originalContents;
		}

    }])
        
;
