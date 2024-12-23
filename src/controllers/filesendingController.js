const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs'); // Para ler o arquivo de mídia
const services = require('../services/filesendingServices')
const authConfig = require('../config/auth')
const path = require('path');
const { Readable } = require('stream');



async function downloadFileFromDrive(fileId, nome_arquivo) {
  const url = `https://drive.google.com/uc?export=download&id=${fileId}`;

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  const filePath = path.join(__dirname, `../assets/${nome_arquivo}.pdf`); // Caminho para salvar o arquivo baixado localmente

  const writer = fs.createWriteStream(filePath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(filePath));
    writer.on('error', reject);
  });
}

function base64ToReadableStream(base64String) {
  const buffer = Buffer.from(base64String, 'base64'); // Converte Base64 para Buffer
  return Readable.from(buffer); // Cria um stream a partir do buffer
}

const fileController = {
  sendMediaMessageDrive: async (req, res) => {
    // Criando o FormData para incluir os campos da requisição

    //const mediaPath = path.join(__dirname, '../assets/pdf_sample_2.pdf'); // Substitua 'seu_arquivo.jpg' pelo nome do seu arquivo
    //console.log('Caminho do arquivo de mídia:', mediaPath);


    const fileId = req.body.fileId; // ID do arquivo no Google Drive
    const nome_arquivo = req.body.nome //Nome do arquivo
    let mediaPath;

    try {
      // Baixa o arquivo do Google Drive
      mediaPath = await downloadFileFromDrive(fileId, nome_arquivo);
      console.log('Arquivo baixado com sucesso:', mediaPath);
    } catch (error) {
      return res.status(500).json({ msg: 'Erro ao baixar arquivo do Google Drive', error: error.message });
    }

    // Verificando se o arquivo existe
    if (!fs.existsSync(mediaPath)) {
      return res.status(400).json({ message: 'Arquivo de mídia não encontrado.' });
    }

    // fs.createReadStream(mediaPath)
    //   .on('error', err => console.log('Erro ao ler o arquivo:', err))
    //   .on('open', () => console.log('Arquivo aberto com sucesso:', mediaPath));
    // // Verificando se o arquivo existe
    // if (!fs.existsSync(mediaPath)) {
    //   return res.status(400).json({ message: 'Arquivo de mídia não encontrado.' });
    // }

    const formData = new FormData();
    console.log(req.body.number);
    formData.append('number', `${req.body.number}`); // Número de destino
    formData.append('medias', fs.createReadStream(mediaPath)); // Arquivo de mídia
    formData.append('openTicket', 0); // Utilize 1 para abrir um ticket
    formData.append('queueId', 0); // ID da fila desejada
    formData.append('body', ''); // Corpo da mensagem (texto)

    try {
      const response = await axios.post('https://api.hubot.app.br/api/messages/send', formData, {
        headers: {
          'Authorization': `${authConfig.auth.auth_token}`, // Substitua pelo seu token
          ...formData.getHeaders() // Isso é necessário para incluir o cabeçalho multipart/form-data corretamente
        },
      });
      res.status(200).json({ msg: "Arquivo enviado com sucesso!" });

    } catch (error) {
      res.status(401).json({ error, msg: "Erro ao enviar arquivo." });
    }
  },
  sendMediaMessage: async (req, res) => {

    const pdfStream = base64ToReadableStream(req.body.base64Pdf);
    const authToken = req.headers['authorization'];
    console.log(authToken)
    if (!authToken) {
      return res.status(400).json({ msg: 'Token de autenticação é obrigatório.' });
    }

    const formData = new FormData();
    console.log(req.body.number);
    console.log(req.body.base64Pdf);
    formData.append('number', `${req.body.number}`); // Número de destino
    formData.append('medias', pdfStream, { filename: 'BOLETO.pdf', contentType: 'application/pdf' }); // Arquivo de mídia
    formData.append('openTicket', 0); // Utilize 1 para abrir um ticket
    formData.append('queueId', 0); // ID da fila desejada
    formData.append('body', ''); // Corpo da mensagem (texto)

    try {
      const response = await axios.post('https://api.hubot.app.br/api/messages/send', formData, {
        headers: {
          'Authorization': `${authToken}`, // Substitua pelo seu token
          ...formData.getHeaders() // Isso é necessário para incluir o cabeçalho multipart/form-data corretamente
        },
      });
      res.status(200).json({ msg: "Arquivo enviado com sucesso!" });

    } catch (error) {
      res.status(400).json({ error, msg: "Erro ao enviar arquivo." });
    }
  },
  convertBase64: async (req, res) => {
    const base64data = req.body.base64data;

    let mediaPath;


    const filePath = path.join(__dirname, '../assets', 'dd12-13_0.pdf');
    const outputPath = path.join(__dirname, '../assets', 'Converted.pdf');
    const outputDir = path.join(__dirname, '../assets');
    const fileName = "Converted"
    try {
      //const fileBuffer = await services.readFile(filePath)
      //const base64String = fileBuffer.toString('base64');
      //console.log(base64String);
      //mediaPath = await services.base64ToPDF(base64String, outputPath);
      //mediaPath = await services.pdfToBase64(filePath, outputDir,fileName);

      const response = await services.base64ToPDF(base64data, outputPath);
      res.status(200).json({ msg: "Arquivo enviado com sucesso!" });
      console.log('Arquivo convertido com sucesso:', mediaPath);
    } catch (error) {
      console.log('Erro ao converter arquivo: ', error)
    }


  }


}



module.exports = fileController;
