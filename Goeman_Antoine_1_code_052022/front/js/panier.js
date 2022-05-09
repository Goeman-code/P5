//je déclare différentes variables pour pouvoir les réuttiliser partout
let panierArticle = JSON.parse(localStorage.getItem('article'));
let donneesProduit;
let productsList = []

//Je vais récupérer mes données avec un fetch
const fetchProduits = () => {
    return new Promise((resolve, reject) => {
        fetch("http://localhost:3000/api/products")
        .then((res) => res.json())
        .then((data) => {
            donneesProduit = data;
            resolve()
        }).catch(err => reject(err))
    })
};

//Je créé ma const asynchrone pour await mon fetch.
const listeProduits = async () => {
    await fetchProduits();
    //Je créé une boucle qui va passer dans mon localstorage et faire une carte pour chaque objet récupéré
    //j'y ajoute également les id de mes objets à mon tableau pour pouvoir les envoyer plus tards et finaliser la commande
    for (let i in panierArticle) {
        let objet = panierArticle[i];
        let articleId = objet.id;
        productsList.push(articleId)

        let infosProduit = donneesProduit.find(produit => produit._id == articleId);

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
                <p class="recup" data-prix="${objetPrix}">${objetPrix}</p>
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
//aprés avoir créé toutes mes cartes, j'initialise mes addEvent listener pour chaque objet, le bouton de suppression qui va avec
//et la fonction permettant de calculer le prix total du panier et son nombre d'articles
listeProduits().then(() => {
    initChangeEventListener();
    initSuppButton();
    calculTotal();
})

//Fonction créant les addEventListener de chaque objet de la page pour les modifs quantité et prix
function initChangeEventListener() {
    const inputQuantite = document.querySelectorAll('.itemQuantity');
    //je créé une boucle dans mon noeud pour ajouter un addEventListener à chaque formulaire de modifs de quantité
    inputQuantite.forEach(input => {
        input.addEventListener('change', () => {
            let inputInfos = input.closest('.cart__item');

            //Je vais chercer dans le localstorage l'élément qui va être modififé afin de pouvoir également le mettre à jours
            let thisArticle = panierArticle.find(article => article.id === inputInfos.dataset.id && article.couleur === inputInfos.dataset.color);
            let indexPanier = panierArticle.indexOf(thisArticle)
            panierArticle.splice(indexPanier, 1);
            panierArticle.push({
                id: inputInfos.dataset.id,
                couleur: inputInfos.dataset.color,
                quantite: input.value
            });
            localStorage.setItem('article', JSON.stringify(panierArticle));

            //Je recalcule le prix avec la nouvelle quantité attribué par le client, puis modifie le prix et la quantité dans mon html
            let infosProduit = donneesProduit.find(produit => produit._id == inputInfos.dataset.id);
            objetPrix = infosProduit.price * input.value;
    
            let modifPrix = inputInfos.querySelector('.cart__item__content__description')
            modifPrix.innerHTML =
                `
                <h2>${infosProduit.name}</h2>
                <p>${inputInfos.dataset.color}</p>
                <p class="recup" data-prix="${objetPrix}">${objetPrix}</p>
                `
    
            let modifQuantite = inputInfos.querySelector('.cart__item__content__settings__quantity')
            modifQuantite.querySelector('p').innerHTML =
                `
                    Qté : ${input.value}
                    `
            //Je rappel ma fonction de calcul total du panier à chaque modification d'un objet
            calculTotal();
        });
    })

}
//Bouton de suppression d'un article
function initSuppButton() {
    const supprimer = document.querySelectorAll('.deleteItem');
    //Comme précédement, pour chaque élément de la page, je viens initialiser le bouton de suppression d'article
    supprimer.forEach(click => {
        click.addEventListener('click', () => {
            //Je viens récupérer l'élément html à supprimer au clic, ainsi que la ligne à supprimer également dans le localstorage
            let elementToDelete = click.closest('.cart__item');
            let thisArticle = panierArticle.find(article => article.id === elementToDelete.dataset.id && article.couleur === elementToDelete.dataset.color);
            let indexPanier = panierArticle.indexOf(thisArticle)
            panierArticle.splice(indexPanier, 1);
            localStorage.setItem('article', JSON.stringify(panierArticle));
            elementToDelete.parentNode.removeChild(elementToDelete);
            calculTotal();
        })
    })
}

//Fonction de calcul total de la quantité et du prix
function calculTotal () {
    //Je récupère dans le localstorage toutes  les quantitées des différents articles, puis je les transforme en nombres
    let tableauQuantite = panierArticle.map(obj => obj.quantite);
    let tableauQuantiteParse = tableauQuantite.map(x => parseInt(x));
    //Je viens ensuite les ajouter les unes aux autres avec reduce
    const completeQuantite = tableauQuantiteParse.reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        0
    );
    //Je récupère tout mes prix, j'en fait un tableau puis comme précédement je passe dans le dit tableau pour récupérer les différents prix
    //que je vais ensuite transformer en nombrees pour les additionner
    let tableauPrix = document.querySelectorAll('.cart__item__content__description > p.recup');
    let arrPrix = Array.from(tableauPrix);
    let totalPrix = arrPrix.map(p => p.dataset.prix);
    let totalPrixParse = totalPrix.map(x => Number(x));
    const completePrix = totalPrixParse.reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        0
    );
    //Je met à jours mes éléments avec les nouvelles valeurs
    let quantiteTotal = document.getElementById('totalQuantity');
    quantiteTotal.innerHTML = `${completeQuantite}`
    let prixTotal = document.getElementById('totalPrice');
    prixTotal.innerHTML = `${completePrix}`
}


