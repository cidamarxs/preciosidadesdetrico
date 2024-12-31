import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import app from "./firebaseConfig";

// Obter instância do Firestore
const db = getFirestore(app);

// Adicionar uma receita
export async function adicionarReceita(dados) {
  try {
    const docRef = await addDoc(collection(db, "receita_trico"), dados);
    return docRef.id; // Retorna o ID do documento adicionado
  } catch (e) {
    console.error("Erro ao adicionar receita: ", e);
    throw e;
  }
}

// Listar todas as receitas
export async function listarReceitas() {
  try {
    const querySnapshot = await getDocs(collection(db, "receita_trico"));
    const receitas = [];
    querySnapshot.forEach((doc) => {
      receitas.push({ id: doc.id, ...doc.data() });
    });
    return receitas; // Retorna um array com todas as receitas
  } catch (e) {
    console.error("Erro ao listar receitas: ", e);
    throw e;
  }
}
