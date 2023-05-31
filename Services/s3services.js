// ? Services: contain network calls, modifies controller folder
const AWS = require("aws-sdk");
const dotenv = require("dotenv");
dotenv.config();

async function uploadToS3(data, filename) {
  try {
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;
    // ? AWS related settings in the following link
    // https://youtu.be/ihZ6aHiOIWQ?list=PL4dunL3FOEk0XNSrauPcapBXdyojKlM9x&t=771

    let s3bucket = new AWS.S3({
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET,
    });

    var params = {
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: data,
      ACL: "public-read",
    };
    return new Promise((resolve, reject) => {
      s3bucket.upload(params, (error, s3response) => {
        if (error) {
          console.log({ s3buckerError: error });
          reject(error);
        } else {
          // console.log({ s3bucketSuccess: s3response });
          resolve(s3response.Location);
        }
      });
    });
  } catch (error) {
    console.log({ uploadToS3ControllerError: error });
  }
}

module.exports = {
  uploadToS3,
};
