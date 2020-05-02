// Happy __day!

const dayOfWeek = (() => {
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
 
  const formattedString = `Happy ${weekdays[new Date().getDay()]}!`
  const el = document.querySelector('#day');
  if (el !== null) el.innerHTML = formattedString;
})();
