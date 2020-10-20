const chalk = require('chalk');
const fs = require('fs');

// add lists
// app l [listName]
// 20639b blue
// 3caea3 green
// f6d55c yellow
// ed553b red

const date = new Date();

const listTodos = () => {
	const todos = loadTodos();
	if (todos.length == 0) {
		todos;
		console.log(chalk.hex('e67e22')('Your list is empty.', chalk.hex('fff')(`Stuck? Try 'doo --help'`)));
		return;
	}

	console.log(chalk.bold.underline('#todos\n'));

	todos.forEach((todo) => {
		const currentDay = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
		const tomorrow = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() + 1}`;
		const weekDays = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ];
		const months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
		let dayOfWeek = weekDays[todo.dueDate.slice(-1)];
		let dayOfMonth = todo.dueDate.slice(-4, -2);
		let month = months[parseInt(todo.dueDate.slice(-7, -5)) - 2];
		const dueDateDay = `${dayOfWeek}, ${dayOfMonth} ${month}`;

		todo.dueDate = todo.dueDate.slice(0, 10);
		if (todo.dueDate == currentDay) {
			todo.dueDate = 'today';
		} else if (todo.dueDate == tomorrow) {
			todo.dueDate = 'tomorrow';
		} else {
			todo.dueDate = dueDateDay;
		}

		const itemId = chalk.hex('ffffff').bold(`${todo.id}`);
		const itemTodo = chalk.hex('398EEA').bold(`${todo.todo}`);
		const dueDate = chalk.hex('23C05E')(`${todo.dueDate}`);

		todo.completed == true
			? console.log(`${itemId}      ${chalk.hex('f39c12')(`[x]`)}       ${dueDate}      ${itemTodo}       ${todo.hours}:${todo.minutes}`)
			: console.log(`${itemId}      ${chalk.hex('ed553b')(`[ ]`)}       ${dueDate}      ${itemTodo}       ${todo.totalHours}:${todo.totalMinutes}`);
	});
};

const addTodo = (title, due) => {
	const todos = loadTodos();
	const duplicateTodo = todos.find((todo) => todo.todo === title);

	const id = todos.length + 1;
	// dueDate: today (by default)
	if (!duplicateTodo) {
		todos.push({
			id,
			todo: title,
			completed: false,
			dueDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getDay()}`,
			startTime: 0,
			totalHours: 0,
			totalMinutes: 0
		});

		saveTodos(todos);
		if (due !== undefined) {
			dueDate(id, due);
		}

		console.log(chalk.hex('23C05E')('Todo added!'));
	} else {
		console.log(chalk.hex('ed553b')('Todo already exists!'));
	}
};

const removeTodo = (id) => {
	const todos = loadTodos();
	const keepTodos = todos.filter((todo) => todo.id != id);

	if (todos.length > keepTodos.length) {
		// set new id for remaining todos
		let newId = 1;
		keepTodos.map((obj) => {
			obj.id = newId;
			newId++;
		});

		console.log(chalk.hex('23C05E')(`Todo deleted!`));
	} else {
		console.log(chalk.hex('ed553b')(`Todo ${chalk.bold(id)} not found!`));
	}

	saveTodos(keepTodos);
};

const markCompleted = (id) => {
	const todos = loadTodos();
	todos.map((todo) => {
		if (todo.id == id) {
			todo.completed == false
				? console.log(chalk.hex('fff')(`Todo #${chalk.bold(id)} completed!`))
				: console.log(chalk.hex('fff')(`Todo #${chalk.bold(id)} uncompleted!`));
			todo.completed = !todo.completed;
			saveTodos(todos);
		}
	});
};

const dueDate = (id, due) => {
	const todos = loadTodos();
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();

	todos.map((todo) => {
		if (todo.id == id) {
			let newDueDate = '';

			if (due == 'tom') {
				newDueDate = `${year}-${month}-${day + 1}`;
				console.log(chalk.hex('fff')(`Todo #${chalk.bold(id)} is due ${chalk.bold('tomorrow')}!`));
			} else if (due == 'tod') {
				newDueDate = `${year}-${month}-${day}`;
				console.log(chalk.hex('fff')(`Todo #${chalk.bold(id)} is due ${chalk.bold('today')}!`));
			} else {
				const newDate = new Date();
				newDate.setDate(newDate.getDate() + parseInt(due));
				let m = (newDate.getMonth()+1) < 9 ? `0${newDate.getMonth()+1}` : newDate.getMonth() + 1;
				let d = newDate.getDate() < 9 ? `0${newDate.getDate()}` : newDate.getDate();
				newDueDate = `${newDate.getFullYear()}-${m}-${d}-${newDate.getDay()}`;
			}

			todo.dueDate = newDueDate;
			saveTodos(todos);
		}
	});
};

const startTimer = (id) => {
	const todos = loadTodos();
	const startTime = date.getTime();

	todos.map((todo) => {
		if (todo.id == id) {
			todo.startTime = startTime;
			console.log(
				chalk.hex('fff')(`Timer started for task #${chalk.bold(id)} ${chalk.bold(
					todo.todo
				)} \nIt's time ${date.getHours()}:${date.getMinutes()}\nTotal time tracked already: ${todo.totalHours}:${todo.totalMinutes}
				`)
			);
		}
	});

	saveTodos(todos);
};

const stopTimer = (id) => {
	const todos = loadTodos();
	const stopTime = date.getTime();

	let totalHours = 0;
	let totalMinutes = 0;
	let totalTime = '';

	
	todos.map((todo) => {
		if(todo.startTime == 0) {
			return ;
		}

		if (todo.id == id) {
			const ms = Math.floor((stopTime - todo.startTime) / 60000);

			totalHours = Math.floor(ms / 60);
			totalMinutes = ms % 60;
			totalTime = `${totalHours}:${totalMinutes}`;

			todo.totalHours += totalHours;
			todo.totalMinutes += totalMinutes;
			todo.startTime = 0;

			console.log(
				chalk.hex('fff')
				(`Timer stopped for task #${chalk.bold(id)} ${chalk.bold(
					todo.todo
				)} \nIt's time ${date.getHours()}:${date.getMinutes()}\nTotal time tracked this session: ${totalTime}\nTotal time tracked: ${todo.totalHours}:${todo.totalMinutes}
				`)
			);
		}
		// console.log(todo);
	});

	saveTodos(todos);

};

// write to file
const saveTodos = (todos) => {
	const dataJSON = JSON.stringify(todos);
	fs.writeFileSync('.todos.json', dataJSON);
};

// read from file
const loadTodos = () => {
	try {
		const dataBuffer = fs.readFileSync('.todos.json');
		const dataJSON = dataBuffer.toString();
		return JSON.parse(dataJSON);
	} catch (e) {
		console.log(chalk('No file exists. Creating file..'));
		saveTodos([]);
		console.log(chalk.hex('2ecc71')('Your file has been created!'));
		return [];
	}
};

module.exports = { addTodo, removeTodo, listTodos, markCompleted, dueDate, startTimer, stopTimer };
