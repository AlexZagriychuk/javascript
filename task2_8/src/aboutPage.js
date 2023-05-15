import Cart from "./Cart.js"
import { getAllProducts } from "./api/productsApi.js";


// Cart must be initialized only after products data has been fetched
const products = await getAllProducts()
const cart = new Cart(products)