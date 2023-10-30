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
      await this.storage.bucket(this.bucketName).file(filePath).save(file.data);
      return true;
    } catch (e) {
      console.error(
        `Error while uploading a file to ${this.bucketName}, Error: ` + e,
      );
      return null;
    }
  }

  public async get_file_url(filePath) {
    try {
      const file = await this.storage.bucket(this.bucketName).file(filePath);
      const videoData = await file.download();

      return videoData;
    } catch (e) {}
  }
}
