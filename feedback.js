// Elements
const Name = document.getElementById('name');
const Email = document.getElementById('emailID');
const feedback = document.getElementById('feedback');
const stars = document.querySelectorAll(".star");
const form = document.getElementById('feedbackform');
const submitBtn = document.getElementById('btn');
const successMsg = document.getElementById('successMsg');

let selectedRating = 0;

// Show error messages
function showError(id, message) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = message;
}

// // Clear all errors
function clearErrors() {
    showError('nameError', '');
    showError('emailError', '');
    showError('messageError', '');
    showError('ratingError', '');
}

//clear errors
Name.addEventListener('input', ()=>showError('nameError', ''));
Email.addEventListener('input', ()=>showError('emailError', ''));
feedback.addEventListener('input', ()=> showError('messageError', ''));


// Validate form
function validate() {
    clearErrors();
    let isValid = true;

    if (!Name.value.trim()) {
        showError('nameError', 'Please enter your name');
        isValid = false;
    }

    if (!/^\S+@\S+\.\S+$/.test(Email.value)) {
        showError('emailError', 'Please enter a valid email');
        isValid = false;
    }

    if (selectedRating === 0) {
        showError('ratingError', 'Please select a rating');
        isValid = false;
    }

    if (!feedback.value.trim()) {
        showError('messageError', 'Please enter your feedback');
        isValid = false;
    }

    return isValid;
}

// Handle star rating click
stars.forEach(star => {
    star.addEventListener("click", () => {
        selectedRating = parseInt(star.dataset.value);

        stars.forEach(s => {
            s.classList.toggle("active", s.dataset.value <= selectedRating);
        });

        // Clear rating error as soon as user clicks a star
        showError('ratingError', '');
    });
});

// Display success message and hide form
function successDisplay() {
    form.style.display = 'none';
    successMsg.style.display = 'block';
    successMsg.querySelector("p").textContent =
        `Thanks ${Name.value}! Your feedback has been saved.`;
}

// Handle form submission
function handleSubmit(event) {
    event.preventDefault();

    if (!validate()) return;

    // Example: Send data to server
    const data = {
        name: Name.value,
        email: Email.value,
        rating: selectedRating,
        feedback: feedback.value
    };

    fetch("http://localhost:3001/submit-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(() => {
        successDisplay();
        form.reset();
        selectedRating = 0;
        stars.forEach(s => s.classList.remove("active"));
    })
    .catch(err => {
        alert("Submission failed");
        console.error(err);
    });
}

// Attach submit event
form.addEventListener('submit', handleSubmit);
