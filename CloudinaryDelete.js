const cloudinary = require("cloudinary");
const dotenv = require("dotenv");
const process = require("process");
const { Router } = require("express");

const router = Router();

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

router.delete("/", async (req, res) => {

  try {

    const { public_id } = req.body;

    console.log("public_id", public_id);

    if (!public_id) {
      return res.status(400).json({ error: "Public ID is required" });
    }

    // Destroy file by public ID
    cloudinary.uploader.destroy(
      public_id,
      { resource_type: 'raw' }, 
      (error, result) => {
        if (error) {
          console.log(error);
          return res  
            .status(500)
            .json({ error: "Failed to delete the PDF", details: error });
        }
        console.log(result);
        return res.json({ message: "PDF deleted successfully", result });
      }
    );    

  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
}
);

module.exports = router;
