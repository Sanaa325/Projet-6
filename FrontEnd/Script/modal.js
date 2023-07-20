const worksUrl = "http://localhost:5678/api/works"; // URL de l'API
let modal = null;
let formData = new FormData()

const editBtnDisplay = () => {
  const jsModal = document.querySelectorAll('.js-modal')
  if (sessionStorage.getItem("token")) {
    jsModal.forEach((btn) => { btn.style.visibility = "visible"; })
    document.querySelector("#banner").style.display = null
    document.querySelector("#login").style.display = "none"
    document.querySelector("#logout").style.display = null
    document.querySelector("header").style.margin = "100px auto"
    document.querySelector("#logout").addEventListener('click', (e) => {
      sessionStorage.removeItem("token");
      location.href = "index.html";
    })
  }
  else {
    document.querySelector("#login").style.display = null
    document.querySelector("#logout").style.display = "none"
    jsModal.forEach((btn) => { btn.style.visibility = "hidden"; })
    document.querySelector("#banner").style.display = "none"
    document.querySelector("header").style.margin = "50px auto"
  }
}
editBtnDisplay()


const openModal = function (e) {
  closeModal(e)
  e.preventDefault()
  const target = document.querySelector(e.target.getAttribute('href'))
  target.style.display = 'flex'; //pour afficher qqch
  target.removeAttribute('aria-hidden')
  target.setAttribute('aria-modal', 'true')
  modal = target
  modal.addEventListener('click', closeModal)
  modal.querySelector('.modal-close').addEventListener('click', closeModal)
  modal.querySelector('.modal-stop').addEventListener('click', stopPropagation)
  if (e.target.getAttribute('href') === "#modal1") {
    displayWorksModal()
  }
  else {
    
    document.querySelector('.select-image').addEventListener('click', function() {
      document.getElementById('file').click();
    });

    document.getElementById("add-picture-btn").addEventListener('click', function (e) {
      e.preventDefault()
      const btnTitle = document.querySelector("#add-title");
      const categoryOfWork = document.querySelector("#add-category");
      formData.append("title", btnTitle.value);
      formData.append("category", categoryOfWork.value);
      fetch(worksUrl, {
        method: 'POST', // Méthode HTTP (GET, POST, PUT, DELETE, etc.)
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem("token")}`, // Ajoutez le token d'authentification dans l'en-tête
          'Accept': 'application/json' // Définissez le type de contenu de la requête
        },
        body: formData
      })
        .then(response => {
          response.json().then(response2 => {
            works.push(response2)
            displayWorksModal()
            displayWorks()
            closeModal(e)
          })
        })
    })

    document.getElementById("file").addEventListener('change', function (e) {
      e.preventDefault()
      const file = e.target.files[0];
      formData = new FormData();
      formData.append("image", file);
    })
  }
}

function deleteWork(workToDeletedId) {
  if (confirm("Souhaitez-vous vraiment supprimer ce projet ?") == true) {
    fetch(worksUrl + '/' + workToDeletedId, {
      method: 'DELETE', // Méthode HTTP (GET, POST, PUT, DELETE, etc.)
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem("token")}`, // Ajoutez le token d'authentification dans l'en-tête
        'Content-Type': 'application/json' // Définissez le type de contenu de la requête
      },
    })
      .then(response => {
        works = works.filter(work => work.id !== workToDeletedId) //filtrer works sans celui supp
        displayWorksModal()
        displayWorks()
      })
  }

}
function deleteAllWorks() {

  //to do quand recuperation back adapte

}

const closeModal = function (e) {
  if (modal === null) return
  e.preventDefault()
  modal.style.display = 'none'
  modal.setAttribute('aria-hidden', 'true')
  modal.removeAttribute('aria-modal')
  modal.removeEventListener('click', closeModal)
  modal.querySelector('.modal-close').removeEventListener('click', closeModal)
  modal.querySelector('.modal-stop').removeEventListener('click', stopPropagation)

}

const stopPropagation = function (e) {
  e.stopPropagation()
}

document.querySelectorAll('.js-modal').forEach(a => {
  a.addEventListener('click', openModal)
})


function displayWorksModal() {
  document.getElementById("content").innerHTML = ""

  works.forEach(work => {
    const div = document.createElement('div')
    const element = document.createElement('figure')
    element.innerHTML = '<img src="' + work.imageUrl + '" alt="' + work.title + '" ><figcaption>Editer</figcaption>'

    const divContainer = document.createElement('div');
    divContainer.style.position = 'fixed';
    divContainer.style.justifyContent = 'right';
    divContainer.style.margin = '-100px 0 0 0';
    divContainer.style.width = 'inherit';
    const trash = document.createElement("i")
    trash.className = 'fa-solid fa-trash';
    element.appendChild(trash);
    trash.addEventListener("click", function (e) {
      e.preventDefault()
      deleteWork(work.id)
    })

    const moveBtn = document.createElement("i")
    moveBtn.className = 'fa-solid fa-up-down-left-right';
    divContainer.appendChild(trash);
    divContainer.appendChild(moveBtn);
    element.appendChild(divContainer);
    div.appendChild(element);

    document.getElementById('content').appendChild(div);

  });
  
  document.getElementById("delete-gallery").addEventListener('click', function (e) {
    e.preventDefault()
    deleteAllWorks(work.id)
  })
}








