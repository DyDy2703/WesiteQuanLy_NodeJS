import mongoose from "mongoose";
import priorityTypeRepository from "../../data/repositories/prioritytype.repository.js";
import Issue from "../../models/issue.model.js";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

class PriorityTypeService {

    /**
     * @route   POST /api/priority-types/
     * @desc    Create a new priority type
     * @body    { name, level }
     * @returns 201 Created | 402 Not Required | 409 Already Exists | 500 Internal Server Error
    **/
    async createPriorityType(data) {
        const { name, level } = data;

        if (!name || level === undefined) {
            throw { status: 402, message: "name and level are required" };
        }

        const exist = await priorityTypeRepository.findByName(name);
        if (exist) {
            throw { status: 409, message: "Priority type already exists"};
        }

        return await priorityTypeRepository.create({ name, level });
    }

    /**
     * @route   GET /api/priority-types/
     * @desc    Get all priority types
     * @body    {  }
     * @returns 200 OK | 500 Internal Server Error
    **/
    async getAllPriorityTypes() {
        return await priorityTypeRepository.findAll();
    }

    /**
     * @route   GET /api/priority-types/{priorityTypeID}
     * @desc    Get priority type by ID
     * @body    {  }
     * @returns 200 OK | 400 Invalid ID | 404 Not Found | 500 Internal Server Error
    **/
    async getPriorityTypeById(id) {
        if (!validateObjectId(id)) {
            throw { status: 400, message: "Invalid ID" };
        }

        const type = await priorityTypeRepository.findById(id);
        if (!type) {
            throw { status: 404, message: "Priority type not found" };
        }

        return type;
    }

    /**
     * @route   PUT /api/priority-types/{priorityTypeID}
     * @desc    Update priority type by ID
     * @body    { name, level }
     * @returns 200 OK | 400 Invalid ID | 404 Not Found | 405 Bad Request | 409 Already Exists | 500 Internal Server Error
    **/
    async updatePriorityType(id, data) {
        if (!validateObjectId(id)) {
            throw { status: 400, message: "Invalid ID" };
        }

        const current = await priorityTypeRepository.findById(id);
        if (!current) {
            throw { status: 404, message: "Priority type not found" };
        }

        const { name, level } = data;

        if (!name && level === undefined) {
            throw { status: 405, message: "No fields provided to update"};
        }

        // Nếu đổi name thì mới check trùng
        if (name && name !== current.name) {
        const exist = await priorityTypeRepository.findByName(name);
        if (exist) {
            throw { status: 409, message: "Priority type name already exists" };
        }
        }

        return await priorityTypeRepository.update(id, {
            name: name ?? current.name,
            level: level ?? current.level,
        });
    }

    /**
     * @route   DELETE /api/priority-types/{priorityTypeID}
     * @desc    Delete priority type (prevent if being used by issues)
     * @body    { }
     * @returns 200 OK | 400 Invalid ID | 404 Not Found | 408 In Use | 500 Internal Server Error
    **/
    async deletePriorityType(id) {
        if (!validateObjectId(id)) {
            throw { status: 400, message: "Invalid ID" };
        }

        const type = await priorityTypeRepository.findById(id);
        if (!type) {
            throw { status: 404, message: "Priority type not found" };
        }

        // Không cho xóa nếu đang được Issue sử dụng
        const issueUsing = await Issue.findOne({ priority_type_id: id });
        if (issueUsing) {
            throw { status: 408, message: "Priority type is in use" };
        }

        await priorityTypeRepository.delete(id);

        return true;
    }
}

export default new PriorityTypeService();