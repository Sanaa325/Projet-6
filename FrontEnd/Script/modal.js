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

function swipeModal() {
  const mod1 = document.querySelector("#modal1");
  const mod2 = document.querySelector("#modal2");
  if (mod1.style.display !== "none") {
    mod1.style.display = "none";
    mod2.style.display = "flex";
  
  } else {
    mod1.style.display = "flex";
    mod2.style.display = "none";
  }
}
const addbutton = document.querySelector("#add-validated");
addbutton.addEventListener("click", swipeModal);

const ret = document.querySelector(".modal-previous");
ret.addEventListener("click", swipeModal);


document.querySelector('.select-image').addEventListener('click', function () {
  document.getElementById('file').click();
});

document.getElementById("add-picture-btn").addEventListener('click', function (e) {
  e.preventDefault();

  const fileInput = document.getElementById("file");
  const btnTitle = document.querySelector("#add-title");
  const categoryOfWork = document.querySelector("#add-category");

  // Vérifier si une image a été sélectionnée
  if (!fileInput.files || fileInput.files.length === 0) {
    alert("Veuillez sélectionner une image !");
    return;
  }

  // Vérifier si champ titre est vide
  if (btnTitle.value.trim() === "") {
    alert("Erreur: Le titre doit être renseigné.");
    return;
  }

  // Vérifier si champ catégorie est vide
  if (categoryOfWork.value.trim() === "") {
    alert("Erreur: La catégorie doit être renseignée.");
    return;
  }

  formData.append("title", btnTitle.value);
  formData.append("category", categoryOfWork.value);

  fetch(worksUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
      'Accept': 'application/json'
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
    .catch(error => {
      alert("Une erreur est survenue lors de l'ajout de l'image : " + error.message);
    });
});

document.getElementById("file").addEventListener('change', function (e) {
  e.preventDefault();
  const file = e.target.files[0];
  formData = new FormData();


  // Vérifier la taille de l'image (maximum de 4 Mo)
  const maxSize = 4 * 1024 * 1024; // 4 Mo en octets
  if (file.size > maxSize) {
    alert("Erreur: la taille de l'image ne doit pas dépasser 4 Mo.");
    return;
  }

  // Vérifier si le fichier est au format PNG, JPEG ou PJPEG
  const validImageFormats = ["image/png", "image/jpeg", "image/pjpeg"];
  if (!validImageFormats.includes(file.type)) {
    alert("Erreur: format de l'image non valide.");
    return;
  }

  formData.append("image", file);

  const imagePreview = document.getElementById('image-preview');
  const uploadBtnContainer = document.getElementById('upload-btn-container');

  const reader = new FileReader();
  reader.onload = function (event) {
    imagePreview.src = event.target.result;
    // Rendre la miniature visible
    imagePreview.style.display = "block";

    // Masquer l'icône et le bouton "Ajouter Image"
    uploadBtnContainer.style.display = "none";
  };

  reader.onerror = function () {
    // Afficher l'icône et le bouton "Ajouter Image" en cas d'erreur
    imagePreview.style.display = "none";
    uploadBtnContainer.style.display = "block";

    alert("Erreur lors du chargement de l'image !");
  };

  reader.readAsDataURL(file);
});


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


  }
}

// Fonction pour supprimer projet
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

// Fermer modal
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

// Afficher les projets dans la modal
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








