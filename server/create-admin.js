require("dotenv").config();

const readline = require("readline");
const db = require("./config/database");
const { hashPassword } = require("./utils/password");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (question) =>
  new Promise((resolve) => {
    rl.question(question, resolve);
  });

const createAdmin = async () => {
  try {
    const email = (await ask("Admin email: ")).trim();
    const password = await ask("Admin password: ");

    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    const passwordHash = await hashPassword(password);

    const result = await db.query(
      `
        INSERT INTO users (email, password_hash, role)
        VALUES ($1, $2, 'admin')
        RETURNING id, email, role, is_active, created_at;
      `,
      [email, passwordHash]
    );

    console.log("Admin account created successfully.");
    console.log(result.rows[0]);
  } catch (error) {
    console.error("Failed to create admin account.");

    if (error.code === "23505") {
      console.error("An account with this email already exists.");
    } else {
      console.error(error.message);
    }
  } finally {
    await db.end();
    rl.close();
  }
};

createAdmin();