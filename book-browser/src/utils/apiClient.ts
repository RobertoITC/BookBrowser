// File: src/utils/apiClient.ts
import axios from 'axios';
const API_KEY='AIzaSyAQNAFrIYE58G15RJfHdogaVLrANrKAIlA';


const apiClient = axios.create({
  baseURL: 'https://www.googleapis.com/books/v1',
  params: {
    key: API_KEY,
  }
});

export default apiClient;

