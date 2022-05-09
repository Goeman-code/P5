const produit = window.location.href
//Je récupère mon url et l'id de la commande quej e passe dans mon html
var url = new URL(produit);
var id = url.searchParams.get("id")

window.addEventListener("DOMContentLoaded", () => {
    let texteId = document.getElementById('orderId')
    texteId.innerHTML = `${id}`
})

