import jsonServer from "json-server";

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Mock token verification (in production, use JWT verification)
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized - missing token" });
  }
  next();
};

// Custom middleware for auth endpoints
server.post("/auth/register", (req, res) => {
  const db = router.db;
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Check if user exists
  const existingUser = db.get("users").find({ email }).value();
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  // Create new user
  const newUser = {
    id: String(db.get("users").value().length + 1),
    name,
    email,
    password,
    role: "user",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.get("users").push(newUser).write();

  // Return user without password and a fake token
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json({
    user: userWithoutPassword,
    token: "fake-jwt-token-" + newUser.id,
  });
});

server.post("/auth/login", (req, res) => {
  const db = router.db;
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const user = db.get("users").find({ email, password }).value();

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Return user without password and a fake token
  const { password: _, ...userWithoutPassword } = user;
  res.status(200).json({
    user: userWithoutPassword,
    token: "fake-jwt-token-" + user.id,
  });
});

server.get("/auth/profile", verifyToken, (req, res) => {
  const db = router.db;
  // In a real app, extract user ID from JWT token
  // For demo, return first user
  const user = db.get("users").value()[0];
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const { password: _, ...userWithoutPassword } = user;

  res.status(200).json({
    data: userWithoutPassword,
  });
});

// Protected routes middleware
server.use((req, res, next) => {
  if (
    req.path.startsWith("/users") ||
    req.path.startsWith("/profile") ||
    req.path.startsWith("/activities")
  ) {
    verifyToken(req, res, next);
  } else {
    next();
  }
});

// Users endpoints
server.get("/users", (req, res, next) => {
  const db = router.db;
  const {
    page = 1,
    limit = 10,
    search,
    sortBy = "name",
    sortOrder = "asc",
  } = req.query;

  let users = db.get("users").value();

  // Filter by search
  if (search) {
    users = users.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()),
    );
  }

  // Sort
  users.sort((a, b) => {
    const aVal = a[sortBy] || "";
    const bVal = b[sortBy] || "";
    const comparison = aVal > bVal ? 1 : -1;
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const total = users.length;
  const pageNum = parseInt(page);
  const pageSize = parseInt(limit);
  const startIndex = (pageNum - 1) * pageSize;
  const paginatedUsers = users.slice(startIndex, startIndex + pageSize);

  // Remove passwords
  const usersWithoutPassword = paginatedUsers.map(
    ({ password: _, ...user }) => user,
  );

  res.status(200).json({
    data: usersWithoutPassword,
    total,
    page: pageNum,
    limit: pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
});

server.get("/users/:id", (req, res) => {
  const db = router.db;
  const user = db.get("users").find({ id: req.params.id }).value();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.status(200).json({
    data: userWithoutPassword,
  });
});

server.put("/users/:id", (req, res) => {
  const db = router.db;
  const user = db.get("users").find({ id: req.params.id }).value();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const updated = {
    ...user,
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  db.get("users").find({ id: req.params.id }).assign(updated).write();

  const { password: _, ...userWithoutPassword } = updated;
  res.status(200).json({
    data: userWithoutPassword,
  });
});

server.delete("/users/:id", (req, res) => {
  const db = router.db;
  const user = db.get("users").find({ id: req.params.id }).value();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  db.get("users").remove({ id: req.params.id }).write();

  res.status(200).json({ message: "User deleted" });
});

// Profile endpoints (current user)
server.get("/profile", (req, res) => {
  const db = router.db;
  // In real app, get from JWT token
  const user = db.get("users").value()[0];

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.status(200).json({
    data: userWithoutPassword,
  });
});

server.put("/profile", (req, res) => {
  const db = router.db;
  // In real app, get from JWT token
  const user = db.get("users").value()[0];

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const updated = {
    ...user,
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  db.get("users").find({ id: user.id }).assign(updated).write();

  const { password: _, ...userWithoutPassword } = updated;
  res.status(200).json({
    data: userWithoutPassword,
  });
});

// Activities endpoints
server.get("/activities", (req, res) => {
  const db = router.db;
  const activities = db.get("activities").value() || [];

  res.status(200).json({
    data: activities,
  });
});

// Standard CRUD routes for remaining endpoints
server.use(router);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`JSON Server is running at http://localhost:${PORT}`);
  console.log("Available endpoints:");
  console.log("  POST /auth/login");
  console.log("  POST /auth/register");
  console.log("  GET /auth/profile");
  console.log("  GET /users (paginated, searchable, sortable)");
  console.log("  GET /users/:id");
  console.log("  PUT /users/:id");
  console.log("  DELETE /users/:id");
  console.log("  GET /profile");
  console.log("  PUT /profile");
  console.log("  GET /activities");
});
