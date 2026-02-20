const axios = require('axios');

const HELIUS_API_URL = 'https://api.helius.xyz/v0';
const apiKey = process.env.HELIUS_API_KEY;
if (!apiKey) {
  console.error('HELIUS_API_KEY not set in environment.');
  process.exit(2);
}

const wallet = process.argv[2];
if (!wallet) {
  console.error('Usage: node scripts/debug-helius.js <walletAddress>');
  process.exit(2);
}

(async () => {
  try {
    const resp = await axios.get(`${HELIUS_API_URL}/addresses/${wallet}/transactions`, {
      params: { 'api-key': apiKey, limit: 50 }
    });

    const data = resp.data || [];
    console.log(`Fetched ${data.length} transactions for wallet ${wallet} (no type filter)`);
    if (data.length > 0) {
      console.log('--- Sample 1 ---');
      console.log(JSON.stringify(data[0], null, 2).slice(0, 4000));
      if (data.length > 1) {
        console.log('--- Sample 2 ---');
        console.log(JSON.stringify(data[1], null, 2).slice(0, 4000));
      }
    }
  } catch (err) {
    console.error('Helius fetch error:', err.message || err);
    if (err.response) {
      console.error('Status:', err.response.status);
      try { console.error('Body:', JSON.stringify(err.response.data).slice(0, 2000)); } catch(e) {}
    }
    process.exit(1);
  }
})();
