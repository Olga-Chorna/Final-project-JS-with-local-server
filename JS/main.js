
// import { RequestManager } from "./modules/request";

const ordersUrl = 'http://localhost:3000/powerbanks';



class RequestManager {
  async reseiveResponse(url) {
    const response = await fetch(url);
    return await response.json();
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
    this.uSB_A = data.usb_a;
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
    // let allPrices = this.price_compare.map((store) => Number(store.price));
    let allPrices = this.price_compare.map((store) => store.price);
    allPrices.sort((a,b) => a-b);
    return this.maxPrice = allPrices[allPrices.length -1];
  }
}


class AllProducts{
  constructor(data){
    this.products = data.map((product) => {
      let productClassCall = new Product(product);
      productClassCall.calculateMinPrice();
      productClassCall.calculateMaxPrice();
      return productClassCall;
    });
  }
  getAllproducts() {
    return this.products;
  }
}

class RenderProductCard{
 rendererProduct(data, where, how='beforeend'){
  where.insertAdjacentHTML(how, `
    <div class="card mb-3" style="max-width: 75vw;" data-idNumber=${data.id}>
    <div class="row g-0">
      <div class="col-md-4" style="position: relative;">
        <button class="to-favorite icon-style">
          <i class="icon-heart"></i>
        </button>
        <img src="${data.url}" class="img-fluid rounded-start p-3" style="width: 50%;" alt="...">
        <div class="form-check text-center">
          <input class="form-check-input" type="checkbox" value="toCompare" name="toCompare" id="">
          <label class="form-check-label" for="toCompare">Додати до порівняння</label>
        </div>
      </div>
      <div class="col-md-8">
      <div class="row">
        <div class="col-md-8 border-end">
          <div class="card-body">
            <a href="product.html?product-id=${data.id}" target="__blank"" class="card-title h5">${data.title}</a>
            <p class="card-text"><span class="text-secondary fw-bolder">Ємність батареї: </span><span> ${data.battery_capacity}, ${data.battery_type}</span></p>
            <p class="card-text"><span class="text-secondary fw-bolder">Вхід: </span><span>${data.pB_charging_enter}</span></p>
            <p class="card-text"><span class="text-secondary fw-bolder">Корпус: </span>${data.body_material}<span></span></p>
            <p class="card-text"><span class="text-secondary fw-bolder">Вага: </span>${data.weight }<span></span></p>
            <div>
              <a class="btn btn-outline-secondary" href="#" role="button">${data.battery_capacity}</a>
            </div>
          </div>
        </div>
        <div class="col-md-4 p-3">
          <h5 class="text-center text-warning">Bід<span class="text-primary">${data.minPrice} грн</span> до <span class="text-primary">${data.maxPrice} грн</span></h4>
          <ul id="storesForproduct${data.id}" class="storesAndPrices p-4">
          </ul>
        </div>
      </div>
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

class AllChildREmover {
  static removeAllChildOfElem(elem) {
    while(elem.firstChild) {
      elem.removeChild(elem.firstChild);
    }
  }
}

class FavoriteCounter{
  static renderNumber(){
    let span = document.getElementById('favorite-counter');
    let number = 0;
    for(let i=0; i<localStorage.length; i++) {
      if(localStorage.key(i).includes('favorite')){
        number++
      };
    }
    return span.innerText = `(${number})`;
  }
}

class ToCompareCounter{
  static renderNumber(){
    let span = document.getElementById('toCompare-counter');
    let number = 0;
    for(let i=0; i<localStorage.length; i++) {
      if(localStorage.key(i).includes('toCompare')){
        number++
      };
    }
    return span.innerText = `(${number})`;
  }
}

class CheckedCheckboxReader{
  read(where, id){
    let checkList = document.querySelectorAll(`div#${id} input[type="checkbox"]:checked`);
    if (checkList.length > 0){
      let filterList = [];
      checkList.forEach((checkbox) => filterList.push(checkbox.value));
      console.log(filterList);
      return where[`${id}`] = filterList;
    }
  }
}

class FilterManager{
  manufacturerFilter(data, list, category) {
    console.log('список моделей PB', list);
    console.log('список категорій', category);  
    const filteredData = data.filter((pb) => list.includes(pb[category].toLowerCase()));
    return filteredData;
  }

