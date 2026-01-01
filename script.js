const Name=document.getElementById('name')
const Email=document.getElementById('emailID')
const Rating=document.getElementById('rating')
const feedback=document.getElementById('feedback')
const submitBtn=document.getElementById("btn")
const form =document.getElementById('feedbackform')




Rating.addEventListener("input", () => {
    if (Rating.value > 5) Rating.value = 5;
    if (Rating.value < 1) Rating.value = 1;
});


validate=()=>{
    if(!Name||!Email||!feedback){
        alert("enter valid details")
        return false
    }
    return true
}

successDisplay=()=>{
    // Show success message
        const successMsg = document.getElementById('successMsg');
        successMsg.style.display = 'block';
        form.style.display='none';
        successMsg.textContent = `✓ Thank you ${Name.value}! Your  rating has been saved.`;
            
    // Hide message after 3 seconds
     setTimeout(() => {
        successMsg.style.display = 'none';
        form.style.display='flex';
        }, 1000);
    
}


function handleSubmit(event){
    event.preventDefault()

    if(!validate(form)) return
  
    console.log(Name.value)
    console.log(Email.value)
    console.log(Rating.value)
    console.log(feedback.value)

    successDisplay()

   
    form.reset()

       
   
}