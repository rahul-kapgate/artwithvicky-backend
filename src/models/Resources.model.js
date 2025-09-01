import mongoose from "mongoose";


const resourcesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },   
},
{
    timestamps: true,
}
)

const Resources = mongoose.model("Resources", resourcesSchema);

export default Resources;