// const user_api = require("./user_route.js");
// const project_collection_route = require("./project_collection_route.js");
// const cloudinaryDelete = require("./CloudinaryDelete.js");
const port = process.env.PORT || 4000;
function routes(app) {
    
// app.use("/api/auth", user_api);
// app.use("/api/projects", project_collection_route);
// app.use("/api/delete-file", cloudinaryDelete);

app.get("/", (req, res) => {
    res.send(
        `<h1>Welcome to EduProjectLog API</h1><p>Worker ${process.pid} is listening on port ${port}</p>`
    );
});    

}

module.exports = routes;