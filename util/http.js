import axios from 'axios';
import { CURRENT_HOST } from '../environment';

const BACKEND_URL = CURRENT_HOST

export async function storeProduct(productData) {
  console.log(BACKEND_URL + '/api/products', productData)
  const response = await axios.post(BACKEND_URL + '/api/products', productData);
  const id = response.data.id;
  return id;
}

export async function fetchProducts() {
  console.log(BACKEND_URL + '/api/products')
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


export async function fetchDeliveries(planningPending, sizingPending ) {
  let url = BACKEND_URL + '/api/deliveries?status1='
  if (planningPending === true && sizingPending === true) {
    url = url + 'Pendiente de planificar&status2=Pendiente de dimensionar'
  } else if (planningPending === true && sizingPending === false) {
    url = url + 'Pendiente de planificar'
  } else if (planningPending === false && sizingPending === true) {
    url = url + 'Pendiente de dimensionar'
  }
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
      customerDni: response.data[key].customer.id.toString(),
      customerTelephone: response.data[key].customer.telephone,
      customerLongitude: parseFloat(response.data[key].customer.longitude),
      customerLatitude: parseFloat(response.data[key].customer.latitude),
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
      searchField: response.data[key].product.productName + ',' + response.data[key].product.id + ',' +response.data[key].customer.district + ',' + response.data[key].customer.province,
      checkedForPlanning: false
    }
    deliveryObj.productWeight = (deliveryObj.productWeight === 0) ? '' : deliveryObj.productWeight;
    deliveryObj.productWidth = (deliveryObj.productWidth === 0) ? '' : deliveryObj.productWidth;
    deliveryObj.productHeight = (deliveryObj.productHeight === 0) ? '' : deliveryObj.productHeight;
    deliveryObj.productLength = (deliveryObj.productLength === 0) ? '' : deliveryObj.productLength;
    deliveryObj.productFragility = (deliveryObj.productFragility === 'true') ? true : false;
    deliveryObj.productStackability = (deliveryObj.productStackability === 'true') ? true : false;
    deliveries.push(deliveryObj);
  }
  return deliveries;
}

export async function storeDelivery(deliveryData) {
  console.log(BACKEND_URL + '/api/bulk-upload')
  const deliveryDataList = []
  deliveryDataList.push(deliveryData)
  const response = await axios.post(BACKEND_URL + '/api/bulk-upload', deliveryDataList);
  const id = response.data.id;
  return id;
}

export async function fetchTrucks() {
  let url = BACKEND_URL + '/api/trucks'
  console.log(url)
  const response = await axios.get(url);
  const trucks = [];
  for(const key in response.data) {
    const truckObj = {
      key: response.data[key].icensePlate,
      licensePlate: response.data[key].licensePlate,
      truckDescription: response.data[key].description,
      width: response.data[key].width,
      length: response.data[key].length,
      height: response.data[key].height,
      maximumWeightCapacity: response.data[key].maximumWeightCapacity,
      searchField: response.data[key].truckDescription + ',' + response.data[key].licensePlate,
      checkedForPlanning: false
    }
    trucks.push(truckObj);
  }
  return trucks;
}

export async function planningAlgorithm(planningInfo) {
  let url = BACKEND_URL + '/api/planning';
  const response = await axios.post(url, planningInfo);
  return response.data;
}

export async function storeTruck(truckData) {
  console.log(BACKEND_URL + '/api/trucks', truckData)
  const response = await axios.post(BACKEND_URL + '/api/trucks', truckData);
  return response;
}