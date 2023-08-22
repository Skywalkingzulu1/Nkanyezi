const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public")); // Serve static files from the "public" directory

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
