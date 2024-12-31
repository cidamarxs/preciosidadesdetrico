import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Configuração do Firebase (substitua com as suas credenciais)
const firebaseConfig = {
    apiKey: "AIzaSyDvrty4zjeuNMYu8TuQuf49LihZWuiAlgE",
    authDomain: "preciosidades-de-trico.firebaseapp.com",
    databaseURL: "https://preciosidades-de-trico-default-rtdb.firebaseio.com",
    projectId: "preciosidades-de-trico",
    storageBucket: "preciosidades-de-trico.firebasestorage.app",
    messagingSenderId: "53723311991",
    appId: "1:53723311991:web:b32af8acafada569287b72"
 };

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Função para adicionar uma receita no Firestore
export async function adicionarReceita(receita) {
  try {
    const docRef = await addDoc(collection(db, "receitas"), receita);
    return docRef.id; // Retorna o ID do documento
  } catch (e) {
    console.error("Erro ao adicionar receita: ", e);
    throw e;
  }
}

// Função para listar receitas do Firestore
export async function listarReceitas() {
  try {
    const querySnapshot = await getDocs(collection(db, "receitas"));
    const receitas = [];
    querySnapshot.forEach((doc) => {
      receitas.push(doc.data());
    });
    return receitas;
  } catch (e) {
    console.error("Erro ao listar receitas: ", e);
    throw e;
  }
}

// Função para enviar um arquivo para o Firebase Storage
export async function enviarArquivo(arquivo) {
  try {
    const arquivoRef = ref(storage, 'arquivos/' + arquivo.name);
    await uploadBytes(arquivoRef, arquivo);
    const url = await getDownloadURL(arquivoRef);
    return url; // Retorna a URL do arquivo enviado
  } catch (e) {
    console.error("Erro ao enviar arquivo: ", e);
    throw e;
  }
}


// Exemplo: Adicionando uma receita com um arquivo
async function executar() {
  try {
    // Envia um arquivo para o Storage e obtém a URL
    const arquivo = new File(["conteúdo"], "exemplo.txt"); // Substitua pelo arquivo real
    const urlArquivo = await enviarArquivo(arquivo);

    // Adiciona a receita ao Firestore
    const id = await adicionarReceita({
      nome: "Cachecol Ponto Arroz",
      descricao: "Um cachecol simples e elegante feito com ponto arroz.",
      tags: ["cachecol", "ponto arroz", "trico"],
      arquivo: urlArquivo, // URL do arquivo no Storage
    });
    console.log("Receita adicionada com ID: ", id);

    // Lista todas as receitas no Firestore
    const receitas = await listarReceitas();
    console.log("Receitas cadastradas: ", receitas);
  } catch (e) {
    console.error("Erro: ", e);
  }
}

executar();