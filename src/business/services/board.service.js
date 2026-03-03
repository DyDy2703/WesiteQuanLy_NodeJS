import mongoose from "mongoose";
import boardRepository from "../../data/repositories/board.repository.js";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

class BoardService {

    /**
     * @route   POST /api/boards/
     * @desc    Create a new board   
     * @body    { name, user_id }
     * @returns 201 Created | 402 Not Required | 406 Not Validate | 409 Already Exist | 500 Internal Server Error
    **/ 
    async createBoard(data) {
        const { name, user_id } = data;

        if (!name || !user_id) {
            throw { status: 402, message: "Name and user_id is required" };
        }

        const existing = await boardRepository.findByName(name);
        if (existing) {
            throw { status: 409, message: "Name already exists" };
        }

        if (!validateObjectId(user_id)) {
            throw { status: 406, message: "Invalid user_id" };
        }

        return await boardRepository.create(data);
    }

    /**
     * @route   GET /api/boards/
     * @desc    Get all issues
     * @body    { }
     * @returns 200 OK | 500 Internal Server Error
    **/    
    async getAllBoards() {
        return await boardRepository.findAll();
    }

    /**
     * @route   GET /api/boards/{boardID}
     * @desc    Get all boards by ID
     * @body    { }
     * @returns 200 OK | 400 Invalid ID | 404 Not Found | 500 Internal Server Error
    **/
    async getBoardById(id) {
        if (!validateObjectId(id)) {
            throw { status: 400, message: "Invalid ID" };
        }

        const board = await boardRepository.findById(id);
        if (!board) {
            throw { status: 404, message: "Board not found" };
        }

        return board;
    }

    /**
     * @route   PUT /api/boards/{boardID}
     * @desc    Update board by ID   
     * @body    { name?, user_id? }
     * @returns 200 OK | 400 Invalid ID | 404 Not Found | 405 Bad Request | 500 Internal Server Error
    **/
    async updateBoard(id, data) {
        if (!validateObjectId(id)) {
            throw { status: 400, message: "Invalid ID" };
        }

        if (!data.name && !data.user_id) {
            throw { status: 405, message: "Bad Request" };
        }

        const board = await boardRepository.update(id, data);
        if (!board) {
            throw { status: 404, message: "Board not found" };
        }

        return board;
    }

    /**
     * @route   DELETE /api/boards/{boardID}
     * @desc    Delete comment by ID
     * @body    { }
     * @returns 200 OK | 400 Invalid ID | 404 Not Found | 500 Internal Server Error
    **/
    async deleteBoard(id) {
        if (!validateObjectId(id)) {
            throw { status: 400, message: "Invalid ID" };
        }

        const board = await boardRepository.delete(id);
        if (!board) {
            throw { status: 404, message: "Board not found" };
        }

        return board;
    }
}

export default new BoardService();