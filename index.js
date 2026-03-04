// 7. import dotenv
require("dotenv").config()

// 1. import express
const express = require("express")

// import router
const router = require("./router")

// 5. import cors
const cors = require("cors")

// import connecting file
require("./connection")

// 2. create server
const BookStoreServer = express()

// 6. use cors
BookStoreServer.use(cors())

// 8. parse data - middleware
BookStoreServer.use(express.json())

// use router
BookStoreServer.use(router)

// add image to server
BookStoreServer.use("/imageUploads", express.static("imageUploads"))

// 3. Port
const PORT = 3000

// 4. Tell server to listen
BookStoreServer.listen(PORT, () => {
    console.log(`Bookstore server started at PORT ${PORT}, and waiting for client request`)
})


BookStoreServer.get('/', (req, res) => {
    res.status(200).send("Server Started")
})

BookStoreServer.get('/about', (req, res) => {
    res.status(200).send("Closed")
})