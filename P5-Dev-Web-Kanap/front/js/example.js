boutonAjout.addEventListener('click', () => {
    let panierArticle = JSON.parse(localStorage.getItem('article')) ?? [];
    let couleurArticle = parseInt(document.getElementById('colors').value);
    let nombreArticle = parseInt(document.getElementById('quantity').value);
    let articleInfos = { // Remove the let here
        id: id,
        couleur: couleurArticle,
        quantite: nombreArticle
    };


    for (let i in panierArticle) {
        let objet = panierArticle[i];
        if ((id === objet.id) && (couleurArticle === objet.couleur)) {
            articleInfos = { // Remove the let here
                id: id,
                couleur: couleurArticle,
                quantite: nombreArticle + panierArticle[i].quantite
            };
            panierArticle.splice(i, 1); // or delete panierArticle[i];
        }
    }


    listeArticles.push(articleInfos);
    localStorage.setItem('article', JSON.stringify(listeArticles));
});