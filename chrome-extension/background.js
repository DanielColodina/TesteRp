// URL do sistema RP Empreendimentos
const SYSTEM_URL = "https://testerp-5z5v.onrender.com/login";

chrome.action.onClicked.addListener((tab) => {
  // Abre o sistema em uma nova aba ou na aba atual
  chrome.tabs.create({ url: SYSTEM_URL, active: true });
});
