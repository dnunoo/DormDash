//this is where I assign the ids in the index html to js variables and do calculations for orders

window.menuItems = 0;

const street = document.getElementById("Dorm-Building")
const city = document.getElementById("RoomNumber")
const zipcode = document.getElementById("Campus")
const fname = document.getElementById("name")
const lastname = document.getElementById("lastname")
const phonenumber = document.getElementById("phonenumber")

const serviceItems = document.getElementsByClassName("service");
const serviceTotal = document.getElementById("price");

const orderTotal = document.getElementById("total")

async function callFeeAPI({target}) {
    if (target.className === "service" && target.checked) {
        window.menuItems += parseInt (target.value);
    } else if (target.className === "service" && !target.checked){
        window.menuItems -= parseInt (target.value);
}

 let response = await getFee()
 if( response) {
 window. responseFee = response. data. fee
 orderTotal. textContent = `$${((Number(window.menuItems) + response.data.fee)/100).toFixed(2)}`
 console.log("RESP TRUE",window.menuItems)
 } else {
    orderTotal.textContent = `$${(Number(window.menuItems)/100).toFixed(2)}`
    console.log("RESP FALSE",window.menuItems)
 }




    serviceTotal.textContent = `${(window.menuItems / 100).toFixed(0)}`;
}

for(const service of serviceItems) {
    service.addEventListener("click", callFeeAPI);
}

street.addEventListener("focusout", callFeeAPI)
city.addEventListener("focusout", callFeeAPI)
zipcode.addEventListener("focusout", callFeeAPI)
fname.addEventListener("focusout", callFeeAPI)
lastname.addEventListener("focusout", callFeeAPI)
phonenumber.addEventListener("focusout", callFeeAPI)