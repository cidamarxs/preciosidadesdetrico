import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import app from "./firebaseConfig";

const storage = getStorage(app);

export async function enviarArquivo(arquivo) {
  const storageRef = ref(storage, `arquivos/${arquivo.name}`);
  try {
    await uploadBytes(storageRef, arquivo);
    return await getDownloadURL(storageRef); // Retorna a URL do arquivo no Storage
  } catch (e) {
    console.error("Erro ao enviar arquivo: ", e);
    throw e;
  }
}
