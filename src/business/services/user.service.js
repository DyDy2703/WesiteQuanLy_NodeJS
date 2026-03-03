import mongoose from "mongoose";
import bcrypt from "bcrypt";
import userRepository from "../../data/repositories/user.repository.js";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

class UserService {

    /**
     * @route   POST /api/users/
     * @desc    Create a new user   
     * @body    { username, email, password, display_name?, role? }
     * @returns 200 OK | 402 Not required | 409 Already Exist | 500 Internal Server Error
    **/
    async createUser(data) {
        const { username, email, password, display_name, role } = data;

        if (!username || !email || !password) {
            throw { status: 402, message: "username, email and password are required" };
        }

        const existing = await userRepository.findByUsernameOrEmail(
            username,
            email
        );

        if (existing) {
            throw { status: 409, message: "username or email already in use" };
        }

        // 🔐 Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        return await userRepository.create({
            username,
            email,
            password: hashedPassword,
            display_name,
            role,
            active: true,
        });
    }

    /**
     * @route   GET /api/users/
     * @desc    Get all user
     * @body    { }
     * @returns 200 OK | 500 Internal Server Error
    **/
    async getAllUsers() {
        return await userRepository.findAll();
    }

    /**
     * @route   GET /api/users/{userID}
     * @desc    Get user by ID   
     * @body    { }
     * @returns 200 OK | 400 Invalid ID | 404 Not Found | 500 Internal Server Error
    **/
    async getUserById(id) {
        if (!validateObjectId(id)) {
            throw { status: 400, message: "Invalid user ID" };
        }

        const user = await userRepository.findById(id);
        if (!user) {
            throw { status: 404, message: "User not found" };
        }

        return user;
    }

    /**
     * @route   PUT /api/users/{userID}
     * @desc    Update user by ID   
     * @body    { username?, email?, password?, display_name?, role?, active? }
     * @returns 200 OK | 400 Invalid ID | 404 Not Found | 405 Bad Request | 500 Internal Server Error
    **/
    async updateUser(id, data) {
        if (!validateObjectId(id)) {
            throw { status: 400, message: "Invalid user ID" };
        }

        if (!data || Object.keys(data).length === 0) {
            throw { status: 405, message: "Bad Request" };
        }

        // Check trùng username/email nếu update
        if (data.username || data.email) {
            const existing = await userRepository.findByUsernameOrEmail(
                data.username,
                data.email
            );

            if (existing && existing._id.toString() !== id) {
                throw { status: 409, message: "username or email already in use" };
            }
        }

        // Nếu update password → hash lại
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        const user = await userRepository.update(id, data);

        if (!user) {
            throw { status: 404, message: "User not found" };
        }

        return user;
    }

    /**
     * @route   DELETE /api/users/{userID}
     * @desc    Delete user by ID   
     * @body    { }
     * @returns 200 OK | 400 Invalid ID | 404 Not Found | 500 Internal Server Error
    **/
    async deleteUser(id) {
        if (!validateObjectId(id)) {
            throw { status: 400, message: "Invalid user ID" };
        }

        const user = await userRepository.delete(id);

        if (!user) {
            throw { status: 404, message: "User not found" };
        }

        return user;
    }
}

export default new UserService();