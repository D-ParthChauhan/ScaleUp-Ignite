let _id = 100; // Start IDs high to avoid conflicts with hardcoded ones
const uid = () => String(_id++);

export const db = {
  // ADDED the 'votes' object to the user model to track their votes
  users: [{ id: 'u1', name: 'IITB Student', impact: 0, badges: [], votes: { 'p1': 'up' } }],
  communities: [
    // --- IITB Communities ---
    // ADDED a 'comments' array to each post
    { id: 'c1', name: 'IITB General', parentId: null, members: ['u1'], posts: [{ id: 'p1', text: 'Welcome to the main IITB community!', userId: 'u1', ts: Date.now(), up: 5, down: 0, comments: [] }] },
    { id: 'c2', name: 'Hostel 1', parentId: 'c1', members: [], posts: [] },
    { id: 'c3', name: 'Hostel 2', parentId: 'c1', members: [], posts: [] },
    { id: 'c4', name: 'Hostel 3', parentId: 'c1', members: [], posts: [] },
    { id: 'c5', name: 'Hostel 8', parentId: 'c1', members: ['u1'], posts: [] },
    { id: 'c6', name: 'Hostel 15', parentId: 'c1', members: [], posts: [] },

    // --- ScaleUp Communities ---
    { id: 'c7', name: 'ScaleUp Community', parentId: null, members: ['u1'], posts: [{ id: 'p2', text: 'This is the main ScaleUp community for hackathon news.', userId: 'u1', ts: Date.now(), up: 10, down: 1, comments: [] }] },
    { id: 'c8', name: 'Frontend Wizards', parentId: 'c7', members: ['u1'], posts: [{ id: 'p3', text: 'Who is excited for React Native v100?', userId: 'u1', ts: Date.now(), up: 3, down: 0, comments: [{id: uid(), text: 'Me too!', userId: 'u1', ts: Date.now()}] }] },
    { id: 'c9', name: 'Backend Titans', parentId: 'c7', members: [], posts: [] },
    { id: 'c10', name: 'Design Gurus', parentId: 'c7', members: [], posts: [] },
  ],
  notifications: [],
};

export const api = {
listCommunities(){ return new Promise(res => setTimeout(() => res([...db.communities]), 200)); },
  createCommunity({ name, parentId = null, userId }){ // Must accept userId
  return new Promise(res => setTimeout(()=>{
    // This line is the fix: The creator is automatically the first member.
    const c = { id: uid(), name, parentId, members: [userId], posts: [] };

    db.communities.push(c);
    db.notifications.unshift({ id: uid(), text: `New community created: ${name}`, ts: Date.now() });
    res(c);
  },200));
},

  joinCommunity({ userId, communityId }){
    return new Promise(res => setTimeout(()=>{
      const c = db.communities.find(x=>x.id===communityId);
      if (!c.members.includes(userId)) c.members.push(userId);
      db.notifications.unshift({ id: uid(), text: `Joined ${c.name}`, ts: Date.now() });
      res(c);
    },200));
  },

  autoJoinChild({ userId, parentId }){
    return new Promise(res => setTimeout(()=>{
      const child = db.communities.find(x=>x.parentId===parentId);
      if (child && !child.members.includes(userId)) {
        child.members.push(userId);
        db.notifications.unshift({ id: uid(), text: `Auto-joined ${child.name}`, ts: Date.now() });
      }
      res(child||null);
    },200));
  },

  createPost({ communityId, userId, text }){
    return new Promise(res => setTimeout(()=>{
      const c = db.communities.find(x=>x.id===communityId);
      const p = { id: uid(), text, userId, ts: Date.now(), up:0, down:0, comments: [] };
      c.posts.unshift(p);
      db.notifications.unshift({ id: uid(), text: `New post in ${c.name}`, ts: Date.now() });
      res(p);
    },200));
  },

  votePost({ userId, postId, delta }){
    return new Promise(res => setTimeout(()=>{
      const user = db.users.find(u => u.id === userId);
      if (!user) return res(null);

      const voteDirection = delta > 0 ? 'up' : 'down';
      const oppositeDirection = delta > 0 ? 'down' : 'up';
      const currentVote = user.votes[postId];

      const community = db.communities.find(c => c.posts.some(p => p.id === postId));
      if (!community) return res(null);
      const post = community.posts.find(x => x.id === postId);
      if (!post) return res(null);

      let newVoteDirection = null;
      let impactChange = 0;

      if (currentVote === voteDirection) {
        // CASE 1: UNVOTE
        post[voteDirection] -= 1;
        newVoteDirection = null;
        impactChange = -delta;
        
      } else if (currentVote === oppositeDirection) {
        // CASE 2: VOTE CHANGE
        post[oppositeDirection] -= 1;
        post[voteDirection] += 1;
        newVoteDirection = voteDirection;
        impactChange = 2 * delta;

      } else {
        // CASE 3: NEW VOTE
        post[voteDirection] += 1;
        newVoteDirection = voteDirection;
        impactChange = delta;
      }
      
      user.votes[postId] = newVoteDirection; 
      
      const author = db.users.find(x => x.id === post.userId);
      if (author) {
        author.impact = Math.max(0, (author.impact || 0) + impactChange);
      }

      const responsePost = {
          ...post,
          colorId: newVoteDirection
      };
      res(responsePost);
    },120));
  },
  
  addComment({ postId, userId, text }) {
    return new Promise(res => setTimeout(() => {
      const community = db.communities.find(c => c.posts.some(p => p.id === postId));
      if (!community) return res(null);
      const post = community.posts.find(x => x.id === postId);
      const comment = { id: uid(), text, userId, ts: Date.now() };
      post.comments.push(comment);
      res(comment);
    }, 200));
  },

  listNotifications(){ return new Promise(res => setTimeout(()=>res(db.notifications),150)); },
  currentUser(){ return db.users[0]; }
};