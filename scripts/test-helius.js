const axios = require('axios');

const HELIUS_API_URL = 'https://api.helius.xyz/v0';
const apiKey = process.env.HELIUS_API_KEY;
if (!apiKey) {
  console.error('HELIUS_API_KEY not set in environment.');
  process.exit(2);
}

const wallet = process.argv[2];
if (!wallet) {
  console.error('Usage: node scripts/test-helius.js <walletAddress>');
  process.exit(2);
}

(async () => {
  try {
    const resp = await axios.get(`${HELIUS_API_URL}/addresses/${wallet}/transactions`, {
      params: { 'api-key': apiKey, limit: 10 }
    });

    const data = resp.data || [];
    console.log(`Fetched ${data.length} transactions for wallet ${wallet}`);
    if (data.length > 0) {
      const sample = data[0];
      console.log('Sample transaction signature:', sample.signature || sample.txHash || '(no signature)');
      console.log('Type:', sample.type || '(no type)');
      console.log('Timestamp:', sample.timestamp || '(no timestamp)');
    }
  } catch (err) {
    console.error('Helius fetch error:', err.message || err);
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Body:', JSON.stringify(err.response.data).slice(0, 200));
    }
    process.exit(1);
  }
})();
