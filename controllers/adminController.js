import Admin from "../models/adminModel.js";
import jwt from "jsonwebtoken";
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(404).json({ message: "All feild are mandatory" });
  }
  const existingAdmin = await Admin.findOne({ email });
  if (!existingAdmin) {
    res.status(404).json({ message: "pls enter correct email" });
  } else {
    if (password !== existingAdmin.password) {
      res.status(404).json({ message: "password doest match" });
    } else {
      let resp = {
        id: existingAdmin._id,
      };
      let token = jwt.sign(resp, "secret", { expiresIn: 120 });
      res.status(200).send({ auth: true, token });
    }
  }
};
