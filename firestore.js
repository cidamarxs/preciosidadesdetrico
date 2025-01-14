if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

const addDocument = async (collection, data) => {
  const docRef = await db.collection(collection).add(data);
  console.log('Documento adicionado ao Firestore:', { collection, data, docId: docRef.id });
  return docRef.id;
};

const getCollection = async (collection) => {
  const snapshot = await db.collection(collection).get();
  const documents = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  console.log('Documentos recuperados do Firestore:', { collection, documents });
  return documents;
};

const updateDocument = async (collection, docId, data) => {
  await db.collection(collection).doc(docId).update(data);
  console.log('Documento atualizado no Firestore:', { collection, docId, data });
};

const deleteDocument = async (collection, docId) => {
  await db.collection(collection).doc(docId).delete();
  console.log('Documento removido do Firestore:', { collection, docId });
};

const getDocumentById = async (collection, docId) => {
  const doc = await db.collection(collection).doc(docId).get();
  if (doc.exists) {
    console.log('Documento encontrado no Firestore:', { collection, docId, data: doc.data() });
    return { id: doc.id, ...doc.data() };
  } else {
    console.log('Documento não encontrado no Firestore:', { collection, docId });
    return null;
  }
};
