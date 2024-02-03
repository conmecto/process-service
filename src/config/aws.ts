import { S3Client, CreateBucketCommand, HeadBucketCommand, PutPublicAccessBlockCommand } from '@aws-sdk/client-s3';
import { Environments, enums } from '../utils';

const runAwsFile = () => {};

let s3Client: S3Client;

(async function checkOrCreateBucket() {
    let checkBucketExists = false;
    if (Environments.env !== 'prod') {
        return;
    }
    s3Client = new S3Client({ 
        credentials: {
            accessKeyId: Environments.aws.accessKeyId,
            secretAccessKey: Environments.aws.secretAccessKey,
        },
        region: Environments.aws.s3Region
    });
    if (!s3Client) {
        throw new Error('S3 client not found');
    } 
    try {
        const command = new HeadBucketCommand({
            Bucket: Environments.aws.s3LogBucket
        });            
        const res = await s3Client.send(command);
        checkBucketExists = true; 
    } catch(error) {
        console.log(enums.PrefixesForLogs.AWS_CHECK_BUCKET_ERROR + error);
    }

    try {
        if (checkBucketExists) {
            return;
        }
        const createCommand = new CreateBucketCommand({
            Bucket: Environments.aws.s3LogBucket,
            CreateBucketConfiguration: {
                LocationConstraint: Environments.aws.s3Region
            },
            ObjectOwnership: 'BucketOwnerPreferred',
        });
        const updateBucketCommand = new PutPublicAccessBlockCommand({
            Bucket: Environments.aws.s3LogBucket,
            PublicAccessBlockConfiguration: {
                BlockPublicAcls: false
            }
        });
        const [createRes, updateRes] = await Promise.all([
            s3Client.send(createCommand),
            s3Client.send(updateBucketCommand)
        ]);
    } catch(error) {
        console.log(enums.PrefixesForLogs.AWS_CREATE_BUCKET_ERROR + error);
    }
})();

export { runAwsFile, s3Client }

