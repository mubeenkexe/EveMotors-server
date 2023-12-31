import { Router } from "express";
import { carsModel } from "../models/cars.js";
import { hash, compare } from "bcrypt";
import { userModel } from "../models/users.js";
import jwt from "jsonwebtoken";
const mainRouter = Router();

mainRouter.get('/cars', async (req, res) => {

    try {

        const data = await carsModel.find();
        const count = await carsModel.count();

        if (count > 0) {
            res.json(data);
        }

        else {
            res.json({ message: "No cars found" });
        }
        res.end();
    }
    catch (err) {
        console.log(err);
    }
});

mainRouter.get('/cars/:carId', async (req, res) => {
    try {
        const carId = req.params.carId;
        const carData = await carsModel.findById(carId);

        if (carData) {
            res.json(carData);
        } else {
            res.status(404).json({ message: 'Car not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


mainRouter.get('/users', async (req, res) => {
    try {

        let response = await userModel.find();
        let count = await userModel.count();

        if (count > 0) {
            res.json(response);
        }

        else {
            res.json({ message: "User Not Found!" })
        };

    } catch (error) {
        console.log(error);
    }
});

mainRouter.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const encryptedPassword = await hash(password, 10);

    try {
        const user = await userModel.create({
            firstName,
            lastName,
            email,
            password: encryptedPassword,
        });
        res.status(201).json({ message: "User has been registered.", user });
        res.end();

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred while registering the user." });
        res.end();
    }
});

mainRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid Email" }); 
        }

        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid Password" }); 
        }

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);
        console.log("Generated Token:", token);

        res.status(200).json({ token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});


export default mainRouter;