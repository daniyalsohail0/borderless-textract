import express from 'express';
import aws from 'aws-sdk';
import multer from 'multer';
import fs from 'fs';

const app = express();
const upload = multer({ dest: 'uploads/' });

aws.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const textract = new aws.Textract();

const parseDate = (text: string): Date | undefined => {
  const match = text.match(/(\d{2})[/-](\d{2})[/-](\d{4})/);
  if (match) {
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1;
    const year = parseInt(match[3], 10);
    return new Date(year, month, day);
  }
  return undefined;
};

app.post('/api/passport', upload.single('passport'), (req, res, next) => {
  if (!req.file) {
    return res.status(400).send({ error: 'No passport image provided' });
  }

  const params: aws.Textract.AnalyzeDocumentRequest = {
    Document: {
      Bytes: fs.readFileSync(req.file.path)
    },
    FeatureTypes: ['FORMS']
  };

  textract.analyzeDocument(params, (err, data) => {
    if (err) {
      console.log(err, err.stack);
      return res.status(500).send({ error: 'Failed to analyze passport image' });
    }

    let dob: Date | undefined;
    let expiry: Date | undefined;

    const blocks = data.Blocks || [];
    blocks.forEach((block) => {
      if (block.Text && block.Text.match(/date of birth/i)) {
        dob = parseDate(block.Text);
      } else if (block.Text && block.Text.match(/expiry date/i)) {
        expiry = parseDate(block.Text);
      }
    });

    if (!dob || !expiry) {
      return res.status(400).send({ error: 'Failed to extract date of birth and expiry date from passport image' });
    }

    return res.status(200).send({ dob, expiry });
  });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
