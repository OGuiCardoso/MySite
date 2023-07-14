import mongoose from "mongoose";
const { Schema } = mongoose;

const projectSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
    },
    description: {
        type: String,
        required: true
    },
    text: {
        type: [String],
        required: true
    },
    technologies: {
        type: [String],
        Required: true
    },
    repository: {
        type: String,
        required: true
    },
    image: {
        url: {
            type: String,
            required: true
        },
        filename: {
            type: String,
            required: true
        }
    }
})

const Project = mongoose.model('Project', projectSchema);
export default Project
