document.getElementById('productForm').addEventListener('submit', function(event) {
  let formIsValid = true;
  
  // Select all required fields inside our specific inventory form
  const requiredInputs = this.querySelectorAll('[required]');

  requiredInputs.forEach(input => {
    // Find the empty span error element right next to or underneath this input field
    const errorSpan = input.parentElement.querySelector('.error-msg');

    if (input.value.trim() === '') {
      // 1. Block the form from sending data to the node backend router
      formIsValid = false;
      
      // 2. Turn the border outline bright red
      input.classList.add('invalid-input');
      
      // 3. Inject the "Invalid field" message and turn it visible
      if (errorSpan) {
        errorSpan.textContent = 'Invalid field';
        errorSpan.style.display = 'block';
      }
    } else {
      // Clean up previous error flags if the user typed something valid
      input.classList.remove('invalid-input');
      if (errorSpan) {
        errorSpan.style.display = 'none';
      }
    }
  });

  // If even ONE field was blank, prevent submission entirely
  if (!formIsValid) {
    event.preventDefault();
  }
});

// Optional bonus: Clear error styling immediately if they hit the gray "CLEAR" button
document.getElementById('productForm').addEventListener('reset', function() {
  const errors = this.querySelectorAll('.error-msg');
  const inputs = this.querySelectorAll('input');
  
  errors.forEach(err => err.style.display = 'none');
  inputs.forEach(input => input.classList.remove('invalid-input'));
});