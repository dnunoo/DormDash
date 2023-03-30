import {DoorDashClient } from "@doordash/sdk";
import {v4 as uuidv4} from "uuid";
import "dotenv/config";

// const DoorDashClient = require('@doordash/sdk')

const client = new DoorDashClient({
    developer_id: process.env.DEVELOPER_ID,
    key_id: process.env.KEY_ID,
    signing_secret: process.env.SIGNING_SECRET,

})

const response = await client.createDelivery({
    external_delivery_id: uuidv4(), 
    pickup_address: 'University Village Building 2, Dover, DE 19904',
    pickup_phone_number: '+1(650)5555555',
    dropoff_address: 'University Village Building 1, Dover, DE 19904',
    dropoff_phone_number: '+1(650)5555555',
  })

console.log(response.data);

// const client = new DoorDashClient.DoorDashClient("5f4d72cd-f2c0-454d-8764-b4dee8733be3")

// const response = client
//   .createDelivery({
//     external_delivery_id: 'D-12345',
//     pickup_address: '1200 N Dupont Hwy, Dover, DE 19901',
//     pickup_phone_number: '+1(650)5555555',
//     dropoff_address: '1201 3rd Ave, Seattle, WA, 98101',
//     dropoff_phone_number: '+1(650)5555555',
//   })
//   .then(response => {
//     console.log(response.data)
//   })
//   .catch(err => {
//     console.log(err)
//   })