// import { RequestManager } from "./modules/request";

const ordersUrl = 'http://localhost:3000/powerbanks';

class RequestManagerById {
  async reseiveResponse(url, id) {
    const response = await fetch(url);
    const data = await response.json();
    const dataFiltered = data.filter((product) => (product.id === id));
    return dataFiltered[0];
  }
}

class StoresAndPrices {
  constructor(source,price) {
    this.source = source;
    this.price = price;
  }
}

class Product { 
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.url = data.url;
    this.price_compare = data.price_compare.map(
      (store) => new StoresAndPrices(store.source, store.price)
    );
    this.color = data.color;
    this.manufacturer = data.manufacturer;
    this.descr = data.descr;
    this.battery_capacity = data.battery_capacity;
    this.battery_type = data.battery_type;
    this.pB_charging_enter = data.powerbank_charging_enter;
    this.uSB_type_C = data.USB_type_C;
    this.uSB_A = data.USB_A;
    this.eTEnd_charging = data.end_to_end_charging;
    this.fast_charging = data.fast_charging;
    this.adapters = data.adapters;
    this.additional_features = data.additional_features;
    this.body_material = data.body_material;
    this.weight = data.weight;
    this.minPrice = ''; 
    this.maxPrice = '';
  }

  calculateMinPrice(){
    let allPrices = this.price_compare.map((store) => Number(store.price));
    allPrices.sort((a,b) => a-b);
    return this.minPrice = allPrices[0];
  }

  calculateMaxPrice(){
    let allPrices = this.price_compare.map((store) => Number(store.price));
    allPrices.sort((a,b) => a-b);
    return this.maxPrice = allPrices[allPrices.length -1];
  }

}

class RenderProductCard{
  rendererProduct(data, where, how='beforeend'){
   where.insertAdjacentHTML(how, `
   <div class="card mb-3 " style="max-width: 80vw;">
     <div class="row g-0">
       <div class="col-md-4">
         <img src="${data.url}" class="img-fluid rounded-start m-2" alt="...">
       </div>
       <div class="col-md-8 px-5">
         <div class="card-body ">
           <h5 class="card-title  text-center text-bg-warning p-3">${data.title}</h5>
           <h4 class="text-center text-warning">Bід <span clasa="text-primary">${data.minPrice} грн</span> до <span>${data.maxPrice} грн</span></h4>
           <ul id="storesForproduct${data.id}"></ul>
           <p class="card-text"><strong>Колір:</strong> ${data.color.join(',')}</p>
           <p class="card-text"><strong>Виробник:</strong> ${data.battery_capacity}</p>
           <p class="card-text"><strong>Ємність батареї:</strong> ${data.manufacturer}</p>
           <p class="card-text"><strong>Тип акумуляторів:</strong> ${data.battery_type}</p>
           <p class="card-text"><strong>Входи зарядки powerbank'a:</strong> ${data.pB_charging_enter.join(',')}</p>
           <p class="card-text"><strong>USB type C:</strong> ${data.uSB_type_C} шт</p>
           <p class="card-text"><strong>USB A:</strong> ${data.uSB_A} шт</p>
           <p class="card-text"><strong>Наскрізна зарядка:</strong> ${data.eTEnd_charging}</p>
           <p class="card-text"><strong>Швидка зарядка:</strong> ${data.fast_charging.join(',')}</p>
           <p class="card-text"><strong>Комплектні дроти (адаптери):</strong> ${data.adapters}</p>
           <p class="card-text"><strong>Функції:</strong> ${data.additional_features}</p>
           <p class="card-text"><strong>Матеріал корпуса:</strong> ${data.body_material}</p>
           <p class="card-text"><strong>Вага:</strong> ${data.weight} г</p>
         </div>
       </div>
     </div>
     <div class="row g-0">
       <div class="col-12">
         <p class="p-3">${data.descr}</p>
       </div>
     </div>
   </div>
   `);
  }
 
  rendererStoresAndPrices(data, id, how='beforeend'){
   let ul = document.getElementById(`storesForproduct${id}`);
   let liRender = data.forEach((store) => {
     ul.insertAdjacentHTML(how, `
     <li class="d-flex justify-content-between"><span class="text-info">${store.source}</span><span class="text-warning">${store.price} грн</span></li>
     `)
   });
  }
 }

document.addEventListener('DOMContentLoaded', async (e) => {
  const productId = new URL(window.location).searchParams.get('product-id');
  console.log(productId);
  let request = new RequestManagerById();
  debugger;
  let response = await request.reseiveResponse(ordersUrl, productId);
  console.log(response);
  let powerbank = new Product(response);
  powerbank.calculateMinPrice();
  powerbank.calculateMaxPrice();
  console.log(powerbank);
  let div = document.getElementById('card-info');
  let renderCardCall = new RenderProductCard().rendererProduct(powerbank,div);
  let renderStoresCall = new RenderProductCard().rendererStoresAndPrices(powerbank, productId);
});