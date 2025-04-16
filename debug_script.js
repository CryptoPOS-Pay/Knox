
document.addEventListener("DOMContentLoaded", function () {
  const amountInput = document.getElementById("amount");
  const currencySelect = document.getElementById("currency");
  const cryptoSelect = document.getElementById("crypto");
  const conversionOutput = document.getElementById("conversion");
  const sendButton = document.getElementById("send");

  async function updateConversion() {
    const amount = parseFloat(amountInput.value);
    const currency = currencySelect.value.toLowerCase();
    const crypto = cryptoSelect.value.toLowerCase();

    console.log("🔁 Conversion en cours...");
    console.log("Montant:", amount);
    console.log("Devise:", currency);
    console.log("Crypto:", crypto);

    if (isNaN(amount) || !currency || !crypto) {
      console.warn("⛔ Informations incomplètes pour la conversion");
      return;
    }

    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=${currency}`;
    console.log("URL CoinGecko:", url);

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("Réponse JSON:", data);

      const price = data[crypto][currency];
      const converted = amount / price;
      console.log("Prix unitaire:", price);
      console.log("Montant converti:", converted);

      conversionOutput.textContent = `≈ ${converted.toFixed(6)} ${crypto.toUpperCase()}`;
    } catch (error) {
      console.error("Erreur lors de la récupération du taux:", error);
      conversionOutput.textContent = "Erreur de conversion";
    }
  }

  amountInput.addEventListener("input", updateConversion);
  currencySelect.addEventListener("change", updateConversion);
  cryptoSelect.addEventListener("change", updateConversion);

  sendButton.addEventListener("click", function () {
    console.log("💸 Bouton Envoyer cliqué");
    // Code de paiement ici
  });
});
