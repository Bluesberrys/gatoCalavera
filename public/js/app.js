document.addEventListener("DOMContentLoaded", function () {
  const burgerMenu = document.querySelector(".burger-menu");
  const menu = document.querySelector(".menu");

  burgerMenu.addEventListener("click", function () {
    menu.classList.toggle("active");
  });
});
