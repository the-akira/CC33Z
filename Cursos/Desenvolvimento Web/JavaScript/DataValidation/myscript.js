document.querySelector("form").addEventListener("submit", function(event) {
  var email = document.getElementById("email").value;
  var regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!regex.test(email)) {
    event.preventDefault();
    alert("Please enter a valid email address.");
  } else {
    alert("Valid email!");
  }
});