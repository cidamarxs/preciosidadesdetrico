if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const uploadFile = async (file, path) => {
  const storageRef = storage.ref(path);
  await storageRef.put(file);
  const fileURL = await storageRef.getDownloadURL();
  console.log('Arquivo enviado para o Storage:', { file, path, fileURL });
  return fileURL;
};

const deleteFile = async (path) => {
  const fileRef = storage.ref(path);
  await fileRef.delete();
  console.log('Arquivo removido do Storage:', path);
};
