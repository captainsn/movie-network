const form = document.forms[0]

// function createPlaylist
function createPlaylist() {
  window.location.href ='/movie'
}



/*=============================================
=            Form Submit Functions            =
=============================================*/

function submitUser() {
  var data = {}
  if (form.password.value) data.password = form.password.value
  if (form.confirm.value) data.confirm = form.confirm.value
  if (form.username.value) data.username = form.username.value
  if (form.name.value) data.name = form.name.value 
  if (form.email.value) data.email = form.email.value 

  if (!data.email) return displayError('Must provide email')
  if (!data.password) return displayError('Must provide password')
  if (data.password !== form.confirm.value) return displayError('Passwords do not match')

  fetch('/register', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data)
  }).then(submitSuccess)
  .catch(submitError)

}

function submitLogin() {
 console.log("jesusssssssss")
 var data = {
    username: form.username.value,
    password: form.password.value
  }
  console.log(data)

  fetch('/login', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data)
  }).then(function(res) {
    if (!res.ok) { alert('ERROR') }
    res.json()
    .then(function(data) {
      localStorage.token = data.token
      window.location.href ='/account'
    })
  }).catch(submitError)
}

function addToDatabase() {
  var data = {
    title: form.title.value
  }
  fetch('/add-to-db', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data)
  }).then(function(res) {
    if (!res.ok) { alert('ERROR!') }
    res.json()
    .then(function(data) {
      alert(JSON.stringify(data))
      localStorage.token = data.token
      window.location.href = '/account'
    })
  }).catch(submitError)
}
/*=============================================
=            Form Submit Callbacks            =
=============================================*/
function clearForm() {
    form.reset();
    clearError('message');
    var divs = document.getElementsByClassName('hidden');
    for (var i = 0; i < divs.length; i++)
        divs[i].style.display = '';
}

function clearError(target) {
    if (target === 'message')
        return document.getElementById('js-error-message').style.visibility = 'hidden';
    target.style.border = '1px solid #888';
}


function submitSuccess(res) {
    if (!res.ok) {
      return submitError(res);
    }
    var modal = document.getElementById('js-success');
    modal.style.display = 'block';
    clearForm();
    window.location.href ='/login'
}

function submitError(res, message) {
    if (res.status >= 400 && res.status < 500)
        return res.text().then(function(message) {displayError(message)});
    if (message)
        return displayError(message);
}

function displayError(message) {
    var errorDiv = document.getElementById('js-error-message');
    errorDiv.innerHTML = message;
    errorDiv.style.visibility = 'visible';
}

/*=============================================
=            Browse Page            =
=============================================*/

document.getElementById("high-to-low").addEventListener("click",function(){
  sortItems("order");
});
document.getElementById("low-to-high").addEventListener("click",function(){
  sortItems("order","-");
});
document.getElementById("default").addEventListener("click",function(){
  sortItems("default");
});
function sortItems(dataType,neg) {
  neg = neg || "";
  var delay = 0;
  var sortable = document.querySelectorAll(".sortable");
 for (var i = 0; i < sortable.length; i++) {
   var dataSelect = document.querySelector("[data-default='" + i + "']")
    dataSelect.style.opacity = 0;
    dataSelect.style.transitionDelay = (delay += 0.02) + "s";
  } 
  sortable[sortable.length-1].addEventListener("transitionend", function(){
    for (var i = 0; i < sortable.length; i++) {
    //Get the element by data-order and change the order style.  That's all you have to do!  You could probably substitute data-order for an id, but the data attribute seemed more logical
    var dataSelect = document.querySelector("[data-" + dataType + "='" + i + "']")
    dataSelect.style.order = neg + i;
      dataSelect.style.opacity = 1;
      dataSelect.style.transitionDelay = (delay -= 0.02) + "s";
  }
  });
  
  
}


$(".icon").click(function() {
  var icon = $(this),
      input = icon.parent().find("#search"),
      submit = icon.parent().find(".submit"),
      is_submit_clicked = false;
  
  // Animate the input field
  input.animate({
    "width": "165px",
    "padding": "10px",
    "opacity": 1
  }, 300, function() {
    input.focus();
  });
  
  submit.mousedown(function() {
    is_submit_clicked = true;
  });
  
  // Now, we need to hide the icon too
  icon.fadeOut(300);
  
  // Looks great, but what about hiding the input when it loses focus and doesnt contain any value? Lets do that too
  input.blur(function() {
    if(!input.val() && !is_submit_clicked) {
      input.animate({
        "width": "0",
        "padding": "0",
        "opacity": 0
      }, 200);
      
      // Get the icon back
      icon.fadeIn(200);
    };
  });
});

$(function() {  
  $('.button')
    .on('mouseenter', function(e) {
      var parentOffset = $(this).offset(),
          relX = e.pageX - parentOffset.left,
          relY = e.pageY - parentOffset.top;
      $(this).find('span').css({top:relY, left:relX})
    })
    .on('mouseout', function(e) {
      var parentOffset = $(this).offset(),
          relX = e.pageX - parentOffset.left,
          relY = e.pageY - parentOffset.top;
      $(this).find('span').css({top:relY, left:relX})
    });
  $('[href=#]').click(function(){return false});
});

/*=============================================
=            Index Page            =
=============================================*/
//CHANGE 
