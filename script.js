document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();
  this.reset();
  document.getElementById("thankYouMsg").style.display = "block";
});
