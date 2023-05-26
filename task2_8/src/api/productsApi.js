const productsData = [
    {
        "id": 1,
        "name": "Morabo Sofa",
        "brand": "Ikea",
        "price": "699.33",
        "imageURL": "./resources/ikea-01-morabo.avif",
        "isFeatured": true
    },
    {
        "id": 2,
        "name": "Malm Bed",
        "brand": "Ikea",
        "price": "349.00",
        "imageURL": "./resources/ikea-02-malm-bed.avif",
        "isFeatured": false
    },
    {
        "id": 3,
        "name": "Kallax Shelf Unit",
        "brand": "Ikea",
        "price": "129.00",
        "imageURL": "./resources/ikea-03-kallax-shelf-unit.avif",
        "isFeatured": false
    },
    {
        "id": 4,
        "name": "Desky Single Sit Stand Desk",
        "brand": "Desky",
        "price": "579.00",
        "imageURL": "./resources/Desky-01-Single Sit Stand Desk.webp",
        "isFeatured": false
    },
    {
        "id": 5,
        "name": "Desky Pro Ergonomic Chair",
        "brand": "Desky",
        "price": "599.00",
        "imageURL": "./resources/Desky-02-Pro Ergonomic Chair.webp",
        "isFeatured": false
    },
    {
        "id": 6,
        "name": "Zamora Arch Metal Wall Mirror",
        "brand": "Greyleigh",
        "price": "299.99",
        "imageURL": "./resources/Greyleigh-01-Zamora+Arch+Metal+Wall+Mirror.webp",
        "isFeatured": false
    },
    {
        "id": 7,
        "name": "Americus Upholstered Bed",
        "brand": "Greyleigh",
        "price": "679.99",
        "imageURL": "./resources/Greyleigh-02-Americus+Upholstered+Bed.webp",
        "isFeatured": true
    },
    {
        "id": 8,
        "name": "Cottage 6-Piece Dining Set - Grey",
        "brand": "Leons",
        "price": "1199.00",
        "imageURL": "./resources/leons-01-Cottage 6-Piece Dining Set.webp",
        "isFeatured": false
    },
    {
        "id": 9,
        "name": "Atomic Coffee Table - Brown Cherry",
        "brand": "Leons",
        "price": "379.00",
        "imageURL": "./resources/leons-02-Atomic Coffee Table - Brown Cherry.webp",
        "isFeatured": true
    },
    {
        "id": 10,
        "name": "Dallas Glider Recliner",
        "brand": "Leons",
        "price": "899.00",
        "imageURL": "./resources/leons-03-Dallas Glider Recliner.webp",
        "isFeatured": false
    }
]


export async function getAllProducts() {
    // Returning data from this file instead of real API (keep the function async only because if we were fetching data from API it would be async)
    return productsData;
} 