export interface IGoogleCloudService {
  list_files(): Promise<any>;
  upload_file(filePath, file): Promise<any>;
}
