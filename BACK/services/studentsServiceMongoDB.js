import User from "../models/userModel.js";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const findAllUsers = async () => {
    return await User.find({})
};

export const findUser = async (id) => {
    return await User.findById(id)
};

export const deleteStudentService = async (id) => {
    return await User.findByIdAndDelete(id)
};

export const createStudentService = async (data) => {
    const hashedPass = await bcrypt.hash(data.password, SALT_ROUNDS);
    return await User.create({ ...data, password: hashedPass });
};

export const updateStudentService = async (id, data) => {
    if (data.password) {
        data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
    };
    return await User.findByIdAndUpdate(id, data, { new: true })
}