
async function sendPayment() {
  if (typeof window.ethereum === 'undefined') {
    alert('Veuillez installer MetaMask');
    return;
  }

  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  const walletAddress = accounts[0];
  document.getElementById('wallet-status').innerText = '📦 Wallet connecté : ' + walletAddress.slice(0, 6) + '...' + walletAddress.slice(-4);

  const recipient = document.getElementById('merchant-address').value;
  const amount = document.getElementById('crypto-amount').innerText.replace('≈ ', '').split(' ')[0];

  const valueInWei = window.ethers.utils.parseEther(amount);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  try {
    const tx = await signer.sendTransaction({
      to: recipient,
      value: valueInWei
    });
    await tx.wait();
    alert('✅ Paiement effectué avec succès');
  } catch (err) {
    console.error(err);
    alert('❌ Paiement échoué');
  }
}
