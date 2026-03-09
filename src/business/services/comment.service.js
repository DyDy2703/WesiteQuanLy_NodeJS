import mongoose from "mongoose";
import commentRepository from "../../data/repositories/comment.repository.js";
import Issue from "../../data/models/issue.model.js";

const validateObjectId = (id) =>  mongoose.Types.ObjectId.isValid(id);

class CommentService {

    /**
     * @route   POST /api/comments/
     * @desc    Create a new comment   
     * @body    { issue_id, user_id, content }
     * @returns 201 Created | 402 Not Required | 404 Not Found | 406 Not Validate | 500 Internal Server Error
    **/
    async createComment(data) {
        const { issue_id, user_id, content } = data;

        if (!issue_id || !user_id || !content) {
            throw { status: 402, message: "issue_id, user_id and content are required" };
        }

        if (!validateObjectId(issue_id) || !validateObjectId(user_id)) {
            throw { status: 406, message: "Invalid issue_id or user_id" };
        }

        const issue = await Issue.findById(issue_id);
        if (!issue) {
            throw { status: 404, message: "Issue not found" };
        }

        return await commentRepository.create(data);
    }

    /**
     * @route   GET /api/comments/
     * @desc    Get all comments
     * @body    { }
     * @returns 200 OK | 500 Internal Server Error
    **/
    async getAllComments() {
        return await commentRepository.findAll();
    }

    /**
     * @route   GET /api/comments/{commentID}
     * @desc    Get comment by ID
     * @body    { }
     * @returns 200 OK | 400 Invalid ID | 404 Not Found | 500 Internal Server Error
    **/
    async getCommentById(id) {
        if (!validateObjectId(id)) {
            throw { status: 400, message: "Invalid ID" };
        }

        const comment = await commentRepository.findById(id);

        if (!comment) {
            throw { status: 404, message: "Comment not found" };
        }

        return comment;
    }

    /**
     * @route   PUT /api/comments/{commentID}
     * @desc    Update comment by ID   
     * @body    { issue_id?, user_id?, content? }
     * @returns 200 OK | 400 Invalid ID | 402 Not Required | 404 Not Found | 405 Bad Request | 406 Field Validate | 500 Internal Server Error
    **/
    async updateComment(id, data) {
        if (!validateObjectId(id)) {
            throw { status: 400, message: "Invalid ID" };
        }

        // // Không cho sửa issue_id và user_id
        // delete data.issue_id;
        // delete data.user_id;

        if (!data.content) {
            throw { status: 402, message: "Content is required" };
        }

        const comment = await commentRepository.update(id, data);

        if (!comment) {
            throw { status: 404, message: "Comment not found" };
        }

        return comment;
    }

    /**
     * @route   DELETE /api/comments/{commentID}
     * @desc    Delete comment by ID
     * @body    { }
     * @returns 200 OK | 400 Invalid ID | 404 Not Found | 405 Bad Request |500 Internal Server Error
    **/
    async deleteComment(id) {
        if (!validateObjectId(id)) {
            throw { status: 400, message: "Invalid ID" };
        }

        const comment = await commentRepository.findById(id);

        if (!comment) {
            throw { status: 404, message: "Comment not found" };
        }

        if (uppercase(comment.issue_id.status) === "DONE") {
            throw { status: 405, message: "Cannot delete comment of DONE issue" };
        }

        await commentRepository.delete(id);

        return true;
    }
}

export default new CommentService();