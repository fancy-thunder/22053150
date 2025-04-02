import { useData } from '../context/DataContext';
import { getRandomImage } from '../api/api';

const UsersPage = () => {
  const { users, posts } = useData();

  // Calculate post counts for each user
  const userPostCounts = Object.entries(users).map(([userId, userName]) => {
    const userPosts = posts.filter((post) => post.userid === userId);
    return { id: userId, name: userName, postCount: userPosts.length };
  });

  // Sort by post count and get top 5
  const topUsers = userPostCounts
    .sort((a, b) => b.postCount - a.postCount)
    .slice(0, 5);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Top 5 Users by Post Count</h1>
      <div>
        {topUsers.map((user) => (
          <div key={user.id} className="card">
            <div className="card-body d-flex align-items-center">
              <img
                src={getRandomImage()}
                alt="User"
                className="rounded-circle me-3"
                style={{ width: '50px', height: '50px' }}
              />
              <div>
                <h5 className="card-title mb-1">{user.name}</h5>
                <p className="card-text text-muted">Posts: {user.postCount}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
