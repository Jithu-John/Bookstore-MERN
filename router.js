const express = require("express")
const { registerController, loginController, updateUserProfileController, updateAdminProfileController, getAllUsersController, googleLoginController } = require("./Controller/userController")
const jwtmiddleware = require("./Middlewares/jwtmiddleware")
const { addBookController, getHomeBooksController, getAllBooksController, getAllUserAddedBooksController, removeUserAddedBook, getUserBoughtBook, viewBookController, approveBookController, makePaymentController } = require("./Controller/bookController")
const multerConfig = require("./Middlewares/imageMulterMiddleware")
const adminjwtmiddleware = require("./Middlewares/AdminJWTMiddleware")
const router = express.Router()

// Register
router.post("/register", registerController)


// Login
router.post("/login", loginController)


// Google Login
router.post("/google-login", googleLoginController)


// Add Book
router.post("/add-book", jwtmiddleware, multerConfig.array("uploadImages", 3), addBookController)


// Get home books
router.get("/home-books", getHomeBooksController)


// Get all books
router.get("/all-books", jwtmiddleware, getAllBooksController)


// Get user books
router.get("/user-books", jwtmiddleware, getAllUserAddedBooksController)

 
// Remove Book
router.delete("/remove-book/:id", jwtmiddleware, removeUserAddedBook)


// Get user bought book
router.get("/user-boughtbook", jwtmiddleware, getUserBoughtBook)


// View Book
router.get("/view-book/:id", jwtmiddleware, viewBookController)


// Update user Profile
router.put("/update-profile", jwtmiddleware, multerConfig.single("profileImage"), updateUserProfileController)


// Admin

// All books
router.get("/admin-allbooks" , adminjwtmiddleware, getAllBooksController)


// Update Book Status
router.put("/admin-updatebook/:id", adminjwtmiddleware, approveBookController)


// Update Admin Profile
router.put("/admin-updateprofile", adminjwtmiddleware, multerConfig.single("profileImage"), updateAdminProfileController)


// get all users
router.get("/admin-allusers", adminjwtmiddleware, getAllUsersController)


// payment
router.post("/make-payment", jwtmiddleware, makePaymentController)

module.exports = router