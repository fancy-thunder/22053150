import { createContext, useContext, useEffect, useState } from 'react';
import { getUsers, getPosts, getComments } from '../api/api';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState({});
  const [posts, setPosts] = useState([]); 
  const [comments, setComments] = useState({}); 
  const [lastPostId, setLastPostId] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('Starting to fetch users...');
        const usersData = await getUsers();
        console.log('Users fetched successfully:', usersData);
        setUsers(usersData);
      } catch (err) {
        console.error('Error in fetchUsers:', err);
        setError('Failed to fetch users. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const fetchAllPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Starting to fetch all posts...');
      const allPosts = [];
      for (const userId in users) {
        console.log(`Fetching posts for user ${userId}...`);
        const userPosts = await getPosts(userId);
        if (Array.isArray(userPosts)) {
          allPosts.push(...userPosts);
        }
      }
      
      console.log('All posts fetched successfully:', allPosts);
      if (allPosts.length > 0) {
        allPosts.sort((a, b) => b.id - a.id);
        setPosts(allPosts);
        setLastPostId(Math.max(...allPosts.map((post) => parseInt(post.id))));
      }
    } catch (err) {
      console.error('Error in fetchAllPosts:', err);
      setError('Failed to fetch posts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (Object.keys(users).length > 0) {
      console.log('Users available, fetching posts...');
      fetchAllPosts();
    }
  }, [users]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const newPosts = [];
        for (const userId in users) {
          const userPosts = await getPosts(userId);
          if (Array.isArray(userPosts)) {
            const newUserPosts = userPosts.filter(
              (post) => parseInt(post.id) > lastPostId
            );
            newPosts.push(...newUserPosts);
          }
        }
        if (newPosts.length > 0) {
          setPosts((prevPosts) => {
            const updatedPosts = [...newPosts, ...prevPosts];
            updatedPosts.sort((a, b) => b.id - a.id); 
            return updatedPosts;
          });
          setLastPostId(Math.max(...newPosts.map((post) => parseInt(post.id))));
        }
      } catch (err) {
        console.error('Error in post update interval:', err);
      }
    }, 5000); 

    return () => clearInterval(interval); 
  }, [users, lastPostId]);

  const fetchComments = async (postId) => {
    try {
      if (!comments[postId]) {
        console.log(`Fetching comments for post ${postId}...`);
        const postComments = await getComments(postId);
        console.log(`Comments fetched for post ${postId}:`, postComments);
        setComments((prev) => ({ ...prev, [postId]: postComments }));
      }
    } catch (err) {
      console.error(`Error fetching comments for post ${postId}:`, err);
    }
  };

  return (
    <DataContext.Provider
      value={{ users, posts, comments, fetchComments, fetchAllPosts, isLoading, error }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
