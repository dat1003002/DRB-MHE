const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const path = require('path');
 
const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

const config = {
  user: "sa",
  password: "drbvnit",
  server: "localhost",
  database: "drb-mhe",
  options: {
    enableArithAbort: true,
    encrypt: false 
  },
};

let pool;

const connectSQL = async () => {
  try {
    pool = await sql.connect(config);
    console.log("Connected to SQL Server database.");
  } catch (err) {
    console.error("Error connecting to SQL Server:", err);
  }
};

connectSQL();

const checkSQLConnection = (req, res, next) => {
  if (!pool) {
    return res.status(500).json({ message: 'SQL Server connection not established' });
  }
  next();
};

app.get("/data", checkSQLConnection, async (req, res) => {
  try {
    const result = await pool.request().query("SELECT * FROM tblmhe");
    const dataWithBase64Images = result.recordset.map(record => ({
      ...record,
      image: record.image ? `data:image/jpeg;base64,${record.image.toString('base64')}` : null
    }));
    res.json(dataWithBase64Images);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).send(err);
  }
});

app.post('/register', checkSQLConnection, async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const checkUser = await pool.request()
      .input('username', sql.VarChar, username)
      .query('SELECT * FROM users WHERE username = @username');

    if (checkUser.recordset.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.request()
      .input('username', sql.VarChar, username)
      .input('password', sql.VarChar, hashedPassword)
      .input('role', sql.VarChar, role)
      .query('INSERT INTO users (username, password, role) VALUES (@username, @password, @role)');

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/data', upload.single('image'), async (req, res) => {
  try {
    const { name, description } = req.body;
    const image = req.file ? req.file.buffer : null;

    const result = await pool.request()
      .input('name', sql.NVarChar, name)
      .input('description', sql.NVarChar, description)
      .input('image', sql.VarBinary, image)
      .query(`
        INSERT INTO tblmhe (name, description, image)
        OUTPUT inserted.*
        VALUES (@name, @description, @image)
      `);

    const addedData = result.recordset[0]; 
    res.status(200).json(addedData);
  } catch (err) {
    console.error("Error adding data:", err);
    res.status(500).json({ message: "Error adding data" });
  }
});


app.get('/api/search', checkSQLConnection, async (req, res) => {
  const { name } = req.query;

  try {
    const result = await pool.request()
      .input('name', sql.NVarChar, `%${name}%`)
      .query(`
        SELECT * FROM tblmhe
        WHERE name LIKE @name
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }

    res.json(result.recordset);
  } catch (err) {
    console.error("Error searching data:", err);
    res.status(500).json({ message: "Error searching data" });
  }
});


app.put('/api/data/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const image = req.file ? req.file.buffer : null;
    let query = `   
      UPDATE tblmhe
      SET name = @name, description = @description
    `;
 
    if (image) {
      query += ', image = @image';
    }
 
    query += ' WHERE id = @id';

    // Thực hiện truy vấn
    await pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.NVarChar, name)
      .input('description', sql.NVarChar, description)
      .input('image', sql.VarBinary, image)
      .query(query);

    res.status(200).json({ message: 'Data updated successfully' });
  } catch (err) {
    console.error("Error updating data:", err);
    res.status(500).json({ message: "Error updating data" });
  }
});

app.delete("/api/data/:id", checkSQLConnection, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM tblmhe WHERE id = @id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Data not found" });
    }

    res.json({ message: "Data deleted successfully" });
  } catch (err) {
    console.error("Error deleting data:", err);
    res.status(500).json({ message: "Error deleting data" });
  }
});

app.post('/login', checkSQLConnection, async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.request().query`SELECT * FROM users WHERE username = ${username}`;
    const user = result.recordset[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      'your_jwt_secret',
      { expiresIn: '1y' }
    );

    res.json({
      message: `Logged in as ${user.role}`,
      role: user.role,
      token: token
    });
  } catch (err) {
    console.error('Error logging in:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

const HOST = "192.168.3.148"
const PORT = process.env.PORT || 5001;
app.listen(PORT, HOST,() => {
  console.log(`Server is running on port ${PORT}`);
});
