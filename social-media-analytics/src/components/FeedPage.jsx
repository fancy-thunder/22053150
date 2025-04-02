import { useData } from '../context/DataContext';
import { getRandomImage } from '../api/api';

const FeedPage = () => {
  const { posts, users, isLoading, error } = useData();

  if (isLoading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading feed data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Feed</h4>
          <p>{error}</p>
          <hr />
          <p className="mb-0">Please try refreshing the page or check your connection.</p>
        </div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="container mt-4">
        <div className="alert alert-info" role="alert">
          <h4 className="alert-heading">No Posts Available</h4>
          <p>There are no posts to display at the moment.</p>
          <hr />
          <p className="mb-0">Please check back later for updates.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Feed</h1>
      <div>
        {posts.map((post) => (
          <div key={post.id} className="card mb-3">
            <div className="card-body d-flex align-items-center">
              <img
                src={getRandomImage()}
                alt="Post"
                className="rounded-circle me-3"
                style={{ width: '50px', height: '50px' }}
              />
              <div className="flex-grow-1">
                <h5 className="card-title">{users[post.userid] || 'Unknown User'}</h5>
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
