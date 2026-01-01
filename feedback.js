
const Name = document.getElementById('name')
const Email = document.getElementById('emailID')
const stars = document.querySelectorAll(".star");
const feedback = document.getElementById('feedback')
const submitBtn = document.getElementById("btn")
const form = document.getElementById('feedbackform')

function showError(id, message) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = message;
}


validate = () => {
    let isValid = true;

    if (!Name.value.trim()) {
        showError('nameError', 'Please enter your name');
        isValid = false;
    }

    if (!Email.value.includes('@')) {
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


let selectedRating = 0;


stars.forEach(star => {
    star.addEventListener("click", () => {
        selectedRating = star.dataset.value;

        stars.forEach(s => {
            s.classList.toggle(
                "active",
                s.dataset.value <= selectedRating
            );
        });
    });
});



successDisplay = () => {
    // Show success message
    const successMsg = document.getElementById('successMsg');
    successMsg.style.display = 'block';
    form.style.display = 'none';
    successMsg.textContent = `✓ Thank you ${Name.value}! Your  rating has been saved.`;

    // // Hide message after 3 seconds
    // setTimeout(() => {
    //     successMsg.style.display = 'block';
        // form.style.display = 'flex';
    // }, 3000);

}


function handleSubmit(event) {
    event.preventDefault()

    if (!validate()) return
    console.log(Name.value);
    console.log(Email.value);
    console.log(selectedRating);
    console.log(feedback.value);

    const data = {
        name: Name.value,
        email: Email.value,
        rating: selectedRating,
        feedback: feedback.value
    };


    fetch("http://localhost:3001/submit-feedback", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: Name.value,
            email: Email.value,
            rating: selectedRating,
            feedback: feedback.value
        })
    })
        .then(res => res.json())
        .then(() => {
            successDisplay();
            form.reset();
        })
        .catch(err => {
            alert("Submission failed");
            console.error(err);
        });

}
form.addEventListener('submit', handleSubmit)
