let meubleListe = fetch("http://localhost:3000/api/products")
    .then((res) => (res.json()))
    .then((promise) => {
        meubleListe = promise
        console.log(meubleListe)
        document.getElementById("items").innerHTML = meubleListe.map(
          (meuble) => 
          `
          <a href="./product.html?id=${meuble._id}">
          <article>
          <img src="${meuble.imageUrl}" alt="${meuble.name}">
          <h3 class="productName">${meuble.name}</h3>
          <p class="productDescription">${meuble.description}</p>
          </article>
          </a>
          `,
        ).join(' ');
    });

