if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const uploadToStorage = async (file, folder) => {
  const fileName = `${Date.now()}_${file.name}`;
  const storagePath = `${folder}/${fileName}`;
  const fileRef = storage.ref(storagePath);

  await fileRef.put(file);
  const fileURL = await fileRef.getDownloadURL();
  console.log('Arquivo enviado para o Storage:', { file, storagePath, fileURL });

  return { url: fileURL, name: fileName };
};

const getFileURL = async (path) => {
  const fileRef = storage.ref(path);
  const fileURL = await fileRef.getDownloadURL();
  console.log('URL do arquivo recuperada do Storage:', { path, fileURL });
  return fileURL;
};

const deleteFromStorage = async (path) => {
  const fileRef = storage.ref(path);
  await fileRef.delete();
  console.log('Arquivo removido do Storage:', path);
};
