import axios from 'axios';

const BASE_URL = '<http://20.244.56.144/evaluation-service>';


const cache = {
  users: null,
  posts: {}, 
  comments: {}, 
};


const placeholderImages = [
  '<https://via.placeholder.com/150/FF0000/FFFFFF?text=Image1>',
  '<https://via.placeholder.com/150/00FF00/FFFFFF?text=Image2>',
  '<https://via.placeholder.com/150/0000FF/FFFFFF?text=Image3>',
];

// Function to get a random image
export const getRandomImage = () => {
  return placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
};

// Fetch all users
export const getUsers = async () => {
  if (cache.users) {
    return cache.users; // Return cached users if available
  }
  try {
    const response = await axios.get(`${BASE_URL}/users`);
    cache.users = response.data.users;
    return cache.users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

// Fetch posts for a specific user
export const getPosts = async (userId) => {
  if (cache.posts[userId]) {
    return cache.posts[userId]; 
  }
  try {
    const response = await axios.get(`${BASE_URL}/users/${userId}/posts`);
    cache.posts[userId] = response.data;
    return response.data;
  } catch (error) {
    console.error(`Error fetching posts for user ${userId}:`, error);
    return [];
  }
};


export const getComments = async (postId) => {
  if (cache.comments[postId]) {
    return cache.comments[postId]; 
  }
  try {
    const response = await axios.get(`${BASE_URL}/posts/${postId}/comments`);
    cache.comments[postId] = response.data.comments || [];
    return cache.comments[postId];
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error);
    return [];
  }
};
