$(document).ready(function () {
	var savedToDo = JSON.parse(localStorage.getItem('savedToDo')),
  incompleteTasks=$('#incomplete-tasks'),
	completedTasks=$('#completed-tasks');
	if (!savedToDo) savedToDo = [];

//------save and get data from/to local Storage--------//
	var localStorageService = {
		setToDo: function () {
			localStorage.setItem('savedToDo', JSON.stringify(savedToDo));
		},
		getToDo: function () {
			savedToDo.map(function (i) {
				var newTaskTitle = i.value,
				listItem = '<li id="li-with-id">';
				listItem += '<input type="checkbox" id="changeType">';
				listItem += '<label for="inputTask">' + newTaskTitle + '</label>';
				listItem += '<input  type="text" value="' + i.value + '" class="input-value"/>';
				listItem += '<button class="pull-right edit">Edit</button>';
				listItem += '<button class="pull-right delete">Delete</button>';
				listItem += '</li>';

				if (i.type == 'incomplete') {
					incompleteTasks.append(listItem);
				} else {
					$('#completed-tasks li').remove();
					completedTasks.append(listItem);
				}
				$('#li-with-id').attr("id", i.id);
			});
		}
	};

	localStorageService.getToDo();

	//----show-hide message----//
	function showMessage(text, type) {
		var message =	$('.message');
		if (type === 'warning') {
			message.removeClass('success');
			message.addClass('warning');
			message.html('<p class="fa fa-warning"></p>' + text).show();

		} else {
			message.removeClass('warning');
			message.addClass('success');
			message.html('<p class="fa fa-check"></p>' + text).fadeIn('slow').delay(500).fadeOut();
		}
	}

	//--------add new To Do--------//
	$('#add').on('click', function () {
		var newTaskTitle = $('#new-task').val(),
			id = new Date().getTime(),
			newTask = $('#new-task');


		if (newTaskTitle === '') {
			showMessage('No task added', 'warning');
		} else {
			showMessage('Task added to list');
			savedToDo.push({id: id, type: 'incomplete', value: newTaskTitle});
			incompleteTasks.children().remove();
			localStorageService.getToDo();
			$('#li-with-id').attr("id", id);
			newTask.val('');
			localStorageService.setToDo()
		}
		updateCounter();
	});

	//-------edit task------//
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

//-------change task type------//
	}).on('change', '#changeType', function () {

		var parent = $(this).parent();
		var grandpa = parent.parent();
		var liId = parent.attr("id");

		function changeTaskType(type) {
			savedToDo.map(function (i, index) {
				if (i.id == liId) {
					savedToDo[index].type = type;
					localStorageService.setToDo();
				}
			});
		}

		if (grandpa.is('#incomplete-tasks')) {
			parent.remove();
			completedTasks.append(parent);
			changeTaskType('completed')
		} else if (grandpa.is('#completed-tasks')) {
			parent.remove();
			incompleteTasks.append(parent);
			changeTaskType('incomplete')
		}
		updateCounter();

		//------delete task------//

	}).on('click', '.delete', function () {
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

	//------update counter------//
	function updateCounter() {
		var remainTask = $('#incomplete-tasks li').length;
		$('#сounter').hide().text(remainTask).fadeIn(300);
	}
	updateCounter();

});