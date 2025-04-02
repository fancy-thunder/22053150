import { useEffect } from 'react';
import { useData } from '../context/DataContext';
import { getRandomImage } from '../api/api';

const TrendingPage = () => {
  const { posts, comments, fetchComments } = useData();

  
  useEffect(() => {
    posts.forEach((post) => {
      fetchComments(post.id);
    });
  }, [posts, fetchComments]);

  
  const postCommentCounts = posts.map((post) => {
    const postComments = comments[post.id] || [];
    return { ...post, commentCount: postComments.length };
  });

  
  const maxCommentCount = Math.max(
    ...postCommentCounts.map((post) => post.commentCount),
    0
  );

  
  const trendingPosts = postCommentCounts.filter(
    (post) => post.commentCount === maxCommentCount
  );

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Trending Posts</h1>
      <div>
        {trendingPosts.map((post) => (
          <div key={post.id} className="card">
            <div className="card-body d-flex align-items-center">
              <img
                src={getRandomImage()}
                alt="Post"
                className="rounded-circle me-3"
                style={{ width: '50px', height: '50px' }}
              />
              <div>
                <p className="card-text">{post.content}</p>
                <p className="card-text text-muted">
                  Comments: {post.commentCount}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingPage;
