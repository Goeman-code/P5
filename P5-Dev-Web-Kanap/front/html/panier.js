let panierArticle = JSON.parse(localStorage.getItem('article'));

const fetchProduits = async () => {
    await fetch("http://localhost:3000/api/products")
        .then((res) => res.json())
        .then((promise) => {
            donneesProduit = promise
        });
};

const listeProduits = async () => {
    for (let i in panierArticle) {
        await fetchProduits();
        let objet = panierArticle[i];
        let articleId = objet.id;

        let infosProduit = donneesProduit.find(produit => produit._id == articleId);
        console.log(infosProduit)

        let listeArticles = document.getElementById('cart__items');
        let article = document.createElement('article');
        let objetPrix = infosProduit.price * objet.quantite;

        article.innerHTML =
            `
        <article class="cart__item" data-id="${infosProduit._id}" data-color="${objet.couleur}">
            <div class="cart__item__img">
                <img src="${infosProduit.imageUrl}" alt="${infosProduit.altTxt}">
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__description">
                <h2>${infosProduit.name}</h2>
                <p>${objet.couleur}</p>
                <p>${objetPrix}</p>
            </div>
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : ${objet.quantite}</p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${objet.quantite}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                </div>
            </div>
        </article>
        `
        listeArticles.appendChild(article);
    };
}
listeProduits()


//Je créé une boucle for qui me permettra de créer le addEventListener de chaque input
for (let i in panierArticle) {
    //Malgré toutes les méthodes testée ci dessous, impossible de récupérer mon html collection, je reçois juste un Array vide

    //let inputQuantite = document.getElementsByClassName('itemQuantity');
    //inputQuantite = Array.from(HTMLCollection);
    //const inputQuantite = [...document.getElementsByClassName('itemQuantity')];
    var inputQuantite = Array.prototype.slice.call(document.getElementsByClassName('itemQuantity'));
    console.log(inputQuantite)
    let articleModif = inputQuantite[i];
    console.log(articleModif)
    
    articleModif.addEventListener('change', async () => {
        await fetchProduits();
        console.log(donneesProduit)
        objetPrix = donneesProduit.price * articleModif.value;
        console.log(objetPrix)

        let modifPrix = document.getElementsByClassName('cart__item__content__description');
        let nouveauPrix = modifPrix[i]
        nouveauPrix.innerHTML =
        `
        <h2>${donneesProduit.name}</h2>
        <p>${objet.couleur}</p>
        <p>${objetPrix}</p>
        `

        let modifQuantite = document.getElementsByClassName('cart__item__content__settings__quantity');
        let nouvelleQuantite = modifQuantite[i]
        nouvelleQuantite.innerHTML =
        `
        <p>Qté : ${articleModif.value}</p>
        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${articleModif.value}">
        `
    });
};

//let quantiteTotal = document.getElementById('totalQuantity');
//let prixTotal = document.getElementById('totalPrice');

