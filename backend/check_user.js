const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: false
});

async function checkUser() {
  try {
    const [results] = await sequelize.query("SELECT email, passwordHash FROM Users WHERE email = 'admin@admin.com'");
    console.log('User found:', results);
  } catch (err) {
    console.error('Error checking user:', err);
  } finally {
    await sequelize.close();
  }
}

checkUser();
