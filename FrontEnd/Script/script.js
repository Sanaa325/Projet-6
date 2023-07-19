let works = []

function loadProject() {
    const root = "http://localhost:5678/api";
    fetch(root + "/works").then(function (response) {
        console.log(response)
        response.json().then(function (response2) {
            works = response2
            displayWorks()
        })
    })

    fetch(root + "/categories")
        .then(reponse => reponse.json())
        .then(reponse2 => displayCategory(reponse2));

}

loadProject()

function displayWorks(categoryId) {
    document.getElementById("gallery").innerHTML = ""
    const filterWorks = works.filter(work => work.categoryId === categoryId || categoryId === undefined)
    filterWorks.forEach(work => {
        const element = document.createElement('figure')
        element.innerHTML = '<img src="' + work.imageUrl + '" alt="' + work.title + '" ><figcaption>' + work.title + '</figcaption>'
        document.getElementById('gallery').appendChild(element);
    });
}

function displayCategory(categories) {
    for (let i = 0; i < categories.length; i++) {
        const button = document.createElement("button");
        button.innerHTML = categories[i].name
        const filterContainer = document.querySelector('.filter-container');
        button.classList.add("btn-filter")
        button.addEventListener("click", function () {
            displayWorks(categories[i].id)
        })
        filterContainer.appendChild(button);
        const selectCategory = document.getElementById("add-category") //recuperer liste deroulante
        const option = document.createElement("option") //ajout option
        option.innerHTML = categories[i].name //nommer option
        option.value = categories[i].id //identifiant de categories pour backend
        selectCategory.appendChild(option)
    }
}

document.getElementById("all-category").addEventListener("click", function () {
    displayWorks()
})

function displayAdminElement() {
    if (sessionStorage.getItem("token")) {
        document.getElementById("login").style.display = "none"
        document.getElementById("logout").style.display = "block"
    }
}
displayAdminElement()
