import mongoose from "mongoose";
import Project from "./models/projects.js";

async function conectDb() {
    await mongoose.connect('mongodb://127.0.0.1:27017/mysite')
    console.log('Data base connected')
}
conectDb().catch(e => console.log(e))


const seedDb = async () => {
    await Project.deleteMany({});
    for (let i = 1; i <= 20; i++) {
        const project = new Project({
            title: `Test project ${i}`,
            link: `https://testproject${i}`,
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Illum similique quam adipisci qui facilis amet facere animi magni quos ipsum quibusdam fugiat provident voluptatibus voluptatum officia atque quo iure!Distinctio?',
            text: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which dont look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isnt anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.',
            image: 'https://images.unsplash.com/photo-1583339793403-3d9b001b6008?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNpdGVzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60'
        })
        await project.save()
    }
}
seedDb();
