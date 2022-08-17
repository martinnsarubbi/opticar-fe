import axios from 'axios';
import { CURRENT_HOST } from '../environment';

const BACKEND_URL = CURRENT_HOST + '/api'

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

export async function fetchDeliveries() {
  const url = BACKEND_URL + '/deliveries?status1=A Entregar&status2=Falta Dimensionar'
  console.log(url)
  const response = await axios.get(url);
  const deliveries = [];
  for(const key in response.data) {
    const deliveryObj = {
      key: key,
      deliveryid: response.data[key].id,
      status: response.data[key].status,
      customerName: response.data[key].customer.name,
      customerSurname: response.data[key].customer.surname,
      customerAddress: response.data[key].customer.address,
      customerLongitude: response.data[key].customer.longitude,
      customerLatitude: response.data[key].customer.latitude,
      customerDistrict: response.data[key].customer.district,
      customerProvince: response.data[key].customer.province,
      productName: response.data[key].product.productName,
      productCategory: response.data[key].product.category,
      productId: response.data[key].product.id,
      productWeight: response.data[key].product.weight,
      productWidth: response.data[key].product.width,
      productHeight: response.data[key].product.height,
      productLength: response.data[key].product.length,
      productStackability: response.data[key].product.stackability,
      productFragility: response.data[key].product.fragility,
      searchField: response.data[key].product.productName + ',' +response.data[key].customer.district + ',' + response.data[key].customer.province
    }
    deliveries.push(deliveryObj);
  }
  return deliveries;
}