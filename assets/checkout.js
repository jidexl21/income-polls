let Actions = {
  IsNumeric : function (str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  },
  SetInitial : function(){
    // console.log("set initial");
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
    // console.log(`${inc.value} ${exp.value}`)
  },
  CalculateCommunityPercent: function(){
    var inc = document.querySelector("#income").value; 
    var fromCommunity = document.querySelector("#communityAmount").value; 
    if(Actions.IsNumeric(inc) && Actions.IsNumeric(fromCommunity) && parseInt(inc) >  0){
      document.querySelector("#communityPercent").value = (fromCommunity/ inc) * 100; 
    }
    // console.log(`calculating community`)
  },
  SendResultsAndExit: function(){
    var currForm = document.getElementById("main-form"); 
    var data = Actions.Serialize(currForm)

   var toSend = data.split("&").reduce((previous, curr)=>{
      var toks = curr.split('=')
      previous[toks[0]] = decodeURIComponent(toks[1]);
      return previous; 
    }, {});

    axios.post("https://income-polls.a-z.ng/api/data", toSend)
    .then(function(){
      Actions.SetThankYou();
    })
    .catch(function(e){
      console.error(e)
    })
   
  }, 
  Serialize: function(form, evt){
    var evt    = evt || window.event;
    evt.target = evt.target || evt.srcElement || null;
    var field, query='';
    if(typeof form == 'object' && form.nodeName == 'FORM'){
        for(i=form.elements.length-1; i>=0; i--){
            field = form.elements[i];
            if(field.name && field.type != 'file' && field.type != 'reset' && !field.disabled){
                if(field.type == 'select-multiple'){
                    for(j=form.elements[i].options.length-1; j>=0; j--){
                        if(field.options[j].selected){
                            query += '&' + field.name + "=" + encodeURIComponent(field.options[j].value).replace(/%20/g,'+');
                        }
                    }
                }
                else{
                    if((field.type != 'submit' && field.type != 'button') || evt.target == field){
                        if((field.type != 'checkbox' && field.type != 'radio') || field.checked){
                            query += '&' + field.name + "=" + encodeURIComponent(field.value).replace(/%20/g,'+');
                        }   
                    }
                }
            }
        }
    }
    return query.substr(1);
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
        event.preventDefault()
        event.stopPropagation()
      if (!form.checkValidity()) {
        ;
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
