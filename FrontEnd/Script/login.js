const loginURL = "http://localhost:5678/api/users/login";

function getUserLog() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value

    const user = {
        email: email,
        password: password
    }
    return user;
}

function showErrorMsg() {
    alert("Erreur dans l'identifiant ou le mot de passe");
}

document.getElementById('login-btn').addEventListener('click', function(e) {
    //Ne pas declencher le submit
   e.preventDefault()
   const user = getUserLog();

   fetch(loginURL,{
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
   })
   .then((res) => {
    if (res.ok) {
     res.json().then((connexion) => {

        sessionStorage.setItem("token", connexion.token);
        location.href = "index.html";
     });
    }
    else{
        showErrorMsg();
        return 0;
    }
   })
   
});




