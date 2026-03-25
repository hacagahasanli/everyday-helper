 const normalizeAzText = (text: string): string => {
  const charMap: { [key: string]: string } = {
    ə: "e",
    Ə: "E",
    ı: "i",
    İ: "I",
    ş: "s",
    Ş: "S",
    ç: "c",
    Ç: "C",
    ğ: "g",
    Ğ: "G",
    ü: "u",
    Ü: "U",
    ö: "o",
    Ö: "O",
  };

  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[əıüşçğüöƏIŞÇĞÜÖ]/g, (match) => charMap[match] || match)
    .toLowerCase();
};

export default normalizeAzText
