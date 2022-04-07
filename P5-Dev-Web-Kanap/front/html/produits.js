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

    boutonAjout.addEventListener('click', () => {
        let panierArticle = JSON.parse(localStorage.getItem('article'));
        let couleurArticle = document.getElementById('colors').value; // It's better to parse value here instead of line number 65
        let nombreArticle = document.getElementById('quantity').value; // It's better to parse value here instead of line number 66
        let articleInfos; // It's better to init articleInfos first. Like this, you know can access it in this scope

        if (panierArticle === null) {
            let articleInfos = { // Remove the let here
                id: id,
                couleur: couleurArticle,
                quantite: nombreArticle
            };
            listeArticles.push(articleInfos);
            localStorage.setItem('article', JSON.stringify(listeArticles));
        }

        if (panierArticle !== null) {  // In this case it make sense to use 'if' and 'else' instead of two 'if'

            for (let i in panierArticle) {
                let objet = panierArticle[i];
                if ((id === objet.id) && (couleurArticle === objet.couleur)) {
                    let nombreArticleNumber = parseInt(nombreArticle, 10); // second param not necessary : 10 is the default value
                    let objetQuantiteNumber = parseInt(objet.quantite, 10); // second param not necessary : 10 is the default value
                    panierQuantite = nombreArticleNumber += objetQuantiteNumber;
                    panierArticle.splice(i, 1);
                    console.log(panierArticle) 
                    console.log(panierQuantite)
                    let articleInfos = { // Remove the let here
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

//let boutonAjout = document.getElementById('addToCart');

//boutonAjout.addEventListener('click', () => {
//    let panierArticle = JSON.parse(localStorage.getItem('article'));
//    let couleurArticle = document.getElementById('colors').value;
//    let nombreArticle = parseInt(document.getElementById('quantity').value);
//
//    if (panierArticle === null) {
//        let panierArticle = []
//        let articleInfos = {
//            id: id,
//            couleur: couleurArticle,
//            quantite: nombreArticle
//        };
//        panierArticle.push(articleInfos);
//        localStorage.setItem('article', JSON.stringify(panierArticle));
//        }
//
//    for (let i in panierArticle) {
//    let objet = panierArticle[i];
//        if ((panierArticle !== null) && (id === objet.id) && (couleurArticle === objet.couleur)) {
//            let objetQuantiteNumber = parseInt(objet.quantite);
//            panierQuantite = nombreArticle += objetQuantiteNumber;
//            let articleInfos = {
//                id: id,
//                couleur: couleurArticle,
//                quantite: panierQuantite
//            };
//            console.log(articleInfos)
//            panierArticle.splice(i, 1);
//            panierArticle.push(articleInfos);
//            localStorage.setItem('article', JSON.stringify(panierArticle));
//            break;
//        }
//    }
//});

