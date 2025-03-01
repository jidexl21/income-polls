let Actions = {
  IsNumeric : function (str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  },
  SetInitial : function(){
    console.log("set initial");
    var mainForm = document.getElementById("main-form");
    mainForm.classList.remove("d-none");

    var thankYou = document.getElementById("thank-you");
    thankYou.classList.add("d-none")
    Actions.CalculateMonthlySavings(); 
    Actions.CalculateCommunityPercent();
  },
  SetThankYou : function(){
    console.log("set thank you");
    var mainForm = document.getElementById("main-form");
    mainForm.classList.add("d-none");

    var thankYou = document.getElementById("thank-you");
    thankYou.classList.remove("d-none")
  },
  Refresh : function(){
    location.reload();
  }, 
  CalculateMonthlySavings: function(){
    var inc = document.querySelector("#income").value; 
    var exp = document.querySelector("#expense").value; 
    if(Actions.IsNumeric(inc) && Actions.IsNumeric(exp) && parseInt(inc) >  0){
      document.querySelector("#savings").value = ((inc - exp) / inc) * 100; 
    }
    console.log(`${inc.value} ${exp.value}`)
  },
  CalculateCommunityPercent: function(){
    var inc = document.querySelector("#income").value; 
    var fromCommunity = document.querySelector("#communityAmount").value; 
    if(Actions.IsNumeric(inc) && Actions.IsNumeric(fromCommunity) && parseInt(inc) >  0){
      document.querySelector("#communityPercent").value = (fromCommunity/ inc) * 100; 
    }
    console.log(`calculating community`)
  },
  SendResultsAndExit: function(){
    Actions.SetThankYou();
  }
};

// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'
  
  Actions.SetInitial();
  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation');

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation();
      }else{
        Actions.CalculateMonthlySavings();
        Actions.CalculateCommunityPercent();
        Actions.SendResultsAndExit(); 
      }
      form.classList.add('was-validated')

    
    }, false)
  }); 

  document.querySelector("#income").addEventListener('keyup', evt=>{
    Actions.CalculateMonthlySavings();

  }); 

  document.querySelector("#expense").addEventListener('keyup', evt=>{
    Actions.CalculateMonthlySavings();
  }); 

  document.querySelector("#communityAmount").addEventListener('keyup', evt=>{
    Actions.CalculateCommunityPercent();
  }); 

})()
