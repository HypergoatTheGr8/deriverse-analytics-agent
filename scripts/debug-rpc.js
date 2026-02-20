const { Connection, PublicKey } = require('@solana/web3.js');

const RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
const wallet = process.argv[2];
if (!wallet) {
  console.error('Usage: node scripts/debug-rpc.js <walletAddress>');
  process.exit(2);
}

(async () => {
  try {
    const conn = new Connection(RPC_URL, 'confirmed');
    const pub = new PublicKey(wallet);
    const sigs = await conn.getSignaturesForAddress(pub, { limit: 50 });
    console.log(`RPC: fetched ${sigs.length} signatures for ${wallet}`);
    if (sigs.length > 0) {
      console.log('Sample signatures:', sigs.slice(0, 5).map(s => s.signature));

      // Fetch and print a parsed transaction for the first signature
      const firstSig = sigs[0].signature;
      const parsed = await conn.getParsedTransaction(firstSig, 'confirmed');
      console.log('Parsed transaction (trimmed):', JSON.stringify(parsed ? {
        slot: parsed.slot,
        meta: parsed.meta ? { err: parsed.meta.err, fee: parsed.meta.fee, preBalances: parsed.meta.preBalances?.slice(0,3), postBalances: parsed.meta.postBalances?.slice(0,3) } : null,
        transaction: parsed.transaction ? { message: { accountKeys: parsed.transaction.message.accountKeys.slice(0,5) } } : null
      } : null, null, 2));
    }
  } catch (err) {
    console.error('RPC error:', err.message || err);
    process.exit(1);
  }
})();
