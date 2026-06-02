// admin_backend.js

const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const router = express.Router();
const app = express();
const PORT = 4000;

// ================= DB Connection =================
(async () => {
  try {
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "splitbuddy",
    });
    console.log("✅ Connected to MySQL (promise connection).\n");

    // Create notifications table if not exists
    await connection.execute(
      "CREATE TABLE IF NOT EXISTS notifications (id INT AUTO_INCREMENT PRIMARY KEY, type VARCHAR(32), message TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
    );
    console.log("✅ Notifications table ensured.\n");

    // START SERVER ONLY AFTER DB IS READY
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("MySQL connection error:", err);
    process.exit(1);
  }
})();

// ================= Middleware =================
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
  credentials: true
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(
  session({
    secret: "splitbuddy_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 60 * 60 * 1000 },
  })
);

// ================= Multer Setup =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "upload/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ================= USERS APIs =================
// Register
app.post("/api/users/register", upload.single("profile_photo"), async (req, res) => {
  try {
    const { name, email, password, role, currency, timezone } = req.body;
    const profile_photo = req.file ? req.file.filename : null;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const [existing] = await connection.execute("SELECT user_id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const [insertResult] = await connection.execute(
      `INSERT INTO users (name, email, password, role, profile_photo, currency, timezone)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email, hashed, role || "user", profile_photo, currency || "INR", timezone || "Asia/Kolkata"]
    );

    // Insert notification for new user registration (with user_id for FK constraint)
    await connection.execute(
      "INSERT INTO notifications (user_id, type, message) VALUES (?, ?, ?)",
      [insertResult.insertId, "user", `Welcome ${name}!`]
    );

    res.json({ message: "User registered", success: true, user_id: insertResult.insertId });
  } catch (err) {
    console.error("Error in /api/users/register:", err);
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post("/api/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const [rows] = await connection.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(401).json({ message: "User not found" });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid password" });

    req.session.user_id = user.user_id;
    req.session.role = user.role;

    res.json({
      message: "Login successful",
      success: true,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Error in /api/users/login:", err);
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/users", async (req, res) => {
  try {
    const [results] = await connection.execute("SELECT * FROM users");
    res.json(results);
  } catch (err) {
    console.error("Error in GET /api/users:", err);
    res.status(500).json({ error: err.message });
  }
});
// Logout
app.post("/api/users/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
});
// GET all queries
// app.get("/api/queries", async (req, res) => {
//   try {
//     const [results] = await connection.execute("SELECT * FROM queries");
//     res.json(results);
//   } catch (err) {
//     console.error("Error in GET /api/queries:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// PATCH: Update user (for admin user management, only name/email)
app.put("/api/users/:id", async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ error: "Name and email required" });
    const [result] = await connection.execute(
      `UPDATE users SET name = ?, email = ? WHERE user_id = ?`,
      [name, email, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });
    // Fetch and return the updated user
    const [rows] = await connection.execute("SELECT * FROM users WHERE user_id = ?", [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    console.error("Error in PUT /api/users/:id:", err);
    res.status(500).json({ error: err.message });
  }
});
// Update user
app.put("/api/users/:id", upload.single("profile_photo"), async (req, res) => {
  try {
    const { name, email, password, role, currency, timezone } = req.body;
    const profile_photo = req.file ? req.file.filename : null;

    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const [result] = await connection.execute(
      `UPDATE users 
       SET name = ?, email = ?, 
           password = COALESCE(?, password), 
           role = ?, 
           profile_photo = COALESCE(?, profile_photo),
           currency = ?, timezone = ?
       WHERE user_id = ?`,
      [
        name,
        email,
        hashedPassword,
        role,
        profile_photo,
        currency,
        timezone,
        req.params.id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found or no changes applied" });
    }
    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Error in PUT /api/users/:id:", err);
    res.status(500).json({ error: err.message });
  }
});
// ...existing code...

// ================= Overview stats API =================
app.get("/api/overview/stats", async (req, res) => {
  try {
    const [userRows] = await connection.execute("SELECT COUNT(*) AS users FROM users");
    const [groupRows] = await connection.execute("SELECT COUNT(*) AS groups FROM groups");
    const [queryRows] = await connection.execute("SELECT COUNT(*) AS queries FROM queries");
    res.json({
      users: userRows[0].users,
      groups: groupRows[0].groups,
      queries: queryRows[0].queries,
    });
  } catch (err) {
    console.error("Error in GET /api/overview/stats:", err);
    res.status(500).json({ error: err.message });
  }
});
// ...existing code...
// ...existing code...

// Get all groups with their members (for admin monitoring)
app.get("/api/groups-with-members", async (req, res) => {
  try {
    const [groups] = await connection.execute("SELECT group_id, group_name FROM groups");
    if (groups.length === 0) return res.json([]);
    for (let group of groups) {
      const [members] = await connection.execute(
        `SELECT u.user_id, u.name, u.email
         FROM group_members gm
         JOIN users u ON gm.user_id = u.user_id
         WHERE gm.group_id = ?`,
        [group.group_id]
      );
      group.members = members || [];
    }
    res.json(groups);
  } catch (err) {
    console.error("Error in GET /api/groups-with-members:", err);
    res.status(500).json({ error: err.message });
  }
});
// ...existing code...

// ...existing code...

// Get single user by ID
app.get("/api/users/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });
    const [results] = await connection.execute("SELECT * FROM users WHERE user_id = ?", [userId]);
    if (results.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(results[0]);
  } catch (err) {
    console.error("Error in GET /api/users/:id:", err);
    res.status(500).json({ error: err.message });
  }
});
// ...existing code...
// Delete user
app.delete("/api/users/:id", async (req, res) => {
  try {
    const [result] = await connection.execute("DELETE FROM users WHERE user_id = ?", [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("Error in DELETE /api/users/:id:", err);
    res.status(500).json({ error: err.message });
  }
});

// ================= GROUPS & MEMBERS =================

// Create group
app.post("/api/groups", async (req, res) => {
  try {
    const { group_name, created_by, currency } = req.body;
    if (!group_name || !created_by) {
      return res.status(400).json({ message: "group_name and created_by required" });
    }

    const groupCurrency = currency || "INR"; // Default to INR

    const [insertResult] = await connection.execute(
      "INSERT INTO groups (group_name, created_by, currency) VALUES (?, ?, ?)",
      [group_name, created_by, groupCurrency]
    );

    const groupId = insertResult.insertId;

    await connection.execute(
      "INSERT INTO group_members (group_id, user_id) VALUES (?, ?)",
      [groupId, created_by]
    );

    // Get creator's name for notification
    const [userRows] = await connection.execute("SELECT name FROM users WHERE user_id = ?", [created_by]);
    const creatorName = userRows.length > 0 ? userRows[0].name : "Unknown";

    // Insert notification for new group creation
    await connection.execute(
      "INSERT INTO notifications (type, message) VALUES (?, ?)",
      ["group", `New group created: ${group_name} by ${creatorName}`]
    );

    res.json({ message: "Group created", group_id: groupId });
  } catch (err) {
    console.error("Error in POST /api/groups:", err);
    res.status(500).json({ error: err.message });
  }
});

// Join group
app.post("/api/groups/:id/join", async (req, res) => {
  try {
    const { user_id } = req.body;
    const { id } = req.params;
    if (!user_id) {
      return res.status(400).json({ message: "user_id required to join group" });
    }

    const [existing] = await connection.execute(
      "SELECT * FROM group_members WHERE group_id = ? AND user_id = ?",
      [id, user_id]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: "User already in group" });
    }

    await connection.execute(
      "INSERT INTO group_members (group_id, user_id) VALUES (?, ?)",
      [id, user_id]
    );
    res.json({ message: "Joined group" });
  } catch (err) {
    console.error("Error in POST /api/groups/:id/join:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get user's groups
app.get("/api/groups/user/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const [results] = await connection.execute(
      `SELECT g.* 
       FROM groups g
       JOIN group_members gm ON g.group_id = gm.group_id
       WHERE gm.user_id = ?`,
      [user_id]
    );
    res.json(results);
  } catch (err) {
    console.error("Error in GET /api/groups/user/:user_id:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get group members
app.get("/api/groups/:id/members", async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await connection.execute(
      `SELECT gm.member_id, u.user_id, u.name, u.email 
       FROM group_members gm
       JOIN users u ON gm.user_id = u.user_id
       WHERE gm.group_id = ?`,
      [id]
    );
    res.json(results);
  } catch (err) {
    console.error("Error in GET /api/groups/:id/members:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/groups/:groupId/members/:memberId", async (req, res) => {
  const { groupId, memberId } = req.params;
  const { user_id } = req.body;

  try {
    if (!user_id) {
      return res.status(400).json({ error: "Missing user_id in body" });
    }

    // 1. Only admin can remove members
    const [groupRows] = await connection.execute(
      "SELECT created_by FROM groups WHERE group_id = ?",
      [groupId]
    );

    if (groupRows.length === 0) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (parseInt(groupRows[0].created_by) !== parseInt(user_id)) {
      return res.status(403).json({ error: "Only group admin can remove members" });
    }

    if (parseInt(memberId) === parseInt(user_id)) {
      return res.status(400).json({ error: "Admin cannot remove themselves" });
    }

    // 2. Check if member is part of any expense splits
    const [splits] = await connection.execute(
      `SELECT es.* 
       FROM expense_splits es
       JOIN expenses e ON e.expense_id = es.expense_id
       WHERE e.group_id = ? AND es.user_id = ?`,
      [groupId, memberId]
    );

    if (splits.length > 0) {
      return res.status(400).json({
        error: "Cannot remove this member — they are part of existing expenses/splits."
      });
    }

    // 3. Check if member has any pending settlements
    const [pending] = await connection.execute(
      `SELECT * FROM settlements 
       WHERE group_id = ? AND status = 'pending'
         AND (from_user = ? OR to_user = ?)`,
      [groupId, memberId, memberId]
    );

    if (pending.length > 0) {
      return res.status(400).json({
        error: "Cannot remove this member — they have pending settlements."
      });
    }

    // 4. Safe to remove
    const [result] = await connection.execute(
      "DELETE FROM group_members WHERE group_id = ? AND user_id = ?",
      [groupId, memberId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Member not found in this group" });
    }

    res.json({ message: "Member removed successfully" });
  } catch (err) {
    console.error("Error removing member:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// ================= EXPENSES =================
// Delete an expense and update balances/settlements
app.delete("/api/expenses/:expenseId", async (req, res) => {
  const { expenseId } = req.params;
  try {
    // 1. Get expense details
    const [expenseRows] = await connection.execute("SELECT * FROM expenses WHERE expense_id = ?", [expenseId]);
    if (expenseRows.length === 0) {
      return res.status(404).json({ error: "Expense not found" });
    }
    const expense = expenseRows[0];
    const groupId = expense.group_id;

    // 2. Delete splits for this expense
    await connection.execute("DELETE FROM expense_splits WHERE expense_id = ?", [expenseId]);

    // 3. Delete the expense itself
    await connection.execute("DELETE FROM expenses WHERE expense_id = ?", [expenseId]);

    // 4. Recalculate settlements for the group (delete old, regenerate)
    await connection.execute("DELETE FROM settlements WHERE group_id = ?", [groupId]);

    // 5. Regenerate settlements for the group
    // (reuse logic from /api/groups/:groupId/generate-settlement)
    // Get all expenses and splits for this group
    const [splits] = await connection.execute(
      `SELECT es.user_id AS from_user, e.paid_by AS to_user, SUM(es.share_amount) AS amount
       FROM expenses e
       JOIN expense_splits es ON e.expense_id = es.expense_id
       WHERE e.group_id = ? AND es.user_id != e.paid_by
       GROUP BY es.user_id, e.paid_by`,
      [groupId]
    );
    for (const s of splits) {
      await connection.execute(
        `INSERT INTO settlements (group_id, from_user, to_user, amount, status)
         VALUES (?, ?, ?, ?, 'pending')`,
        [groupId, s.from_user, s.to_user, s.amount]
      );
    }

    res.json({ message: "Expense deleted and balances/settlements updated." });
  } catch (err) {
    console.error("Error deleting expense:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Utility: Backfill missing splits for all expenses
app.post("/api/expenses/backfill-splits", async (req, res) => {
  try {
    // Get all expenses
    const [expenses] = await connection.execute("SELECT * FROM expenses");
    let count = 0;
    for (const exp of expenses) {
      // Check if splits exist for this expense
      const [splits] = await connection.execute("SELECT * FROM expense_splits WHERE expense_id = ?", [exp.expense_id]);
      if (splits.length === 0) {
        // Try to get split_between from expense (if stored), else skip
        // If not stored, try to infer from group members
        let split_between = [];
        if (exp.split_between) {
          try {
            split_between = JSON.parse(exp.split_between);
          } catch (err) {
            split_between = [];
          }
        }
        // If still empty, get group members
        if (!split_between.length) {
          const [members] = await connection.execute("SELECT user_id FROM group_members WHERE group_id = ?", [exp.group_id]);
          split_between = members.map(m => m.user_id);
        }
        if (split_between.length) {
          const per_head = exp.amount / split_between.length;
          for (let uid of split_between) {
            await connection.execute(
              `INSERT INTO expense_splits (expense_id, user_id, share_amount)
               VALUES (?, ?, ?)`,
              [exp.expense_id, uid, per_head]
            );
          }
          count++;
        }
      }
    }
    res.json({ message: `Backfilled splits for ${count} expenses.` });
  } catch (err) {
    console.error("Error in backfill splits:", err);
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/groups/:groupId/generate-settlement", async (req, res) => {
  try {
    const { groupId } = req.params;

    // 1. Get all expenses and splits for this group
    const [splits] = await connection.execute(
      `SELECT es.user_id AS from_user, e.paid_by AS to_user, SUM(es.share_amount) AS amount
       FROM expenses e
       JOIN expense_splits es ON e.expense_id = es.expense_id
       WHERE e.group_id = ? AND es.user_id != e.paid_by
       GROUP BY es.user_id, e.paid_by`,
      [groupId]
    );

    if (splits.length === 0) {
      return res.json({ message: "No settlements needed." });
    }

    // 2. Calculate net balances between each pair
    const netMap = {};
    splits.forEach(s => {
      const a = s.from_user;
      const b = s.to_user;
      const key = a < b ? `${a}_${b}` : `${b}_${a}`;
      const sign = a < b ? 1 : -1;
      netMap[key] = (netMap[key] || 0) + s.amount * sign;
    });

    // 3. Get all completed settlements for this group
    const [completedSettlements] = await connection.execute(
      `SELECT from_user, to_user, amount FROM settlements WHERE group_id = ? AND status = 'completed'`,
      [groupId]
    );

    // 4. Remove all pending settlements (so we can regenerate them)
    await connection.execute("DELETE FROM settlements WHERE group_id = ? AND status = 'pending'", [groupId]);

    // 5. For each net balance, subtract already completed settlements
    for (const key in netMap) {
      let [user1, user2] = key.split("_").map(Number);
      let amount = netMap[key];

      // Subtract completed settlements between these users
      completedSettlements.forEach(cs => {
        if (
          (cs.from_user === user1 && cs.to_user === user2) ||
          (cs.from_user === user2 && cs.to_user === user1)
        ) {
          // If completed in same direction, subtract
          if (cs.from_user === user1 && cs.to_user === user2) {
            amount -= cs.amount;
          } else {
            amount += cs.amount;
          }
        }
      });

      if (Math.abs(amount) < 0.01) continue; // already settled

      let from_user, to_user, finalAmount;
      if (amount > 0) {
        from_user = user1;
        to_user = user2;
        finalAmount = amount;
      } else {
        from_user = user2;
        to_user = user1;
        finalAmount = -amount;
      }

      await connection.execute(
        `INSERT INTO settlements (group_id, from_user, to_user, amount, status)
         VALUES (?, ?, ?, ?, 'pending')`,
        [groupId, from_user, to_user, finalAmount]
      );
    }

    // 6. Fetch updated settlements
    const [settlements] = await connection.execute(
      `SELECT s.*, uf.name AS from_user_name, ut.name AS to_user_name
       FROM settlements s
       JOIN users uf ON s.from_user = uf.user_id
       JOIN users ut ON s.to_user = ut.user_id
       WHERE s.group_id = ? AND s.status = 'pending'`,
      [groupId]
    );

    res.json({ message: "Settlements generated and netted successfully", settlements });
  } catch (err) {
    console.error("Error generating net settlements:", err);
    res.status(500).json({ error: "Failed to generate settlements" });
  }
});

// Patch settlement (mark as paid)
app.patch("/api/settlements/:id/pay", async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `UPDATE settlements SET status='completed' WHERE settlement_id=?`;
    const [result] = await connection.execute(sql, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Settlement not found" });
    }
    res.json({ message: "Payment successful" });
  } catch (err) {
    console.error("Error in PATCH /api/settlements/:id/pay:", err.stack || err);
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/users/:userId/settlements", async (req, res) => {
  const userId = req.params.userId;

  try {
    const [rows] = await connection.execute(
      `SELECT
        s.settlement_id,
        s.group_id,
        g.group_name,
        g.currency,  -- <-- ADD THIS LINE!
        s.from_user,
        fu.name AS from_user_name,
        s.to_user,
        tu.name AS to_user_name,
        s.amount,
        s.status,
        s.settled_at
      FROM settlements s
      JOIN groups g ON s.group_id = g.group_id
      JOIN users fu ON s.from_user = fu.user_id
      JOIN users tu ON s.to_user = tu.user_id
      WHERE (s.from_user = ? OR s.to_user = ?)
        AND s.status = 'pending'`,
      [userId, userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching user settlements:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.patch("/api/settlements/:id/pay", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await connection.execute(
      "UPDATE settlements SET status='completed' WHERE settlement_id=?",
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Settlement not found" });
    }
    // Optionally return the updated settlement
    const [rows] = await connection.execute(
      `SELECT s.*, uf.name AS from_user_name, ut.name AS to_user_name, g.group_name
       FROM settlements s
       JOIN users uf on s.from_user = uf.user_id
       JOIN users ut on s.to_user = ut.user_id
       JOIN groups g on s.group_id = g.group_id
       WHERE s.settlement_id = ?`,
      [id]
    );
    res.json({ message: "Payment successful", settlement: rows[0] });
  } catch (err) {
    console.error("Error in PATCH /api/settlements/:id/pay:", err.stack || err);
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/users/:userId/settlements", async (req, res) => {
  const userId = req.params.userId;

  try {
    const [rows] = await connection.execute(
      `SELECT
        s.settlement_id,
        s.group_id,
        g.group_name,
        g.currency,  -- <-- ADD THIS LINE
        s.from_user,
        fu.name AS from_user_name,
        s.to_user,
        tu.name AS to_user_name,
        s.amount,
        s.status
      FROM settlements s
      JOIN groups g ON s.group_id = g.group_id
      JOIN users fu ON s.from_user = fu.user_id
      JOIN users tu ON s.to_user = tu.user_id
      WHERE (s.from_user = ? OR s.to_user = ?)
        AND s.status = 'pending'`,
      [userId, userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching user settlements:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/api/groups/:groupId/settlements", async (req, res) => {
  try {
    const { groupId } = req.params;
    const [rows] = await connection.execute(
      `SELECT s.*, uf.name AS from_user_name, ut.name AS to_user_name
       FROM settlements s
       JOIN users uf ON s.from_user = uf.user_id
       JOIN users ut ON s.to_user = ut.user_id
       WHERE s.group_id = ?`,
      [groupId]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error in GET /api/groups/:groupId/settlements:",err.stack || err);
    res.status(500).json({ error: "Internal server error" });
  }
});
// ================= USER BALANCE =================
app.get("/api/users/:userId/balance", async (req, res) => {
  try {
    const { userId } = req.params;

    const [groups] = await connection.execute(
      `SELECT g.group_id, g.group_name
       FROM group_members gm
       JOIN groups g ON gm.group_id = g.group_id
       WHERE gm.user_id = ?`,
      [userId]
    );

    if (groups.length === 0) {
      return res.json({ groups: [], totalBalance: 0 });
    }

    const balances = [];

    for (let grp of groups) {
      const group_id = grp.group_id;
      const group_name = grp.group_name;

      // Fetch expenses for the current group
      const [expenses] = await connection.execute(
        "SELECT * FROM expenses WHERE group_id = ?",
        [group_id]
      );

      if (expenses.length === 0) {
        balances.push({ group_id, group_name, balance: 0 });
      } else {
        const totalExpense = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
        const [memberCountRows] = await connection.execute(
          "SELECT COUNT(*) as count FROM group_members WHERE group_id = ?",
          [group_id]
        );
        const memberCount = memberCountRows[0].count;
        const fairShare = totalExpense / memberCount;

        const userPaid = expenses
          .filter(e => e.paid_by == userId)
          .reduce((sum, e) => sum + parseFloat(e.amount), 0);

        const balance = userPaid - fairShare;
        balances.push({ group_id, group_name, balance });
      }
    }

    const totalBalance = balances.reduce((acc, b) => acc + b.balance, 0);

    res.json({ groups: balances, totalBalance });
  } catch (err) {
    console.error("Error in GET /api/users/:userId/balance:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/users/test", (req, res) => {
  res.json({ message: "Test route working!" });
});


// ================= EXIT GROUP =================
app.post("/api/groups/:groupId/exit", async (req, res) => {
  try {
    const { groupId } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: "Missing user_id in body" });
    }

    //  Check if user has any pending settlements
    const [pending] = await connection.execute(
      `SELECT * FROM settlements 
       WHERE group_id = ? AND status = 'pending'
       AND (from_user = ? OR to_user = ?)`,
      [groupId, user_id, user_id]
    );

    if (pending.length > 0) {
      return res.status(400).json({
        error: "You cannot exit the group until all your balances are settled.",
      });
    }

    const [memberRows] = await connection.execute(
      "SELECT * FROM group_members WHERE group_id = ? AND user_id = ?",
      [groupId, user_id]
    );

    if (memberRows.length === 0) {
      return res.status(400).json({ error: "User not a member of this group" });
    }

    await connection.execute(
      "DELETE FROM group_members WHERE group_id = ? AND user_id = ?",
      [groupId, user_id]
    );

    const [remainingMembers] = await connection.execute(
      "SELECT user_id FROM group_members WHERE group_id = ?",
      [groupId]
    );

    if (remainingMembers.length === 0) {
      await connection.execute("DELETE FROM groups WHERE group_id = ?", [groupId]);
      return res.json({ message: "You left the group. Group deleted as no members remain." });
    }

    const [groupRows] = await connection.execute(
      "SELECT created_by FROM groups WHERE group_id = ?",
      [groupId]
    );

    if (groupRows.length === 0) {
      return res.status(404).json({ error: "Group not found" });
    }

    const adminId = groupRows[0].created_by;

    if (parseInt(adminId) === parseInt(user_id)) {
      const newAdminId = remainingMembers[0].user_id;
      await connection.execute(
        "UPDATE groups SET created_by = ? WHERE group_id = ?",
        [newAdminId, groupId]
      );
      return res.json({ message: "You left the group. Admin rights transferred to another member." });
    }

    res.json({ message: "You have exited the group." });
  } catch (err) {
    console.error("Error in POST /api/groups/:groupId/exit:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ================= EXPENSES =================

// Get expenses by group
app.get("/api/expenses", async (req, res) => {
  try {
    const { group_id } = req.query;
    if (!group_id) {
      return res.status(400).json({ error: "group_id is required" });
    }

    const [rows] = await connection.execute(
      `SELECT e.*, u.name AS paid_by_name
       FROM expenses e
       JOIN users u ON e.paid_by = u.user_id
       WHERE e.group_id = ?
       ORDER BY e.created_at DESC`,
      [group_id]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error in GET /api/expenses:", err.stack || err.stack || err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add new expense
// app.post("/api/expenses", async (req, res) => {
//   try {
//     const { group_id, paid_by, description, amount, split_between } = req.body;

//     if (!group_id || !paid_by || !description || !amount || !split_between?.length) {
//       return res.status(400).json({ error: "Missing fields" });
//     }

//     // Insert into expenses table
//     const [expResult] = await connection.execute(
//       `INSERT INTO expenses (group_id, paid_by, description, amount, created_at)
//        VALUES (?, ?, ?, ?, NOW())`,
//       [group_id, paid_by, description, amount]
//     );

//     const expense_id = expResult.insertId;
//     const per_head = amount / split_between.length;
   
//     // Insert splits
//     for (let uid of split_between) {
//       await connection.execute(
//         `INSERT INTO expense_splits (expense_id, user_id, share_amount)
//          VALUES (?, ?, ?)`,
//         [expense_id, uid, per_head]
//       );
//     }

//     res.json({
//       message: "Expense added successfully",
//       expense_id,
//       per_head,
//       split_between,
//       paid_by
//     });
//   } catch (err) {
//     console.error("Error in POST /api/expenses:", err.stack || err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });
// app.post("/api/expenses", (req, res) => {
//   const { group_id, paid_by, description, amount, split_between } = req.body;

//   if (!group_id || !paid_by || !description || !amount || !split_between || split_between.length === 0) {
//     return res.status(400).json({ error: "Missing required fields" });
//   }

//   const query = `
//     INSERT INTO expenses (group_id, paid_by, description, amount, currency, created_at)
//     VALUES (?, ?, ?, ?, 'INR', NOW())
//   `;

//   db.query(query, [group_id, paid_by, description, amount], (err, result) => {
//     if (err) {
//       console.error("❌ Expense insert error:", err);
//       return res.status(500).json({ error: err.message });
//     }

//     const expenseId = result.insertId;
//     // ROUND the per-head amount
//     const perHead = Math.round(amount / split_between.length);

//     const splitQuery = `
//       INSERT INTO expense_splits (expense_id, user_id, share_amount)
//       VALUES ?
//     `;
//     const values = split_between.map((uid) => [expenseId, uid, perHead]);

//     db.query(splitQuery, [values], (err2) => {
//       if (err2) {
//         console.error("❌ Expense split insert error:", err2);
//         return res.status(500).json({ error: err2.message });
//       }

//       res.json({
//         expense_id: expenseId,
//         group_id,
//         paid_by,
//         description,
//         amount,
//         per_head: perHead,
//         split_between,
//       });
//     });
//   });
// });


app.post("/api/expenses", async (req, res) => {
  try {
    let { group_id, paid_by, description, amount, split_between, currency } = req.body;

    // Fetch group currency if not provided
    if (!currency && group_id) {
      const [groupRows] = await connection.execute(
        "SELECT currency FROM groups WHERE group_id = ?",
        [group_id]
      );
      currency = groupRows.length > 0 ? groupRows[0].currency : "INR";
    }

    // Insert into expenses table
    const [expResult] = await connection.execute(
      `
      INSERT INTO expenses (group_id, paid_by, description, amount, currency, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
      `,
      [group_id, paid_by, description, amount, currency]
    );

    const expense_id = expResult.insertId;

    // Calculate per-head share
    const per_head = Math.round(amount / split_between.length);

    // Insert expense splits
    const splitValues = split_between.map((uid) => [expense_id, uid, per_head]);
    await connection.query(
      `
      INSERT INTO expense_splits (expense_id, user_id, share_amount)
      VALUES ?
      `,
      [splitValues]
    );

    // Response
    res.json({
      message: "✅ Expense added successfully",
      expense_id,
      group_id,
      paid_by,
      description,
      amount,
      currency,
      per_head,
      split_between,
    });
  } catch (err) {
    console.error("❌ Error in POST /api/expenses:", err.stack || err);
    res.status(500).json({ error: "Internal server error" });
  }
});



// ================= DELETE GROUP =================
app.delete("/api/groups/:groupId", async (req, res) => {
  try {
    const { groupId } = req.params;
    const { user_id } = req.body; // admin id from frontend

    if (!user_id) {
      return res.status(400).json({ error: "Missing user_id for authorization" });
    }

    // 1. Check if group exists and get admin
    const [groupRows] = await connection.execute(
      "SELECT created_by FROM groups WHERE group_id = ?",
      [groupId]
    );

    if (groupRows.length === 0) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (parseInt(groupRows[0].created_by) !== parseInt(user_id)) {
      return res.status(403).json({ error: "Only group admin can delete the group" });
    }

    // 2. Check for pending settlements
    const [pending] = await connection.execute(
      `SELECT * FROM settlements 
       WHERE group_id = ? AND status = 'pending'`,
      [groupId]
    );

    if (pending.length > 0) {
      return res.status(400).json({
        error: "Cannot delete group until all pending settlements are cleared.",
      });
    }

    // 3. Delete related data safely (order matters due to foreign keys)
    await connection.execute("DELETE FROM expense_splits WHERE expense_id IN (SELECT expense_id FROM expenses WHERE group_id = ?)", [groupId]);
    await connection.execute("DELETE FROM expenses WHERE group_id = ?", [groupId]);
    await connection.execute("DELETE FROM settlements WHERE group_id = ?", [groupId]);
    await connection.execute("DELETE FROM group_members WHERE group_id = ?", [groupId]);
    await connection.execute("DELETE FROM groups WHERE group_id = ?", [groupId]);

    res.json({ message: "Group deleted successfully" });
  } catch (err) {
    console.error("Error deleting group:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Alias route for all-members (same as /members)
app.get("/api/groups/:groupId/all-members", async (req, res) => {
  const { groupId } = req.params;

  try {
    const [results] = await connection.execute(
      `SELECT gm.member_id, u.user_id, u.name, u.email 
       FROM group_members gm
       JOIN users u ON gm.user_id = u.user_id
       WHERE gm.group_id = ?`,
      [groupId]
    );
    res.json(results);
  } catch (err) {
    console.error("Error fetching group members:", err);
    res.status(500).json({ error: "Failed to fetch group members" });
  }
});

// ================= ROOT =================
// Get all notifications
app.get("/api/notifications", async (req, res) => {
  try {
    const [rows] = await connection.execute("SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: err.message });
  }
});
app.get("/", (req, res) => {
  res.send("API is running...");
});


//=================Get all queries================
// app.get("/api/queries", async (req, res) => {
//   try {
//     const [results] = await connection.execute("SELECT * FROM queries");
//     res.json(results);
//   } catch (err) {
//     console.error("Error in GET /api/queries:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// Get all expense splits with user and expense details
app.get("/api/expense_splits", async (req, res) => {
  try {
    const [results] = await connection.execute(`
      SELECT es.split_id, es.expense_id, es.user_id, es.share_amount,
             u.name AS user_name,
             e.description, e.amount, e.created_at
      FROM expense_splits es
      JOIN users u ON es.user_id = u.user_id
      JOIN expenses e ON es.expense_id = e.expense_id
      ORDER BY e.created_at DESC
    `);
    res.json(results);
  } catch (err) {
    console.error("Error in GET /api/expense_splits:", err);
    res.status(500).json({ error: err.message });
  }
});
// Clear all notifications
app.delete("/api/notifications", async (req, res) => {
  try {
    await connection.execute("DELETE FROM notifications");
    res.json({ message: "All notifications cleared." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Mark settlement as paid (for 'Pay on Hand')
app.post("/api/settlements", async (req, res) => {
  try {
    const { from_user, to_user, amount } = req.body;
    // Find pending settlement matching these details
    const [rows] = await connection.execute(
      `SELECT * FROM settlements WHERE from_user=? AND to_user=? AND amount=? AND status='pending' LIMIT 1`,
      [from_user, to_user, amount]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Settlement not found" });
    }
    const settlementId = rows[0].settlement_id;
    await connection.execute(
      `UPDATE settlements SET status='completed' WHERE settlement_id=?`,
      [settlementId]
    );
    res.json({ message: "Payment successful" });
  } catch (err) {
    console.error("Error in POST /api/settlements:", err.stack || err);
    res.status(500).json({ error: err.message });
  }
});

// Razorpay order creation
app.post("/api/razorpay/order", async (req, res) => {
  try {
    const Razorpay = require("razorpay");
    const { amount, currency, from_user, to_user, group_id } = req.body;
    // IMPORTANT: Use your TEST key and secret for test mode
    const key_id = process.env.RAZORPAY_KEY_ID || "rzp_test_RLJtrMpC4SnfN2"; // Example test key
    const key_secret = process.env.RAZORPAY_KEY_SECRET || "s5fR0jgGEBodRcDwdYAl3KEz"; // Replace with your test secret
    if (!key_id || !key_secret) {
      console.error("Razorpay key_id or key_secret missing");
      return res.status(500).json({ error: "Razorpay API keys missing" });
    }
    const razorpay = new Razorpay({ key_id, key_secret });
    const order = await razorpay.orders.create({
      amount,
      currency,
      payment_capture: 1,
    });
    res.json(order);
  } catch (err) {
    console.error("Error creating Razorpay order:", err);
    res.status(500).json({ error: err.message });
  }
});

// Razorpay payment verification
app.post("/api/razorpay/verify", async (req, res) => {
  try {
    const crypto = require("crypto");
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, from_user, to_user, amount, group_id } = req.body;
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      console.error("Missing Razorpay verification fields", req.body);
      return res.status(400).json({ success: false, message: "Missing verification fields" });
    }
    // IMPORTANT: Use the SAME test secret as above
    const key_secret = process.env.RAZORPAY_KEY_SECRET || "s5fR0jgGEBodRcDwdYAl3KEz"; // Replace with your test secret
    const generated_signature = crypto.createHmac("sha256", key_secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");
    if (generated_signature === razorpay_signature) {
      // Mark settlement as paid
      const [rows] = await connection.execute(
        `SELECT * FROM settlements WHERE from_user=? AND to_user=? AND amount=? AND status='pending' LIMIT 1`,
        [from_user, to_user, amount]
      );
      if (rows.length === 0) {
        return res.status(404).json({ message: "Settlement not found" });
      }
      const settlementId = rows[0].settlement_id;
      await connection.execute(
        `UPDATE settlements SET status='completed' WHERE settlement_id=?`,
        [settlementId]
      );
      res.json({ success: true });
    } else {
      console.error("Invalid Razorpay signature", { generated_signature, razorpay_signature });
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (err) {
    console.error("Error verifying Razorpay payment:", err);
    res.status(500).json({ error: err.message });
  }
});

//========= Mail ===============================

// const cors = require("cors");
const nodemailer = require("nodemailer");
// const bcrypt = require("bcrypt");


app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());


// ------------------ SEND RESET EMAIL ------------------
app.post("/send-email", async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({ status: "error", message: "Email required" });

  try {
    const [rows] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0)
      return res.status(404).json({ status: "error", message: "Email not registered" });

    // Setup nodemailer
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "splitbuddy2025@gmail.com",
        pass: "phsb lsoj fskm hrxz", // Gmail app password
      },
    });

    let mailOptions = {
      from: "SplitBuddy <splitbuddy2025@gmail.com>",
      to: email,
      subject: "Password Reset Request",
      text: `Click this link to reset your password: http://localhost:3000/reset-password?email=${email}`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ status: "success", message: "Password reset email sent!" });
  } catch (err) {
    console.error("Send email error:", err);
    res.status(500).json({ status: "error", message: "Failed to send email" });
  }
});

// ------------------ RESET PASSWORD ------------------
app.post("/reset-password", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ status: "error", message: "Email and password required" });

  try {
    const [rows] = await connection.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0)
      return res.status(404).json({ status: "error", message: "User not found" });

    const hashedPassword = await bcrypt.hash(password, 10); // Hash password
    await connection.query("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email]);

    res.json({ status: "success", message: "Password updated successfully!" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

//------------------ LOGIN ------------------
app.post("/api/users/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await connection.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(401).json({ success: false, message: "Unauthorized" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: "Unauthorized" });

    // For simplicity, return user object (without password)
    const { password: pw, ...userData } = user;
    res.json({ success: true, user: userData });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//=========================QUERIES===================


// All queries from table
app.get("/api/query", async (req, res) => {
  try {
    const [results] = await connection.execute(`
      SELECT q.query_id, q.user_id, u.name AS user_name, u.email AS user_email,
             q.category, q.message, q.status, q.created_at
      FROM queries q
      LEFT JOIN users u ON q.user_id = u.user_id
      ORDER BY q.created_at DESC
    `);
    res.json(results);
  } catch (err) {
    console.error("Error fetching queries:", err);
    res.status(500).json({ error: "Failed to fetch queries" });
  }
});




// ✅ Update query status to "resolved"
app.put("/api/query/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await connection.execute(
      "UPDATE queries SET status = ? WHERE query_id = ?",
      [status, id]
    );

    res.json({ status: "success", message: "Query status updated" });
  } catch (err) {
    console.error("Error updating query status:", err);
    res.status(500).json({ status: "error", error: "Failed to update status" });
  }
});



// ✅ Insert query
app.post("/api/query", async (req, res) => {
  try {
    const { user_id, category, message } = req.body;

    if (!message || !category) {
      return res
        .status(400)
        .json({ status: "error", error: "Missing fields" });
    }

    if (user_id) {
      await connection.execute(
        "INSERT INTO queries (user_id, category, message, status, created_at) VALUES (?, ?, ?, 'open', NOW())",
        [user_id, category, message]
      );
    } else {
      await connection.execute(
        "INSERT INTO queries (category, message, status, created_at) VALUES (?, ?, 'open', NOW())",
        [category, message]
      );
    }

    res.json({ status: "success" });
  } catch (err) {
    console.error("Error inserting query:", err);
    res.status(500).json({ status: "error", error: "Database error" });
  }
});



//Reply from Admin
// const nodemailer = require("nodemailer");

// ✅ Reusable sendEmail function
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "splitbuddy2025@gmail.com",          // Your Gmail
    pass: "phsb lsoj fskm hrxz",            // Gmail app password (2FA must be enabled)
  },
});

async function sendEmail({ to, subject, html }) {
  try {
    await transporter.sendMail({
      from: '"SplitBuddy Support" <splitbuddy2025@gmail.com>',
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("sendEmail error:", err);
    throw err;
  }
}

// ------------------ SEND QUERY REPLY ------------------
app.post("/send-reply", async (req, res) => {
  const { email, subject, message, type } = req.body;

  if (!email || !message || type !== "reply") {
    return res
      .status(400)
      .json({ status: "error", error: "Email, message, and type are required" });
  }

  try {
    // ✅ Custom template for query reply
    const emailContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color:#185a9d;">Query Resolved</h2>
        <p>Hi,</p>
        <p>Your query has been resolved. Here's the response from our team:</p>
        <blockquote style="background:#f5f5f5; padding:10px; border-left:4px solid #185a9d;">
          ${message}
        </blockquote>
        <p>Thank you for contacting SplitBuddy!</p>
      </div>
    `;

    // Send the email
    await sendEmail({
      to: email,
      subject: subject || "Your Query Has Been Resolved ✅",
      html: emailContent,
    });

    res.json({ status: "success", message: "Query reply email sent!" });
  } catch (err) {
    console.error("Error sending query reply email:", err);
    res.status(500).json({ status: "error", error: "Failed to send email" });
  }
});

// Get group balances for a user
app.get("/api/users/:user_id/group-balances", async (req, res) => {
  const userId = req.params.user_id;
  const [rows] = await connection.execute(`
    SELECT g.group_id, g.group_name, g.currency,
      COALESCE(SUM(
        CASE
          WHEN e.paid_by = ? THEN e.amount
          ELSE 0
        END
        -
        CASE
          WHEN es.user_id = ? THEN es.share_amount
          ELSE 0
        END
      ), 0) AS balance
    FROM groups g
    LEFT JOIN expenses e ON g.group_id = e.group_id
    LEFT JOIN expense_splits es ON e.expense_id = es.expense_id AND es.user_id = ?
    WHERE g.group_id IN (
      SELECT group_id FROM group_members WHERE user_id = ?
    )
    GROUP BY g.group_id
  `, [userId, userId, userId, userId]);
  res.json(rows);
});
