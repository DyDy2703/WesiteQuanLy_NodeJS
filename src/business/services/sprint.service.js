import mongoose from "mongoose";
import sprintRepository from "../../data/repositories/sprint.repository.js";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

class SprintService {

    /**
     * @route   POST /api/sprints/
     * @desc    Create a new sprint   
     * @body    { name, project_id, start_date?, end_date?, status? }
     * @returns 201 OK | 402 Not Required | 405 Bad Request | 406 Not Validate | 500 Internal Server Error
    **/
    async createSprint(data) {
        const { name, project_id, start_date, end_date } = data;

        if (!name || !project_id) {
            throw { status: 400, message: "name and project_id are required" };
        }

        if (!validateObjectId(project_id)) {
            throw { status: 406, message: "Invalid project_id" };
        }

        // Validate date logic
        if (start_date && end_date) {
            if (new Date(start_date) > new Date(end_date)) {
                throw { status: 405, message: "start_date must be before end_date" };
            }
        }

        return await sprintRepository.create(data);
    }

    /**
     * @route   GET /api/sprints/
     * @desc    Get all sprints
     * @body    { }
     * @returns 200 OK | 500 Internal Server Error
    **/
    async getAllSprints() {
        return await sprintRepository.findAll();
    }

    /**
     * @route   GET /api/sprints/{sprintID}
     * @desc    Get all sprints by ID
     * @body    { }
     * @returns 200 OK | 400 Invalid ID | 404 Not Found | 500 Internal Server Error
    **/
    async getSprintById(id) {
        if (!validateObjectId(id)) {
            throw { status: 400, message: "Invalid ID" };
        }

        const sprint = await sprintRepository.findById(id);
        if (!sprint) {
            throw { status: 404, message: "Sprint not found" };
        }

        return sprint;
    }

    /**
     * @route   PUT /api/sprints/{sprintID}
     * @desc    Update sprint by ID   
     * @body    { name?, project_id?, start_date?, end_date?, status? }
     * @returns 200 OK | 400 Invalid ID | 404 Not Found | 405 Bad Request | 500 Internal Server Error
    **/
    async updateSprint(id, data) {
        if (!validateObjectId(id)) {
            throw { status: 400, message: "Invalid ID" };
        }

        if (!data || Object.keys(data).length === 0) {
            throw { status: 405, message: "Bad Request" };
        }

        if (data.project_id && !validateObjectId(data.project_id)) {
            throw { status: 406, message: "Invalid project_id" };
        }

        // Không cho sửa ngày bắt đầu nếu đã active
        if (
            uppcase(existingSprint.status) === "ACTIVE" &&
            data.start_date &&
            new Date(data.start_date).getTime() !==
            new Date(existingSprint.start_date).getTime()
        ) {
            throw { status: 406, message: "Cannot modify start_date when sprint is ACTIVE" };
        } 

        if (data.start_date && data.end_date) {
            if (new Date(data.start_date) > new Date(data.end_date)) {
                throw { status: 405, message: "start_date must be before end_date" };
            }
        }

        const sprint = await sprintRepository.update(id, data);
        if (!sprint) {
            throw { status: 404, message: "Sprint not found" };
        }

        return sprint;
    }

    /**
     * @route   DELETE /api/sprints/{sprintID}
     * @desc    Delete sprint by ID
     * @body    { }
     * @returns 200 OK | 400 Invalid ID | 404 Not Found | 500 Internal Server Error
    **/
    async deleteSprint(id) {
        if (!validateObjectId(id)) {
            throw { status: 400, message: "Invalid ID" };
        }

        const sprint = await sprintRepository.delete(id);
        if (!sprint) {
            throw { status: 404, message: "Sprint not found" };
        }

        // Không cho xóa nếu còn Issue liên quan 
        const issueCount = await Issue.countDocuments({ sprint_id: id });
        if (issueCount > 0) {
            throw { status: 406, message: "Cannot delete sprint because it still has issues" };
        }
        return sprint;
    }
}

export default new SprintService();