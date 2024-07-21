export function remplirAnnees() {
    const anneeSelect = document.getElementById('annee');
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1900; year--) {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      anneeSelect.appendChild(option);
    }
  }
  