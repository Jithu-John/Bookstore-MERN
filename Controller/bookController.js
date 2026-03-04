const books = require("../Models/bookModel");
const stripe = require('stripe')(process.env.stripeSK)
    

// Add Book
exports.addBookController = async (req, res) => {
    console.log(`Inside Add book controller`);
    // console.log(req.body);
    // console.log(req.files);

    const { title, author, noOfPages, imageURL, price, discountPrice, abstract, publisher, language, isbn, category } = req.body
    console.log(title, author, noOfPages, imageURL, price, discountPrice, abstract, publisher, language, isbn, category);

    const uploadImages = req.files
    console.log(uploadImages);

    var uploadImg = []
    req.files.map(item => uploadImg.push(item.filename))
    console.log(uploadImg);

    const userMail = req.payload

    try {
        const existingBook = await books.findOne({ title, userMail })
        console.log(existingBook);

        if (existingBook) {
            res.status(401).json(`You already this book`)
        } else {
            const newBook = new books({
                title, author, noOfPages, imageURL, price, discountPrice, abstract, publisher, language, isbn, category, uploadImages: uploadImg, userMail
            })
            await newBook.save()
            res.status(200).json(newBook)
        }

    } catch (error) {
        res.status(400).json(error)
    }

    res.status(200).json(`Add book request Recieved`)
}

// Get Book
exports.getHomeBooksController = async (req, res) => {
    console.log(`Inside get home book controller`);

    try {
        const homeBooks = await books.find().sort({ _id: -1 }).limit(4)
        res.status(200).json(homeBooks)
    } catch (error) {
        res.status(500).json(error)
    }
}


// Get All Book
exports.getAllBooksController = async (req, res) => {
    console.log(`Inside get all book controller`);

    const searchKey = req.query.search
    console.log(searchKey);

    try {
        const allBooks = await books.find({ title: { $regex: searchKey, $options: "i" } })
        res.status(200).json(allBooks)
    } catch (error) {
        res.status(500).json(error)
    }
}


// Get All user added Book
exports.getAllUserAddedBooksController = async (req, res) => {
    console.log(`Inside get all book controller`);
    const userMail = req.payload
    try {
        const allUserBooks = await books.find({ userMail })
        res.status(200).json(allUserBooks)
    } catch (error) {
        res.status(500).json(error)
    }
}


// Delete user added book
exports.removeUserAddedBook = async (req, res) => {
    console.log(`Inside remove user added book`);
    console.log(req.params);
    const { id } = req.params
    try {
        const removebook = await books.findByIdAndDelete({ _id: id })
        res.status(200).json("Book Deleted")
    } catch (error) {
        res.status(500).json(error)
    }
}


// Get user bought book
exports.getUserBoughtBook = async (req, res) => {
    console.log(`Inside Get user bought book`);
    const userMail = req.payload
    try {
        const userBoughtBoook = await books.find({ boughtBy: userMail })
        res.status(200).json(userBoughtBoook)
    } catch (error) {
        res.status(500).json(error)
    }
}


// View Book
exports.viewBookController = async (req, res) => {
    console.log(`Inside View Book Controller`);
    const { id } = req.params

    try {
        const bookDetails = await books.findById({ _id: id })
        res.status(200).json(bookDetails)
    } catch (error) {
        res.status(500).json(error)
    }
}

// // // ADMIN // // //
// Approve Book   

exports.approveBookController = async (req, res) => {
    console.log(`Inside Approve Book Controller`);
    const { id } = req.params
    try {
        const updateBook = await books.findByIdAndUpdate({ _id: id }, {
            status: "approved"
        }, { new: true })
        res.status(200).json(updateBook)
    } catch (error) {
        res.status(500).json(error)
    }
}


// Payment - userside
exports.makePaymentController = async (req, res) => {
    console.log(`Inside payment controller`);

    const { _id, userMail, title, author, noOfPages, imageURL, price, discountPrice, abstract, publisher, language, isbn, category } = req.body
    console.log(_id, userMail, title, author, noOfPages, imageURL, price, discountPrice, abstract, publisher, language, isbn, category);

    const email = req.payload
    console.log(email);

    try {
        const updateBookDetails = await books.findByIdAndUpdate({ _id }, { status: "sold", boughtBy: email }, { new: true })

        const line_items = [{
            price_data: {
                currency: "usd",
                product_data: {
                    name: title,
                    description: `${author} | ${publisher}`,
                    metadata: {
                        title, author, noOfPages, imageURL, price, discountPrice, abstract, publisher, language, isbn, category, userMail, status: "sold", boughtBy: email
                    }
                },
                unit_amount: Math.round(discountPrice * 100)
            },
            quantity: 1
        }]

        // stripe Checkout
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            success_url: "http://localhost:5173/payment-success",
            cancel_url: "http://localhost:5173/payment-error",
            line_items,
            mode: "payment"
        })
        console.log("session", session);
        res.status(200).json({ checkoutSessionURL : session.url })

    } catch (error) {
        res.status(500).json(error)
    }
}