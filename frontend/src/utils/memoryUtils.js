const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function getMediaSrc(memory) {
  if (!memory?.mediaUrl) return "";
  return `${API_BASE_URL}${memory.mediaUrl}`;
}

export function getCoverSrc(memory) {
  if (memory?.coverImageUrl) {
    return `${API_BASE_URL}${memory.coverImageUrl}`;
  }

  if (memory?.mediaUrl) {
    return `${API_BASE_URL}${memory.mediaUrl}`;
  }

  return "";
}

export function formatDateTR(dateValue, options = {}) {
  if (!dateValue) return "";

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    ...options,
  }).format(new Date(dateValue));
}

export function getTypeLabel(type) {
  const labels = {
    photo: "Fotoğraf",
    video: "Video",
    note: "Not",
    audio: "Ses Kaydı",
    music: "Müzik",
    special_day: "Özel Gün",
  };

  return labels[type] || type;
}

export function getTypeIcon(type) {
  const icons = {
    photo: "▧",
    video: "▶",
    note: "✎",
    audio: "🎙",
    music: "♪",
    special_day: "♡",
  };

  return icons[type] || "🍀";
}