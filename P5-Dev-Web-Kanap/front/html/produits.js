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
        //Je déclare toutes les variables donr j'aurais bnesoin au début pour ne pas avoir à les redéclarer
        let panierArticle = JSON.parse(localStorage.getItem('article'));
        let couleurArticle = document.getElementById('colors').value;
        let nombreArticle = parseInt(document.getElementById('quantity').value);
        let articleInfos = {
            id: id,
            couleur: couleurArticle,
            quantite: nombreArticle
        };
    
        //Je créer un if null parceque lors du premier clique, si panierArticle est vide et que je tente de l'envoyer dans le localStorage
        //je reçois un message d'erreur, je créer recréer donc dans la fonction panierarticle sous forme de array vide que je remplis puis
        //que j'envois, si je tente de sortir mon JSON.stringify du if je recevrais une erreur car panierArticle seras condiéré comme vide.
        if (panierArticle === null) {
            let panierArticle = []
            let articleInfos = {
                id: id,
                couleur: couleurArticle,
                quantite: nombreArticle
            };
            panierArticle.push(articleInfos);
            localStorage.setItem('article', JSON.stringify(panierArticle));
            } else {
            //Plutôt que de créer un deuxième if je créé un else dans lequel j'insère ma boucle qui viendras vérifier si il doit incrémenter
            //et la raison pour laquelle elle ne marchais pas avant était qu'elle modifiais panierArticle, mais que c'était listeArticle qui
            //était push, dans l'état actuel la fonction marche et l'incrémentation fonctionne bien.
            for (let i in panierArticle) {
                let objet = panierArticle[i];
                    if ((panierArticle !== null) && (id === objet.id) && (couleurArticle === objet.couleur)) {
                        let objetQuantiteNumber = parseInt(objet.quantite);
                        panierQuantite = nombreArticle += objetQuantiteNumber;
                        let articleInfos = {
                            id: id,
                            couleur: couleurArticle,
                            quantite: panierQuantite
                        };
                        console.log(articleInfos)
                        panierArticle.splice(i, 1);
                        panierArticle.push(articleInfos);
                        localStorage.setItem('article', JSON.stringify(panierArticle));
                        break;
                        }
                    }
            }
            //Maintenant la question que je me pose c'est : où est ce que je met ma fonction final qui viendras, si les deux
            //autres fonction n'ont rien fait ajouter quelque chose, je ne sais pas comment faire, je ne peux pas le mettre 
            //dans ma boucle sinon il se répéte, si je le sort de ma boucle comment faire pour qu'il ne soit pas éxécuter si
            //l'incrémentation à marcher ? et impossible de le mettre dans la fonction comme dans l'éxemple parceque sinon, 
            //quand le localstorage est vide au premeir clique j'ai un message d'erreur qui dit qu'il ne peux pas push dans une variable 
            // null. J'espère que ca auras été assez corremctment expliqué.
    });
});

 