const produit = window.location.href
var url = new URL(produit);
var id = url.searchParams.get("id")

window.addEventListener("DOMContentLoaded", () => {
    let texteId = document.getElementById('orderId')
    texteId.innerHTML = `${id}`
})

