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
 * Função para fazer upload de um arquivo para o Firebase Storage.
 * @param {File} file - O arquivo a ser carregado.
 * @param {string} path - O caminho no Storage onde o arquivo será salvo.
 * @returns {Promise<string>} - URL pública do arquivo carregado.
 */
export const uploadFile = async (file, path) => {
  const storageRef = storage.ref(path);
  await storageRef.put(file);
  const fileURL = await storageRef.getDownloadURL();
  return fileURL;
};

/**
 * Função para deletar um arquivo do Firebase Storage.
 * @param {string} path - O caminho do arquivo no Storage.
 * @returns {Promise<void>}
 */
export const deleteFile = async (path) => {
  const fileRef = storage.ref(path);
  await fileRef.delete();
};

export default storage;
