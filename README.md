### Doocli is a command-line interface task manager 


## Installation

    $ npm i -g doocli

## Available options

 - List all tasks
 - Add new task
 - Remove task
 - Check/Uncheck task
 - Set/Modify due date
 - Track time

**List all tasks**

    $ doo list
 
**Add new task**

    $ doo add <taskName>

**Add new task with due date**

    $ doo add <taskName> <dateLimit>
    // if not specified, task's due date will be current day by default
    

**Remove a task**

    $ doo remove <id>

**Mark task as completed/uncompleted**

    $ doo c <id>

**Add due date**

    $ doo dd <id> <dateLimit>
    
    / *
		<dateLimit> can be replaced with:
	  tod (today)
	  tom (tomorrow)
	  a number (sets task's due date on current day + input number)
    */
   
**Track time**

		$ doo start <id>
        
		$ doo stop <id>
