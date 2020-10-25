### Doocli is a command-line interface task manager 


## Installation

    $ npm i -g doocli

## Update

    $ npm update -g doocli
    

## Available options

 - List all boards and tasks
 - Add new task
 - Remove task
 - Check/Uncheck task
 - Set/Modify due date
 - Track time
 - Create board
 - Remove board
 - Move task to another board

**List all boards and tasks**

    $ doo list
 
**Add new task**

    $ doo add <taskName> <board> <dueDate>
    // <board> and <dueDate> are optional. if not specified, default board will be **tasks** and dueDate will be current day

**Add new task in a board**

    $ doo add <taskName> <board>
    

**Remove a task**

    $ doo r <id>

**Mark task as completed/uncompleted**

    $ doo c <id>

**Add due date**

    $ doo dd <id> <dateLimit>
    
    / *
	  <dateLimit> can be replaced with:
	  tod (today)
	  tom (tomorrow)
	  number (set task's due date on current day + input number)
    */
   
**Track time**

	$ doo start <id>
        
	$ doo stop <id>

**Add new board**

	$ doo touch <boardName>
        
**Remove a board**

	$ doo rm <boardName>

**Move task in another board**

	$ doo mv <taskId> <boardName>