//Validation du formulaire
window.addEventListener("DOMContentLoaded", () => {
    //Je met en place mes regex
    let filtreNom = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(([',. -][A-Za-zÀ-ÖØ-öø-ÿ])?[A-Za-zÀ-ÖØ-öø-ÿ]*){2,15}$/
    let filtreAddresse = /^\d{1,5}\s([A-Za-zÀ-ÖØ-öø-ÿ])+(([',. -][A-Za-zÀ-ÖØ-öø-ÿ])?[A-Za-zÀ-ÖØ-öø-ÿ]*)*$/
    let filtreVille = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(([',. -][A-Za-zÀ-ÖØ-öø-ÿ]{2,15})?[A-Za-zÀ-ÖØ-öø-ÿ]*)*$/
    let filtreMail = /^([a-zA-Z\d\.-]+)@([a-zA-Z\d-]+)\.([a-zA-Z]{2,8})$/
    //Je récupère tout mes champs de formulaires et déclare mes const pour les réutiliser par la suite
    const formNom = document.getElementById('firstName');
    let firstName = 0
    const formPrenom = document.getElementById('lastName');
    let lastName = 0
    const formAdresse = document.getElementById('address');
    let address = 0
    const formVille = document.getElementById('city');
    let city = 0
    const formEmail = document.getElementById('email');
    let email = 0


    const formButton = document.getElementById('order')
        formButton.addEventListener('click', (e) => {
            //J'empêche le bouton de me rediriger automatiquement étant un submit
            //Et je déclare une variable haserror pour pouvoir stopper la fonction en cas de problème
            e.preventDefault()
            let hasError = false
            
            //Pour chaque élément du formulaire je créer ma vérification via regex pour éviter les mauvais remplissages our l'absence d'iformations
            if (formNom.value.length < 2) {
                document.getElementById('firstNameErrorMsg').innerHTML = `
                Veuillez entrer votre prénom.`
                hasError = true
            } else if (filtreNom.test(formNom.value) === false) {
                document.getElementById('firstNameErrorMsg').innerHTML = `
                Veuillez entrer un prénom valide.`
                hasError = true
            } else {
                firstName = formNom.value
                document.getElementById('firstNameErrorMsg').innerHTML = ``
            }

            if (formPrenom.value.length < 2) {
                document.getElementById('lastNameErrorMsg').innerHTML = `
                    Veuillez entrer votre nom.`
                    hasError = true
            }
            else if (filtreNom.test(formPrenom.value) === false) {
                document.getElementById('lastNameErrorMsg').innerHTML = `
                    Veuillez entrer un nom valide.`
                    hasError = true
            } else {
                lastName = formPrenom.value
                document.getElementById('lastNameErrorMsg').innerHTML = ``
            }

            if (formAdresse.value.length < 7) {
                document.getElementById('addressErrorMsg').innerHTML = `
                    Veuillez entrer votre addresse.`
                    hasError = true
            }
            else if (filtreAddresse.test(formAdresse.value) === false) {
                document.getElementById('addressErrorMsg').innerHTML = `
                    Veuillez entrer une addresse valide.`
                    hasError = true
            } else {
                address = formAdresse.value
                document.getElementById('addressErrorMsg').innerHTML = ``
            }

            if (formVille.value.length < 1) {
                document.getElementById('cityErrorMsg').innerHTML = `
                    Veuillez entrer le nom de votre ville.`
                    hasError = true
            }
            else if (filtreVille.test(formVille.value) === false) {
                document.getElementById('cityErrorMsg').innerHTML = `
                    Veuillez entrer un nom de ville valide.`
                    hasError = true
            } else {
                city = formVille.value
                document.getElementById('cityErrorMsg').innerHTML = ``
            }

            if (formEmail.value.length < 10) {
                document.getElementById('emailErrorMsg').innerHTML = `
                    Veuillez entrer votre addresse mail.`
                    hasError = true
            }
            else if (filtreMail.test(formEmail.value) === false) {
                document.getElementById('emailErrorMsg').innerHTML = `
                    Veuillez entrer une addresse mail valide.`
                    hasError = true
            } else {
                email = formEmail.value
                document.getElementById('emailErrorMsg').innerHTML = ``
            }
            //Si un champ est mal remplis, stop la fonction
            if (hasError === true) {
                return
            }

            let request = {
                contact : {
                    firstName: firstName,
                    lastName: lastName,
                    address: address,
                    city: city,
                    email: email
                },
                products : productsList
            }
            //J'envoie ma requête avec les bonnes informations et mon objet avec le contact et le array de produits,
            //puis je redirige vers la confirmation avec l'id de commande dans l'url
            fetch("http://localhost:3000/api/products/order", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(request)
            }).then(res => {
                return res.json()
            })
            .then(data => {
                let idCommande = data.orderId
                window.location.href = `./confirmation.html?id=${idCommande}`
            })
            .catch(err => console.error(err))
        })
});