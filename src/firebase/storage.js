import { storage } from './fbconfig';
import { ref, getDownloadURL, uploadBytesResumable, deleteObject } from '@firebase/storage';

export function UploadImage(name, image) {
  const storageRef = ref(storage, `images/${name}`);
  const uploadTask = uploadBytesResumable(storageRef, image);

  uploadTask.on('state_changed', (snap) => {
    const progress = (snap.bytesTransferred / snap.totalBytes) * 100;
    console.log(`Upload ${progress}% done.`)
  }, (err) => {
    console.error(err);
  });

  return new Promise((resolve, reject) => {
    uploadTask.then(async snap => {
      try {
        const url = await getDownloadURL(snap.ref);
        resolve(url);
      } catch (err) {
        reject(err);
      }
    }).catch(err => {
      reject(err);
    });
  });
}

export function DeleteImage(url) {
  const storageRef = ref(storage, url);
  return deleteObject(storageRef);
}