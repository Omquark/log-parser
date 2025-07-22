function getFormattedDate() {
  const now = new Date();

  const pad = (n) => String(n).padStart(2, '0');

  const day = pad(now.getDay());
  const month = pad(now.getMonth());
  const year = now.getFullYear();

  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());

  return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
}

module.exports = { getFormattedDate }