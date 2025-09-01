import Resources from "../models/Resources.model.js";

 const createResource = async (req, res) => {
    const { title, description, link } = req.body;

    if (!title && !description && !link) {
        return res.status(400).json({ message: "Title, description and link are required" });
    }

    try { 
        const resource = await Resources.create({ title, description, link });
        res.status(201).json({ message: "Resource created successfully", resource });
    } catch (error) {
        res.status(500).json({ message: "Failed to create resource", error: error.message });
    }

}

const getAllResources = async (req, res) => {
    try {
        const resources = await Resources.find();
        res.status(200).json({ message: "Resources fetched successfully", resources });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch resources", error: error.message });
    }
}

const getResourceById = async (req, res) => {
    const { id } = req.params;
    try {
        const resource = await Resources.findById(id);
        res.status(200).json({ message: "Resource fetched successfully", resource });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch resource", error: error.message });
    }
}

const updateResourceById = async (req, res) => {
    const { id } = req.params;
    const { title, description, link } = req.body;
    try {
        const resource = await Resources.findByIdAndUpdate(id, { title, description, link }, { new: true });
        res.status(200).json({ message: "Resource updated successfully", resource });
    } catch (error) {
        res.status(500).json({ message: "Failed to update resource", error: error.message });
    }
}

const deleteResourceById = async (req, res) => {
    const { id } = req.params;
    try {
        const resource = await Resources.findByIdAndDelete(id);
        res.status(200).json({ message: "Resource deleted successfully", resource });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete resource", error: error.message });
    }
}

export { createResource, getAllResources, getResourceById, updateResourceById, deleteResourceById }; 