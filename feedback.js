
        // BASIC LOGIC FOR FEEDBACK SYSTEM
        
        // 1. Initialize variables
        let feedbackData = [];
        let currentRating = 0;
        
        // 2. Load saved feedback from localStorage on page load
        function loadSavedFeedback() {
            const saved = localStorage.getItem('foodieHubFeedback');
            if (saved) {
                feedbackData = JSON.parse(saved);
            }
            updateFeedbackDisplay();
        }
        
        // 3. Star rating functionality
        const stars = document.querySelectorAll('.star');
        const ratingValue = document.getElementById('ratingValue');
        const ratingInput = document.getElementById('rating');
        
        stars.forEach(star => {
            star.addEventListener('click', function() {
                currentRating = parseInt(this.getAttribute('data-value'));
                ratingInput.value = currentRating;
                ratingValue.textContent = `${currentRating}/5`;
                
                // Update star colors
                stars.forEach((s, index) => {
                    if (index < currentRating) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
                
                document.getElementById('ratingError').style.display = 'none';
            });
        });
        
        // 4. Form validation
        function validateForm() {
            let isValid = true;
            
            const name = document.getElementById('feedbackName').value.trim();
            const email = document.getElementById('feedbackEmail').value.trim();
            const rating = document.getElementById('rating').value;
            const message = document.getElementById('feedbackMessage').value.trim();
            
            // Simple validation
            if (!name) {
                showError('nameError', 'Please enter your name');
                isValid = false;
            }
            
            if (!email || !email.includes('@')) {
                showError('emailError', 'Please enter a valid email');
                isValid = false;
            }
            
            if (rating === '0') {
                showError('ratingError', 'Please select a rating');
                isValid = false;
            }
            
            if (!message) {
                showError('messageError', 'Please enter your feedback');
                isValid = false;
            }
            
            return isValid;
        }
        
        function showError(elementId, message) {
            const element = document.getElementById(elementId);
            element.textContent = message;
            element.style.display = 'block';
        }
        
        // 5. Save feedback (basic - to localStorage and .txt file)
        function saveFeedback() {
            const feedback = {
                id: Date.now(),
                name: document.getElementById('feedbackName').value.trim(),
                email: document.getElementById('feedbackEmail').value.trim(),
                rating: document.getElementById('rating').value,
                message: document.getElementById('feedbackMessage').value.trim(),
                date: new Date().toLocaleDateString()
            };
            
            // Add to array
            feedbackData.push(feedback);
            
            // Save to localStorage
            localStorage.setItem('foodieHubFeedback', JSON.stringify(feedbackData));
            
            // Create .txt file content
            const fileContent = `
FOODIE HUB - FEEDBACK
=====================
Date: ${feedback.date}
Name: ${feedback.name}
Email: ${feedback.email}
Rating: ${feedback.rating}/5
Feedback: ${feedback.message}
=====================
`;
            
            // Create and download .txt file
            const blob = new Blob([fileContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `feedback_${feedback.id}.txt`;
            a.click();
            
            return feedback;
        }
        
        // 6. Update feedback display
        function updateFeedbackDisplay() {
            const feedbackList = document.getElementById('feedbackList');
            const feedbackCount = document.getElementById('feedbackCount');
            
            feedbackCount.textContent = `Total Feedback: ${feedbackData.length}`;
            
            if (feedbackData.length === 0) {
                feedbackList.innerHTML = `
                    <div class="empty-feedback">
                        <div style="font-size: 2.5rem; margin-bottom: 15px;">📝</div>
                        <p>No feedback yet. Submit your feedback first!</p>
                    </div>
                `;
                return;
            }
            
            // Show latest feedback first
            const reversedData = [...feedbackData].reverse();
            
            feedbackList.innerHTML = reversedData.map(feedback => `
                <div class="feedback-item">
                    <div class="feedback-header">
                        <div class="feedback-name">${feedback.name}</div>
                        <div class="feedback-date">${feedback.date}</div>
                    </div>
                    <div class="feedback-rating">${'★'.repeat(feedback.rating)}${'☆'.repeat(5 - feedback.rating)}</div>
                    <div class="feedback-message">${feedback.message}</div>
                </div>
            `).join('');
        }
        
        // 7. Clear all feedback
        function clearAllFeedback() {
            if (confirm('Are you sure you want to delete all feedback?')) {
                feedbackData = [];
                localStorage.removeItem('foodieHubFeedback');
                updateFeedbackDisplay();
                alert('All feedback cleared!');
            }
        }
        
        // 8. Form submission handler
        document.getElementById('feedbackForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!validateForm()) {
                return;
            }
            
            const feedback = saveFeedback();
            
            // Show success message
            const successMsg = document.getElementById('successMessage');
            successMsg.style.display = 'block';
            successMsg.textContent = `✓ Thank you ${feedback.name}! Your ${feedback.rating}/5 rating has been saved.`;
            
            // Hide message after 3 seconds
            setTimeout(() => {
                successMsg.style.display = 'none';
            }, 3000);
            
            // Reset form
            this.reset();
            stars.forEach(star => star.classList.remove('active'));
            ratingValue.textContent = '0/5';
            ratingInput.value = '0';
            currentRating = 0;
            
            // Update display
            updateFeedbackDisplay();
        });
        
        // 9. Button event listeners
        document.getElementById('loadFeedback').addEventListener('click', function() {
            loadSavedFeedback();
            if (feedbackData.length === 0) {
                alert('No saved feedback found.');
            } else {
                alert(`Loaded ${feedbackData.length} feedback entries.`);
            }
        });
        
        document.getElementById('clearFeedback').addEventListener('click', clearAllFeedback);
        
        // 10. Initialize on page load
        window.addEventListener('DOMContentLoaded', function() {
            loadSavedFeedback();
        });
    