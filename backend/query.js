const { Sequelize } = require('sequelize');
const path = require('path');
const dbPath = path.join(__dirname, 'database.sqlite');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false
});

async function run() {
  try {
    const [results] = await sequelize.query("SELECT * FROM Prompts");
    console.log(JSON.stringify(results, null, 2));

    let updated = 0;
    for (let prompt of results) {
      if (prompt.prompt && prompt.prompt.toLowerCase().includes('atendechat')) {
        let newPrompt = prompt.prompt.replace(/Atendechat/g, 'Innovation').replace(/atendechat/g, 'innovation').replace(/ATENDECHAT/g, 'INNOVATION');
        await sequelize.query("UPDATE Prompts SET prompt = :newPrompt WHERE id = :id", {
          replacements: { newPrompt, id: prompt.id }
        });
        updated++;
      }
    }
    console.log(`Updated ${updated} prompts.`);
  } catch(e) {
    console.log(e.message);
  }
}
run();
