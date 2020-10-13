const chalk = require('chalk');
const fs = require('fs');

// refractor all code


// create option for lists
// -> app add +listName todo


// error when loading empty list (create file)
const listTodos = () => {
	const todos = loadTodos();
	const date = new Date();
	console.log(chalk.hex('f6d55c').bold('Your todos'));

	todos.forEach((todo) => {
		const currentDay = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
		const tomorrow = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() + 1}`;
		const weekDays = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ];
		const months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
		let dayOfWeek = weekDays[todo.dueDate.slice(-1)];
		let dayOfMonth = todo.dueDate.slice(-4, -2);
		let month = months[parseInt(todo.dueDate.slice(-7, -5)) - 2];

		const dueDateDay = `${dayOfWeek} ${dayOfMonth} ${month}`;
		
		todo.dueDate = todo.dueDate.slice(0, 10);
		if (todo.dueDate == currentDay) {
			todo.dueDate = 'today';
		} else if (todo.dueDate == tomorrow) {
			todo.dueDate = 'tomorrow';
		} else {
			todo.dueDate = dueDateDay;
		}
		const itemId = chalk.hex('3caea3').bold(`${todo.id}`);
		const itemTodo = chalk.hex('3caea3').bold(`${todo.todo}`);

		const dueDate = chalk.hex('20639b')(`${todo.dueDate}`);


		const template =
			todo.completed == true
				? console.log(`${itemId}      ${chalk.hex('ed553b')(`[x]`)}       ${dueDate}      ${itemTodo}`)
				: console.log(`${itemId}      ${chalk.hex('ed553b')(`[ ]`)}       ${dueDate}      ${itemTodo}`);


	});
};

// 20639b blue
// 3caea3 green
// f6d55c yellow
// ed553b red

const addTodo = (title, body) => {
	const date = new Date();
	const todos = loadTodos();
	const duplicateTodo = todos.find((todo) => todo.t === title);

	// dueDate: today (by default)
	if (!duplicateTodo) {
		todos.push({
			id: todos.length + 1,
			todo: title,
			completed: false,
			dueDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getDay()}`
		});

		saveTodos(todos);
		console.log(chalk.hex('3caea3').bold('New todo added!'));
	} else {
		console.log(chalk.hex('ed553b').bold('todo already exists!'));
	}
};

const removeTodo = (id) => {
	// remove by id
	const todos = loadTodos();
	const keepTodos = todos.filter((todo) => todo.id != id);

	if (todos.length > keepTodos.length) {
		// set new id for remaining todos
		let newId = 1;
		keepTodos.map((obj) => {
			obj.id = newId;
			newId++;
		});

		console.log(chalk.hex('3caea3').bold(`Your todo was deleted!`));
	} else {
		console.log(chalk.hex('ed553b').bold('Todo not found!'));
	}

	saveTodos(keepTodos);
};

const markCompleted = (id) => {
	const todos = loadTodos();
	const completedTodo = todos.map((todo) => {
		if (todo.id == id) {
			todo.completed = !todo.completed;
			saveTodos(todos);
		}
	});
};

const dueDate = (id, due) => {
	const todos = loadTodos();
	let date = new Date();

	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();
	const hours = date.getHours();
	const mins = date.getMinutes();

	todos.map((todo) => {
		if (todo.id == id) {
			let newDueDate = '';

			if (due == 'tom') {
				newDueDate = `${year}-${month}-${day + 1}`;
			} else {
				const newDue = new Date();
				newDue.setDate(newDue.getDate() + parseInt(due));
				newDueDate = `${newDue.getFullYear()}-${newDue.getMonth() + 1}-${newDue.getDate()}-${newDue.getDay()}`;
			}

			todo.dueDate = newDueDate;
			saveTodos(todos);
		}
	});
};

// write to file
const saveTodos = (todos) => {
	const dataJSON = JSON.stringify(todos);
	fs.writeFileSync('todos.json', dataJSON);
};

// read from file
const loadTodos = () => {
	try {
		const dataBuffer = fs.readFileSync('todos.json');
		const dataJSON = dataBuffer.toString();
		return JSON.parse(dataJSON);
	} catch (e) {
		console.log('No file exists. Creating file..');
		return [];
	}
};

module.exports = { addTodo, removeTodo, listTodos, markCompleted, dueDate };
