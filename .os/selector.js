const os = require('os');
const { spawn } = require('child_process');
const platform = os.platform();

if (platform == 'darwin') {
    console.log('macOS');
    
    const exec = spawn('sh', ['./.os/build.sh']);
    exec.stdout.on('data', data => console.log(data.toString()));
    exec.on('exit', () => console.log('FINISHED'));

} else if (platform == 'win32') {
    console.log('windows');
}