export function generateUuid() {
  if (window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  } else {
    console.warn('Crypto.randomUUID() is not available in this environment. Falling back to less secure method or library.');
    return Math.random.toString().slice(0, 9);
  }
}
