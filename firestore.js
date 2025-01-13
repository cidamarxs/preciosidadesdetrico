
import firebase from "firebase/app";
import "firebase/firestore";
import firebaseConfig from "./firebaseConfig";

// Inicializando o Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Referência ao Firestore
const db = firebase.firestore();

/**
 * Adiciona um documento em uma coleção no Firestore.
 * @param {string} collection - Nome da coleção.
 * @param {Object} data - Dados a serem armazenados no documento.
 * @returns {Promise<string>} - Retorna o ID do documento criado.
 */
export const addDocument = async (collection, data) => {
  const docRef = await db.collection(collection).add(data);
  return docRef.id;
};

/**
 * Busca todos os documentos de uma coleção.
 * @param {string} collection - Nome da coleção.
 * @returns {Promise<Object[]>} - Retorna um array de objetos representando os documentos.
 */
export const getCollection = async (collection) => {
  const snapshot = await db.collection(collection).get();
  const documents = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return documents;
};

/**
 * Atualiza um documento existente no Firestore.
 * @param {string} collection - Nome da coleção.
 * @param {string} docId - ID do documento a ser atualizado.
 * @param {Object} data - Dados atualizados.
 * @returns {Promise<void>}
 */
export const updateDocument = async (collection, docId, data) => {
  await db.collection(collection).doc(docId).update(data);
};

/**
 * Remove um documento de uma coleção no Firestore.
 * @param {string} collection - Nome da coleção.
 * @param {string} docId - ID do documento a ser removido.
 * @returns {Promise<void>}
 */
export const deleteDocument = async (collection, docId) => {
  await db.collection(collection).doc(docId).delete();
};

/**
 * Busca um documento específico por ID.
 * @param {string} collection - Nome da coleção.
 * @param {string} docId - ID do documento a ser buscado.
 * @returns {Promise<Object>} - Retorna o documento encontrado ou null se não existir.
 */
export const getDocumentById = async (collection, docId) => {
  const doc = await db.collection(collection).doc(docId).get();
  if (doc.exists) {
    return { id: doc.id, ...doc.data() };
  } else {
    return null;
  }
};

export default db;
