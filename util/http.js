import axios from 'axios';

const BACKEND_URL = 'http://192.168.0.10:8080'

export async function storeProduct(productData) {
  console.log(productData)
  const response = await axios.post(BACKEND_URL + '/api/products', productData);
  console.log("Pero a q costo.............")
  const id = response.data.id;
  return id;
}

export async function fetchProducts() {
  const response = await axios.get(BACKEND_URL + '/api/products');
  const products = [];
  for(const id in response.data) {
    const productObj = {
      id: id,
      productName: response.data[id].productName
    };
    products.push(productObj);
  }
  return products;
}