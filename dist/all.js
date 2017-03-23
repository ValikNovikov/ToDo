'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Task = function () {
	//------create task object------//
	function Task(task) {
		_classCallCheck(this, Task);

		this.value = task.value || task;
		this.type = task.type || 'incomplete';
		this.id = task.id || new Date().getTime();
	}

	//------create task template method------//


	_createClass(Task, [{
		key: 'getTaskTemplate',
		value: function getTaskTemplate() {
			var listItem = '<li id="li-with-id" data-id="' + this.id + '">';
			listItem += '<input type="checkbox" class="js_changeType">';
			listItem += '<label for="inputTask">' + this.value + '</label>';
			listItem += '<input  type="text" value="' + this.value + '" class="input-value"/>';
			listItem += '<button class="pull-right js_edit">Edit</button>';
			listItem += '<button class="pull-right js_delete">Delete</button>';
			listItem += '</li>';

			return listItem;
		}
	}]);

	return Task;
}();

var ToDo = function () {
	function ToDo() {
		_classCallCheck(this, ToDo);

		this.taskList = [];
		this.incompleteTasks = $('#incomplete-tasks');
		this.completedTasks = $('#completed-tasks');
	}

	//------get tasks from storage method------//


	_createClass(ToDo, [{
		key: 'getToDo',
		value: function getToDo(toDoArr) {
			var _this = this;

			toDoArr.forEach(function (item) {
				var task = new Task(item);

				_this.taskList.push(task);

				if (item.type == 'incomplete') {
					_this.incompleteTasks.append(task.getTaskTemplate());
				} else {
					_this.completedTasks.append(task.getTaskTemplate());
				}
			});
		}

		//------save task to Local Storage method------//

	}, {
		key: 'setToDo',
		value: function setToDo(savedToDo) {
			localStorage.setItem('savedToDo', JSON.stringify(savedToDo));
		}

		//------add new task method------//

	}, {
		key: 'addNewTask',
		value: function addNewTask(taskTitle) {
			var taskObj = new Task(taskTitle);

			this.taskList.push(taskObj);
			this.incompleteTasks.append(taskObj.getTaskTemplate());
			$('#new-task').val('');
			this.setToDo(this.taskList);
			this.updateCounter(this.taskList);
			this.showMessage('Task added to list');
		}

		//------edit current task method------//

	}, {
		key: 'editTask',
		value: function editTask(parent, text) {
			var _this2 = this;

			var editLabel = parent.find('label').text();

			parent.find('label').html(text);

			this.taskList.forEach(function (i, index) {
				if (i.value == editLabel) {
					_this2.taskList[index].value = text;
					_this2.setToDo(_this2.taskList);
				}
			});
		}

		//------delete task method------//

	}, {
		key: 'deleteTask',
		value: function deleteTask(id) {
			var _this3 = this;

			this.taskList.forEach(function (i, index) {
				if (i.id == id && i.type == 'incomplete') {
					_this3.taskList.splice(index, 1);
					_this3.incompleteTasks.find("li[data-id='" + id + "']").remove();
				} else if (i.id == id && i.type == 'completed') {
					_this3.completedTasks.find("li[data-id='" + id + "']").remove();
				}
			});

			this.setToDo(this.taskList);
		}

		//-------change task type method------//

	}, {
		key: 'changeStatus',
		value: function changeStatus(id) {
			var _this4 = this;

			this.taskList.forEach(function (i, index) {
				if (i.id == id && i.type == 'incomplete') {
					_this4.taskList[index].type = 'completed';
					_this4.updateUiOnStatusChange(_this4.incompleteTasks, _this4.completedTasks, i.id);
					_this4.setToDo(_this4.taskList);
				} else if (i.id == id && i.type == 'completed') {
					_this4.taskList[index].type = 'incomplete';
					_this4.updateUiOnStatusChange(_this4.completedTasks, _this4.incompleteTasks, i.id);
					_this4.setToDo(_this4.taskList);
				}
			});
			this.updateCounter(this.taskList);
		}

		//------updating DOM when task status changed method------//

	}, {
		key: 'updateUiOnStatusChange',
		value: function updateUiOnStatusChange(removeFrom, addTo, id) {
			var $task = removeFrom.find("li[data-id='" + id + "']");
			$task.remove();
			addTo.append($task);
		}

		//------show message  method------//

	}, {
		key: 'showMessage',
		value: function showMessage(text, type) {
			var message = $('.message');

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

	}, {
		key: 'updateCounter',
		value: function updateCounter(taskArr) {
			var remainTask = [];
			taskArr.forEach(function (i) {
				if (i.type == 'incomplete') {
					remainTask.push(i);
					$('#сounter').hide().text(remainTask.length).fadeIn(300);
				}
			});
		}
	}]);

	return ToDo;
}();

$(document).ready(function () {
	var todo = new ToDo(),
	    savedToDo = JSON.parse(localStorage.getItem('savedToDo'));
	if (!savedToDo) savedToDo = [];
	todo.getToDo(savedToDo);
	todo.updateCounter(savedToDo);

	//--------add new To Do--------//
	$('#add').on('click', function () {
		var newTaskTitle = $('#new-task').val();
		if (newTaskTitle === '') {
			todo.showMessage('No task added', 'warning');
		} else {
			todo.addNewTask(newTaskTitle);
		}
	});

	//-------edit task------//
	$('.task').on('click', '.js_edit', function () {

		var parent = $(this).parent(),
		    id = parent.data('id'),
		    editTask = $(this).prev('input[class="input-value"]').val();

		if (!parent.hasClass('editMode')) {
			parent.addClass('editMode');
		} else {
			parent.removeClass('editMode');
			todo.editTask(parent, editTask);
		}

		//-------change task type------//
	}).on('change', '.js_changeType', function () {

		var parent = $(this).parent(),
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRvZG8uanMiXSwibmFtZXMiOlsiVGFzayIsInRhc2siLCJ2YWx1ZSIsInR5cGUiLCJpZCIsIkRhdGUiLCJnZXRUaW1lIiwibGlzdEl0ZW0iLCJUb0RvIiwidGFza0xpc3QiLCJpbmNvbXBsZXRlVGFza3MiLCIkIiwiY29tcGxldGVkVGFza3MiLCJ0b0RvQXJyIiwiZm9yRWFjaCIsIml0ZW0iLCJwdXNoIiwiYXBwZW5kIiwiZ2V0VGFza1RlbXBsYXRlIiwic2F2ZWRUb0RvIiwibG9jYWxTdG9yYWdlIiwic2V0SXRlbSIsIkpTT04iLCJzdHJpbmdpZnkiLCJ0YXNrVGl0bGUiLCJ0YXNrT2JqIiwidmFsIiwic2V0VG9EbyIsInVwZGF0ZUNvdW50ZXIiLCJzaG93TWVzc2FnZSIsInBhcmVudCIsInRleHQiLCJlZGl0TGFiZWwiLCJmaW5kIiwiaHRtbCIsImkiLCJpbmRleCIsInNwbGljZSIsInJlbW92ZSIsInVwZGF0ZVVpT25TdGF0dXNDaGFuZ2UiLCJyZW1vdmVGcm9tIiwiYWRkVG8iLCIkdGFzayIsIm1lc3NhZ2UiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwic2hvdyIsImZhZGVJbiIsImRlbGF5IiwiZmFkZU91dCIsInRhc2tBcnIiLCJyZW1haW5UYXNrIiwiaGlkZSIsImxlbmd0aCIsImRvY3VtZW50IiwicmVhZHkiLCJ0b2RvIiwicGFyc2UiLCJnZXRJdGVtIiwiZ2V0VG9EbyIsIm9uIiwibmV3VGFza1RpdGxlIiwiYWRkTmV3VGFzayIsImRhdGEiLCJlZGl0VGFzayIsInByZXYiLCJoYXNDbGFzcyIsImxpSWQiLCJjaGFuZ2VTdGF0dXMiLCJkZWxldGVUYXNrIl0sIm1hcHBpbmdzIjoiOzs7Ozs7SUFDTUE7QUFDTDtBQUNBLGVBQVlDLElBQVosRUFBa0I7QUFBQTs7QUFDakIsT0FBS0MsS0FBTCxHQUFhRCxLQUFLQyxLQUFMLElBQWNELElBQTNCO0FBQ0EsT0FBS0UsSUFBTCxHQUFZRixLQUFLRSxJQUFMLElBQVksWUFBeEI7QUFDQSxPQUFLQyxF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QUFPaUMsSUFBUCxDQUFZLElBQVosQ0FEVjs7QUFHQVAsT0FBS1ksWUFBTCxDQUFrQkQsSUFBbEI7O0FBRUQ7QUFDQyxFQXRCRCxFQXNCR1AsRUF0QkgsQ0FzQk0sT0F0Qk4sRUFzQmUsWUF0QmYsRUFzQjZCLFlBQVk7QUFDeEMsTUFBSUcsT0FBT3BELEVBQUUsSUFBRixFQUFRbUIsTUFBUixFQUFYO0FBQ0EsTUFBSXFDLE9BQU9KLEtBQUtBLElBQUwsQ0FBVSxJQUFWLENBQVg7QUFDQVAsT0FBS2EsVUFBTCxDQUFnQkYsSUFBaEI7QUFDQVgsT0FBSzVCLGFBQUwsQ0FBbUJULFNBQW5CO0FBQ0EsRUEzQkQ7QUE0QkEsQ0E5Q0QiLCJmaWxlIjoiYWxsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5jbGFzcyBUYXNrIHtcblx0Ly8tLS0tLS1jcmVhdGUgdGFzayBvYmplY3QtLS0tLS0vL1xuXHRjb25zdHJ1Y3Rvcih0YXNrKSB7XG5cdFx0dGhpcy52YWx1ZSA9IHRhc2sudmFsdWUgfHwgdGFzaztcblx0XHR0aGlzLnR5cGUgPSB0YXNrLnR5cGUgfHwnaW5jb21wbGV0ZSc7XG5cdFx0dGhpcy5pZCA9IHRhc2suaWQgfHwgbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cdH1cblxuLy8tLS0tLS1jcmVhdGUgdGFzayB0ZW1wbGF0ZSBtZXRob2QtLS0tLS0vL1xuXHRnZXRUYXNrVGVtcGxhdGUoKSB7XG5cdFx0bGV0IGxpc3RJdGVtID0gJzxsaSBpZD1cImxpLXdpdGgtaWRcIiBkYXRhLWlkPVwiJyt0aGlzLmlkKydcIj4nO1xuXHRcdGxpc3RJdGVtICs9ICc8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2xhc3M9XCJqc19jaGFuZ2VUeXBlXCI+Jztcblx0XHRsaXN0SXRlbSArPSAnPGxhYmVsIGZvcj1cImlucHV0VGFza1wiPicgKyB0aGlzLnZhbHVlICsgJzwvbGFiZWw+Jztcblx0XHRsaXN0SXRlbSArPSAnPGlucHV0ICB0eXBlPVwidGV4dFwiIHZhbHVlPVwiJyArIHRoaXMudmFsdWUgKyAnXCIgY2xhc3M9XCJpbnB1dC12YWx1ZVwiLz4nO1xuXHRcdGxpc3RJdGVtICs9ICc8YnV0dG9uIGNsYXNzPVwicHVsbC1yaWdodCBqc19lZGl0XCI+RWRpdDwvYnV0dG9uPic7XG5cdFx0bGlzdEl0ZW0gKz0gJzxidXR0b24gY2xhc3M9XCJwdWxsLXJpZ2h0IGpzX2RlbGV0ZVwiPkRlbGV0ZTwvYnV0dG9uPic7XG5cdFx0bGlzdEl0ZW0gKz0gJzwvbGk+JztcblxuXHRcdHJldHVybiBsaXN0SXRlbTtcblx0fVxufVxuXG5jbGFzcyBUb0RvIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy50YXNrTGlzdCA9IFtdO1xuXHRcdHRoaXMuaW5jb21wbGV0ZVRhc2tzID0gJCgnI2luY29tcGxldGUtdGFza3MnKTtcblx0XHR0aGlzLmNvbXBsZXRlZFRhc2tzID0gJCgnI2NvbXBsZXRlZC10YXNrcycpO1xuXHR9XG5cbi8vLS0tLS0tZ2V0IHRhc2tzIGZyb20gc3RvcmFnZSBtZXRob2QtLS0tLS0vL1xuXHRnZXRUb0RvKHRvRG9BcnIpIHtcblx0XHR0b0RvQXJyLmZvckVhY2goKGl0ZW0pID0+IHtcblx0XHRcdGxldCB0YXNrID0gbmV3IFRhc2soaXRlbSk7XG5cblx0XHRcdHRoaXMudGFza0xpc3QucHVzaCh0YXNrKTtcblxuXHRcdFx0aWYgKGl0ZW0udHlwZSA9PSAnaW5jb21wbGV0ZScpIHtcblx0XHRcdFx0dGhpcy5pbmNvbXBsZXRlVGFza3MuYXBwZW5kKHRhc2suZ2V0VGFza1RlbXBsYXRlKCkpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5jb21wbGV0ZWRUYXNrcy5hcHBlbmQodGFzay5nZXRUYXNrVGVtcGxhdGUoKSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuLy8tLS0tLS1zYXZlIHRhc2sgdG8gTG9jYWwgU3RvcmFnZSBtZXRob2QtLS0tLS0vL1xuXHRzZXRUb0RvKHNhdmVkVG9Ebykge1xuXHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdzYXZlZFRvRG8nLCBKU09OLnN0cmluZ2lmeShzYXZlZFRvRG8pKTtcblx0fVxuXG4vLy0tLS0tLWFkZCBuZXcgdGFzayBtZXRob2QtLS0tLS0vL1xuXHRhZGROZXdUYXNrKHRhc2tUaXRsZSl7XG5cdFx0bGV0IHRhc2tPYmogPSBuZXcgVGFzayh0YXNrVGl0bGUpO1xuXG5cdFx0XHR0aGlzLnRhc2tMaXN0LnB1c2godGFza09iaik7XG5cdFx0XHR0aGlzLmluY29tcGxldGVUYXNrcy5hcHBlbmQodGFza09iai5nZXRUYXNrVGVtcGxhdGUoKSk7XG5cdFx0XHQkKCcjbmV3LXRhc2snKS52YWwoJycpO1xuXHRcdFx0dGhpcy5zZXRUb0RvKHRoaXMudGFza0xpc3QpO1xuXHRcdFx0dGhpcy51cGRhdGVDb3VudGVyKHRoaXMudGFza0xpc3QpO1xuXHRcdFx0dGhpcy5zaG93TWVzc2FnZSgnVGFzayBhZGRlZCB0byBsaXN0Jyk7XG5cdFx0fVxuXG5cdC8vLS0tLS0tZWRpdCBjdXJyZW50IHRhc2sgbWV0aG9kLS0tLS0tLy9cblx0ZWRpdFRhc2socGFyZW50LHRleHQpe1xuXHRcdGxldCBlZGl0TGFiZWwgPSBwYXJlbnQuZmluZCgnbGFiZWwnKS50ZXh0KCk7XG5cblx0XHRwYXJlbnQuZmluZCgnbGFiZWwnKS5odG1sKHRleHQpO1xuXG5cdFx0dGhpcy50YXNrTGlzdC5mb3JFYWNoKChpLCBpbmRleCkgPT4ge1xuXHRcdFx0XHRpZiAoaS52YWx1ZSA9PSBlZGl0TGFiZWwpIHtcblx0XHRcdFx0XHR0aGlzLnRhc2tMaXN0W2luZGV4XS52YWx1ZSA9IHRleHQ7XG5cdFx0XHRcdFx0dGhpcy5zZXRUb0RvKHRoaXMudGFza0xpc3QpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdH1cblxuLy8tLS0tLS1kZWxldGUgdGFzayBtZXRob2QtLS0tLS0vL1xuXHRkZWxldGVUYXNrKGlkKXtcblx0XHR0aGlzLnRhc2tMaXN0LmZvckVhY2goKGksaW5kZXgpID0+IHtcblx0XHRcdGlmIChpLmlkID09IGlkICYmIGkudHlwZSA9PSAnaW5jb21wbGV0ZScpIHtcblx0XHRcdFx0dGhpcy50YXNrTGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xuXHRcdFx0XHR0aGlzLmluY29tcGxldGVUYXNrcy5maW5kKFwibGlbZGF0YS1pZD0nXCIgKyBpZCArIFwiJ11cIikucmVtb3ZlKCk7XG5cdFx0XHR9ZWxzZSBpZihpLmlkID09IGlkICYmIGkudHlwZSA9PSAnY29tcGxldGVkJyl7XG5cdFx0XHRcdHRoaXMuY29tcGxldGVkVGFza3MuZmluZChcImxpW2RhdGEtaWQ9J1wiICsgaWQgKyBcIiddXCIpLnJlbW92ZSgpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0dGhpcy5zZXRUb0RvKHRoaXMudGFza0xpc3QpO1xuXG5cdH1cblxuLy8tLS0tLS0tY2hhbmdlIHRhc2sgdHlwZSBtZXRob2QtLS0tLS0vL1xuXHRjaGFuZ2VTdGF0dXMoaWQpe1xuXHRcdHRoaXMudGFza0xpc3QuZm9yRWFjaCgoaSwgaW5kZXgpID0+IHtcblx0XHRcdGlmIChpLmlkID09IGlkICYmIGkudHlwZSA9PSAnaW5jb21wbGV0ZScpIHtcblx0XHRcdFx0dGhpcy50YXNrTGlzdFtpbmRleF0udHlwZSA9ICdjb21wbGV0ZWQnO1xuXHRcdFx0XHR0aGlzLnVwZGF0ZVVpT25TdGF0dXNDaGFuZ2UodGhpcy5pbmNvbXBsZXRlVGFza3MsIHRoaXMuY29tcGxldGVkVGFza3MsIGkuaWQpO1xuXHRcdFx0XHR0aGlzLnNldFRvRG8odGhpcy50YXNrTGlzdClcblx0XHRcdH1lbHNlIGlmKGkuaWQgPT0gaWQgJiYgaS50eXBlID09ICdjb21wbGV0ZWQnKXtcblx0XHRcdFx0dGhpcy50YXNrTGlzdFtpbmRleF0udHlwZSA9ICdpbmNvbXBsZXRlJztcblx0XHRcdFx0dGhpcy51cGRhdGVVaU9uU3RhdHVzQ2hhbmdlKHRoaXMuY29tcGxldGVkVGFza3MsIHRoaXMuaW5jb21wbGV0ZVRhc2tzLCBpLmlkKTtcblx0XHRcdFx0dGhpcy5zZXRUb0RvKHRoaXMudGFza0xpc3QpXG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0dGhpcy51cGRhdGVDb3VudGVyKHRoaXMudGFza0xpc3QpO1xuXHR9XG5cblx0Ly8tLS0tLS11cGRhdGluZyBET00gd2hlbiB0YXNrIHN0YXR1cyBjaGFuZ2VkIG1ldGhvZC0tLS0tLS8vXG5cdHVwZGF0ZVVpT25TdGF0dXNDaGFuZ2UocmVtb3ZlRnJvbSwgYWRkVG8sIGlkKXtcblx0XHRsZXQgJHRhc2sgPSByZW1vdmVGcm9tLmZpbmQoXCJsaVtkYXRhLWlkPSdcIiArIGlkICsgXCInXVwiKTtcblx0XHQkdGFzay5yZW1vdmUoKTtcblx0XHRhZGRUby5hcHBlbmQoJHRhc2spO1xuXHR9XG5cblx0Ly8tLS0tLS1zaG93IG1lc3NhZ2UgIG1ldGhvZC0tLS0tLS8vXG5cdHNob3dNZXNzYWdlKHRleHQsIHR5cGUpe1xuXHRcdGxldCBtZXNzYWdlID0gJCgnLm1lc3NhZ2UnKTtcblxuXHRcdGlmICh0eXBlID09PSAnd2FybmluZycpIHtcblx0XHRcdG1lc3NhZ2UucmVtb3ZlQ2xhc3MoJ3N1Y2Nlc3MnKTtcblx0XHRcdG1lc3NhZ2UuYWRkQ2xhc3MoJ3dhcm5pbmcnKTtcblx0XHRcdG1lc3NhZ2UuaHRtbCgnPHAgY2xhc3M9XCJmYSBmYS13YXJuaW5nXCI+PC9wPicgKyB0ZXh0KS5zaG93KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG1lc3NhZ2UucmVtb3ZlQ2xhc3MoJ3dhcm5pbmcnKTtcblx0XHRcdG1lc3NhZ2UuYWRkQ2xhc3MoJ3N1Y2Nlc3MnKTtcblx0XHRcdG1lc3NhZ2UuaHRtbCgnPHAgY2xhc3M9XCJmYSBmYS1jaGVja1wiPjwvcD4nICsgdGV4dCkuZmFkZUluKCdzbG93JykuZGVsYXkoNTAwKS5mYWRlT3V0KCk7XG5cdFx0fVxuXHR9XG5cblx0Ly8tLS0tLS0tdXBkYXRlIGNvdW50ZXIgbWV0aG9kLS0tLS0tLy9cblx0dXBkYXRlQ291bnRlcih0YXNrQXJyKXtcblx0XHRsZXQgcmVtYWluVGFzayA9W107XG5cdFx0dGFza0Fyci5mb3JFYWNoKChpKSA9PiB7XG5cdFx0XHRpZihpLnR5cGUgPT0gJ2luY29tcGxldGUnICl7XG5cdFx0XHRcdHJlbWFpblRhc2sucHVzaChpKTtcblx0XHRcdFx0JCgnI9GBb3VudGVyJykuaGlkZSgpLnRleHQocmVtYWluVGFzay5sZW5ndGgpLmZhZGVJbigzMDApXG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0fVxufVxuXG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcblx0bGV0IHRvZG8gPSBuZXcgVG9EbygpLFxuXHQgIHNhdmVkVG9EbyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3NhdmVkVG9EbycpKTtcblx0XHRpZiAoIXNhdmVkVG9Ebykgc2F2ZWRUb0RvID0gW107XG4gICAgdG9kby5nZXRUb0RvKHNhdmVkVG9Ebyk7XG4gICAgdG9kby51cGRhdGVDb3VudGVyKHNhdmVkVG9Ebyk7XG5cblx0Ly8tLS0tLS0tLWFkZCBuZXcgVG8gRG8tLS0tLS0tLS8vXG5cdCQoJyNhZGQnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG5cdFx0bGV0IG5ld1Rhc2tUaXRsZSA9ICQoJyNuZXctdGFzaycpLnZhbCgpO1xuXHRcdGlmIChuZXdUYXNrVGl0bGUgPT09ICcnKSB7XG5cdFx0XHR0b2RvLnNob3dNZXNzYWdlKCdObyB0YXNrIGFkZGVkJywgJ3dhcm5pbmcnKTtcblx0XHR9ZWxzZXtcblx0XHRcdHRvZG8uYWRkTmV3VGFzayhuZXdUYXNrVGl0bGUpO1xuXHRcdH1cblx0fSk7XG5cblx0Ly8tLS0tLS0tZWRpdCB0YXNrLS0tLS0tLy9cblx0JCgnLnRhc2snKS5vbignY2xpY2snLCAnLmpzX2VkaXQnLCBmdW5jdGlvbiAoKSB7XG5cblx0XHRsZXQgcGFyZW50ID0gJCh0aGlzKS5wYXJlbnQoKSxcblx0XHRcdGlkID0gcGFyZW50LmRhdGEoJ2lkJyksXG5cdFx0XHRlZGl0VGFzayA9ICQodGhpcykucHJldignaW5wdXRbY2xhc3M9XCJpbnB1dC12YWx1ZVwiXScpLnZhbCgpO1xuXG5cdFx0aWYgKCFwYXJlbnQuaGFzQ2xhc3MoJ2VkaXRNb2RlJykpIHtcblx0XHRcdHBhcmVudC5hZGRDbGFzcygnZWRpdE1vZGUnKTtcblx0XHR9ZWxzZSB7XG5cdFx0XHRwYXJlbnQucmVtb3ZlQ2xhc3MoJ2VkaXRNb2RlJyk7XG5cdFx0XHR0b2RvLmVkaXRUYXNrKHBhcmVudCxlZGl0VGFzayk7XG5cdFx0fVxuXG5cdFx0Ly8tLS0tLS0tY2hhbmdlIHRhc2sgdHlwZS0tLS0tLS8vXG5cdH0pLm9uKCdjaGFuZ2UnLCAnLmpzX2NoYW5nZVR5cGUnLCBmdW5jdGlvbiAoKSB7XG5cblx0XHRsZXQgcGFyZW50ID0gJCh0aGlzKS5wYXJlbnQoKSxcblx0XHQgICBsaUlkID0gcGFyZW50LmRhdGEoXCJpZFwiKTtcblxuXHRcdHRvZG8uY2hhbmdlU3RhdHVzKGxpSWQpO1xuXG5cdC8vLS0tLS0tZGVsZXRlIHRhc2stLS0tLS0vL1xuXHR9KS5vbignY2xpY2snLCAnLmpzX2RlbGV0ZScsIGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgZGF0YSA9ICQodGhpcykucGFyZW50KCk7XG5cdFx0dmFyIGxpSWQgPSBkYXRhLmRhdGEoXCJpZFwiKTtcblx0XHR0b2RvLmRlbGV0ZVRhc2sobGlJZCk7XG5cdFx0dG9kby51cGRhdGVDb3VudGVyKHNhdmVkVG9Ebyk7XG5cdH0pO1xufSk7Il19
