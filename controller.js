$(document).ready(function () {


	$('#add').on('click', function () {
		var listItem;
		var newTaskTitle = $('#new-task').val();
		var incopleteTask=$('#incomplete-tasks');
		var inputTask =$('.inputTask');
		var newTask=$('#new-task');

		function message(text,type) {
			if(type ==='warning'){

				$('.warning').html('<p class="fa fa-warning"></p> No task added').show();
				$('.success').hide();

			}else{
				$('.success').html('<p class="fa fa-check"></p>Task added to list').fadeIn('slow').delay(500).fadeOut();
				$('.warning').hide();
			}
		}

		if (newTaskTitle === '') {
			message('No task added','warning');

		} else {
			message('Task added to list');


			listItem = '<li>';
			listItem += '<input type="checkbox">';
			listItem += '<label>' + newTaskTitle + '</label>';
			listItem += '<input type="text" class="inputTask"/>';
			listItem += '<button class="edit">Edit</button>';
			listItem += '<button class="delete">Delete</button>';
			listItem += '</li>';

			incopleteTask.append(listItem);
			inputTask.val(newTaskTitle);

			newTask.val('');
		}
		updateCounter();
	});


	$('.task').on('click', '.edit', function () {

		var parent = $(this).parent();

		if (!parent.hasClass('editMode')) {
			var edit = $('#editable').val();
			parent.addClass('editMode');
		} else if (parent.hasClass('editMode')) {

			var editTask = $(this).prev('input[type="text"]').val();
			var editLabel = parent.find('label');
			editLabel.html(editTask);
			parent.removeClass('editMode');
		}


	});


	$('.task').on('change', 'input[type="checkbox"]', function () {

		var grandpa = $(this).parent().parent();

		var parent = $(this).parent();

		if (grandpa.is('#incomplete-tasks')) {
			parent.remove();
			$('#completed-tasks').append(parent);
		} else if (grandpa.is('#completed-tasks')) {
			parent.remove();
			$('#incomplete-tasks').append(parent);
		}
		updateCounter();
	});


	$('.task').on('click', '.delete', function () {
		$(this).parent().remove();
		updateCounter();
	});


	function updateCounter() {
		var remainTask = $('#incomplete-tasks li').length;

		$('#updateCounter').hide().text(remainTask).fadeIn(300);
	}
	updateCounter();

});