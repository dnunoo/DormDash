function getFormValues() {
    const inputContainer = document.getElementById("order-details")
    const fieldList = inputContainer.querySelectorAll("input")
    const fieldArray = Array.from(fieldList)

    const payload = fieldArray.reduce(
        (obj,field) => {
            if(field.name=="items") {
                if (field.checked) {
                    obj["order_value"] += parseInt(field.value)
                }
            } else {
                obj[field.name] = field.value

            }
            return obj
        }, {order_value: 0}
    )
    return payload
}

async function getFee() {
    const payload = getFormValues()
    const finalPayload = JSON.stringify(payload);

    const formInput = document.querySelector("form");
    
    if (formInput.checkValidity()) {
        const response = await fetch("/get-delivery-rate", {
            method: "POST",
            body: finalPayload,
            headers:{"Content-Type" : "application/json"},
        }).then ((response) => {
            let resp = response.json();
            return resp;
        }).catch ((rejected) => {
            console.log (rejected);
        })

        const deliveryFee = document.getElementById("fee");
        const serviceTotal = document.getElementById("price");
        const orderTotal = document.getElementById("total");

        serviceTotal.textContent = `$${(window.menuItems / 100).toFixed(2)}`;
        deliveryFee.textContent = `$${(response.data.fee / 100).toFixed(2)}`
        orderTotal.textContent = `$${(
            (Number(window.menuItems)) + //response.data.fee)  
            100
            ).toFixed(2)}`;
            
        return response;

        console.log("I filled it out")
    } else {
        console.log("I didn't fill it out")

    }
}

async function createDelivery() {
    console.log("HEY")
    const payload = getFormValues()
    const finalPayload = JSON.stringify(payload)
    console.log(finalPayload, 777)

    const formInput = document.querySelector("form");

    const menuBoxes = document.querySelectorAll("input[type=checkbox]:checked")
    
    // CHANGED THIS IF CONDITION
    // ALSO MODIFIED THE FETCH CALL TO RETURN TEXT INSTEAD OF JSON
    // AND THEN WRITE TO THE DOCUMENT
    if (payload && formInput.checkValidity() && menuBoxes.length > 0) {
        await fetch("/create-delivery", {
            method: "POST",
            body: finalPayload,
            headers: { "Content-Type": "application/json" }
        })
        .then(res => res.text())
        .then(htmlStr => {
            document.open();
            document.write(htmlStr);
            document.close();
        })
        //  .then ((response) => {
        //     console.log(response, "RESPONSE")
        //     let resp = response.json()
        //     return resp
        //  })
        //     .then((res) => {
        //         console.log(res, 8989)
        //     })
        //  .catch ((rejected) => {
        //     console.log (rejected)
        // });

        // if (response) {
        //     const inputContainer = document.getElementById("order-details")
        //     inputContainer.innerHTML = response.json();
        // }
    }else if (formInput.checkValidity() && menuBoxes.length === 0) {
        alert("Please select a Menu Item")
    }else {
        return;
    }
}