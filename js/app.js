var main = function () {

    /* Model which is used to store each todo */
    var todoModel = function () {
        id = "";
        value = "";
        completed = false;
    };

    /* Variable to decide which list(all/active/completed) to display */
    var populateState = "all";

    /* Reference to DOM Elements */
    var todoInput = document.getElementById('todo');
    var allLink = document.getElementById('alllink');
    var activeLink = document.getElementById('activelink');
    var completedLink = document.getElementById('completedlink');
    var clearCompleted = document.getElementById('clearcompleted');
    var dummyP = document.getElementById('dummyp');
    var itemsTodo = document.getElementById('itemsTodo');
    var todoDiv = document.getElementsByClassName('todo');
    var selectAllBtn = document.getElementById('selectall');
    var deleteAllBtn = document.getElementById('deleteall');
    var btnPara = document.getElementById('btnpara');
    var bodyDiv = document.getElementById('bodycontent');

    /* 
        Function which returns todo list from localStorage 
        Input : none
        Output : Array of todo Objects(todoModel) 
    */
    var getTodoList = function () {
        return JSON.parse(localStorage.getItem("todos"));
    };

    /* 
        Function which returns random number
        Input : none
        Output : Unique number, to be used as todo ID 
    */
    var getTodoID = function () {
        return Math.floor((Math.random() * 123456789) + 123);
    };

    /* Array which contains todo Objects(todoModel) */
    var todoList = getTodoList();

    /*
        Function which removes the DOM Elements for each todo in the list
        Input : none
        Output : Clears the todo list UI
    */
    var clearTodoListUI = function () {
        var parentEle = document.getElementById('todolist-content');
        while (parentEle.hasChildNodes()) {
            parentEle.removeChild(parentEle.lastChild);
        }
    };

    /* 
        Function which creates UI(DOM Elements) for Single todo in the list 
        Input : ID, Value of the todo to be displayed
        Output : Creates single todo UI 
    */
    var createTodoListUI = function (todoID, todoValue) {
        var id = todoID;
        var value = todoValue;

        var parentDiv1 = document.getElementById('todolist-content');
        var div = document.createElement('div');
        div.setAttribute('class', 'todo');
        div.setAttribute('id', id);
        parentDiv1.appendChild(div);

        var parentDiv2 = document.getElementById(id);

        var inputComplete = document.createElement('input');
        inputComplete.setAttribute('type', 'checkbox');
        inputComplete.setAttribute('class', 'complete');
        parentDiv2.appendChild(inputComplete);

        var inputDelete = document.createElement('input');
        inputDelete.setAttribute('type', 'button');
        inputDelete.setAttribute('class', 'delete');
        parentDiv2.appendChild(inputDelete);

        var para = document.createElement('p');
        para.textContent = value;
        parentDiv2.appendChild(para);
    };

    /*
        Function which displays appropriate list(All/Active/Completed)
        Input : 'populateState' Variable
        Output : DOM Elements are created and displayed for todo list
    */
    var populateTodos = function (populateState) {
        var todoID, todoValue, todoCompleted;

        clearTodoListUI();

        if (todoList != null) {
            bodyDiv.setAttribute('class', '');
            for (var i = 0; i < todoList.length; i++) {
                todoID = todoList[i].id;
                todoValue = todoList[i].value;
                todoCompleted = todoList[i].completed;
                if (populateState === "all") {
                    createTodoListUI(todoID, todoValue);
                } else if (populateState === "active" && !todoCompleted) {
                    createTodoListUI(todoID, todoValue);
                } else if (populateState === "completed" && todoCompleted) {
                    createTodoListUI(todoID, todoValue);
                }
            }
            completedTodoUI();
        } else {
            bodyDiv.setAttribute('class', 'hide');
        }
    };

    /*
        Function which adds new todo to the list
        Input : Event object of keyup on the Input DOM Element
        Output : A new todo is added to list(todoList) and to localStorage 
    */
    var addTodo = function (event) {
        if (event.keyCode === 13) {

            if (todoInput.value == "") {
                return;
            }

            if (todoList == null) {
                todoList = [];
            }
            var todo = new todoModel();
            todo.id = getTodoID();
            todo.value = todoInput.value;
            todo.completed = false;

            todoList.push(todo);

            var todos = JSON.stringify(todoList);
            localStorage.setItem("todos", todos);
            todoInput.value = "";

            update();
        }
    };

    /*
        Function which is triggered when 'DELETE BUTTON(CIRCULAR)' is clicked
        Input : Event object of click on Div containing delete button
        Output : Appropriate todo(based on id) is deleted from list and localStorage
    */

    var deleteTodo = function (event) {
        var todos;
        var id = event.currentTarget.id;

        if (todoList != null) {
            if (todoList.length == 1) {
                localStorage.clear();
                todoList = getTodoList();
            } else {
                for (var i = 0; i < todoList.length; i++) {
                    if (todoList[i].id == id) {
                        todoList.splice(i, 1);
                    }
                }
                todos = JSON.stringify(todoList);
                localStorage.setItem("todos", todos);
            }
            update();
        }
    };

    /*
        Function which is triggered when 'Clear Completed' is clicked
        Input : none
        Output : Deletes all the completed todos
    */
    var deleteCompletedTodos = function () {

        var todos;
        var completedTodoIndex = [];

        if (todoList != null) {
            var i = 0;
            var arrayLength = todoList.length;
            while (i < arrayLength) {
                if (todoList[i].completed) {
                    todoList.splice(i, 1);
                    arrayLength = todoList.length;
                } else {
                    i++;
                }
            }
            if (todoList.length == 0) {
                localStorage.clear();
                todoList = getTodoList();
            } else {
                todos = JSON.stringify(todoList);
                localStorage.setItem("todos", todos);
            }
            update();
        }
    };

    /*
        Function which is triggered when 'CLEAR ALL BUTTON(CIRCULAR)' is clicked
        Input : none
        Output : Deletes all todos by clearing localStorage
    */
    var deleteAllTodos = function () {
        if (localStorage.getItem("todos")) {
            localStorage.clear();
            todoList = getTodoList();
            update();
        }
    };

    /*
        Function which is triggered when 'MARK/UNMARK CHECKBOX(CIRCULAR)' is clicked
        Input : Event object of click on Div containing mark/unmark checkbox
        Output : Appropriate todo(based on id) is marked as completed
    */
    var completedTodo = function (event) {
        var todos;
        var id = event.currentTarget.id;

        if (todoList != null) {
            for (var i = 0; i < todoList.length; i++) {
                if (todoList[i].id == id) {
                    todoList[i].completed = event.target.checked;
                }
            }
            todos = JSON.stringify(todoList);
            localStorage.setItem("todos", todos);
        }
        update();
    };

    /*
        Function which changes the appearance of completed todos
        Input : none
        Output : Changes the UI of completed todos, UI of selectall checkbox and UI of 'Clear Completed'
    */
    var completedTodoUI = function () {
        var id;
        var para;
        var input;
        var completedTodoCount = 0;
        var selectAllCheckboxInput = document.getElementById('selectall');

        if (todoList != null) {
            for (var i = 0; i < todoList.length; i++) {
                id = document.getElementById(todoList[i].id);
                if (id == null) {
                    continue;
                }
                para = id.getElementsByTagName('p');
                if (todoList[i].completed === true) {
                    completedTodoCount++;
                    input = id.getElementsByTagName('input');
                    for (var j = 0; j < input.length; j++) {
                        if (input[j].type.toLowerCase() == 'checkbox') {
                            input[j].checked = true;
                            input[j].setAttribute('class', 'completed');
                            para[0].setAttribute('class', 'todocompleted');
                        }
                    }
                } else if (todoList[i].completed === false) {
                    input = id.getElementsByTagName('input');
                    for (var j = 0; j < input.length; j++) {
                        if (input[j].type.toLowerCase() == 'checkbox') {
                            input[j].checked = false;
                            input[j].setAttribute('class', 'complete');
                            para[0].setAttribute('class', '');
                        }
                    }
                }
            }

            if (completedTodoCount == todoList.length) {
                selectAllCheckboxInput.checked = true;
                selectAllCheckboxInput.setAttribute('class', 'selectedall');
            } else {
                selectAllCheckboxInput.checked = false;
                selectAllCheckboxInput.setAttribute('class', '');
            }
        }
        if (completedTodoCount > 0) {
            clearCompleted.setAttribute('class', '');
            dummyP.setAttribute('class', 'hide');
        } else {
            clearCompleted.setAttribute('class', 'hide');
            dummyP.setAttribute('class', '');
        }
    };

    /*
        Function which is triggered when either 'MARK CHECKBOX' or 'DELETE BUTTON' is clicked
        Input :  Event object of click on Div containing mark/unmark checkbox and delete button
        Output : Appropriate function(completedTodo or deleteTodo) is called
    */
    var clickOptionDecider = function (event) {
        if (event.target !== event.currentTarget) {
            if (event.target.tagName == "INPUT") {
                if (event.target.getAttribute('class') == 'delete') {
                    deleteTodo(event);
                } else if (event.target.type.toLowerCase() == 'checkbox') {
                    completedTodo(event);
                }
            }
        }
        event.stopPropagation();
    };

    /*
        Function which is triggered when 'MARK/UNMARK ALL CHECKBOX(CIRCULAR)' is clicked
        Input : Event object of mouseclick on MARK/UNMARK ALL CHECKBOX
        Output : All todos are marked/unmarked as completed 
    */
    var completedAllTodos = function (event) {
        var todos;
        var checkboxInput = event.target;
        if (checkboxInput.checked) {
            checkboxInput.setAttribute('class', 'selectedall');
            if (todoList != null) {
                for (var i = 0; i < todoList.length; i++) {
                    todoList[i].completed = true;
                }
                todos = JSON.stringify(todoList);
                localStorage.setItem("todos", todos);
            }
        } else {
            checkboxInput.setAttribute('class', '');
            if (todoList != null) {
                for (var i = 0; i < todoList.length; i++) {
                    todoList[i].completed = false;
                }
                todos = JSON.stringify(todoList);
                localStorage.setItem("todos", todos);
            }
        }
        update();
    };

    /*
        Function which adds the edited todo to the list and to localStorage
        Input : Event object of keyup on Input DOM, ID of todo to be edited
        Output : Appropriate todo(whose id is passed) value is changed
    */
    var addEditedTodo = function (event, editedTodoID) {
        var todos;

        if (todoList != null) {
            for (var i = 0; i < todoList.length; i++) {
                if (todoList[i].id == editedTodoID) {
                    if (event.target.value == "") {
                        todoList.splice(i, 1);
                    } else {
                        todoList[i].value = event.target.value;
                    }
                }
            }
            todos = JSON.stringify(todoList);
            localStorage.setItem("todos", todos);
        }
    };

    /*
        Function which is triggered when todo text is double clicked
        Input : Event object of double click on Paragraph Element
        Output : An Input DOM Element is inserted and appropriate function(addEditedTodo) is called to add edited todo
    */
    var editTodo = function (event) {
        var textInput;
        var para = event.target;
        var divID = para.parentElement.id;
        var todo = event.target.textContent;
        var checkbox = event.target.parentElement.childNodes[0];
        var button = event.target.parentElement.childNodes[1];

        checkbox.setAttribute('style', 'visibility:hidden');
        button.setAttribute('style', 'visibility:hidden');

        para.innerHTML = "<input type='text' value='" + todo + "' style='width:100%;'>";

        para.removeEventListener('dblclick', editTodo, false);

        textInput = para.childNodes[0].addEventListener('keyup', function (event) {
            if (event.keyCode === 13) {
                addEditedTodo(event, divID);
                para.innerHTML = event.target.value;
                checkbox.removeAttribute('style');
                button.removeAttribute('style');
                update();
            }
        }, false);
    };

    /*
        Function which is triggered when 'All' link is clicked
        Input : none
        Output : Displays all todos
    */
    var displayAllTodos = function () {

        allLink.setAttribute('class', 'option-selected');
        activeLink.setAttribute('class', '');
        completedLink.setAttribute('class', '');

        populateState = "all";
        update();
    };

    /*
        Function which is triggered when 'Active' link is clicked
        Input : none
        Output : Displays active todos list
    */
    var displayActiveTodos = function () {
        allLink.setAttribute('class', '');
        activeLink.setAttribute('class', 'option-selected');
        completedLink.setAttribute('class', '');

        populateState = "active";
        update();
    };

    /*
        Function which is triggered when 'Completed' link is clicked
        Input : none
        Output : Displays completed todos list
    */
    var displayCompletedTodos = function () {

        allLink.setAttribute('class', '');
        activeLink.setAttribute('class', '');
        completedLink.setAttribute('class', 'option-selected');

        populateState = "completed";
        update();
    };

    /*
        Function which displays help text
        Input : Event object of mouseover/mouseout on MARK/UNMARK CHECKBOX or CLEAR ALL BUTTON
        Output : Appropriate help message is displayed
    */
    var displayHelpTextContent = function (event) {
        var targetElement = event.target;
        var eventType = event.type;
        switch (eventType) {
            case "mouseover":
                if (targetElement.id == "selectall") {
                    btnPara.innerHTML = "MARK/UNMARK ALL";
                } else if (targetElement.id == "deleteall") {
                    btnPara.innerHTML = "CLEAR ALL";
                }
                break;
            case "mouseout": btnPara.innerHTML = "";
                break;
        }
    };

    /*
        Function which adds EventListeners to dynamically added DOM Elements(Div and Paragraph)
        Input : none
        Output : EventListeners are added
    */
    var addCustomEventListener = function () {
        for (var i = 0; i < todoDiv.length; i++) {
            todoDiv[i].addEventListener('click', clickOptionDecider, false);
            todoDiv[i].getElementsByTagName('p')[0].addEventListener('dblclick', editTodo, false);
        }
    };

    /*
        Function which updates count of todos left
        Input : none
        Output : Displays the number of todos left to complete
    */
    var updateItemsTodo = function () {
        var itemsTodoCount = 0;

        if (todoList != null) {
            for (var i = 0; i < todoList.length; i++) {
                if (todoList[i].completed === false) {
                    itemsTodoCount++;
                }
            }
        }
        itemsTodo.textContent = itemsTodoCount + " Todos left";
    };

    /*
        Function which is used to update the todo UI
        Input : none
        Output : Todo UI is updated and EventListeners are added to dynamically added DOM Elements
    */
    var update = function () {
        populateTodos(populateState);
        updateItemsTodo();
        addCustomEventListener();
    };

    /* Function call to update UI */
    update();

    /* EventListeners */
    todoInput.addEventListener('keyup', addTodo, false);
    allLink.addEventListener('click', displayAllTodos, false);
    activeLink.addEventListener('click', displayActiveTodos, false);
    completedLink.addEventListener('click', displayCompletedTodos, false);
    clearCompleted.addEventListener('click', deleteCompletedTodos, false);
    selectAllBtn.addEventListener('mouseover', displayHelpTextContent, false);
    deleteAllBtn.addEventListener('mouseover', displayHelpTextContent, false);
    selectAllBtn.addEventListener('mouseout', displayHelpTextContent, false);
    deleteAllBtn.addEventListener('mouseout', displayHelpTextContent, false);
    selectAllBtn.addEventListener('click', completedAllTodos, false);
    deleteAllBtn.addEventListener('click', deleteAllTodos, false);
}

 /* Script is loaded after page load */
window.addEventListener('load', main);