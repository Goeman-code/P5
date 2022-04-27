// move your JS files in appropriate folder

let panierArticle = JSON.parse(localStorage.getItem('article'));
let donneesProduit;
let products = []  // if you use french name, use it everywhere : produits

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
        products.push(articleId)

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
    console.log(completeQuantite)

    let tableauPrix = document.querySelectorAll('.cart__item__content__description > p.recup');
    let arrPrix = Array.from(tableauPrix);
    let totalPrix = arrPrix.map(p => p.dataset.prix);
    let totalPrixParse = totalPrix.map(x => parseInt(x));
    let valueBase = 0;
    const completePrix = totalPrixParse.reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        valueBase
    );
    console.log(completePrix)

    let quantiteTotal = document.getElementById('totalQuantity');
    quantiteTotal.innerHTML = `${completeQuantite}`
    let prixTotal = document.getElementById('totalPrice');
    prixTotal.innerHTML = `${completePrix}`
}



window.addEventListener("DOMContentLoaded", () => {
    const formNom = document.getElementById('firstName');
    let firstName = 'string'
    const formPrenom = document.getElementById('lastName');
    let lastName = 'string'
    const formAdresse = document.getElementById('address');
    let address = 'string'
    const formVille = document.getElementById('city');
    let city = 'string'
    const formEmail = document.getElementById('email');
    let email = 'string'

    const formButton = document.getElementById('order')

    let filtreNom = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*){2,15}$/
    let filtreAddresse = /^\d{1,5}\s([A-Za-zÀ-ÖØ-öø-ÿ])+(([',. -][A-Za-zÀ-ÖØ-öø-ÿ])?[A-Za-zÀ-ÖØ-öø-ÿ]*)*$/
    let filtreVille = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(([',. -][A-Za-zÀ-ÖØ-öø-ÿ]{2,15})?[A-Za-zÀ-ÖØ-öø-ÿ]*)*$/
    let filtreMail = /^([A-Za-zÀ-ÖØ-öø-ÿ\d\.-]+)@([A-Za-zÀ-ÖØ-öø-ÿ\d-]+)\.([a-zA-Z]{2,8})$/

        formButton.addEventListener('click', (e) => {
            nom = formNom.value;
            let verifNom = nom.match(filtreNom);
            if (verifNom == null) {
                document.getElementById('firstNameErrorMsg').innerHTML = `
                    Veuillez entrer votre prénom.`
            } else {
                firstName = nom
                console.log(firstName)
            }
            prenom = formPrenom.value;
            let verifPrenom = prenom.match(filtreNom);
            if (verifPrenom == null) {
                document.getElementById('lastNameErrorMsg').innerHTML = `
                    Veuillez entrer votre nom.`
            } else {
                lastName = prenom
                console.log(lastName)
            }
            addresse = formAdresse.value;
            let verifAddresse = addresse.match(filtreAddresse);
            if (verifAddresse == null) {
                document.getElementById('addressErrorMsg').innerHTML = `
                    Veuillez entrer votre addresse.`
            } else {
                address = addresse
                console.log(address)
            }
            ville = formVille.value
            let verifVille = ville.match(filtreVille)
            if (verifVille == null) {
                document.getElementById('cityErrorMsg').innerHTML = `
                Veuillez entrer le nom de votre ville.`
            } else {
                city = ville
                console.log(city)
            }
            addresseMail = formEmail.value
            let verifMail = addresseMail.match(filtreMail)
            if (verifMail == null) {
                document.getElementById('emailErrorMsg').innerHTML = `
                Veuillez entrer votre addresse mail.`
            } else {
                email = addresseMail
                console.log(email)
            }
            let contact = {
                firstName: firstName,
                lastName: lastName,
                address: address,
                city: city,
                email: email
            };
            console.log(contact)
            console.log(products)

            fetch("http://localhost:3000/api/order", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(contact, products)
            }).then(res => {
                return res.json()
            })
            .then(data => {
                console.log(data)
                infosCommande = data
                console.log(infosCommande)
                window.location.href = "./confirmation.html?id=${infosCommande.orderId}"
            })
        })
});