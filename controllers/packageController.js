import Package from "../models/packageModel.js";
import Aws from "aws-sdk";
import dotenv from "dotenv";
import crypto from "crypto";
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
///////////////////////////////////////////////////////////////////////upload package//

export const addPackage = async (req, res) => {
  const {
    city_name,
    short_description,
    description,
    season,
    highlights,
   
  } = req.body;
  let results = [];
  const uploadPromises = req.files?.map(async (item) => {
    const imagename = randomImageName();
    const params = {
      Bucket: bucketName,
      Key: `package/${imagename}`,
      Body: item?.buffer,
      ACL: "public-read-write",
      ContentType: item?.mimetype,
    };
    return new Promise((resolve, reject) => {
      s3.upload(params, (error, data) => {
        if (error) {
          reject(error);
        }
        resolve(data);
      });
    });
  });
  const uploadResults = await Promise.all(uploadPromises);
  uploadResults?.map((item) => {
    results.push(item?.Location);
  });
  if (
    !city_name ||
    !short_description ||
    !description ||
    !season ||
    !highlights
   
  ) {
    res.status(404).json({ message: "All feild are mandatory" });
    return;
  }
  const existingPackage = await Package.findOne({ city_name });
  if (existingPackage) {
    res.status(403).json({ message: "package already exist" });
    return;
  }
  if (results.length !== 0) {
    const tripPackage = new Package({
      city_name,
      short_description,
      description,
      season,
      images: results,
      highlights,
     
    });
    await tripPackage.save();
    res.status(201).json({ message: "Package saved successfully" });
    return;
  }
};

// ///////////////////////////////////////////////////////////All package Details

export const packageDetails = async (req, res) => {
  const package_details = await Package.find();
  res.status(201).json({ message: "Get all details",package_details });

};

////////////////////////////////////////////////////////////Single Package Details

export const singlePackageDetails = async (req, res) => {
  const { packageId } = req.params;
  try {
    const packageData = await Package.findById(packageId);
    res.status(201).json({ message: "Get single details",packageData });
 
    return;
  } catch (error) {
    console.log(error, "err");
  }
};
////////////////////////////////////////////////////////////Update package details

export const updatePackage = async (req, res) => {
  const { packageId } = req.params;

  try {
    console.log(req?.files,67);
    console.log(req?.body,67);
    if (req.files.length !== 0) {
      const removeData = await Package.findById(packageId);
      const deletesS3File = removeData.images.map((data) => {
        let path = data.split("/")[3];
        let path2 = data.split("/")[4];

        const params = {
          Bucket: bucketName,
          Key: `${path}/${path2}`,
        };
        return new Promise((resolve, reject) => {
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
      });
      await Promise.all(deletesS3File);
      let results = [];
      const uploadPromises = req.files?.map(async (item) => {
        const imagename = randomImageName();
        const params = {
          Bucket: bucketName,
          Key: `package/${imagename}`,
          Body: item?.buffer,
          ACL: "public-read-write",
          ContentType: item?.mimetype,
        };
        return new Promise((resolve, reject) => {
          s3.upload(params, (error, data) => {
            if (error) {
              reject(error);
            }
            resolve(data);
          });
        });
      });
      const uploadResults = await Promise.all(uploadPromises);
      uploadResults?.map((item) => {
        results.push(item?.Location);
      });

      Object.assign(req.body, { images: results });

      await Package.findByIdAndUpdate(packageId, req.body);

      res.status(201).json({ message: "Update Package Successfully" });
      return;
    } else {
   
      await Package.findByIdAndUpdate(packageId, req.body);

      res.status(201).json({ message: "Update Package Successfully" });
      return;
    }
  } catch (error) {
    res.status(404).json({ message: "Error" });
    console.log(error);
  }
};

//////////////////////////////////////////////////////////remove package details

export const deletePackage = async (req, res) => {
  const { packageId } = req.params;
  
  try {
    const removeData = await Package.findById(packageId);
    const deletesS3File = removeData.images.map((data) => {
      let path = data.split("/")[3];
      let path2 = data.split("/")[4];

      const params = {
        Bucket: bucketName,
        Key: `${path}/${path2}`,
      };
      return new Promise((resolve, reject) => {
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
    });
    await Promise.all(deletesS3File);
    await Package.findByIdAndDelete(packageId);
    res.status(201).json({ message: "Delete Package Successfully" });

    return;
  } catch (error) {
    console.log(error);
  }
};

////////////////////////////////////////////////////////Season Based Destination Filter

export const seasonDestination = async (req, res) => {

  const package_details = await Package.find();
  function getSeason() {
    // if()
    const currentMonth = new Date().getMonth() + 1; // Months are zero-indexed, so add 1

    if (currentMonth >= 3 && currentMonth <= 6) {
      return "Summer";
    } else if (currentMonth >= 7 && currentMonth <= 9) {
      return "Monsoon";
    } else if (currentMonth >= 10 && currentMonth <= 11) {
      return "Autumn";
    } else if (
      currentMonth === 12 ||
      (currentMonth >= 1 && currentMonth <= 2)
    ) {
      return "Winter";
    } else {
      return "Invalid month";
    }
  }
  const currentSeason = getSeason();


  const filteredPackages = package_details.filter((pkg) => {
    return pkg.season == currentSeason
  });
  res.status(200).json({ message: "Get Season Based Destination",filteredPackages });
  return;
};