  filterByCategory(data, filterList, filterKeys){
    const newData = [];
    console.log('отримае ФМ', filterList );
    console.log('отримае ФМ ключі', filterKeys );

    // ['battery_capacity', 'USB_A', 'USB_type_C', 'powerbank_charging_enter', 'adapters', 'additional_features']

    filterKeys.forEach((filterKey) => {
      switch(filterKey) {
        case 'manufacturer':
          const prevData = [...newData]
          const dataToADD = this.manufacturerFilter(data, filterList.manufacturer, 'manufacturer');
          dataToADD.forEach((pb) => {
            if (!prevData.includes(pb)){
              newData.push(pb);
            }
          })
        break;

        case 'USB_A':
          const preData = [...newData]
          const datToADD = this.manufacturerFilter(data, filterList.USB_A, 'uSB_A');
          dataToADD.forEach((pb) => {
            if (!prevData.includes(pb)){
              newData.push(pb);
            }
          })
            break;
        // case 'manufacturer':
        // break;

        // case 'manufacturer':
        //   break;

        //   case 'manufacturer':
        //     break;
        
      }    
    });

    
    // data.forEach((pb) => {
    //   if(filterList.manufacturer.includes(pb.manufacturer.toLowerCase())){
    //     newData.push(pb);
    //   };
    //   console.log(filterList.battery_capacity);
    //   console.log(pb.battery_capacity.toLowerCase())
    //   // console.log(pb[battery_capacity].toLowerCase());
    //   // if(filterList[battery_capacity].includes(pb[battery_capacity].toLowerCase())){
    //   //   newData.push(pb);
    //   // };
    //   // if(filterList.USB_A.includes(pb.USB_A.toLowerCase())){
    //   //   newData.push(pb);
    //   // };
    //   // if(filterList.USB_type_C.includes(pb.USB_type_C.toLowerCase())){
    //   //   newData.push(pb);
    //   // };
    //   // pb.powerbank_charging_enter.forEach((enter) => {
    //   //   if(filterList.powerbank_charging_enter.includes(enter.toLowerCase())){
    //   //     newData.push(pb);
    //   //   };
    //   // })
    //   // if(filterList.adapters.includes(pb.adapters.toLowerCase())){
    //   //   newData.push(pb);
    //   // };
    //   // if(filterList.additional_features.includes(pb.additional_features.toLowerCase())){
    //   //   newData.push(pb);
    //   // };
    // });

    return newData;
    
    // let filteredDataTOWOrk = data.filter((pb) => {
    //   if(filterList.manufacturer.includes(pb.manufacturer.toLowerCase())){
    //     alert(`Пауербанк ${pb.title} знайдено`);
    //     return true;
    //   }
    // });
    // return filteredDataTOWOrk;
  }
}

document.addEventListener('DOMContentLoaded', async(e) =>{
  let request = new RequestManager();
  let data = await request.reseiveResponse(ordersUrl);
  console.log(data);
  let dataToWork = new AllProducts(data).getAllproducts();
  console.log(dataToWork);
  let div = document.getElementById('cards-container');
  let compareLink = document.getElementById('compare');


  let renderCall = dataToWork.forEach((item) => new RenderProductCard().rendererProduct(item, div));
  let renderCall2 = dataToWork.forEach((item) => new RenderProductCard().rendererStoresAndPrices(item.price_compare, item.id));


  let cardsContainer = document.getElementById('cards-container');
  cardsContainer.addEventListener('click', (e) => {
    if (e.target.matches('i.icon-heart')){
    e.target.closest('i.icon-heart').style.color = 'orange';
    let div = e.target.closest('div.card');
    console.log(div);
    let key = div.dataset.idnumber;
    console.log(key);
    const dataForStorage = dataToWork.filter((product) => product.id === key);
    console.log(dataForStorage);
    localStorage.setItem((key+'favorite'), JSON.stringify(dataForStorage[0]));
    FavoriteCounter.renderNumber();
    }
  })

  cardsContainer.addEventListener('change', (e) =>{
    if(e.target.matches('input[type="checkbox"]:checked')) {
      let div = e.target.closest('div.card');
      console.log(div);
      let key = div.dataset.idnumber;
      console.log(key);
      const dataForStorage = dataToWork.filter((product) => product.id === key);
      console.log(dataForStorage);
      localStorage.setItem((key+'toCompare'), JSON.stringify(dataForStorage[0]));
      ToCompareCounter.renderNumber();
    } else if(e.target.matches('input[type="checkbox"]')) {
      let div = e.target.closest('div.card');
      console.log(div);
      let key = div.dataset.idnumber;
      console.log(key);
      localStorage.removeItem(key+'toCompare');
      ToCompareCounter.renderNumber();
    };
  })

  let select = document.getElementById('select');
  select.addEventListener('change', (e) => {
    let value = select.value;
    console.log(value);
    switch(value){
      case 'minToMax':
        AllChildREmover.removeAllChildOfElem(div);
        let sortedDataMinMax = dataToWork.sort((a,b) => {
          const priceA = Number(a.minPrice);
          const priceB = Number(b.minPrice);
          if (priceA  < priceB) {
            return -1;
          } else if (priceA > priceB) {
            return 1;
          } else {
            return 0;
          }
        });
        renderCall = sortedDataMinMax.forEach((item) => new RenderProductCard().rendererProduct(item, div));
        renderCall2 = sortedDataMinMax.forEach((item) => new RenderProductCard().rendererStoresAndPrices(item.price_compare, item.id));
      break;
      case 'maxToMin':
        AllChildREmover.removeAllChildOfElem(div);
          let sortedDataMaxMin = dataToWork.sort((a,b) => {
          const priceA = Number(a.maxPrice);
          const priceB = Number(b.maxPrice);
          if (priceA  < priceB) {
            return 1;
          } else if (priceA  > priceB) {
            return -1;
          } else {
            return 0;
          }
        });
        renderCall = sortedDataMaxMin.forEach((item) => new RenderProductCard().rendererProduct(item, div));
        renderCall2 = sortedDataMaxMin.forEach((item) => new RenderProductCard().rendererStoresAndPrices(item.price_compare, item.id));
       break;
      case 'byName':
        AllChildREmover.removeAllChildOfElem(div);
          let sortedData = dataToWork.sort((a,b) => {
          const titleA = a.title.toLowerCase();
          const titleB = b.title.toLowerCase();
          if (titleA < titleB) {
            return -1;
          } else if (titleA > titleB) {
            return 1;
          } else {
            return 0;
          }
        });
        renderCall = sortedData.forEach((item) => new RenderProductCard().rendererProduct(item, div));
        renderCall2 = sortedData.forEach((item) => new RenderProductCard().rendererStoresAndPrices(item.price_compare, item.id));
      break;
    }
  })

  document.forms.filter_form.addEventListener('submit', (e) => {
    e.preventDefault();
    const filterList ={}
    const inputFieldList = document.querySelectorAll('div.input-group');
    const dataAtr = [];
    inputFieldList.forEach((div) => dataAtr.push(div.dataset.filter));
    console.log(dataAtr);
    dataAtr.forEach((atr) => new CheckedCheckboxReader().read(filterList, atr));
    console.log(filterList);
    const filterKeys = Object.keys(filterList);
    console.log(filterKeys);
    if (filterKeys.length > 0){
      debugger;
      let filteredDataTOWOrk = new FilterManager().filterByCategory(dataToWork, filterList, filterKeys);
      // filterKeys.forEach((key) => {
      //   filteredDataTOWOrk = dataToWork.filter((pb) => {
      //     if(filterList[key].includes(pb[key].toLowerCase())){
      //       alert(`Пауербанк ${pb.title} знайдено`);
      //       return true;
      //     }
      //   })
      // })
      // const filteredDataTOWOrk = dataToWork.filter((pb) => {
      //   filterKeys.forEach((key) => {
      //     if (key === "manufacturer") {
      //       if (filterList.manufacturer.includes(pb.manufacturer.toLowerCase())){
      //         alert(`Пауербанк ${pb.title} знайдено`)
      //         return true;// Що саме необхідно повернути, щоб спрацював array.filter?
      //       }
      //     } else if (key === "battery_capacity"){
      //       if (filterList.manufacturer.includes(pb.manufacturer.toLowerCase())){
      //         alert(`Пауербанк ${pb.title} знайдено`)
      //         return true;// Що саме необхідно повернути, щоб спрацював array.filter?
      //       }
      //     }
      //   })
      // })
      console.log(filteredDataTOWOrk);
      let div = document.getElementById('cards-container');
      AllChildREmover.removeAllChildOfElem(div);
      let renderCall = filteredDataTOWOrk.forEach((item) => new RenderProductCard().rendererProduct(item, div));
    }
  });
})