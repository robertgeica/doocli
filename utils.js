const chalk = require("chalk");
const formatDueDate = (inputDate) => {
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const dueDate = new Date(inputDate);
  const dueMonth = dueDate.getMonth() + 1;
  const dueDay = dueDate.getDate();

  const currentDate = new Date();
  const currentDay = currentDate.getDate();

  let formatedDueDate = "";

  if (currentDay === dueDay) return formatedDueDate = "today";
  if (currentDay - dueDay === -1) return formatedDueDate = "yesterday";
  
  return formatedDueDate = `${weekDays[dueDate.getDay()-1]}, ${dueDay} ${months[dueMonth-1]}`;
  

};

module.exports = {
  formatDueDate,
};
