document.querySelector("form").addEventListener("submit", function(event) {
  var email = document.getElementById("email").value;
  if (!email.includes("@")) {
    event.preventDefault();
    alert("Please enter a valid email address.");
  }
});