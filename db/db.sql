-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  password TEXT,
  plan_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (plan_id) REFERENCES plans(id)
);

-- PLANS TABLE
CREATE TABLE IF NOT EXISTS plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT CHECK(type IN ('monthly', 'hotspot')) NOT NULL,
  price REAL NOT NULL,
  duration_hours INTEGER,         -- e.g. 24 for 1 day, 720 for 30 days
  data_limit_mb INTEGER,          -- NULL means unlimited
  device_limit INTEGER,           -- NULL for unlimited (monthly), or e.g. 1 for hotspot
  bandwidth_limit_mbps REAL,      -- per device speed limit
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- SESSIONS TABLE
CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  end_time DATETIME,
  data_used_mb REAL DEFAULT 0,
  active INTEGER DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  plan_id INTEGER,
  amount REAL,
  method TEXT,                    -- e.g. 'mpesa', 'voucher'
  transaction_ref TEXT,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (plan_id) REFERENCES plans(id)
);
