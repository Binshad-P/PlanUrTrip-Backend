import Activity from "../models/activityModel.js";
import Aws from "aws-sdk";
import dotenv from "dotenv";
import crypto from "crypto";
import { log } from "console";
dotenv.config();

const randomImageName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");
const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRECT_ACCESS_KEY;

const s3 = new Aws.S3({
  accessKeyId: accessKey,
  secretAccessKey: secretAccessKey,
});

//upload activities

export const addActivity = async (req, res) => {
  const { title, description, day_activities, packageId } = req.body;
  if (!packageId || !title || !description || !day_activities || !req.file) {
    res.status(404).json({ message: "All feild are mandatory" });
    return;
  }
  const existingActivity = await Activity.findOne({ title });
  if (existingActivity) {
    res.status(403).json({ message: "package already exist" });
    return;
  }
  const imagename = randomImageName();
  const params = {
    Bucket: bucketName,
    Key: `activity/${imagename}`,
    Body: req.file?.buffer,
    ACL: "public-read-write",
    ContentType: req.file?.mimetype,
  };
  let path;
  s3.upload(params, async (err, data) => {
    path = data.Location;

    const Activities = new Activity({
      packageId,
      title,
      description,
      day_activities,
      image: path,
    });
    await Activities.save();
    res.status(201).json({ message: "Activity saved successfully" });
    return;
  });
};
//Get all activity Details
export const activityDetails = async (req, res) => {
  const activity_Details = await Activity.find();
  res.status(201).json({ message: "Get all details", activity_Details });
};

//Get Single Details
export const singleactivityDetails = async (req, res) => {
  const { activityId } = req.params;
  try {
    const Activity_data = await Activity.findById(activityId);
    res.status(201).json({ message: "Get single details", Activity_data });
    return;
  } catch (error) {
    console.log(error);
  }
};
//Update Activity
export const updateActivity = async (req, res) => {
  const { activityId } = req.params;
  try {
    if (req.file) {
      const removeData = await Activity.findById(activityId);
      let path = removeData.image.split("/")[3];
      let path2 = removeData.image.split("/")[4];
      const params = {
        Bucket: bucketName,
        Key: `${path}/${path2}`,
      };
      new Promise((resolve, reject) => {
        s3.createBucket(
          {
            Bucket: bucketName /* Put your bucket name */,
          },
          function () {
            s3.deleteObject(params, function (err, data) {
              if (err) reject(err);
              else resolve(data);
            });
          }
        );
      });
      const imagename = randomImageName();
      const addParams = {
        Bucket: bucketName,
        Key: `activity/${imagename}`,
        Body: req.file?.buffer,
        ACL: "public-read-write",
        ContentType: req.file?.mimetype,
      };

      let path1;
      s3.upload(addParams, async (err, data) => {
        path1 = data.Location;

        Object.assign(req.body, { image: path1 });
        await Activity.findByIdAndUpdate(activityId, req.body);
        res.status(201).json({ message: "Update Package Successfully" });
        return;
      });
    } else {
      await Activity.findByIdAndUpdate(activityId, req.body);
      res.status(201).json({ message: "Update Package Successfully" });

      return;
    }
  } catch (error) {
    console.log(error);
  }
};

//remove activity

export const deleteAactivity = async (req, res) => {
  const { activityId } = req.params;
  try {
    const removeData = await Activity.findById(activityId);
    let path = removeData.image.split("/")[3];
    let path2 = removeData.image.split("/")[4];
    const params = {
      Bucket: bucketName,
      Key: `${path}/${path2}`,
    };
    new Promise((resolve, reject) => {
      s3.createBucket(
        {
          Bucket: bucketName /* Put your bucket name */,
        },
        function () {
          s3.deleteObject(params, function (err, data) {
            if (err) reject(err);
            else resolve(data);
          });
        }
      );
    });

    await Activity.findByIdAndDelete(activityId);
    res.status(201).json({ message: "Delete Activity Successfully" });

    return;
  } catch (error) {
    console.log(error);
  }
};
//////////////////////////////////////////////get activity details based on Destination

export const destinationBasedActivityDetails = async (req, res) => {
  const { packageId } = req.params;
  try {
    const activity_Details = await Activity.find({ packageId });
    res.status(201).json({ message: "Get all details", activity_Details });
  } catch (error) {}
};
