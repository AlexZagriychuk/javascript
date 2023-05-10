import { getAllProducts } from "./api/productsApi.js";
import Product from "./Product.js";


const products = await getAllProducts()
// Leave the current folder "pages" to correctly generate the full path to imageURL  
products.forEach(product => product.imageURL = "../" + product.imageURL)

const productsListElem = document.querySelector(".products-cards") 

products.forEach(product => {
    Product.render(product, productsListElem) 
})