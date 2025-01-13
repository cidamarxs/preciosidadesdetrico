import firebase from "firebase/app";
import "firebase/storage";
import firebaseConfig from "./firebaseConfig";

// Inicializando o Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Referência ao Firebase Storage
const storage = firebase.storage();

/**
 * Função para fazer upload de um arquivo.
 * @param {File} file - O arquivo a ser carregado.
 * @param {string} folder - A pasta de destino no Firebase Storage.
 * @returns {Promise<{ url: string, name: string }>} - Retorna um objeto contendo a URL pública e o nome do arquivo.
 */
export const uploadToStorage = async (file, folder) => {
  const fileName = `${Date.now()}_${file.name}`;
  const storagePath = `${folder}/${fileName}`;
  const fileRef = storage.ref(storagePath);

  await fileRef.put(file);
  const fileURL = await fileRef.getDownloadURL();

  return { url: fileURL, name: fileName };
};

/**
 * Função para obter a URL de um arquivo no Firebase Storage.
 * @param {string} path - O caminho do arquivo no Storage.
 * @returns {Promise<string>} - URL pública do arquivo.
 */
export const getFileURL = async (path) => {
  const fileRef = storage.ref(path);
  const fileURL = await fileRef.getDownloadURL();
  return fileURL;
};

/**
 * Função para deletar um arquivo do Firebase Storage.
 * @param {string} path - O caminho do arquivo a ser removido no Storage.
 * @returns {Promise<void>}
 */
export const deleteFromStorage = async (path) => {
  const fileRef = storage.ref(path);
  await fileRef.delete();
};

export default storage;
