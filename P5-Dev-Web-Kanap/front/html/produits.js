const produit = window.location.href
var url = new URL(produit);
var id = url.searchParams.get("id")


window.addEventListener("DOMContentLoaded", () => {
let donneesProduit = fetch(`http://localhost:3000/api/products/${id}`)
.then((res) => (res.json()))
.then((promise) => {
    donneesProduit = promise
    console.log(donneesProduit)
    let imageProduit = document.getElementsByClassName('item__img');
    let elementUn = imageProduit[0];
    elementUn.innerHTML = `<img src="${donneesProduit.imageUrl}" alt="${donneesProduit.name}">`;

    let nomPrix = document.getElementsByClassName('item__content__titlePrice');
    let nomPrixTab = nomPrix[0];
    nomPrixTab.innerHTML = 
    `<h1 id="title">${donneesProduit.name}</h1>
    <p>Prix : <span id="price">${donneesProduit.price}</span>€</p>`;

    let produitDescription = document.getElementsByClassName('item__content__description');
    let produitDescriptionTab = produitDescription[0];
    produitDescriptionTab.innerHTML = 
    `<p class="item__content__description__title">Description :</p>
    <p id="description">${donneesProduit.description}</p>`;


    let diffColours = `${donneesProduit.colors}`
    const tabCouleur = diffColours.split(',');
    console.log(tabCouleur)

    let produitCouleur = document.getElementById('colors');
    for (let i = 0; i < tabCouleur.length; i++) {
        let opt = document.createElement('option');
        opt.innerHTML = `<option value="${tabCouleur[i]}">${tabCouleur[i]}</option>`;
        produitCouleur.appendChild(opt);
    };
    });

    let boutonAjout = document.getElementById('addToCart');
    let panierArticle = JSON.parse(localStorage.getItem('article'));
    let listeArticles = [];

    boutonAjout.addEventListener('click', () => {
        let panierArticle = JSON.parse(localStorage.getItem('article'));
        console.log(panierArticle)
        let couleurArticle = document.getElementById('colors').value;
        let nombreArticle = document.getElementById('quantity').value;

        if (panierArticle === null) {
        let articleInfos = {
            id: id,
            couleur: couleurArticle,
            quantite: nombreArticle
        };
        listeArticles.push(articleInfos);
        localStorage.setItem('article', JSON.stringify(listeArticles));
        }

        if (panierArticle !== null) {
            for (let i in panierArticle) {
                let objet = panierArticle[i];
                if ((id === objet.id) && (couleurArticle === objet.couleur)) {
                    let nombreArticleNumber = parseInt(nombreArticle, 10);
                    let objetQuantiteNumber = parseInt(objet.quantite, 10);
                    panierQuantite = nombreArticleNumber += objetQuantiteNumber;
                    panierArticle.splice(i, 1);
                    console.log(panierArticle) 
                    console.log(panierQuantite)
                    let articleInfos = {
                        id: id,
                        couleur: couleurArticle,
                        quantite: panierQuantite
                    };
                    listeArticles.push(articleInfos);
                    localStorage.setItem('article', JSON.stringify(listeArticles));
                    console.log(panierArticle)
                }
            }
        }
    });

});


