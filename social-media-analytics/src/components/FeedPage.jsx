import { useData } from '../context/DataContext';
import { getRandomImage } from '../api/api';

const FeedPage = () => {
  const { posts } = useData();

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Feed</h1>
      <div>
        {posts.map((post) => (
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
                <p className="card-text text-muted">Post ID: {post.id}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedPage;
