$(document).ready(function () {
	// the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
	$('.modal').modal();
	setTimeout(function () {
		$(".button-collapse").sideNav();
	}, 1000);
});


$(document).ready(function () {
	Materialize.updateTextFields();
});