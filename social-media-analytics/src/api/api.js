import axios from 'axios';

const BASE_URL = '/api';

const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzNjA1MjA2LCJpYXQiOjE3NDM2MDQ5MDYsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjQ0Y2EyY2RhLTRhY2ItNDgxZS1hOGZlLWUxZGQ3ZTczNDYwOSIsInN1YiI6IjIyMDUzMTUwQGtpaXQuYWMuaW4ifSwiZW1haWwiOiIyMjA1MzE1MEBraWl0LmFjLmluIiwibmFtZSI6ImF2aXNoZWsgc2VuIiwicm9sbE5vIjoiMjIwNTMxNTAiLCJhY2Nlc3NDb2RlIjoibndwd3JaIiwiY2xpZW50SUQiOiI0NGNhMmNkYS00YWNiLTQ4MWUtYThmZS1lMWRkN2U3MzQ2MDkiLCJjbGllbnRTZWNyZXQiOiJLbnJhR2VaRHpubmZlY2pUIn0.nO71MW9E1EemkLdL3HMJuNXRcxfpuN1wBKKibx40e4Y";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${AUTH_TOKEN}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(
  config => {
    console.log('Request Headers:', config.headers);
    console.log('Request URL:', config.url);
    return config;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
  response => {
    console.log('API Response:', response.data);
    return response;
  },
  error => {
    console.error('API Error:', error.response?.data || error.message);
    console.error('Error Status:', error.response?.status);
    console.error('Error Headers:', error.response?.headers);
    return Promise.reject(error);
  }
);

const cache = {
  users: null,
  posts: {}, 
  comments: {}, 
};

const placeholderImages = [
  'https://via.placeholder.com/150/FF0000/FFFFFF?text=Image1',
  'https://via.placeholder.com/150/00FF00/FFFFFF?text=Image2',
  'https://via.placeholder.com/150/0000FF/FFFFFF?text=Image3',
];

export const getRandomImage = () => {
  return placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
};

export const getUsers = async () => {
  if (cache.users) {
    return cache.users; 
  }
  try {
    console.log('Fetching users...');
    const response = await axiosInstance.get('/users');
    console.log('Users response:', response.data);
    cache.users = response.data.users;
    return response.data.users;
  } catch (error) {
    console.error('Error fetching users:', error.response?.data || error.message);
    throw error;
  }
};

export const getPosts = async (userId) => {
  if (cache.posts[userId]) {
    return cache.posts[userId]; 
  }
  try {
    console.log(`Fetching posts for user ${userId}...`);
    const response = await axiosInstance.get(`/users/${userId}/posts`);
    console.log(`Posts response for user ${userId}:`, response.data);
    cache.posts[userId] = response.data.posts;
    return response.data.posts;
  } catch (error) {
    console.error(`Error fetching posts for user ${userId}:`, error.response?.data || error.message);
    throw error; // Re-throw to handle in the component
  }
};

export const getComments = async (postId) => {
  if (cache.comments[postId]) {
    return cache.comments[postId]; 
  }
  try {
    console.log(`Fetching comments for post ${postId}...`);
    const response = await axiosInstance.get(`/posts/${postId}/comments`);
    console.log(`Comments response for post ${postId}:`, response.data);
    cache.comments[postId] = response.data.comments || [];
    return cache.comments[postId];
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error.response?.data || error.message);
    throw error; // Re-throw to handle in the component
  }
};
