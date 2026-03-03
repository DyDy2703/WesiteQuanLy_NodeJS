import mongoose from "mongoose";
import issueRepository from "../../data/repositories/issue.repository.js";
import Comment from "../../data/models/comment.model.js";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

class IssueService {

    /**
     * @route   POST /api/issues/
     * @desc    Create a new issue   
     * @body    { issue_key, summary, description?, status_id, priority_id, type_id, project_id, reporter_id, assignee_id }
     * @returns 201 Created | 402 Not Required | 406 Not Validate | 409 Already Exist | 500 Internal Server Error
    **/
    async createIssue(data) {
        const {
            issue_key,
            summary,
            status_id,
            priority_id,
            type_id,
            project_id,
            reporter_id,
            assignee_id,
        } = data;

        if (
            !issue_key ||
            !summary ||
            !status_id ||
            !priority_id ||
            !type_id ||
            !project_id ||
            !reporter_id ||
            !assignee_id
        ) {
            throw { status: 402, message: "Fields are required" };
        }

        const existing = await issueRepository.findByIssueKey(issue_key);
        if (existing) {
            throw { status: 409, message: "Issue key already exists" };
        }

        // Validate foreign keys
        const foreignKeys = [
            status_id,
            priority_id,
            type_id,
            project_id,
            reporter_id,
            assignee_id,
        ];

        foreignKeys.forEach((id) => {
            if (!validateObjectId(id)) {
                throw { status: 406, message: "Invalid foreign key" };
            }
        });

        return await issueRepository.create(data);
    }

    /**
     * @route   GET /api/issues/
     * @desc    Get all issues
     * @body    { }
     * @returns 200 OK | 500 Internal Server Error
    **/
    async getAllIssues() {
        return await issueRepository.findAll();
    }

    /**
     * @route   GET /api/issues/{issueID}
     * @desc    Get all issues by ID
     * @body    { }
     * @returns 200 OK | 400 Invalid ID | 404 Not Found | 500 Internal Server Error
    **/
    async getIssueById(id) {
        if (!validateObjectId(id)) {
            throw { status: 400, message: "Invalid ID" };
        }

        const issue = await issueRepository.findById(id);
        if (!issue) {
            throw { status: 404, message: "Issue not found" };
        }

        return issue;
    }

    /**
     * @route   PUT /api/issues/{issueID}
     * @desc    Update issue by ID   
     * @body    { issue_key?, summary?, description?, status_id?, priority_id?, type_id?, project_id?, reporter_id?, assignee_id? }
     * @returns 200 OK | 400 Invalid ID | 404 Not Found | 405 Bad Request | 406 Not Validate | 500 Internal Server Error
    **/
    async updateIssue(id, data) {
        if (!validateObjectId(id)) {
            throw { status: 400, message: "Invalid ID" };
        }

        if (!data || Object.keys(data).length === 0) {
            throw { status: 405, message: "Bad Request" };
        }

        // Validate foreign keys nếu có gửi lên
        const foreignFields = [
            "status_id",
            "priority_id",
            "type_id",
            "project_id",
            "reporter_id",
            "assignee_id",
        ];

        foreignFields.forEach((field) => {
            if (data[field] && !validateObjectId(data[field])) {
                throw { status: 406, message: `Invalid ${field}` };
            }
        });

        const issue = await issueRepository.update(id, data);
        if (!issue) {
            throw { status: 404, message: "Issue not found" };
        }

        return issue;
    }

    /**
     * @route   DELETE /api/issues/{issueID}
     * @desc    Delete issue by ID (and related comments)
     * @body    { }
     * @returns 200 OK | 400 Invalid ID | 404 Not Found | 500 Internal Server Error
    **/    
    async deleteIssue(id) {
        if (!validateObjectId(id)) {
            throw { status: 400, message: "Invalid ID" };
        }

        const issue = await issueRepository.delete(id);
        if (!issue) {
            throw { status: 404, message: "Issue not found" };
        }

        // Xóa comment liên quan
        await Comment.deleteMany({ issue_id: id });

        return issue;
    }
}

export default new IssueService();