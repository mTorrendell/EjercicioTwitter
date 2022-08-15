addEventListener("DOMContentLoaded", function () {
  const myModal = new bootstrap.Modal("#myModal");
  myModal.show();
});

function getInputValue() {
  // Selecting the input element and get its value
  const getInputValue = document.getElementById("singInInput").value;
  const inputValue = (document.getElementById("formUsernameModal").value = getInputValue);
}
