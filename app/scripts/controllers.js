'use strict';

var globalVar;

angular.module('lenestApp')
    .controller('MainController', ['$scope', function($scope) {
        $rootScope.currentUser = null;

    }])

    .controller('chatController', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {

    	
    	$('#btn-login').click(function() {
    	var email = $('#login-username').val();
    	var password = $('#login-password').val();
    		firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
    			// console.log(user);
    			$rootScope.currentUser = user.email;
    			$state.go('app.chat');
    		}).catch(function(error) {
		    	console.log(error.message);
		    	var errorCode = error.code;
		    	var errorMessage = error.message;
			});

			console.log('login successful');
    	})

    	$('#logoutButton').click(function(event) {
    		firebase.auth().signOut().then(function() {
			  $state.go('app.login');
			}).catch(function(error) {
			  console.log(error.message);
			});
    	});

    	var $username = $("#username");
  var $newMessage = $("#newMessage");
  var $messageList = $("#messageList");
  var $loginButton = $("#loginButton");
  var $loggedInText = $("#loggedInText");
  var $logoutButton = $("#logoutButton");
  
   var messagesRef = firebase.database().ref('/').child("messages");


  // Add a new message to the message list
  function addMessage(username, text) {
    var el = $("<li class='list-group-item'><b>" + username + ":</b> " + text + "</li>")
    $messageList.append(el);
  }

  // Loop through the last ten messages stored in Firebase
  messagesRef.limitToLast(20).on("child_added", function(snapshot) {
    var message = snapshot.val();

    // Escape unsafe characters
    var username = message.username.replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
    var text = message.text.replace(/\</g, "&lt;").replace(/\>/g, "&gt;");

    addMessage(username, text);
  });

  // Listen for key presses on the new message input
  $newMessage.keypress(function (e) {
    // Get field values
    var username = $username.val();
    var text = $newMessage.val().trim();

    // Save message to Firebase when enter key is pressed
    if (e.keyCode == 13 && text.length) {
      messagesRef.push({
        username: $rootScope.currentUser,
        text: text
      }, function(error) {
        if (error) {
          console.log("Error adding new message:", error);
        }
      });

      // Reset new message input
      $newMessage.val("");
    }
  });

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
			    // document.body.innerHTML = originalContents;
			    window.location.reload(false);
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
		$scope.printFired = 0;

		$('#eddButton').click(function(event) {
			$scope.generateCalendar($('#duedate').val());
			$(this).attr("disabled", "disabled");
			$('#eddPrint').removeAttr("disabled");
		});

		$('#eddReset').click(function() {
			$('#eddTable').html("<tr> <th>Week</th> <th>Date </th> <th>Pregnancy Care</th> <th>Important Milestones</th> </tr>");
			$('#eddButton').removeAttr("disabled");
			$scope.functionRun = false;
			$rootScope.eddOutput = [];
		});

		$scope.eddPrint = function () {
			if ($scope.printFired==0) {
				var printContents = "<style>td {padding:6px!important}</style><div class='container'><h2>"+ $('#pName').val() +"</h2> <div class='row' style='font-size: 1.2em;'> <div class='col-md-6'> EDD: &nbsp; "+ new Date($('#duedate').val()).toDateString().substring(4) +"</div> <div class='col-md-6'> LMP: &nbsp; "+ $('#lmp').val() +"</div> </div> <table class='custom-table table table-bordered table-striped'> <tr> <th style='width:10%'>Month</th> <th style='width:10%''>Week</th> <th style='width:20%'>Date </th> <th  style='width:5%'>Pregnancy Care</th> <th style='width:50%'>Important Milestones</th> </tr> "+ genPrintTable($rootScope.eddOutput) +"</table></div>";
				printDiv(printContents);
			}
		};



		$scope.generateCalendar = function (inputDate) {
		
		if (!$scope.functionRun) {

		    $scope.functionRun = true;
		    var dueDate = new Date(inputDate);
		    var startDate = new Date(inputDate);
		    var monthDate = new Date(inputDate);
		    var month = 1;
		    startDate.setDate(startDate.getDate() - 40 * 7);
		    monthDate.setDate(monthDate.getDate() - 40 * 7);
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
		        //console.log(month, ((temp2-monthDate)>=2592000000));
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
		    //console.log($rootScope.eddOutput);

		    $('#eddTable').html(generateHTMLOutput($rootScope.eddOutput));

		}

		}

		function generateHTMLOutput(output) {
			var htmloutput = "<tr><th>Month</th> <th>Week</th> <th>Date </th> <th>Pregnancy Care</th> <th>Important Milestones</th> </tr>";
			var month_counter = 1;
			var last_month = 0;
			var curr_month = 1;
			for (var i=0; i<output.length; i++) {
				var month_html = '';
				if (curr_month!=last_month) {
				var j=i;
				while (output[j].month==curr_month){
					//console.log(month_counter,output[j].month);
					month_counter++;
					j++;
					if (output[j+1]==undefined)
						break;
				}
					month_html = '<td rowspan="'+ month_counter +'" style="vertical-align:middle">Month '+ output[i].month +' </td> ';
					last_month=curr_month;
				}
		    	htmloutput += '<tr>'+ month_html +' <td>Week '+ output[i].week +'</td> <td>'+ output[i].dateString +'</td> '+ weekTDGen(output[i].week) +' <td> <textarea style="width:100%" rows=1 id="eddRem'+output[i].week+'">'+ output[i].notes +'</textarea></td> </tr>';
				curr_month = output[i].month;
		    	month_counter=1;
		    }
		    return htmloutput;
		}

		function genPrintTable(output) {
			var htmloutput = "";
			var month_counter = 1;
			var last_month = 0;
			var curr_month = 1;
			for (var i=0; i<output.length; i++) {
				var month_html = '';
				if (curr_month!=last_month) {
				var j=i;
				while (output[j].month==curr_month){
					//console.log(month_counter,output[j].month);
					month_counter++;
					j++;
					if (output[j+1]==undefined)
						break;
				}
					month_html = '<td rowspan="'+ month_counter +'" style="vertical-align:middle">Month '+ output[i].month +' </td> ';
					last_month=curr_month;
				}
		    	htmloutput += '<tr>'+ month_html +'<td>Week '+ output[i].week +'</td> <td>'+ output[i].dateString +'</td> '+ weekTDGen(output[i].week) +' <td>'+ $('#eddRem'+output[i].week).val() +'</td> </tr>';
				curr_month = output[i].month;
		    	month_counter=1;
			}
		    return htmloutput;
		}

		function getTrimester(week) {
		    if (week >= 1 && week <= 20)
		        return "Early Pregnancy Care";
		    if (week >= 21 && week <= 42)
		        return "Late Pregnancy Care";
		    // if (week >= 28)
		        // return "III";

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
			if (week==38)
				return "Doppler Flow (sos)";
			return "";
		}

		function weekTDGen(week) {
			if (week==1)
				return "<td rowspan=20 style='vertical-align:middle; text-align:center'>Early Pregnancy Care</td>";
			if (week==21)
				return "<td rowspan=22 style='vertical-align:middle; text-align:center'>Late Pregnancy Care</td>";
			// if (week==28)
			// 	return "<td rowspan=15 style='vertical-align:middle; text-align:center'>III</td>";
			return "";
		}

		function monthTDGen(i) {
			curr_month = $rootScope.eddOutput[i].month;
			while (curr_month<next_month) {

			}
		}

		function printDiv(printContents) {
		    if ($scope.printFired==0) {
		    $scope.printFired = 1;
		    var originalContents = document.body.innerHTML;
		    document.body.innerHTML = printContents;
			    console.log($scope.printFired);
		    window.print();
		    window.location.reload(false);
			}
		}

    }])

    .controller('babyController', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {
		
			var holder2 = document.getElementsByClassName('holder'),
			    tests2 = {
			      filereader: typeof FileReader != 'undefined',
			      dnd: 'draggable' in document.createElement('span'),
			      formdata: !!window.FormData,
			    }, 
			    support2 = {
			      filereader: document.getElementsByClassName('filereader'),
			      formdata: document.getElementsByClassName('formdata'),
			    },
			    acceptedTypes2 = {
			      'image/png': true,
			      'image/jpeg': true,
			      'image/gif': true
			    },
			    fileupload2 = document.getElementById('upload');

			"filereader formdata".split(' ').forEach(function (api) {
			    // FFS. I could have done el.hidden = true, but IE doesn't support
			    // hidden, so I tried to create a polyfill that would extend the
			    // Element.prototype, but then IE10 doesn't even give me access
			    // to the Element object. Brilliant.
			   //  support[api].each(function(index, el) {
			  	// console.log('hey2');
			   //  	$(el).addClass("hidden");
			   //  });
			    for (var i=0; i<support2[api].length; i++) {
				    $(support2[api][i]).addClass('hidden');
			    }
			  
			});

			function previewfile2(file, holder) {
			  if (tests2.filereader === true && acceptedTypes2[file.type] === true) {
			    var reader = new FileReader();
			    reader.onload = function (event) {
			      var image = new Image();
			      image.src = event.target.result;
			      console.log('hello', $(holder).css("height"));
			      image.width = (parseInt($(holder).css("width").substring(0,3))-30); // a fake resize
			      // $('image').css('height') = 250; // a fake resize
			      holder.appendChild(image);
			      $(holder).children('img').each(function(index, el) {
			      	$(el).css("width", "100%");
			      	$(el).css("height", "100%");
			      });
			    };

			    reader.readAsDataURL(file);
			  }  else {
			    holder.innerHTML += '<p>Uploaded ' + file.name + ' ' + (file.size ? (file.size/1024|0) + 'K' : '');
			    console.log(file);
			  }
			}

			function readfiles2(files, holder) {
			    // debugger;
			    var formData = tests.formdata ? new FormData() : null;
			    for (var i = 0; i < files.length; i++) {
			      if (tests.formdata) formData.append('file', files[i]);
			      previewfile2(files[i], holder);
			    }

			}

			if (tests2.dnd) { 
				for (var i=0; i<holder2.length; i++) {
			  holder2[i].ondragover = function () { $(this).addClass('hover'); return false; };
			  holder2[i].ondragend = function () { $(this).addClass(''); return false; };
			  holder2[i].ondrop = function (e) {
			    $(this).addClass('');
			    e.preventDefault();
			    readfiles2(e.dataTransfer.files, this);
			  }
			}
			}

			function printDiv(printContents) {
			    // var printContents = document.getElementById(divName).innerHTML;
			    var originalContents = document.body.innerHTML;
			    document.body.innerHTML = printContents;
			    setTimeout(function() {
			    	window.print();
			    	window.location.reload(false);
			    }, 1000);
			    // document.body.innerHTML = originalContents;
			} 

			function genPrintOutput() {
				var imgs = $('#babyPics').find('img');
				console.log(imgs[0].src);
				var pname = $('#pName').val();
				var comments = [];
					comments.push($('#commentBox').val());
				
				var html = '<style> .babypic {height: 100vh; background-size: 100% 100%; background-repeat: no-repeat; width: 100vw; position: absolute; z-index: 1; } .babyframe {height: 100vh; background-size: 100% 100%; width: 100vw; position: absolute; z-index: 2; } .wishes {width: 100vw; z-index: 3; position: absolute; padding: 0 2em; text-align: center; bottom: 3vh; font-family: "Roboto", sans-serif; font-size: 2.5em; -webkit-text-stroke: 2px white; } .babyname {z-index: 3; position: absolute; left: 8vw; top: 3vh; font-family: cursive; font-size: 5em; font-weight: 900; -webkit-text-stroke: 2px white; } </style> <div class="fluid-container"> <img class="babypic" src="'+ imgs[1].src +'"> <img class="babyframe" src="'+ imgs[0].src +'"> <div class="babyname"> '+ pname +'</div> <div class="wishes">'+ comments[0] +'</div> </div>';
				// $('body').html(html);
				// console.log(html);
				return html;
			}

			$('#babyPrint').click(function() {
				// genPrintOutput();
				printDiv(genPrintOutput());
			});		

	}])
        
;
