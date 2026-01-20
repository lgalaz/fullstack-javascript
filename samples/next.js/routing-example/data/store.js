export const users = [
  { id: '1', name: 'Ada Lovelace' },
  { id: '2', name: 'Grace Hopper' },
  { id: '3', name: 'Linus Torvalds' }
];

export const posts = [
  { id: 'p1', userId: '1', title: 'Intro to Server Components' },
  { id: 'p2', userId: '1', title: 'Routing Patterns' },
  { id: 'p3', userId: '2', title: 'Debugging at Scale' },
  { id: 'p4', userId: '3', title: 'Kernel Notes' }
];

export const comments = [
  { id: 'c1', postId: 'p1', author: 'Maya', body: 'Great summary.' },
  { id: 'c2', postId: 'p1', author: 'Sam', body: 'Super helpful.' },
  { id: 'c3', postId: 'p2', author: 'Priya', body: 'Love the examples.' },
  { id: 'c4', postId: 'p3', author: 'Jo', body: 'Nice tips.' }
];

export function getUsers() {
  return users;
}

export function getUser(id) {
  return users.find((user) => user.id === id) ?? null;
}

export function getPostsByUser(userId) {
  return posts.filter((post) => post.userId === userId);
}

export function getPost(postId) {
  return posts.find((post) => post.id === postId) ?? null;
}

export function getCommentsByPost(postId) {
  return comments.filter((comment) => comment.postId === postId);
}

export function getComment(commentId) {
  return comments.find((comment) => comment.id === commentId) ?? null;
}
