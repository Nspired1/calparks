const { default: bsCustomFileInput } = require("bs-custom-file-input")

(function(){
    'use strict'

    //displays filenames for multiple file uploads in edit.ejs
    bsCustomFileInput.init();
    
    //fetch all the forms to apply custom Bootstrap
    const forms = document.querySelectorAll('.validated-form')

    //Loop over elements in form and prevent submission
    Array.from(forms)
    .map(function(form){
        form.addEventListener('submit', function(event){
            if(!form.checkValidity()){
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
})()