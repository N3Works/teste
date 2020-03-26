'use strict'

class FirestoreApi {
    constructor (driver){
        this.__driver = driver;
    }

    getProjects({ firstParam, operator, secondParam }) {
        let projectsRef = this.__driver.collection("projects");
        return projectsRef.where(firstParam, operator, secondParam).get().then((snapshot) => {
            let projects = [];
            
            for (const project of snapshot.docs) {
                projects.push(project.data());
            }
            return Promise.resolve(projects);
        });
    }
}

module.exports = FirestoreApi;