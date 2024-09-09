// const express = require('express');
import express from 'express';
// const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require('@google/generative-ai');
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

const app = express();
const port = 3000; // 端口号

// 1. 设置 Gemini API 密钥
const GEMINI_PUBLIC_KEY = process.env.GEMINI_PUBLIC_KEY; 

// 2. 创建 Gemini 模型
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
];

const genAI = new GoogleGenerativeAI(GEMINI_PUBLIC_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash', // 选择 Gemini 模型
  safetySettings,
});

// 3. 定义路由处理函数
app.get('/generate', async (req, res) => {
  const prompt = req.query.prompt || 'Write a story about a magic backpack.';

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    res.send(responseText);
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).send('Internal server error');
  }
});

// 4. 启动服务器
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});