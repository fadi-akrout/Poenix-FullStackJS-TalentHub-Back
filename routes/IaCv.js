const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
// Define a route to trigger the Python script
/* router.get('/processCV', (req, res) => {
   // const pythonProcess = spawn('python', ['/Users/Asus store/Desktop/4TWIN/4TWIN5/PI/IA/IA2.py']);
    
    const pythonProcess = spawn('python', ['/Users/Asus store/Documents/GitHub/Poenix-FullStackJS-TalentHub-Back/routes/utils/IA2.py']);
    
    pythonProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });
    
    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
    
    pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        res.sendStatus(200);
       //  Assuming the Python script writes the result to 'output.xlsx'
      //  const filePath = path.join(__dirname, 'output.xlsx');
      //  res.sendFile(filePath);
    });
}); */

router.post('/upload', upload.single('file'), (req, res) => {
    const pythonProcess = spawn('python', ['/Users/Asus store/Desktop/4TWIN/4TWIN5/PI/IA/extractingData/IA4.py']);

    pythonProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        res.send('PDF processed');

    });
});

module.exports = router;

