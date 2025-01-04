import AWS from "aws-sdk";
import axios from "axios";

const s3 = new AWS.S3();
const ssm = new AWS.SSM();

interface LambdaResponse {
  statusCode: number;
  body: string;
}

export const handler = async (): Promise<LambdaResponse> => {
  try {
    const parameter = await ssm
      .getParameter({ Name: "/energy-market-france/source-url" })
      .promise();
    const fileUrl = parameter.Parameter?.Value;

    if (!fileUrl) {
      throw new Error("File URL is not defined in SSM Parameter Store.");
    }

    console.log(`Downloading file from ${fileUrl}...`);
    const fileData = await downloadFile(fileUrl);

    const bucketName = process.env.S3_BUCKET;
    const objectKey = `data/${new Date().toISOString()}.zip`;

    if (!bucketName) {
      throw new Error("S3_BUCKET environment variable is not set.");
    }

    console.log(`Uploading file to S3 bucket: ${bucketName}...`);
    await s3
      .putObject({ Bucket: bucketName, Key: objectKey, Body: fileData })
      .promise();

    console.log(`File successfully uploaded to S3: ${objectKey}`);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "File uploaded successfully." }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to download/upload file." }),
    };
  }
};

function downloadFile(url: string): Promise<Buffer> {
  return axios
    .get(url, { responseType: "arraybuffer", maxRedirects: 5 }) // Automatically follow up to 5 redirects
    .then((response) => Buffer.from(response.data))
    .catch((error) => {
      throw new Error(`Failed to get '${url}': ${error.message}`);
    });
}
