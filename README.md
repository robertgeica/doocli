## Installation

    $ npm i -g doocli

## Commands

 - List all tasks
 - Add new task
 - Remove task
 - Check/Uncheck task
 - Set/Modify due date

**List all tasks**

    $ doo list
 
**Add new task**

    $ doo add 'taskName'
    // replace 'taskName' with your current task

**Add new task with due date**

    $ doo add 'taskName' 'dateLimit'
    // if not specified, task's due date will be current day by default
    

**Remove a task**

    $ doo remove 'id'
    // replace 'id' with task id

**Mark task as completed/uncompleted**

    $ doo c 'id'

**Add due date**

    $ doo dd 'id' 'dateLimit'
    
    / *
	replace 'dateLimit' with:
	  tod (today)
	  tom (tomorrow)
	  a number (sets task's due date on current day + input number)
    */
   
