
class Task {
	//------create task object------//
	constructor(task) {
		this.value = task.value || task;
		this.type = task.type ||'incomplete';
		this.id = task.id || new Date().getTime();
	}

//------create task template method------//
	getTaskTemplate() {
		let listItem = '<li id="li-with-id" data-id="'+this.id+'">';
		listItem += '<input type="checkbox" class="js_changeType">';
		listItem += '<label for="inputTask">' + this.value + '</label>';
		listItem += '<input  type="text" value="' + this.value + '" class="input-value"/>';
		listItem += '<button class="pull-right js_edit">Edit</button>';
		listItem += '<button class="pull-right js_delete">Delete</button>';
		listItem += '</li>';

		return listItem;
	}
}

class ToDo {
	constructor() {
		this.taskList = [];
		this.incompleteTasks = $('#incomplete-tasks');
		this.completedTasks = $('#completed-tasks');
	}

//------get tasks from storage method------//
	getToDo(toDoArr) {
		toDoArr.forEach((item) => {
			let task = new Task(item);

			this.taskList.push(task);

			if (item.type == 'incomplete') {
				this.incompleteTasks.append(task.getTaskTemplate());
			} else {
				this.completedTasks.append(task.getTaskTemplate());
			}
		});
	}

//------save task to Local Storage method------//
	setToDo(savedToDo) {
		localStorage.setItem('savedToDo', JSON.stringify(savedToDo));
	}

//------add new task method------//
	addNewTask(taskTitle){
		let taskObj = new Task(taskTitle);

			this.taskList.push(taskObj);
			this.incompleteTasks.append(taskObj.getTaskTemplate());
			$('#new-task').val('');
			this.setToDo(this.taskList);
			this.updateCounter(this.taskList);
			this.showMessage('Task added to list');
		}

	//------edit current task method------//
	editTask(parent,text){
		let editLabel = parent.find('label').text();

		parent.find('label').html(text);

		this.taskList.forEach((i, index) => {
				if (i.value == editLabel) {
					this.taskList[index].value = text;
					this.setToDo(this.taskList);
				}
			});

		}

//------delete task method------//
	deleteTask(id){
		this.taskList.forEach((i,index) => {
			if (i.id == id) {
				this.taskList.splice(index, 1);
			}
		});

		this.setToDo(this.taskList);
		this.incompleteTasks.find("li[data-id='" + id + "']").remove();
	}

//-------change task type method------//
	changeStatus(id){
		this.taskList.forEach((i, index) => {
			if (i.id == id && i.type == 'incomplete') {
				this.taskList[index].type = 'completed';
				this.updateUiOnStatusChange(this.incompleteTasks, this.completedTasks, i.id);
				this.setToDo(this.taskList)
			}else if(i.id == id && i.type == 'completed'){
				this.taskList[index].type = 'incomplete';
				this.updateUiOnStatusChange(this.completedTasks, this.incompleteTasks, i.id);
				this.setToDo(this.taskList)
			}
		});
		this.updateCounter(this.taskList);
	}

	//------updating DOM when task status changed method------//
	updateUiOnStatusChange(removeFrom, addTo, id){
		let $task = removeFrom.find("li[data-id='" + id + "']");
		$task.remove();
		addTo.append($task);
	}

	//------show message  method------//
	showMessage(text, type){
		let message = $('.message');

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

	//-------update counter method------//
	updateCounter(taskArr){
		let remainTask =[];
		taskArr.forEach((i) => {
			if(i.type == 'incomplete' ){
				remainTask.push(i)
			}
		});
		$('#сounter').hide().text(remainTask.length).fadeIn(300)
	}
}


$(document).ready(function () {
	let todo = new ToDo(),
	  savedToDo = JSON.parse(localStorage.getItem('savedToDo'));
		if (!savedToDo) savedToDo = [];
    todo.getToDo(savedToDo);
    todo.updateCounter(savedToDo);

	//--------add new To Do--------//
	$('#add').on('click', function () {
		let newTaskTitle = $('#new-task').val();
		if (newTaskTitle === '') {
			todo.showMessage('No task added', 'warning');
		}else{
			todo.addNewTask(newTaskTitle);
		}
	});

	//-------edit task------//
	$('.task').on('click', '.js_edit', function () {

		let parent = $(this).parent(),
			id = parent.data('id'),
			editTask = $(this).prev('input[class="input-value"]').val();

		if (!parent.hasClass('editMode')) {
			parent.addClass('editMode');
		}else {
			parent.removeClass('editMode');
			todo.editTask(parent,editTask);
		}

		//-------change task type------//
	}).on('change', '.js_changeType', function () {

		let parent = $(this).parent(),
		   liId = parent.data("id");

		todo.changeStatus(liId);

	//------delete task------//
	}).on('click', '.js_delete', function () {
		var data = $(this).parent();
		var liId = data.data("id");
		todo.deleteTask(liId);
		todo.updateCounter(savedToDo);
	});
});