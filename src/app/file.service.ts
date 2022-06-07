import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) {
  }

  getAllFolder() {
    let result = this.http.get(environment.ip + '/rest_file_folders').pipe(map((response: Response) => response));
    return result;
  }

  getAllSharedFile() {
    let result = this.http.get(environment.ip + '/rest_share_files').pipe(map((response: Response) => response));
    return result;
  }

  getAllSharedFileByAdmin() {
    let result = this.http.get(environment.ip + '/rest_shared_files_by_admin').pipe(map((response: Response) => response));
    return result;
  }

  getAllFile(page = 1) {
    let result = this.http.get(environment.ip + '/rest_files?page=' + page).pipe(map((response: Response) => response));
    return result;
  }

  uploadFile(file: any) {
    let result = this.http.post(environment.ip + '/rest_files', file).pipe(map((response: Response) => response));
    return result;
  }

  createFolder(name: any) {
    let result = this.http.post(environment.ip + '/rest_file_folders', name).pipe(map((response: Response) => response));
    return result;

  }

  loadNextFolder(id: number) {
    let result = this.http.get(environment.ip + '/rest_file_folders/' + JSON.stringify(id)).pipe(map((response: Response) => response));
    return result;
  }

  getEncriptkey(id: number) {
    let result = this.http.get(environment.ip + '/rest_files_public_link/' + id).pipe(map((response: Response) => response));
    return result;
  }

  downloadFileURL(id: number) {
    if (id != undefined) {
      let result = this.http.get(environment.ip + '/rest_files_public_link/' + id).pipe(map((response: Response) => response));
      return result;
    }
  }

  downloadSendFileURL(id: number) {
    if (id != undefined) {
      // let result  = this.http.get(environment.ip+'/rest_files_download/'+id).map((response: Response) => response);
      //return result;

      return this.http.get(environment.ip + '/rest_files_download/' + id,
        {responseType: 'blob'}).pipe(
        map(
          (res: any) => {
            return res;
          }));
    }
  }

  downloadFile(url: string) {
    let result = this.http.get(url).pipe(map((response: Response) => response));
    return result;
  }

  updateFileProp(row: any, id: number) {
    let result = this.http.patch(environment.ip + '/rest_files/' + id, row).pipe(map((response: Response) => response));
    return result;
  }

  updateFolderProp(row: any, id: number) {
    let result = this.http.patch(environment.ip + '/rest_file_folders/' + id, row).pipe(map((response: Response) => response));
    return result;
  }

  shareFile(shareobj: any) {
    let result = this.http.post(environment.ip + '/rest_share_files', shareobj).pipe(map((response: Response) => response));
    return result;
  }

  getFile(id: number) {
    let result = this.http.get(environment.ip + '/rest_files/' + id).pipe(map((response: Response) => response));
    return result;
  }

  getDirectory() {
    let result = this.http.get(environment.ip + '/get_directory');
    return result;
  }

  getDirectorytype() {
    let result = this.http.get(environment.ip + '/get_user_status');
    return result;
  }

  userDirectoryStatus(data: any) {
    let result = this.http.post(environment.ip + '/update_user_status', data);
    return result;
  }

  versionUploadFile(id: number, file: any) {
    let result = this.http.post(environment.ip + '/rest_files_new/' + id, file).pipe(map((response: Response) => response));
    return result;
  }

  preview(id: number) {
    let result = this.http.get(environment.ip + '/rest_files_preview/' + id).pipe(map((response: Response) => response));
    return result;
  }

  uploadFileTos3(file: any) {
    let result = this.http.post(environment.ip + '/rest_email_image', file).pipe(map((response: Response) => response));
    return result;
  }
}
