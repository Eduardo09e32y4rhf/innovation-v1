const electronInstaller = require('electron-winstaller');
const path = require('path');

async function build() {
  try {
    console.log('Iniciando o build do instalador...');
    await electronInstaller.createWindowsInstaller({
      appDirectory: path.join(__dirname),
      outputDirectory: 'c:\\Users\\eduar\\Desktop\\Installer_Output',
      authors: 'Innovation Team',
      exe: 'INNOVATION IA.exe',
      setupExe: 'INNOVATION_IA_Instalador.exe',
      noMsi: true,
      description: 'INNOVATION IA Platform',
      version: '6.1.0',
      title: 'INNOVATION IA'
    });
    console.log('Instalador criado com sucesso!');
  } catch (e) {
    console.log(`Erro ao criar instalador: ${e.message}`);
  }
}

build();
