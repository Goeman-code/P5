// move your JS files in appropriate folder

let panierArticle = JSON.parse(localStorage.getItem('article'));
let donneesProduit;
let productsList = []  // if you use french name, use it everywhere : produits

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

//const getProducts = async () => {
//    return await fetch("http://localhost:3000/api/products").then(res => res.json())
//}


const listeProduits = async () => {
    await fetchProduits();
    for (let i in panierArticle) {
        let objet = panierArticle[i];
        let articleId = objet.id;
        productsList.push(articleId)

        let infosProduit = donneesProduit.find(produit => produit._id == articleId); // avoid using simple comparaison. Always use strict comparaison for more consistent

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
listeProduits().then(() => {
    initChangeEventListener();
}).then(() => {
    initSuppButton()
}).then(() => {
    calculTotal();
})


function initChangeEventListener() {
    const inputQuantite = document.querySelectorAll('.itemQuantity');
    inputQuantite.forEach(input => {
        input.addEventListener('change', () => {
            let inputInfos = input.closest('.cart__item');
            console.log(inputInfos.dataset.id)
            console.log(inputInfos.dataset.color)

            let thisArticle = panierArticle.find(article => article.id == inputInfos.dataset.id && article.couleur == inputInfos.dataset.color);
            let indexPanier = panierArticle.indexOf(thisArticle)
            console.log(indexPanier)
            panierArticle.splice(indexPanier, 1);
            panierArticle.push({
                id: inputInfos.dataset.id,
                couleur: inputInfos.dataset.color,
                quantite: input.value
            });
            localStorage.setItem('article', JSON.stringify(panierArticle));

            let infosProduit = donneesProduit.find(produit => produit._id == inputInfos.dataset.id);
            console.log(infosProduit)
            objetPrix = infosProduit.price * input.value;
            console.log(objetPrix)
    
            let modifPrix = inputInfos.querySelector('.cart__item__content__description')
            console.log(modifPrix)
            modifPrix.innerHTML =
                `
                <h2>${infosProduit.name}</h2>
                <p>${inputInfos.dataset.color}</p>
                <p class="recup" data-prix="${objetPrix}">${objetPrix}</p>
                `
    
            let modifQuantite = inputInfos.querySelector('.cart__item__content__settings__quantity')
            console.log(modifQuantite)
            modifQuantite.querySelector('p').innerHTML =
                `
                    Qté : ${input.value}
                    `
            calculTotal();
        });
    })

}

function initSuppButton() {
    const supprimer = document.querySelectorAll('.deleteItem');
    supprimer.forEach(click => {
        click.addEventListener('click', () => {
            let elementToDelete = click.closest('.cart__item');
            let thisArticle = panierArticle.find(article => article.id == elementToDelete.dataset.id && article.couleur == elementToDelete.dataset.color);
            let indexPanier = panierArticle.indexOf(thisArticle)
            console.log(indexPanier)
            panierArticle.splice(indexPanier, 1);
            localStorage.setItem('article', JSON.stringify(panierArticle));
            elementToDelete.parentNode.removeChild(elementToDelete);
            calculTotal();
        })
    })
}


function calculTotal () {
    let tableauQuantite = panierArticle.map(obj => obj.quantite);
    let tableauQuantiteParse = tableauQuantite.map(x => parseInt(x));
    let baseValue = 0;
    const completeQuantite = tableauQuantiteParse.reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        baseValue
    );

    let tableauPrix = document.querySelectorAll('.cart__item__content__description > p.recup');
    let arrPrix = Array.from(tableauPrix);
    let totalPrix = arrPrix.map(p => p.dataset.prix);
    let totalPrixParse = totalPrix.map(x => parseInt(x));
    let valueBase = 0;
    const completePrix = totalPrixParse.reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        valueBase
    );

    let quantiteTotal = document.getElementById('totalQuantity');
    quantiteTotal.innerHTML = `${completeQuantite}`
    let prixTotal = document.getElementById('totalPrice');
    prixTotal.innerHTML = `${completePrix}`
}



window.addEventListener("DOMContentLoaded", () => {
    let filtreNom = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(([',. -][A-Za-zÀ-ÖØ-öø-ÿ])?[A-Za-zÀ-ÖØ-öø-ÿ]*){2,15}$/
    let filtreAddresse = /^\d{1,5}\s([A-Za-zÀ-ÖØ-öø-ÿ])+(([',. -][A-Za-zÀ-ÖØ-öø-ÿ])?[A-Za-zÀ-ÖØ-öø-ÿ]*)*$/
    let filtreVille = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(([',. -][A-Za-zÀ-ÖØ-öø-ÿ]{2,15})?[A-Za-zÀ-ÖØ-öø-ÿ]*)*$/
    let filtreMail = /^([a-zA-Z\d\.-]+)@([a-zA-Z\d-]+)\.([a-zA-Z]{2,8})$/
    
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
            e.preventDefault
            let hasError = false
            
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

            if (hasError === true) {
                console.log(hasError);
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
                console.log(idCommande)
                window.location.href = `./confirmation.html?id=${idCommande}`
            })
            .catch(err => console.log(err))
        })
});