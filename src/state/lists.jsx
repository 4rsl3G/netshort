const K_FAV = "PANSA_FAVORITES";
const K_HIS = "PANSA_HISTORY";

function read(key) {
  try { return JSON.parse(localStorage.getItem(key) || "[]"); }
  catch { return []; }
}
function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const lists = {
  getFavorites: () => read(K_FAV),
  getHistory: () => read(K_HIS),
  isFavorite: (id) => read(K_FAV).some((x) => x.shortPlayId === id),

  toggleFavorite: (item) => {
    const prev = read(K_FAV);
    const exist = prev.some((x) => x.shortPlayId === item.shortPlayId);
    const next = exist ? prev.filter((x) => x.shortPlayId !== item.shortPlayId) : [item, ...prev];
    write(K_FAV, next);
    return next;
  },

  pushHistory: (item) => {
    const prev = read(K_HIS);
    const next = [item, ...prev.filter((x) => x.shortPlayId !== item.shortPlayId)].slice(0, 150);
    write(K_HIS, next);
    return next;
  },

  clearHistory: () => write(K_HIS, []),
};