class ClearTable{
  static clearBody(fromWhere){
    fromWhere.innerHTML = "";
  }
}

class RenderELements{
  constructor(tableBody){
    this.tableBody=tableBody;
  }
  renderTableHeadings(how="afterbegin"){
    this.tableBody.insertAdjacentHTML(how, `
    <tr id="title" >
    <th class="table-warning">Powerbank:</th>
    </tr>
    <tr id="url" >
      <th class="table-warning">Зображення:</th>
    </tr>
    <tr id="minPrice" >
      <th class="table-warning">Мінімальна ціна, грн</th>
    </tr>
    <tr id="color" >
      <th class="table-warning">Колір:</th>
    </tr>
    <tr id="battery_capacity" >
      <th class="table-warning">Ємність батареї:</th>
    </tr>
    <tr id="battery_type" >
      <th class="table-warning">Тип батареї:</th>
    </tr>
    <tr  id="pB_charging_enter" >
      <th class="table-warning">Входи зарядки powerbank'a:</th>
    </tr>
    <tr id="uSB_A" >
      <th class="table-warning">Портів USB А для зарядки:</th>
    </tr>
    <tr id="uSB_type_C" >
      <th class="table-warning">Портів USB type C для зарядки:</th>
    </tr>
    <tr id="eTEnd_charging" >
      <th class="table-warning">Наскрізна зарядка:</th>
    </tr>
    <tr id="fast_charging" >
      <th class="table-warning"> Швидка зарядка:</th>
    </tr>
    <tr id="adapters" >
      <th class="table-warning">Адаптери в комплекті:</th>
    </tr>
    <tr id="additional_features">
      <th class="table-warning">Додаткові функції:</th>
    </tr>
    <tr id="body_material">
      <th class="table-warning">Матеріал корпусу:</th>
    </tr>
    <tr id="weight" >
      <th class="table-warning">Вага, г:</th>
    </tr>
    `)
  }

  renderImage(arr){
    let tr = document.getElementById('url');
    arr.forEach((pb) => {
      let td = document.createElement('td');
      td.insertAdjacentHTML("afterbegin", `
      <div class="container-fluid" style="position: relative;">
      <button class="to-favorite icon-style">
        <i class="icon-heart"></i>
      </button>
      <img src="${pb.url}" class="img-fluid rounded-start p-3" style="width: 50%;" alt="...">
      </div>
      `)
      tr.insertAdjacentElement('beforeend', td);
    });
  }

  renderTableData(array, how="beforeend"){
    let rows = document.querySelectorAll('tr');
    for (let row of rows){
      for(let pb of array){
        let keys = Object.keys(pb);
        for (let key of keys){
            if ((key === row.id) && (key !== 'url')){
              if((typeof pb[key]) === 'string' || (typeof pb[key]) === 'number'){
                let td = document.createElement('td');
                td.innerText = pb[key];
                row.insertAdjacentElement(how, td);
              } else if ((typeof pb[key]) === 'object'){
                let td = document.createElement('td');
                  td.innerText = pb[key].join(',');
                  row.insertAdjacentElement(how, td);
              }
            }
        }
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', (e) => {
  let keySelector = new URL(window.location).searchParams.get('keySelector');
  console.log(keySelector);
  let data = [];
  for(let i = 0; i < localStorage.length; i++){
    let key = localStorage.key(i);
    if (key.includes(keySelector)){
      data.push(JSON.parse(localStorage.getItem(key)));
    };
  };
  console.log(data);

  let tableBody = document.querySelector('table#compare-table tbody');
  let renderClassCall = new RenderELements(tableBody);
  renderClassCall.renderTableHeadings();
  debugger;
  renderClassCall.renderTableData(data);
  renderClassCall.renderImage(data);
});