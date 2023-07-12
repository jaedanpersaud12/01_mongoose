import mongoose from "mongoose"
import Product from "./models/product.js"

const connectDb = async function () {
  try {
    await mongoose.connect("mongodb://localhost:27017/farmStand")
    console.log("CONNECTED TO MONGO")
  } catch (error) {
    console.log(`MONGO CONNECTION ERROR: ${error}`)
  }
}

connectDb()

const seedProducts = [
  {
    name: "Apple",
    price: 0.99,
    category: "fruit",
  },
  {
    name: "Carrot",
    price: 0.49,
    category: "vegetable",
  },
  {
    name: "Milk",
    price: 2.99,
    category: "dairy",
  },
  {
    name: "Orange",
    price: 1.49,
    category: "fruit",
  },
  {
    name: "Broccoli",
    price: 1.29,
    category: "vegetable",
  },
]

Product.insertMany(seedProducts)
  .then((p) => {
    console.log(p)
  })
  .catch((err) => {
    console.log(err)
  })
