import Video from "../models/Video.model.js";

const SaveVideo = async (req, res) => {
    const { title, description, videoUrl } = req.body;

    if (!title || !videoUrl) {
        return res.status(400).json({ message: "Title and video URL are required" });
    }

    try {
        const video = await Video.create({ title, description, videoUrl });
    }catch (error) {
        return res.status(500).json({ message: "Error saving video", error: error.message });
    }

    return res.status(201).json({ message: "Video saved successfully", title });
}

const GetAllVideos = async (req, res) => {
    try {
        const videos = await Video.find();
        return res.status(200).json(videos);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching videos", error: error.message });
    }
}

export { SaveVideo, GetAllVideos };