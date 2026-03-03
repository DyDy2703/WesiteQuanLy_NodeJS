import mongoose from "mongoose";
import issueTypeRepository from "../../data/repositories/issuetype.repository.js";
import Issue from "../../models/issue.model.js";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

class IssueTypeService {

    /**
     * @route   POST /api/issue-types/
     * @desc    Create a new issue type
     * @body    { name }
     * @returns 201 Created | 402 Not Required | 409 Already Exists | 500 Internal Server Error
    **/
    async createIssueType(data) {
        const { name } = data;

        if (!name) {
            throw { status: 402, message: "name is required" };
        }

        const exist = await issueTypeRepository.findByName(name);
        if (exist) {
            throw { status: 409, message: "Issue type already exists" };
        }

        return await issueTypeRepository.create({ name });
    }

    /**
     * @route   GET /api/issue-types/
     * @desc    Get all issue types
     * @body    { }
     * @returns 200 OK | 500 Internal Server Error
    **/
    async getAllIssueTypes() {
        return await issueTypeRepository.findAll();
    }

    /**
     * @route   GET /api/issue-types/{issueTypeID}
     * @desc    Get issue type by ID
     * @body    { }
     * @returns 200 OK | 400 Invalid ID | 404 Not Found | 500 Internal Server Error
    **/
    async getIssueTypeById(id) {
        if (!validateObjectId(id)) {
            throw { status: 400, message: "Invalid ID" };
        }

        const type = await issueTypeRepository.findById(id);

        if (!type) {
            throw { status: 404, message: "Issue type not found" };
        }

        return type;
    }

    /**
     * @route   PUT /api/issue-types/{issueTypeID}
     * @desc    Update issue type by ID
     * @body    { name }
     * @returns 200 OK | 400 Invalid ID | 404 Not Found | 409 Already Exists | 500 Internal Server Error
    **/
    async updateIssueType(id, data) {
        if (!validateObjectId(id)) {
            throw { status: 400, message: "Invalid ID" };
        }

        const { name } = data;

        if (!name) {
            throw { status: 402, message: "name is required" };
        }

        const current = await issueTypeRepository.findById(id);
        if (!current) {
            throw { status: 404, message: "Issue type not found" };
        }

        // Nếu đổi tên thì mới check trùng
        if (name !== current.name) {
            const exist = await issueTypeRepository.findByName(name);
            if (exist) {
                throw { status: 409, message: "Issue type name already exists" };
            }
        }

        return await issueTypeRepository.update(id, { name });
    }

    /**
     * @route   DELETE /api/issue-types/{issueTypeID}
     * @desc    Delete issue type (prevent if being used by issues)
     * @body    { }
     * @returns 200 OK | 400 Invalid ID | 404 Not Found | 408 In Use | 500 Internal Server Error
    **/
    async deleteIssueType(id) {
        if (!validateObjectId(id)) {
            throw { status: 400, message: "Invalid ID" };
        }

        const type = await issueTypeRepository.findById(id);
        if (!type) {
            throw { status: 404, message: "Issue type not found" };
        }

        // Không cho xóa nếu đang được Issue sử dụng
        const issueUsing = await Issue.findOne({ issue_type_id: id });
        if (issueUsing) {
            throw { status: 408, message: "Issue type is in use" };
        }

        await issueTypeRepository.delete(id);

        return true;
    }
}

export default new IssueTypeService();