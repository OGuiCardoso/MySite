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
        type: String,
        required: true
    },
    technologies: {
        type: String,
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


// const addProject = async () => {
//     const p = new Project({
//         title: 'test project',
//         link: 'https://test',
//         description: 'aaaaaaaaaaaaaaa'
//     })
//     await p.save();
// }
// addProject()

// async function conectDb() {
//     mongoose.connect('mongodb://127.0.0.1:27017/mysite')
//     console.log('Data base connected')
// }
// conectDb().catch(e => console.log(e))
