const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');

const date = new Date();

const listTasks = () => {
	const tasks = loadTasks();
	const crtDate = moment().format('ddd, MMM Do YYYY');
	const tomorrowDate = moment().add(1, 'days').format('ddd, MMM Do YYYY');

	if (tasks.length == 0) {
		console.log(chalk.hex('e67e22')('Your list is empty.', chalk.hex('fff')(`Stuck? Try 'doo --help'`)));
		return;
	}

	tasks.map((board) => {
		let completedTasks = board.tasks.filter((task) => task.completed == true);
		const boardName = chalk.hex('0077B5').bold(`@${board.boardName}`);
		const tasksInfo = chalk.hex('0077B5')(`[${completedTasks.length}/${board.tasks.length}]`);

		console.log(`\v${boardName} ${tasksInfo}`);

		board.tasks.map((task) => {
			const taskId = chalk.hex('fff').bold(`${task.id}`);
			const taskName = chalk.hex('0077B5').bold(`${task.taskName}`);
			const taskCompleted = task.completed ? chalk.hex('25D366')(`[x]`) : chalk.hex('FFFC00')(`[ ]`);
			let taskDueDate;
			if (task.dueDate == crtDate) {
				taskDueDate = chalk.hex('ff5700')(`today`);
			} else if (task.dueDate == tomorrowDate) {
				taskDueDate = chalk.hex('fff')(`tomorrow`);
			} else {
				taskDueDate = chalk.hex('fff')(`${task.dueDate.slice(0, -5)}`);
			}
			const priorityStatus = chalk.hex('fff')(`${task.priorityStatus}`);
			const time = `${task.totalHours}:${task.totalMinutes}`;

			console.log(`${taskId}\t${taskCompleted}\t${taskName}\t${taskDueDate} \t${time}`);
		});
	});
};

