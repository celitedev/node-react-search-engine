/* eslint no-alert: 0 */
import _ from 'lodash';

export default function uploadFiles(uploadFunc, files, ...args) {
  const uploaded = [];
  if (files) {
    _.each(files, file => {
      if (file.size <= 26214400) {
        uploadFunc(file, ...args);
        uploaded.push(file);
      } else {
        alert(`File ${file.name} exceeds allowed size limit 25Mb.\n Actual file size is ${(file.size / 1024 / 1024).toFixed(1)}Mb`);
      }
    });
  }
  return uploaded;
}
