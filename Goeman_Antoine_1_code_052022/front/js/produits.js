//Récupération de l'id du produit présent dans l'url.
const produit = window.location.href
var url = new URL(produit);
var id = url.searchParams.get("id")


window.addEventListener("DOMContentLoaded", () => {
    //Récupération des informations précise du produit à travers l'API.
    let donneesProduit = fetch(`http://localhost:3000/api/products/${id}`)
        .then((res) => (res.json()))
        .then((promise) => {
            donneesProduit = promise
            //récupération des éléments du fichier html puis implémentation des informations récupérées avec le fetch
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

            //Je récupère les couleurs du fetch, puis les sépare en valeur distinct pour les imlpémenter dans mon html avec une boucle
            let diffColours = `${donneesProduit.colors}`
            const tabCouleur = diffColours.split(',');

            let produitCouleur = document.getElementById('colors');
            for (let i = 0; i < tabCouleur.length; i++) {
                let opt = document.createElement('option');
                opt.innerHTML = `<option value="${tabCouleur[i]}">${tabCouleur[i]}</option>`;
                produitCouleur.appendChild(opt);
            };
        });

    //récupération du bouton puis ajout du addEventListener permettant soit la création d'une nouvelle ligne si le mélange produit couleur n'es pas présent
    //ou la modification de la quantité si il est déjà présent dans le localStorage.
    let boutonAjout = document.getElementById('addToCart');
    boutonAjout.addEventListener('click', () => {
        let panierArticle = JSON.parse(localStorage.getItem('article')) ?? [];
        let couleurArticle = document.getElementById('colors').value;
        let nombreArticle = parseInt(document.getElementById('quantity').value);
        if (couleurArticle === '') {
            alert('Veuillez séléctionner une couleur')
            return
        }
        if (nombreArticle === 0) {
            alert('Veuillez séléctionner une quantité supérieur à 0')
            return
        }

        for (let i in panierArticle) {
            let objet = panierArticle[i];
            if ((id === objet.id) && (couleurArticle === objet.couleur)) {
                let objetQuantiteNumber = parseInt(objet.quantite);
                nombreArticle += objetQuantiteNumber;
                panierArticle.splice(i, 1);
            }
        }
        panierArticle.push({
            id: id,
            couleur: couleurArticle,
            quantite: nombreArticle
        });
        localStorage.setItem('article', JSON.stringify(panierArticle));
        alert('Votre produit à bien été ajouté au panier')
    });
});

