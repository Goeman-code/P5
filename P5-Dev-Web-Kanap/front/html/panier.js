let panierArticle = JSON.parse(localStorage.getItem('article'));

for (let i in panierArticle) {
    let objet = panierArticle[i];
    console.log(objet)
    let articleId = objet.id;
    
    let donneesProduit = fetch(`http://localhost:3000/api/products/${articleId}`)
    .then((res) => (res.json()))
    .then((promise) => {
        donneesProduit = promise
        let listeArticles = document.getElementById('cart__items');
        let article = document.createElement('article');
        let objetPrix = donneesProduit.price * objet.quantite;

        article.innerHTML = 
        `
        <article class="cart__item" data-id="${donneesProduit._id}" data-color="${objet.couleur}">
            <div class="cart__item__img">
                <img src="${donneesProduit.imageUrl}" alt="${donneesProduit.altTxt}">
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__description">
                <h2>${donneesProduit.name}</h2>
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

        let inputQuantite = document.getElementsByClassName('itemQuantity');
        let articleModif = inputQuantite[i];
        console.log(articleModif)

        articleModif.addEventListener('change', () => {
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

        });
};