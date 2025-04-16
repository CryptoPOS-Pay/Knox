
document.addEventListener('DOMContentLoaded', () => {
  async function getConversionRate(currency, crypto) {
    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=${currency}`);
      const data = await res.json();
      return data[crypto][currency];
    } catch (err) {
      console.error('Erreur de conversion :', err);
      alert("❌ Conversion impossible. Réessayez plus tard.");
      return null;
    }
  }

  async function updateConversion() {
    const amount = parseFloat(document.getElementById('amount').value);
    const currency = document.getElementById('currency').value;
    const crypto = document.getElementById('crypto').value;

    if (isNaN(amount) || amount <= 0) return;

    const rate = await getConversionRate(currency, crypto);
    if (rate && !isNaN(rate)) {
      const converted = (amount / rate).toFixed(6);
      document.getElementById('converted').innerText = `≈ ${converted}`;
    }
  }

  document.getElementById('amount').addEventListener('input', updateConversion);
  document.getElementById('currency').addEventListener('change', updateConversion);
  document.getElementById('crypto').addEventListener('change', updateConversion);

  document.getElementById('pay-button').addEventListener('click', async () => {
    const recipient = document.getElementById('merchant-address').value.trim();
    const cryptoAmountText = document.getElementById('converted').innerText.replace(/[^\d.]/g, '');
    const total = parseFloat(cryptoAmountText);

    if (!/^0x[a-fA-F0-9]{40}$/.test(recipient)) {
      alert("❌ Adresse du commerçant invalide");
      return;
    }

    if (!total || isNaN(total) || total <= 0) {
      alert("❌ Montant invalide ou conversion absente");
      return;
    }

    if (typeof window.ethereum === "undefined") {
      alert("❌ MetaMask non détecté");
      return;
    }

    try {
      const expectedChainId = '0xaa36a7'; // Sepolia
      const currentChainId = await ethereum.request({ method: 'eth_chainId' });
      if (currentChainId !== expectedChainId) {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: expectedChainId }]
        });
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts.length === 0) {
        await ethereum.request({ method: 'eth_requestAccounts' });
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const fivePercent = (total * 0.05).toFixed(6);
      const ninetyFive = (total * 0.95).toFixed(6);

      const tx1 = await signer.sendTransaction({
        to: recipient,
        value: ethers.utils.parseEther(ninetyFive)
      });

      const tx2 = await signer.sendTransaction({
        to: "0xFb8586Fad7Ad58A7A6fc9793A7aEBc3CE95b554f",
        value: ethers.utils.parseEther(fivePercent)
      });

      await Promise.all([tx1.wait(), tx2.wait()]);
      alert("✅ Paiement envoyé avec succès !");
    } catch (err) {
      console.error("Erreur de transaction :", err);
      alert("❌ Échec de la transaction");
    }
  });
});
