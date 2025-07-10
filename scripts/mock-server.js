const http = require('http');
const url = require('url');

// Mock data
const mockResponses = {
  '/api/health/status': { status: 'OK' },
  '/api/health/db-check': { database: 'Connected' },
  '/api/etl/collections': {
    collections: [
      { collection: 'test_data', count: 100 },
      { collection: 'ml_cases_deaths', count: 5000 }
    ]
  },
  '/api/data': [
    { date: '2024-01-01', country: 'France', new_cases: 1000, new_deaths: 20 },
    { date: '2024-01-02', country: 'Germany', new_cases: 800, new_deaths: 15 }
  ]
};

const mlResponses = {
  '/api/v1/covid/health': {
    model_loaded: true,
    ready_for_predictions: true,
    model_version: '1.0'
  },
  '/api/v1/covid/countries': {
    countries: ['France', 'Germany', 'Italy'],
    total_countries: 3
  },
  '/api/v1/covid/model-info': {
    algorithm: 'polynomial_regression',
    training_date: '2024-01-01',
    performance: { test_r2: 0.85 }
  }
};

// Server principal (port 5000)
const mainServer = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  if (mockResponses[path]) {
    res.writeHead(200);
    res.end(JSON.stringify(mockResponses[path]));
  } else if (req.method === 'POST' && path === '/api/etl/upload') {
    res.writeHead(200);
    res.end(JSON.stringify({ message: 'Upload réussi avec succès' }));
  } else if (req.method === 'POST' && path === '/api/etl/download') {
    res.writeHead(200);
    res.end(JSON.stringify({ message: 'Téléchargement réussi avec succès' }));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

// Serveur ML (port 5001)
const mlServer = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  if (mlResponses[path]) {
    res.writeHead(200);
    res.end(JSON.stringify(mlResponses[path]));
  } else if (req.method === 'POST' && path === '/api/v1/covid/predict-batch') {
    res.writeHead(200);
    res.end(JSON.stringify({
      results: [{
        new_deaths_predicted: 42.5,
        country: 'France',
        date: '2022-05-15'
      }],
      model_version: '1.0',
      timestamp: new Date().toISOString()
    }));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'ML endpoint not found' }));
  }
});

mainServer.listen(5000, () => {
  console.log('Mock API server running on port 5000');
});

mlServer.listen(5001, () => {
  console.log('Mock ML API server running on port 5001');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  mainServer.close();
  mlServer.close();
  process.exit(0);
});

process.on('SIGINT', () => {
  mainServer.close();
  mlServer.close();
  process.exit(0);
});