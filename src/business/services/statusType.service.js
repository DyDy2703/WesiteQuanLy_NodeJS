import mongoose from "mongoose";
import statusTypeRepository from "../../data/repositories/statusType.repository.js";
import Issue from "../../data/models/issue.model.js";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

class StatusTypeService {

    /**
     * @route   POST /api/status-types/
     * @desc    Create a new status type
     * @body    { name, description }
     * @returns 201 Created | 402 Not Required | 409 Already Exists | 500 Internal Server Error
    **/
    async createStatusType(data) {
        const { name, description } = data;

        if (!name || !description) {
            throw { status: 402, message: "name and description are required" };
        }

        const exist = await statusTypeRepository.findByName(name);
        if (exist) {
            throw { status: 409, message: "Status type already exists" };
        }

        return await statusTypeRepository.create({ name, description });
    }

    /**
     * @route   GET /api/status-types/
     * @desc    Get all status types
     * @body    { }
     * @returns 200 OK | 500 Internal Server Error
    **/
    async getAllStatusTypes() {
        return await statusTypeRepository.findAll();
    }

    /**
     * @route   GET /api/status-types/{statusTypeID}
     * @desc    Get status type by ID
     * @body    { }
     * @returns 200 OK | 400 Invalid ID | 404 Not Found | 500 Internal Server Error
    **/
    async getStatusTypeById(id) {
        if (!validateObjectId(id)) {
            throw { status: 400, message: "Invalid ID" };
        }

        const type = await statusTypeRepository.findById(id);
        if (!type) {
            throw { status: 404, message: "Status type not found" };
        }

        return type;
    }

    /**
     * @route   PUT /api/status-types/{statusTypeID}
     * @desc    Update status type by ID
     * @body    { name?, description? }
     * @returns 200 OK | 400 Invalid ID | 404 Not Found | 405 Bad Request | 409 Already Exists | 500 Internal Server Error
    **/
    async updateStatusType(id, data) {
        if (!validateObjectId(id)) {
            throw { status: 400, message: "Invalid ID" };
        }

        const current = await statusTypeRepository.findById(id);
        if (!current) {
            throw { status: 404, message: "Status type not found" };
        }

        const { name, description } = data;

        if (!name && !description) {
            throw { status: 405, message: "No fields provided to update" };
        }

        // Nếu đổi name thì mới check trùng
        if (name && name !== current.name) {
            const exist = await statusTypeRepository.findByName(name);
            if (exist) {
                throw { status: 409, message: "Status type name already exists" };
            }
        }

        return await statusTypeRepository.update(id, {
            name: name ?? current.name,
            description: description ?? current.description,
        });
    }

    /**
     * @route   DELETE /api/status-types/{statusTypeID}
     * @desc    Delete status type (prevent if being used by issues)
     * @body    { }
     * @returns 200 OK | 400 Invalid ID | 404 Not Found | 408 In Use | 500 Internal Server Error
    **/
    async deleteStatusType(id) {
        if (!validateObjectId(id)) {
            throw { status: 408, message: "Invalid ID" };
        }

        const type = await statusTypeRepository.findById(id);
        if (!type) {
            throw { status: 404, message: "Status type not found" };
        }

        // Không cho xóa nếu đang được Issue sử dụng
        const issueUsing = await Issue.findOne({ status_type_id: id });
        if (issueUsing) {
            throw { status: 408, message: "Status type is in use" };
        }

        await statusTypeRepository.delete(id);

        return true;
    }
}

export default new StatusTypeService();