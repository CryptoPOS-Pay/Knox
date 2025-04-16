let userAccount = null;
let convertedAmount = 0; // en crypto

document.addEventListener("DOMContentLoaded", async () => {
  const amountInput = document.getElementById("amount");
  const currencySelect = document.getElementById("currency");
  const cryptoSelect = document.getElementById("crypto");
  const resultDisplay = document.getElementById("conversion");
  const recipientInput = document.getElementById("recipient");
  const walletStatus = document.getElementById("wallet-status");

  async function fetchConversion() {
    const amount = parseFloat(amountInput.value);
    const currency = currencySelect.value.toLowerCase();
    const crypto = cryptoSelect.value.toLowerCase();

    if (!amount || !currency || !crypto) {
      resultDisplay.innerText = "Erreur de conversion";
      return;
    }

    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=${currency}`);
      const data = await response.json();
      const rate = data[crypto][currency];

      if (!rate) throw new Error("Taux non trouvé");

      convertedAmount = amount / rate;

      resultDisplay.innerText = `≈ ${convertedAmount.toFixed(6)} ${crypto.toUpperCase()}`;
    } catch (e) {
      console.error("Conversion échouée:", e);
      resultDisplay.innerText = "Erreur de conversion";
    }
  }

  amountInput.addEventListener("input", fetchConversion);
  currencySelect.addEventListener("change", fetchConversion);
  cryptoSelect.addEventListener("change", fetchConversion);

  // Connecter MetaMask
  window.connectWallet = async function () {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAccount = accounts[0];
        walletStatus.innerText = `🟢 Connecté : ${userAccount}`;
      } catch (err) {
        console.error("Connexion refusée", err);
        walletStatus.innerText = "❌ Connexion refusée";
      }
    } else {
      alert("MetaMask n'est pas installé !");
    }
  };

  // Envoyer la transaction
  window.sendPayment = async function () {
    const recipient = recipientInput.value;
    const crypto = cryptoSelect.value.toLowerCase();

    if (!userAccount) {
      await connectWallet();
    }

    if (!convertedAmount || !recipient) {
      alert("Montant ou adresse invalide !");
      return;
    }

    if (crypto !== 'eth') {
      alert("Ce script prend en charge uniquement ETH pour l’instant.");
      return;
    }

    try {
      const tx = {
        from: userAccount,
        to: recipient,
        value: ethers.utils.parseEther(convertedAmount.toFixed(6).toString()).toHexString()
      };

      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [tx]
      });

      alert("✅ Paiement envoyé !");
    } catch (err) {
      console.error("Erreur lors de l'envoi", err);
      alert("❌ Paiement échoué");
    }
  };
});