const addTask = (taskName, boardName, dueDate) => {
	const tasks = loadTasks();

	if (dueDate == undefined) {
		dueDate = moment().add(0, 'days').format('ddd, MMM Do YYYY');
	}

	let boardId = tasks.length + 1;
	let taskId = 1;
	let taskExist = false;
	tasks.map((board) => {
		const duplicateAlert = chalk.hex('ff5700')(
			`Not added. Found duplicate task in board ${chalk.bold.hex('0077B5')(`@${board.boardName}`)}.`
		);

		taskId += board.tasks.length;
		board.tasks.map((task) => {
			if (task.taskName === taskName) {
				console.log(duplicateAlert);
				taskExist = true;
			}
		});
	});

	if (taskExist) {
		return;
	}

	let newTask = {
		id: taskId,
		taskName: taskName,
		completed: false,
		dueDate: dueDate,

		startTime: 0,
		totalHours: 0,
		totalMinutes: 0,

		isArchived: false,
		priorityStatus: 0
	};

	let newBoard = {
		boardName: boardName,
		boardId: boardId,
		tasks: []
	};

	//if boardName == undefined
	//	if defaultBoard exist
	//		if task !exist
	//			add task
	//	else createDefaultBoard
	//		add task
	if (boardName == undefined) {
		const defaultBoard = tasks.find((board) => board.boardName === 'tasks');

		if (defaultBoard) {
			const duplicatedTask = defaultBoard.tasks.find((task) => task.taskName === taskName);
			if (!duplicatedTask) {
				tasks.map((board) => {
					const addedAlert = chalk.hex('25D366')(
						`${chalk.hex('fff')(`#${newTask.id}`)} ${chalk.bold.hex('0077B5')(
							`${newTask.taskName}`
						)} added successfully in ${chalk.bold.hex('0077B5')(`@${board.boardName}`)}.`
					);
					if (board.boardName == 'tasks') {
						board.tasks.push(newTask);
						console.log(addedAlert);
					}
				});
				saveTasks(tasks);
			}
		} else {
			newBoard.boardName = 'tasks';
			newBoard.tasks.push(newTask);
			saveTasks([ ...tasks, newBoard ]);
		}
	}

	// if boardName !== undefined
	// 	if boardName exists
	//		if task !exist
	//			add task
	//	else createBoard
	//		add task

	if (boardName !== undefined) {
		const foundBoard = tasks.find((board) => board.boardName === boardName);
		if (foundBoard) {
			const duplicatedTask = foundBoard.tasks.find((task) => task.taskName === taskName);

			if (!duplicatedTask) {
				tasks.map((board) => {
					const addedAlert = chalk.hex('25D366')(
						`${chalk.hex('fff')(`#${newTask.id}`)} ${chalk.bold.hex('0077B5')(
							`${newTask.taskName}`
						)} added successfully in ${chalk.bold.hex('0077B5')(`@${board.boardName}`)}.`
					);
					if (board.boardName == boardName) {
						board.tasks.push(newTask);
						console.log(addedAlert);
					}
				});
			}
		} else {
			newBoard.tasks.push(newTask);
			tasks.push(newBoard);

			console.log(
				chalk.hex('25D366')(
					`${chalk.hex('fff')(`#${newTask.id}`)} ${chalk.bold.hex('0077B5')(
						`${newTask.taskName}`
					)} added successfully in newly created board ${chalk.bold.hex('0077B5')(`@${boardName}`)}.`
				)
			);
		}
		saveTasks(tasks);
	}
	if (dueDate !== undefined) {
		setDueDate(taskId, dueDate);
	}
};

const removeTask = (id) => {
	const tasks = loadTasks();
	let newId = 1;
	let flag = false;

	tasks.map((board) => {
		board.tasks.map((task) => {
			if (task.id == id) {
				const keepTasks = board.tasks.filter((task) => task.id != id);
				board.tasks = keepTasks;
				flag = true;

				let taskOutput = chalk.hex('0077B5').bold(`${task.taskName}`);
				let boardOutput = chalk.hex('0077B5').bold(`@${board.boardName}`);
				console.log(chalk.hex('fff')(`Task ${taskOutput} removed from board ${boardOutput}!`));
			}
		});
	});

	// update id after removing a task
	if (flag) {
		tasks.map((board) => {
			board.tasks.map((task) => {
				task.id = newId++;
			});
		});
	} else {
		console.log(chalk.hex('ed553b')(`Task ${chalk.hex('fff').bold(`#${id}`)} not found!`));
	}

	saveTasks(tasks);
};

const setCompleted = (id) => {
	const tasks = loadTasks();
	tasks.map((board) => {
		board.tasks.map((task) => {
			if (task.id == id) {
				task.completed == false
					? console.log(chalk.hex('25D366')(`Todo ${chalk.hex('fff').bold(`#${id}`)} completed`))
					: console.log(chalk.hex('ff5700')(`Todo ${chalk.hex('fff').bold(`#${id}`)} uncompleted`));
				task.completed = !task.completed;
			}
		});
	});
	saveTasks(tasks);
};

const setDueDate = (id, due) => {
	const tasks = loadTasks();
	if (due == undefined) {
		console.log(chalk.hex('ff5700')(`Enter ${chalk.hex('fff').bold(`tom, tod or number`)} to set due date.`));
		return;
	} else if (due == 'tod') {
		due = 0;
	} else if (due == 'tom') {
		due = 1;
	}

	const dueDate = moment().add(due, 'days').format('ddd, MMM Do YYYY');

	tasks.map((board) => {
		board.tasks.map((task) => {
			if (task.id == id) {
				task.dueDate = dueDate;
				console.log(
					chalk.hex('fff')(
						`#${chalk.bold(id)} ${chalk.hex('0077B5').bold(`${task.taskName}`)} is due ${chalk.bold(
							`${dueDate}`
						)}`
					)
				);
			}
		});
	});
	saveTasks(tasks);
};

const startTimer = (id) => {
	const tasks = loadTasks();
	const startTime = date.getTime();

	tasks.map((board) => {
		board.tasks.map((task) => {
			if (task.id == id) {
				task.startTime = startTime;
				console.log(
					chalk.hex('fff')(
						`Timer started for task ${chalk
							.hex('0077B5')
							.bold(`#${id} ${task.taskName}`)} at time ${moment().hour()}:${moment().minutes()}.`
					)
				);
				console.log(
					chalk.hex('fff')(
						`Total time tracked already for this task: ${chalk
							.hex('fff')
							.bold(`${task.totalHours}:${task.totalMinutes}`)}`
					)
				);
			}
		});
	});
	saveTasks(tasks);
};

const stopTimer = (id) => {
	const tasks = loadTasks();
	const stopTime = date.getTime();

	let totalHours = 0;
	let totalMinutes = 0;
	let totalTime = '';

	tasks.map((board) => {
		board.tasks.map((task) => {
			if (task.startTime == 0) {
				return;
			}

			if (task.id == id) {
				const ms = Math.floor((stopTime - task.startTime) / 60000);
				totalHours = Math.floor(ms / 60);
				totalMinutes = ms % 60;
				totalTime = `${totalHours}:${totalMinutes}`;

				task.totalHours += totalHours;
				task.totalMinutes += totalMinutes;
				task.startTime = 0;

				console.log(
					chalk.hex('fff')(
						`Timer stopped for task ${chalk
							.hex('0077B5')
							.bold(`#${id} ${task.taskName}`)} at time ${moment().hour()}:${moment().minutes()}.`
					)
				);
				console.log(
					chalk.hex('fff')(
						`Total time tracked ${chalk.bold(
							`${task.totalHours}:${task.totalMinutes}`
						)} of which ${chalk.bold(`${totalTime}`)} in this session.`
					)
				);
			}
		});
	});

	saveTasks(tasks);
};

// 0077B5 blue
// 25D366 green
// FFFC00 yellow
// ff5700 orange

const getStats = (id) => {

};

const addBoard = (boardName) => {
	let tasks = loadTasks();
	const newBoard = {
		boardName,
		boardId: tasks.length + 1,
		tasks: []
	};
	let newTasks = [ ...tasks, newBoard ];

	if (tasks.length == 0) {
		saveTasks(newBoard);
	}
	let flag = false;
	tasks.map((board) => {
		if (board.boardName == boardName) {
			console.log(
				chalk.hex('ff5700')(`Board with name ${chalk.hex('0077B5').bold(`@${boardName}`)} already exist`)
			);
			flag = true;
		}
	});

	if (flag == false) {
		console.log(chalk.hex('fff')(`Created board ${chalk.hex('0077B5').bold(`@${boardName}`)}`));
		saveTasks(newTasks);
	}
};

const removeBoard = (boardName) => {
	let tasks = loadTasks();
	let filtered;

	let moveTasks = [];
	let flag = false;

	if (boardName == 'tasks') {
		console.log(chalk.hex('ff5700')(`You are not allowed to delete the default board.`));
		return;
	}
	const checkDefaultBoard = (board) => board.boardName == 'tasks';
	const defaultExist = tasks.some(checkDefaultBoard);

	if (defaultExist == false) {
		console.log(chalk.hex('fff')(`Default board created.`));

		let newBoard = {
			boardName: 'tasks',
			boardId: tasks.length + 1,
			tasks: []
		};
		tasks = [ ...tasks, newBoard ];
	}

	tasks.map((board) => {
		// check if board have tasks or not
		if (board.boardName == boardName) {
			if (board.tasks.length !== 0) {
				console.log(
					chalk.hex('fff')(`Started to copy tasks in default board ${chalk.hex('0077B5').bold(`@tasks`)}`)
				);
				moveTasks = [ ...board.tasks ];
				filtered = tasks.filter((board) => {
					return board.boardName != boardName;
				});
				console.log(chalk.hex('fff')(`Board ${chalk.hex('0077B5').bold(`@${boardName}`)} has been removed`));

				flag = true;
			} else {
				console.log(chalk.hex('fff')(`Removed board ${chalk.hex('0077B5').bold(`@${boardName}`)}`));
				filtered = tasks.filter((board) => {
					return board.boardName != boardName;
				});
			}
		}
	});
	tasks.map((board) => {
		if (flag) {
			if (board.boardName == 'tasks') {
				board.tasks = [ ...board.tasks, ...moveTasks ];
				console.log(
					chalk.hex('fff')(
						`Tasks from ${chalk.hex('0077b5').bold(`@${boardName}`)} are now in ${chalk
							.hex('0077b5')
							.bold(`@tasks`)}`
					)
				);
			}
		}
	});

	if (filtered == undefined) {
		console.log(chalk.hex('ff5700')(`Board ${chalk.hex('0077b5').bold(`@${boardName}`)} does not exist`));
		return null;
	}

	// add new id's
	let boardId = 0;
	tasks.map((board) => {
		board.boardId = boardId++;
	});
	saveTasks(filtered);
};


const moveTask = (taskId, toBoard) => {
	const tasks = loadTasks();
	let taskToMove;
	let filtered;
	let fromBoard;

	if (toBoard == undefined) {
		console.log(chalk.hex('ff5700')(`Add board name to move task ${chalk.hex('fff').bold(`#${taskId}`)}`));
		return;
	}

	tasks.map((board) => {
		board.tasks.map((task) => {
			if (task.id == taskId) {
				// console.log(					chalk.hex('fff')(`Found task ${chalk.bold(`#${taskId}`)} in board ${chalk.hex('0077B5').bold(`@${board.boardName}`)}`));
				filtered = board.tasks.filter((task) => task.id != taskId);
				fromBoard = board.boardName;
				taskToMove = board.tasks.filter((task) => task.id == taskId);
			}
		});
	});

	if (fromBoard == undefined) {
		console.log(chalk.hex('ff5700').bold(`#${taskId} not found`));
		return;
	}

	tasks.map((board) => {
		if (board.boardName == toBoard) {
			board.tasks.push(taskToMove[0]);
			// console.log(`Added task in board ${board.boardName}`);
		}

		if (board.boardName == fromBoard) {
			board.tasks = filtered;
			// console.log(`Removed task from board ${board.boardName}`);
		}
	});

	console.log(
		chalk.hex('fff')(`Moved ${chalk.bold(`#${taskId}`)} from ${chalk.hex('0077B5').bold(`@${fromBoard}`)} to ${chalk.hex('0077B5').bold(`@${toBoard}`)}`)
	);

	saveTasks(tasks);
};

// write to file
const saveTasks = (tasks) => {
	const dataJSON = JSON.stringify(tasks);
	fs.writeFileSync('.doo.json', dataJSON);
};

// read from file
const loadTasks = () => {
	try {
		const dataBuffer = fs.readFileSync('.doo.json');
		const dataJSON = dataBuffer.toString();
		return JSON.parse(dataJSON);
	} catch (e) {
		console.log(chalk('No file exists. Creating file..'));
		saveTasks([]);
		console.log(chalk.hex('2ecc71')('Your file has been created!'));
		return [];
	}
};

module.exports = {
	listTasks,
	addTask,
	removeTask,
	setCompleted,
	setDueDate,
	startTimer,
	stopTimer,
	addBoard,
	removeBoard,
	moveTask
};
