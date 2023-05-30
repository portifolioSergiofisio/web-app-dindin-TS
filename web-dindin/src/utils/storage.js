export function setItem({ key, value }) {
  localStorage.setItem(key, value);
}

export function getItem(key) {
  console.log(key);
  localStorage.getItem(key);
}

export function removeItem({ key }) {
  localStorage.removeItem(key);
}

export function clearAll() {
  localStorage.clear();
}
