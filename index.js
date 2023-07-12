import express from "express"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import mongoose from "mongoose"
import Product from "./models/product.js"
import methodOverride from "method-override"

const PORT = 3000
const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const connectDb = async function () {
  try {
    await mongoose.connect("mongodb://localhost:27017/farmStand")
    console.log("CONNECTED TO MONGO")
  } catch (error) {
    console.log(`MONGO CONNECTION ERROR: ${error}`)
  }
}

connectDb()

app.set("views", join(__dirname, "views"))
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))

const categories = ["fruit", "vegetable", "dairy"]

app.get("/", (req, res) => {
  res.send("GO TO /products")
})
app.get("/products", async (req, res) => {
  const { category } = req.query
  if (category) {
    const products = await Product.find({ category })
    res.render("products/index", { products, category })
  } else {
    const products = await Product.find({})
    res.render("products/index", { products, category: "All" })
  }
})

app.post("/products", async (req, res) => {
  const newProduct = new Product(req.body)
  await newProduct.save()
  res.redirect(`/products/${newProduct._id}`)
})

app.get("/products/new", (req, res) => {
  res.render("products/new", { categories })
})

app.get("/products/:id", async (req, res) => {
  const { id } = req.params
  const product = await Product.findById(id)
  res.render("products/details", { product })
})

app.get("/products/:id/edit", async (req, res) => {
  const { id } = req.params
  const product = await Product.findById(id)
  res.render("products/edit", { product, categories })
})

app.put("/products/:id", async (req, res) => {
  const { id } = req.params
  const product = await Product.findByIdAndUpdate(id, req.body, {
    runValidators: true,
  })
  res.redirect(`/products/${product._id}`)
})

app.delete("/products/:id", async (req, res) => {
  const { id } = req.params
  const deletedProduct = await Product.findByIdAndDelete(id)
  console.log(deletedProduct)
  res.redirect("/products")
})

app.listen(PORT, () => {
  console.log(`APP IS LISTENING ON PORT http://localhost/${PORT}`)
})
