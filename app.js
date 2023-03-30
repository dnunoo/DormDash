//this is where the data from the index is being put into the input fields 
import express from "express";
import session from "express-session"
const app = express();
const port = 3000;
import path from "path";
import { fileURLToPath } from "url";
import {v4 as uuidv4} from "uuid";
import "dotenv/config";
import {DoorDashClient } from "@doordash/sdk";

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(session({secret: "blahblahblah", resave: true, saveUninitialized: true}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
})

app.listen (port, (err) => {
    if (err) {
        return console.log ("ERROR", err);
    } 
    console.log(`server is listening on ${port}`);
})

app.use(express.static(__dirname + "/public"))
app.set("view engine", "pug")
app.get("/order", (req, res) => {
    res.render("order")
})

app.post("/get-delivery-rate", async (req, res) => {
    const client = new DoorDashClient({
        developer_id: process.env.DEVELOPER_ID,
        key_id: process.env.KEY_ID,
        signing_secret: process.env.SIGNING_SECRET,
    });

    const response = await client.deliveryQuote({
        external_delivery_id: uuidv4(),
        pickup_address: 'Delaware State University,Dover, DE 19904',
        pickup_phone_number: '+1(302)4657573',
        pickup_business_name: "USTILL",
        // dropoff_address: 'Delaware State University, Dover, DE 19904',
        // MODIFIED THE NAME OF THE INPUT FIELD IN THE HTML FORM
        dropoff_address:`${req.body.dorm_building}, ${req.body.room_building}, ${req.body.campus}$`,
        dropoff_phone_number: req.body.dropoff_phone_number,
        dropoff_contact_given_name: req.body.dropoff_contact_given_name, 
        dropoff_contact_family_name: req.body.dropoff_contact_family_name,
        order_value: req.body.order_value,
    })

    // ADDED EXTERNAL DELIVERY ID TO REQUEST SESSION TO USE IN CREATE DELIVERY ROUTE
    req.session.deliveryId = response.data.external_delivery_id
    res.send(response)
    console.log("QUOTE", response)  

})

app.post("/create-delivery", async (req, res) => {
    // GET DELIVERY ID FROM REQUEST SESSION
    var delivery_id = req.session.deliveryId;

    const client = new DoorDashClient({
        developer_id: process.env.DEVELOPER_ID,
        key_id: process.env.KEY_ID,
        signing_secret: process.env.SIGNING_SECRET,
    });
    console.log(req.session.deliveryId, "QUOTE ID")
    const response = await client.deliveryQuoteAccept(
        delivery_id
        
    )

    const serviceTotal = (response.data.order_value/100).toFixed(2)
    const feeTotal = (response.data.fee/100).toFixed(2)
    const orderTotal = Number(serviceTotal) + Number(feeTotal)

    const data = {
        serviceTotal: serviceTotal,
        feeTotal: feeTotal,
        orderTotal: orderTotal,
    }

    res.render("order", {
        serviceTotal: data.serviceTotal,
        feeTotal: data.feeTotal,
        orderTotal: data.orderTotal

    })
    
    console.log("ACCEPT", response)
        

})