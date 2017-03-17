$(document).ready(function () {



	//------saving data to local Storage--------//
	function localStorageService(id, type, title) {
		var savedToDo = JSON.parse(localStorage.getItem('savedToDo'));
		if (savedToDo) {
			savedToDo.push({id: id, type: type, value: title});
			localStorage.setItem('savedToDo', JSON.stringify(savedToDo));
		} else {
			localStorage.setItem('savedToDo', JSON.stringify([{id: id, type: type, value: title}]));
		}

	}

	//------getting data from local Storage--------//
	function GetData() {
		var savedItems = JSON.parse(localStorage.getItem('savedToDo'));
		if (savedItems) {
			savedItems.map(function (i) {
				var newTaskTitle = i.value;
				var listItem = '<li id="li-with-id">';
				listItem += '<input type="checkbox">';
				listItem += '<label for="inputTask">' + newTaskTitle + '</label>';
				listItem += '<input  type="text" value="' + i.value + '" class="input-value"/>';
				listItem += '<button class="edit">Edit</button>';
				listItem += '<button class="delete">Delete</button>';
				listItem += '</li>';

				// $(".input-value").prop("value",i.value);
				$('#incomplete-tasks').append(listItem);
				$('#li-with-id').attr("id", i.id);

			});

		}

	}

	GetData();

	//----show-hide message----//
	function message(text, type) {
		if (type === 'warning') {

			$('.warning').html('<p class="fa fa-warning"></p>' + text).show();
			$('.success').hide();

		} else {
			$('.success').html('<p class="fa fa-check"></p>' + text).fadeIn('slow').delay(500).fadeOut();
			$('.warning').hide();
		}
	}

	//--------adding new To Do--------//
	$('#add').on('click', function () {
		var newTaskTitle = $('#new-task').val(),
			id = new Date().getTime(),
			incompleteTask = $('#incomplete-tasks'),
			newTask = $('#new-task'),
			inputTask = $('#input-task'),
			listItem;
		listItem = '<li id="li-with-id">';
		listItem += '<input type="checkbox">';
		listItem += '<label for="inputTask">' + newTaskTitle + '</label>';
		listItem += '<input type="text" value="' + newTaskTitle + '"   class="input-value"/>';
		listItem += '<button class="edit">Edit</button>';
		listItem += '<button class="delete">Delete</button>';
		listItem += '</li>';


		if (newTaskTitle === '') {
			message('No task added', 'warning');

		} else {
			message('Task added to list');
			incompleteTask.append(listItem);

			$('#li-with-id').attr("id", id);
			newTask.val('');

			localStorageService(id, 'incompleted', newTaskTitle)
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
			var labelText=editLabel.text();
			editLabel.html(editTask);
			parent.removeClass('editMode');
			var deletingValue = JSON.parse(localStorage.getItem('savedToDo'));
			deletingValue.map(function (i, index) {
				if (i.value == labelText) {
					deletingValue[index].value=editTask;
					localStorage.setItem('savedToDo', JSON.stringify(deletingValue));
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
		var deletingTask = JSON.parse(localStorage.getItem('savedToDo'));
		deletingTask.map(function (i, index) {
			if (i.id == liId) {
				deletingTask.splice(index, 1);
				localStorage.setItem('savedToDo', JSON.stringify(deletingTask));
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