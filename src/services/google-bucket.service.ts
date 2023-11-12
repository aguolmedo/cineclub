// Imports the Google Cloud client library
import { Storage } from '@google-cloud/storage';
import { IGoogleCloudService } from './interface/igoogle-bucket.interface';
import { injectable } from 'inversify';

// For more information on ways to initialize Storage, please see
// https://googleapis.dev/nodejs/storage/latest/Storage.html

@injectable()
export class GoogleCloudService implements IGoogleCloudService {
  public storage = new Storage({
    keyFilename: 'cineclub-service-account.json',
  });
  public bucketName = 'cineclub-cloud-bucket';

  public async list_files() {
    // Lists files in the bucket
    const [files] = await this.storage.bucket(this.bucketName).getFiles();

    console.log('Files:');
    files.forEach((file) => {
      console.log(file.name);
    });

    return true;
  }

  public async upload_file(filePath: string, file) {
    try {
      await this.storage
        .bucket(this.bucketName)
        .file(filePath)
        .save(file.data, {
          gzip: true,

          metadata: {
            cacheControl: 'no-cache',
          },
        });

      return this.get_file_url(filePath);
    } catch (e) {
      console.error(
        `Error while uploading a file to ${this.bucketName}, in route: ${filePath} Error: ` +
          e,
      );
      return null;
    }
  }

  public async get_file_url(filePath) {
    try {
      return `https://storage.googleapis.com/${this.bucketName}/${filePath}`;
    } catch (e) {
      console.log(e);
      return;
    }
  }
}
