const inputEl = document.querySelector('#id-input');
console.log(inputEl);
const containerEl = document.querySelector('.list__add');
console.log(containerEl)

inputEl.addEventListener('keydown', onInputEnter);
const BASE_URL = 'http://localhost:3000';
let getData = null;

function onInputEnter(e) {
    getData = inputEl.value;
    if (getData.length >= 3) {
        alert('not more then 2 numbers');
        inputEl.value = '';
        
    }
    if (e.key === "Enter") {
        getHomeApi(getData)
            .then(item => {
                createElement(item);
                inputEl.value = '';
                
            })
        clearDom();
    }
    
}

clearDom();


//------GET

function getHomeApi(id) {
    
    
    return fetch(`${BASE_URL}/todo/${id}`)
        .then(r => r.json())
        
}

//----POST

function createObject(newBoject) {
    const option = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBoject)
    }

    return fetch(`${BASE_URL}/todo`, option)
    .then(r => r.json())
}

// createObject({
//     value: "create",
//     state: "ready",
// }).then(r => console.log(r));

function createElement(item) {
    const elementList =  `
        <li class="list__item">
        <p class="value">${item.value}</p>
        <p class="pending">${item.state}</p>
        </li>
    `
    containerEl.insertAdjacentHTML('beforeend', elementList);
    console.log(elementList);
}

function clearDom() {
containerEl.innerHTML = ''
}
