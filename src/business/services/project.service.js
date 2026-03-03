import mongoose from "mongoose";
import projectRepository from "../../data/repositories/project.repository.js";

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

class ProjectService {

    /**
     * @route   POST /api/projects/
     * @desc    Create a new project   
     * @body    { name, key, description?, lead_id }
     * @returns 201 OK | 402 Not Required | 406 Not Validate | 409 Already Exists |500 Internal Server Error
    **/    
    async createProject(data) {
        const { name, key, lead_id } = data;

        if (!name || !key || !lead_id) {
            throw { status: 402, message: "name, key and lead_id are required" };
        }

        if (!validateObjectId(lead_id)) {
            throw { status: 406, message: "Invalid lead_id" };
        }

        const existing = await projectRepository.findByKey(key);
        if (existing) {
            throw { status: 409, message: "Project key already exists" };
        }

        return await projectRepository.create(data);
    }

    /**
     * @route   GET /api/projects/
     * @desc    Get all projects
     * @body    { }
     * @returns 200 OK | 500 Internal Server Error
    **/
    async getAllProjects() {
        return await projectRepository.findAll();
    }

    /**
     * @route   GET /api/projects/{projectID}
     * @desc    Get all project by ID
     * @body    { }
     * @returns 200 OK | 400 Invalid ID | 404 Not Found | 500 Internal Server Error
    **/
    async getProjectById(id) {
        if (!validateObjectId(id)) {
            throw { status: 400, message: "Invalid project ID" };
        }

        const project = await projectRepository.findById(id);
        if (!project) {
            throw { status: 404, message: "Project not found" };
        }

        return project;
    }

    /**
     * @route   POST /api/projects/{projectID}
     * @desc    Update project by ID   
     * @body    { name, key, description?, lead_id }
     * @returns 200 OK | 400 Invalid ID | 404 Not Found | 405 Bad Request | 406 Not Validate | 409 Already Exist | 500 Internal Server Error
    **/
    async updateProject(id, data) {
        if (!validateObjectId(id)) {
            throw { status: 400, message: "Invalid project ID" };
        }

        if (!data || Object.keys(data).length === 0) {
            throw { status: 405, message: "Bad Request" };
        }

        if (data.lead_id && !validateObjectId(data.lead_id)) {
            throw { status: 406, message: "Invalid lead_id" };
        }

        // Nếu update key thì check trùng
        if (data.key) {
            const existing = await projectRepository.findByKey(data.key);
            if (existing && existing._id.toString() !== id) {
                throw { status: 409, message: "Project key already exists" };
            }
        }

        const project = await projectRepository.update(id, data);
        if (!project) {
            throw { status: 404, message: "Project not found" };
        }

        return project;
    }

    /**
     * @route   DELETE /api/projects/{projectID}
     * @desc    Delete project by ID
     * @body    { }
     * @returns 200 OK | 400 Invalid ID | 404 Not Found | 500 Internal Server Error
    **/
    async deleteProject(id) {
        if (!validateObjectId(id)) {
            throw { status: 400, message: "Invalid project ID" };
        }

        const project = await projectRepository.delete(id);
        if (!project) {
            throw { status: 404, message: "Project not found" };
        }

        return project;
    }
}

export default new ProjectService();