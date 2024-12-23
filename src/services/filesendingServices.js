const fs = require('fs');
const path = require('path');
// Função para converter Base64 para PDF
function base64ToPDF(base64Data, outputPath) {
  // Remove a parte do tipo de conteúdo, caso esteja presente (como 'data:application/pdf;base64,')
  const base64String = base64Data.replace(/^data:application\/pdf;base64,/, '');

  // Converte o Base64 para um Buffer
  const buffer = Buffer.from(base64String, 'base64');

  // Salva o arquivo PDF no caminho especificado
  fs.writeFile(outputPath, buffer, (err) => {
    if (err) {
      console.error('Erro ao salvar o arquivo PDF:', err);
    } else {
      console.log('Arquivo PDF salvo com sucesso!');
    }
  });
  return outputPath;
}

function pdfToBase64(filePath, outputDir,fileName) {
  // Remove a parte do tipo de conteúdo, caso esteja presente (como 'data:application/pdf;base64,')


  return new Promise((resolve, reject) => {

    try {
      // Garante que o diretório de saída existe

      const outputFilePath = path.join(outputDir, fileName);
      
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      fs.readFile(filePath, (err, data) => {
        if (err) {
          reject(`Erro ao ler o arquivo PDF: ${err}`);
        }

        // Converte o Buffer para Base64
        //const base64 =`data:application/pdf;base64,${data.toString('base64')}`;
        const base64 =data.toString('base64');
        fs.writeFile(outputFilePath, base64, (err) => {
          if (err) {
            reject(`Erro ao salvar o arquivo Base64: ${err}`);
          } else {
            resolve(`Arquivo Base64 salvo com sucesso em: ${outputFilePath}`);
          }
        });


      });
    } catch (error) {
      reject(`Erro ao salvar o arquivo Base64: ${error.message}`);
    }
  });
}

function readFile(filePath) {
  return new Promise((resolve, reject) => {

    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(`Erro ao ler o arquivo PDF: ${err}`);
      }

      // Converte o Buffer para Base64
      const base64 = data.toString('base64');
      resolve(base64);


    });
  }
  );
}
module.exports = { base64ToPDF, pdfToBase64,readFile};

