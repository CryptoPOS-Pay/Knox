
document.addEventListener("DOMContentLoaded", async () => {
  const amountInput = document.getElementById("amount");
  const currencySelect = document.getElementById("currency");
  const cryptoSelect = document.getElementById("crypto");
  const resultDisplay = document.getElementById("cryptoAmount");

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
      if (!rate) throw new Error("Rate not found");

      const converted = amount / rate;
      resultDisplay.innerText = `≈ ${converted.toFixed(6)} ${crypto.toUpperCase()}`;
    } catch (e) {
      console.error("Conversion failed:", e);
      resultDisplay.innerText = "Erreur de conversion";
    }
  }

  amountInput.addEventListener("input", fetchConversion);
  currencySelect.addEventListener("change", fetchConversion);
  cryptoSelect.addEventListener("change", fetchConversion);
});
