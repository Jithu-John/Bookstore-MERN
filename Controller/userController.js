const users = require("../Models/userModel");
const jwt = require('jsonwebtoken');


// Register

exports.registerController = async (req, res) => {
    console.log(`Inside Register Controller`);
    const { username, email, password } = req.body
    console.log(username, email, password);


    try {
        // check the value is already exist
        const existingUser = await users.findOne({ email: email })
        console.log(existingUser);
        if (existingUser) {
            res.status(401).json(`User already exists, Please login`)
        } else {
            const newUser = new users({
                username: username,
                email,
                password
            })
            await newUser.save()
            res.status(200).json(newUser)
        }

    } catch (error) {
        res.status(500).json(error)
    }
}

// login
exports.loginController = async (req, res) => {
    console.log(`Inside login Controller`);

    const { email, password } = req.body
    console.log(email, password);

    try {
        const existingUser = await users.findOne({ email })
        console.log(existingUser);
        if (existingUser) {
            if (existingUser.password == password) {
                console.log("Login Success");

                const token = jwt.sign({ userMail: existingUser.email, role: existingUser.role }, process.env.jwtSecretKey)
                console.log(token);

                res.status(200).json({ existingUser, token })
            } else {
                res.status(401).json("Incorrect Password")
            }
        } else {
            res.status(401).json("User not fount...please register")
        }

    } catch (error) {
        res.status(500).json(error)
    }
}

// Update Profile
exports.updateUserProfileController = async (req, res) => {
    console.log(`Inside update user profile controller`);
    const { username, password, bio, profileImage } = req.body
    const userMail = req.payload
    const profileImg = req.file ? req.file.filename : profileImage
    console.log(username, password, bio, profileImg, userMail);

    try {
        const updateUser = await users.findOneAndUpdate({ email: userMail }, { username, password, bio, profileImg }, { new: true })
        await updateUser.save()
        res.status(200).json(updateUser)
    } catch (error) {
        res.status(500).json(error)
    }

}

// Update Admin Profile
exports.updateAdminProfileController = async (req, res) => {
    console.log(`Inside update user profile controller`);
    const { username, password, profileImage } = req.body
    const userMail = req.payload
    const profileImg = req.file ? req.file.filename : profileImage
    console.log(username, password, profileImg, userMail);

    try {
        const updateAdmin = await users.findOneAndUpdate({ email: userMail }, { username, password, profileImg }, { new: true })
        res.status(200).json(updateAdmin)
    } catch (error) {
        res.status(500).json(error)
    }

}

// Get all users - admin
exports.getAllUsersController = async (req, res) => {
    console.log(`Inside get all users controller`);
    const userMail = req.payload // admin mail
    try {
        const allUsers = await users.find({ email: { $ne: userMail } })
        res.status(200).json(allUsers)
    } catch (error) {
        res.status(500).json(error)
    }
}


// Google Login
exports.googleLoginController = async (req, res) => {
    console.log(`Inside Google Login Controller`);

    const { username, password, email, profileImg } = req.body
    console.log(username, password, email, profileImg);

    try {
        const existingUser = await users.findOne({ email })

        if (existingUser) {
            const token = jwt.sign({ userMail: existingUser.email, role: existingUser.role }, process.env.jwtSecretKey)
            console.log(token);

            res.status(200).json({ user : existingUser, token })
        } else {
            const newUser = new users({
                username,
                email,
                password
            })
            await newUser.save()

            const token = jwt.sign({ userMail: newUser.email, role: newUser.role }, process.env.jwtSecretKey)
            console.log(token);

            res.status(200).json({ user : newUser, token })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}