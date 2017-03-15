$(document).ready(function () {


	$('#add').on('click', function () {

		var $nTask = $('#new-task').val();

		if ($nTask === '') {

			$('.warning').html('<p class="fa fa-warning"></p> No task added').show();

			$('.success').hide();
		} else {

			$('.success').html('<p class="fa fa-check"></p>Task added to list').fadeIn('slow').delay(500).fadeOut();

			$('.warning').hide();

			var listItem = '<li>';
			listItem += '<input type="checkbox">';
			listItem += '<label>' + $nTask + '</label>';
			listItem += '<input type="text" class="inputTask">';
			listItem += '<button class="edit">Edit</button>';
			listItem += '<button class="delete">Delete</button>';
			listItem += '</li>';

			$('#incomplete-tasks').append(listItem);
			$('.inputTask').val($nTask);

			$('#new-task').val('');
		}
		counter();
	});


	$('ul').on('click', '.edit', function () {

		var parent = $(this).parent();

		if (!parent.hasClass('editMode')) {
			parent.addClass('editMode');
		} else if (parent.hasClass('editMode')) {

			var editTask = $(this).prev('input[type="text"]').val();
			var editLabel = parent.find('label');
			editLabel.html(editTask);

			parent.removeClass('editMode');
		}


	});


	$('ul').on('change', 'input[type="checkbox"]', function () {

		var grandpa = $(this).parent().parent();

		var parent = $(this).parent();

		if (grandpa.is('#incomplete-tasks')) {
			parent.remove();
			$('#completed-tasks').append(parent);
		} else if (grandpa.is('#completed-tasks')) {
			parent.remove();
			$('#incomplete-tasks').append(parent);
		}
		counter();
	});


	$('ul').on('click', '.delete', function () {
		$(this).parent().remove();
		counter();
	});


	function counter() {
		var remainTask = $('#incomplete-tasks li').length;
		$('#counter').hide().fadeIn(300).text(remainTask);
	}
	counter();

});