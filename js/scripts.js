/*!
 * Start Bootstrap - Business Casual v7.0.9 (https://startbootstrap.com/theme/business-casual)
 * Copyright 2013-2023 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-business-casual/blob/master/LICENSE)
 */
window.addEventListener("DOMContentLoaded", () => {
  const hours = document.body.querySelectorAll(".list-hours li");
  if (hours.length) {
    const today = hours[new Date().getDay()];
    if (today) today.classList.add("today");
  }
});
