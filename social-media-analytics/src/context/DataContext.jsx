import { createContext, useContext, useEffect, useState } from 'react';
import { getUsers, getPosts, getComments } from '../api/api';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]); // All posts
  const [comments, setComments] = useState({}); // { postId: [comments] }
  const [lastPostId, setLastPostId] = useState(0); // For real-time feed updates

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      const usersData = await getUsers();
      setUsers(usersData);
    };
    fetchUsers();
  }, []);

  // Fetch all posts initially and set up polling for the Feed page
  const fetchAllPosts = async () => {
    const allPosts = [];
    for (const user of users) {
      const userPosts = await getPosts(user.id);
      allPosts.push(...userPosts);
    }
    // Sort posts by ID (assuming higher ID means newer)
    allPosts.sort((a, b) => b.id - a.id);
    setPosts(allPosts);
    if (allPosts.length > 0) {
      setLastPostId(Math.max(...allPosts.map((post) => parseInt(post.id))));
    }
  };

  // Initial fetch of posts
  useEffect(() => {
    if (users.length > 0) {
      fetchAllPosts();
    }
  }, [users]);

  // Polling for new posts (every 5 seconds)
  useEffect(() => {
    const interval = setInterval(async () => {
      const newPosts = [];
      for (const user of users) {
        const userPosts = await getPosts(user.id);
        const newUserPosts = userPosts.filter(
          (post) => parseInt(post.id) > lastPostId
        );
        newPosts.push(...newUserPosts);
      }
      if (newPosts.length > 0) {
        setPosts((prevPosts) => {
          const updatedPosts = [...newPosts, ...prevPosts];
          updatedPosts.sort((a, b) => b.id - a.id); // Sort by ID (newest first)
          return updatedPosts;
        });
        setLastPostId(Math.max(...newPosts.map((post) => parseInt(post.id))));
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [users, lastPostId]);

  // Fetch comments for a specific post
  const fetchComments = async (postId) => {
    if (!comments[postId]) {
      const postComments = await getComments(postId);
      setComments((prev) => ({ ...prev, [postId]: postComments }));
    }
  };

  return (
    <DataContext.Provider
      value={{ users, posts, comments, fetchComments, fetchAllPosts }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
