import express from 'express';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/extract-audio', upload.single('video'), (req, res) => {
  const inputPath = req.file.path;
  const outputPath = `uploads/${req.file.filename}.mp3`;

  ffmpeg(inputPath)
    .noVideo()
    .audioCodec('libmp3lame')
    .save(outputPath)
    .on('end', () => {
      res.download(outputPath, 'audio.mp3', () => {
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      });
    })
    .on('error', err => {
      console.error(err);
      res.status(500).send('Audio extraction failed.');
    });
});

app.get('/', (req, res) => {
  res.send('Audio Extractor is running');
});

app.listen(process.env.PORT || 3000, () =>
  console.log(`Server running on port ${process.env.PORT || 3000}`)
);
