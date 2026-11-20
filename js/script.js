const bar = document.getElementById("bar");
const close = document.getElementById("close");
const nav = document.getElementById("navbar");

if (bar) {
  bar.addEventListener("click", () => {
    nav.classList.add("active");
  });
}

if (close) {
  close.addEventListener("click", () => {
    nav.classList.remove("active");
  });
}

function myFunction() {
  var element = document.body;
  element.classList.toggle("dark-mode");
}

function myFunction1() {
  var element = document.body;
  element.classList.toggle("star-fill");
}
