// $(document).ready(
// 	function () {
//
//
// 		var toAdd;
//
//
// 		function getData() {
// 			// if (localStorage["toDoList"]) {
// 			// 	var arrToDoList = JSON.parse(localStorage.getItem("toDoList"));
// 			// 	arrToDoList.map(function (i) {
// 			// 		return $(".ItemList").append('<li id="liWithId" data-id>' + i.item + '<button class="makeActive">add</button> ' + '</li>');
// 			// 	});
// 			//
// 			// }
//
// 			// if (localStorage["activeToDo"]) {
// 			// 	var arrActiveToDO = JSON.parse(localStorage.getItem("activeToDo"));
// 			// 	arrActiveToDO.map(function (i) {
// 			// 		return $(".activeToDo").append('<li id="liWithId" data-id>' + i.item +  '<button class="deleteBtn">done</button>' + '</li>');
// 			//
// 			// 	});
// 			// }
// 		}
//
// 		getData();
//
// 		$('#button').click(
// 			function () {
// 				var toDolist = [];
//
// 				toAdd = $('input[name=ListItem]').val();
// 				$('.ItemList').append('<li id="liWithId" data-id>' + toAdd +  '<button class="makeActive">add</button>' + '</li>');
//
// 				$('#liWithId').data('id',(new Date()).getTime());
//
// 				if (!localStorage["toDoList"]) {
// 					toDolist.push({id:	$('#liWithId').data('id') , item: toAdd});
// 					localStorage.setItem('toDoList', JSON.stringify(toDolist));
// 				} else {
// 					var addingNew = JSON.parse(localStorage.getItem("toDoList"));
// 					addingNew.push({id: $('#liWithId').data('id'), item: toAdd});
// 					localStorage.setItem('toDoList', JSON.stringify(addingNew));
// 				}
//
//
// 			});
//
//
// 		$(document).on('click', ".makeActive", function () {
// 			var value = $(this).parent();
// 			var action = $('#liWithId').data('id');
//
// 			if (localStorage["activeToDo"]) {
// 				var span = $(this).parent();
//
// 				var i = JSON.parse(localStorage.getItem("activeToDo"));
//
// 				i.push({id: action, item: value[0].firstChild.data});
//
// 				localStorage.setItem('activeToDo', JSON.stringify(i));
//
// 			} else {
// 				localStorage.setItem('activeToDo', JSON.stringify([{id:action,item: value[0].firstChild.data}]))
// 			}
// 			$(".activeToDo").append('<li >'+value[0].firstChild.data+'<button id="deleteBtn">done</button>' + '</li>');
//
// 		});
//
// 		$(document).on('dblclick', 'li', function () {
// 			var id = $('#liWithId').data('id');
// 			deleteItem("toDoList",id );
// 			$(this).toggleClass('strike').fadeOut('slow');
//
// 		});
//
//
// 		function deleteItem(itemName, index) {
//
// 			var arrToDel = JSON.parse(localStorage.getItem(itemName));
//
// 			for(var i = 0; i < arrToDel.length; i++) {
// 				if(arrToDel[i].id === index) {
// 					arrToDel.splice(i, 1);
// 					break;
// 				}
// 			}
//
//
// 			localStorage.setItem(itemName, JSON.stringify(arrToDel))
// 		}
//
// 		$(document).on('click','#deleteBtn',function () {
// 			var delteId=$('#liWithId').data('id');
//
// 			deleteItem('activeToDo',delteId);
//
// 			// var text = $(this).siblings('span');
// 			// var li = $(this).siblings('li');
// 			// li.toggleClass('strike').fadeOut('slow');
// 			//
// 			// deleteItem('activeToDo', text.text());
//
// 		});
// 		$('input').focus(function () {
//
// 			$(this).val('');
// 		});
// 	}
// );



$(document).ready(function(){


	$('button#add').on('click',function(){

		var $nTask = $('#new-task').val();

		if($nTask==='') {

			$('.warning').html('<p class="fa fa-warning"></p> No task added').show();

			$('.success').hide();
		}else{

			$('.success').html('<p class="fa fa-check"></p>Task added to list').fadeIn('slow').delay(500).fadeOut();

			$('.warning').hide();

			var ListItem = '<li>';
			ListItem+='<input type="checkbox">';
			ListItem+='<label>'+$nTask+'</label>';
			ListItem+='<input type="text" class="inputTask">';
			ListItem+='<button class="edit">Edit</button>';
			ListItem+='<button class="delete">Delete</button>';
			ListItem+='</li>';

			$('ul#incomplete-tasks').append(ListItem);
			$('.inputTask').val($nTask);

			$('#new-task').val('');
		};
		counter();
	});



	$('ul').on('click', '.edit',function(){

		var parent = $(this).parent();

		if (!parent.hasClass('editMode')) {
			parent.addClass('editMode');
		}else if (parent.hasClass('editMode')) {

			var editTask = $(this).prev('input[type="text"]').val();
			var editLabel = parent.find('label');
			editLabel.html(editTask);

			parent.removeClass('editMode');
		};

	});


	$('ul').on('change','input[type="checkbox"]', function(){

		var grandpa = $(this).parent().parent();

		var parent = $(this).parent();

		if (grandpa.is('#incomplete-tasks')) {
			parent.remove();
			$('#completed-tasks').append(parent);
		}else if(grandpa.is('#completed-tasks')){
			parent.remove();
			$('#incomplete-tasks').append(parent);
		}
		counter();
	});


	$('ul').on('click','.delete',function(){
		$(this).parent().remove();
		counter();
	});


	function counter(){
		var remainTask = $('#incomplete-tasks li').length;
		$('#counter').hide().fadeIn(300).html(remainTask);
	};
	counter();

});