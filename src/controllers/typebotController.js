const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs'); // Para ler o arquivo de mídia
const authConfig = require('../config/auth')
const path = require('path');


const url = 'https://bot2.hubot.app.br/api/v1/typebots/meu-typebot-c86gm8k/startChat/';

const typebotController = {
   startTypeBot: async(req,res) => {
    console.log(req.body.leads[0].personal_phone);
    if (!req.body.leads[0] || typeof req.body.leads[0] !== 'object' || !req.body.leads[0].personal_phone) {
      return res.status(400).json({ error: 'Personal phone não fornecido.' });
    }

    const data = {
      message: req.body.leads[0].personal_phone.replace(/\D/g, '') + " " + req.body.leads[0].email
    };
    
    const options = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    try {
      const response = await axios.post(url, data, options)
      .then(response => {
        console.log('Resposta do servidor:', response.data);
        res.status(200).json({msg:'Sucesso!'});
      })
      .catch(error => {
        console.error('Erro ao enviar a requisição:', error.response ? error.response.data : error.message);
      });
  
      console.log('Mensagem enviada:', data.message);
    } catch (error) {
      console.error('Erro ao enviar a mensagem:', error.response?.data || error.message);
    }
  }


}



module.exports = typebotController;
