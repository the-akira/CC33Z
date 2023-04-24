function convert() {
  const latinText = document.getElementById("name").value.trim();
  const output = document.getElementById("output");
  const cyrillicText = latinText
    .replace(/a/gi, "а")
    .replace(/b/gi, "б")
    .replace(/v/gi, "в")
    .replace(/g/gi, "г")
    .replace(/d/gi, "д")
    .replace(/e/gi, "е")
    .replace(/yo/gi, "ё")
    .replace(/zh/gi, "ж")
    .replace(/z/gi, "з")
    .replace(/i/gi, "и")
    .replace(/y/gi, "й")
    .replace(/j/gi, "й")
    .replace(/k/gi, "к")
    .replace(/l/gi, "л")
    .replace(/m/gi, "м")
    .replace(/n/gi, "н")
    .replace(/o/gi, "о")
    .replace(/p/gi, "п")
    .replace(/r/gi, "р")
    .replace(/s/gi, "с")
    .replace(/t/gi, "т")
    .replace(/u/gi, "у")
    .replace(/f/gi, "ф")
    .replace(/h/gi, "х")
    .replace(/c/gi, "ц")
    .replace(/ch/gi, "ч")
    .replace(/sh/gi, "ш")
    .replace(/sch/gi, "щ")
    .replace(/y/gi, "ы")
    .replace(/e/gi, "э")
    .replace(/yu/gi, "ю")
    .replace(/ya/gi, "я");
  output.innerText = cyrillicText;
  if (!latinText) {
    output.innerText = "Informe um texto!";
  }
}