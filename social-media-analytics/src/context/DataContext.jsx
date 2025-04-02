import { createContext, useContext, useEffect, useState } from 'react';
import { getUsers, getPosts, getComments } from '../api/api';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]); 
  const [comments, setComments] = useState({}); 
  const [lastPostId, setLastPostId] = useState(0); 

  
  useEffect(() => {
    const fetchUsers = async () => {
      const usersData = await getUsers();
      setUsers(usersData);
    };
    fetchUsers();
  }, []);

  
  const fetchAllPosts = async () => {
    const allPosts = [];
    for (const user of users) {
      const userPosts = await getPosts(user.id);
      allPosts.push(...userPosts);
    }
    
    allPosts.sort((a, b) => b.id - a.id);
    setPosts(allPosts);
    if (allPosts.length > 0) {
      setLastPostId(Math.max(...allPosts.map((post) => parseInt(post.id))));
    }
  };

  
  useEffect(() => {
    if (users.length > 0) {
      fetchAllPosts();
    }
  }, [users]);

  
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
          updatedPosts.sort((a, b) => b.id - a.id); 
          return updatedPosts;
        });
        setLastPostId(Math.max(...newPosts.map((post) => parseInt(post.id))));
      }
    }, 5000); 

    return () => clearInterval(interval); 
  }, [users, lastPostId]);

  
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
