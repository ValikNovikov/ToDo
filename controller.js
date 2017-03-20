$(document).ready(function () {
	var savedToDo = JSON.parse(localStorage.getItem('savedToDo'));
	if (!savedToDo) {
		savedToDo = [];
	}


//------saving and getting data to local Storage--------//
	var localStorageService = {
		setToDo: function () {
			localStorage.setItem('savedToDo', JSON.stringify(savedToDo));
		},
		getToDo: function () {
			savedToDo.map(function (i) {
				var newTaskTitle = i.value;
				var listItem = '<li id="li-with-id">';
				listItem += '<input type="checkbox">';
				listItem += '<label for="inputTask">' + newTaskTitle + '</label>';
				listItem += '<input  type="text" value="' + i.value + '" class="input-value"/>';
				listItem += '<button class="edit">Edit</button>';
				listItem += '<button class="delete">Delete</button>';
				listItem += '</li>';

				$('#incomplete-tasks').append(listItem);
				$('#li-with-id').attr("id", i.id);

			});
		}
	};

	localStorageService.getToDo();

	//----show-hide message----//
	function showMessage(text, type) {
		if (type === 'warning') {
			$('.message').removeClass('success');
			$('.message').addClass('warning');
			$('.message').html('<p class="fa fa-warning"></p>' + text).show();

		} else {
			$('.message').removeClass('warning');
			$('.message').addClass('success');
			$('.message').html('<p class="fa fa-check"></p>' + text).fadeIn('slow').delay(500).fadeOut();
		}
	}

	//--------adding new To Do--------//
	$('#add').on('click', function () {
		var newTaskTitle = $('#new-task').val(),
			id = new Date().getTime(),
			newTask = $('#new-task'),
			inputTask = $('#input-task');


		if (newTaskTitle === '') {
			showMessage('No task added', 'warning');

		} else {
			showMessage('Task added to list');
			savedToDo.push({id: id, type: 'incompleted', value: newTaskTitle});
			$('#incomplete-tasks').children().remove();
			localStorageService.getToDo();
			$('#li-with-id').attr("id", id);
			newTask.val('');
			localStorageService.setToDo()
		}
		updateCounter();
	});


	//-------editing task------//
	$('.task').on('click', '.edit', function () {

		var parent = $(this).parent();

		if (!parent.hasClass('editMode')) {
			parent.addClass('editMode');
		} else if (parent.hasClass('editMode')) {

			var editTask = $(this).prev('input[class="input-value"]').val();
			var editLabel = parent.find('label');
			var labelText = editLabel.text();
			editLabel.html(editTask);
			parent.removeClass('editMode');

			savedToDo.map(function (i, index) {
				if (i.value == labelText) {
					savedToDo[index].value = editTask;
					localStorageService.setToDo();
				}

			});
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


	//------deleting task------//
	$('.task').on('click', '.delete', function () {
		var data = $(this).parent();
		var liId = data.attr("id");
		data.remove();

		savedToDo.map(function (i, index) {
			if (i.id == liId) {
				savedToDo.splice(index, 1);
				localStorageService.setToDo();
			}

		});
		updateCounter();
	});


	//------updating counter------//
	function updateCounter() {
		var remainTask = $('#incomplete-tasks li').length;

		$('#updateCounter').hide().text(remainTask).fadeIn(300);
	}

	updateCounter();

});