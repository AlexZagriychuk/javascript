const productsData = [
    {
        "id": 1,
        "name": "Morabo Sofa",
        "brand": "Ikea",
        "price": "699.00",
        "imageURL": "resources/ikea-01-morabo.avif",
        "isFeatured": true
    },
    {
        "id": 2,
        "name": "Malm Bed",
        "brand": "Ikea",
        "price": "349.00",
        "imageURL": "resources/ikea-02-malm-bed.avif",
        "isFeatured": true
    },
    {
        "id": 3,
        "name": "Kallax Shelf Unit",
        "brand": "Ikea",
        "price": "129.00",
        "imageURL": "resources/ikea-03-kallax-shelf-unit.avif",
        "isFeatured": true
    },
    {
        "id": 4,
        "name": "Morabo Sofa 2",
        "brand": "Ikea2",
        "price": "799.00",
        "imageURL": "resources/ikea-01-morabo.avif",
        "isFeatured": false
    },
    {
        "id": 5,
        "name": "Malm Bed 2",
        "brand": "Ikea2",
        "price": "449.00",
        "imageURL": "resources/ikea-02-malm-bed.avif",
        "isFeatured": false
    },
    {
        "id": 6,
        "name": "Kallax Shelf Unit 3",
        "brand": "Ikea3",
        "price": "229.00",
        "imageURL": "resources/ikea-03-kallax-shelf-unit.avif",
        "isFeatured": false
    }
]


export async function getAllProducts() {
    // Returning data from this file instead of real API (keep the function async only because if we were fetching data from API it would be async)
    return productsData;
} 