const https = require('https');
const fs = require('fs');

const zipPath = 'C:\\Users\\hp\\.gemini\\antigravity\\scratch\\isha-birthday.zip';

console.log('🚀 Uploading to Netlify API...');
console.log('📦 Zip size:', (fs.statSync(zipPath).size / 1024 / 1024).toFixed(2), 'MB');

const zipData = fs.readFileSync(zipPath);

const options = {
  hostname: 'api.netlify.com',
  path: '/api/v1/sites',
  method: 'POST',
  headers: {
    'Content-Type': 'application/zip',
    'Content-Length': zipData.length,
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      const result = JSON.parse(body);
      if (result.ssl_url || result.url) {
        console.log('\n🎉 SUCCESS! Website is LIVE at:');
        console.log('🌐 ' + (result.ssl_url || result.url));
        console.log('\n💕 Share this link!');
      } else {
        console.log('\nResponse:', JSON.stringify(result, null, 2));
      }
    } catch(e) {
      console.log('Raw response status:', res.statusCode);
      console.log('Raw body (first 500):', body.substring(0, 500));
    }
  });
});

req.on('error', (e) => console.error('❌ Error:', e.message));
req.write(zipData);
req.end();
