const API_URL = 'http://localhost:3000/todos';

document.addEventListener('DOMContentLoaded', fetchTasks);

const tasksList = document.querySelector('#tasks-list');

function fetchTasks() {
	fetch(API_URL)
		.then((res) => {
			if (!res.ok) {
				throw new Error(res);
			}

			return res.json();
		})
		.then((todos) => {
			renderTodos(todos);
			setRemainingTasksCount(todos);
		});
}

function renderTodos(todos) {
	tasksList.innerHTML = '';
	todos.forEach((todo) => {
		const todoElement = document.createElement('div');

		todoElement.className = 'task';

		const checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.className = 'checkbox';
		checkbox.checked = todo.completed;

		checkbox.addEventListener('change', () =>
			toggleTodoCompletionStatus(todo.id, todo.completed)
		);

		const todoText = document.createElement('span');
		todoText.textContent = todo.title;

		const deleteButton = document.createElement('button');
		deleteButton.className = 'delete-button';
		deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

		deleteButton.addEventListener('click', () => deleteTodo(todo.id));

		if (todo.completed) {
			todoText.style.textDecoration = 'line-through';
			todoElement.style.opacity = '0.3';
		}

		todoElement.appendChild(checkbox);
		todoElement.appendChild(todoText);
		todoElement.appendChild(deleteButton);

		tasksList.appendChild(todoElement);
	});
}

const remainingTodosCount = document.querySelector('#tasks-count');

function setRemainingTasksCount(todos) {
	const remainingTodos = todos.filter((todo) => !todo.completed).length;

	remainingTodosCount.textContent = remainingTodos;
}

// POST requests
const addTodoForm = document.querySelector('#add-task-form');
const todoInput = document.querySelector('#task-input');

addTodoForm.addEventListener('submit', captureTextInput);

function captureTextInput(e) {
	e.preventDefault();

	const text = todoInput.value.trim();

	if (text) {
		addNewTodo(text);
		e.target.reset();
	}
}

// async await fetch syntax
async function addNewTodo(textFromInput) {
	try {
		const response = await fetch(API_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				title: textFromInput,
				completed: false,
			}),
		});

		if (!response.ok) {
			alert(response.status);
		}

		fetchTasks();
	} catch (error) {
		alert(error);
	}
}

/*
function addNewTodo(textFromInput) {
	fetch(API_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			title: textFromInput,
			completed: false,
		}),
	})
		.then((res) => {
			if (!response.ok) {
				alert(response.status);
			}
		})
		.then(fetchTasks);
}
*/

// PATCH requests

async function toggleTodoCompletionStatus(id, completed) {
	try {
		const response = await fetch(`${API_URL}/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				completed: !completed,
			}),
		});

		if (!response.ok) {
			throw new Error(response);
		}

		fetchTasks();
	} catch (error) {
		alert(error);
	}
}

// DELETE requests
async function deleteTodo(id) {
	try {
		const response = await fetch(`${API_URL}/${id}`, {
			method: 'DELETE',
		});

		if (!response.ok) {
			throw new Error(response);
		}

		fetchTasks();
	} catch (error) {
		alert(error);
	}
}