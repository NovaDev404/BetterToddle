const express = require('express');
const cors = require('cors');
const path = require('path');
const proxy = require('express-http-proxy');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'images', 'favicon.ico'));
});

// Toddle API Proxy
app.use('/:region/graphql', proxy((req) => {
  const region = req.params.region;
  return `https://${region}-production-apis.toddleapp.com/graphql`;
}, {
  proxyReqPathResolver: (req) => {
    return '/graphql';
  },
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    proxyReqOpts.headers = proxyReqOpts.headers || {};
    
    if (srcReq.headers['authorization']) {
      proxyReqOpts.headers['authorization'] = srcReq.headers['authorization'];
    }
    proxyReqOpts.headers['origin'] = 'https://web.toddleapp.com';
    if (srcReq.headers['user-agent']) {
      proxyReqOpts.headers['user-agent'] = srcReq.headers['user-agent'];
    } else {
      proxyReqOpts.headers['user-agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36';
    }
    proxyReqOpts.headers['x-tod-source'] = 'WEB';
    
    return proxyReqOpts;
  }
}));

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
