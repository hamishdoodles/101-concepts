const colors = ["#38a8cc", "#004444", "#884444", "#555588", "#a84466"];

const pagesContainer = document.getElementById('pages');
const tilesContainer = document.getElementById('tiles');

// Add 40 divs to both pages and tiles
for (let i = 0; i < 40; i++) {
  const color = colors[i % colors.length];

  const pageDiv = document.createElement('div');
  pageDiv.className = 'page';
  pageDiv.style.backgroundColor = color;
  pageDiv.innerHTML = `<div class="close-section">&times;</div>${i}`;
  pagesContainer.appendChild(pageDiv);

  const tileDiv = document.createElement('div');
  tileDiv.className = 'tile';
  tileDiv.style.backgroundColor = color;
  tileDiv.textContent = i;
  tilesContainer.appendChild(tileDiv);

  // Add click event to jump to corresponding element in Pages
  tileDiv.addEventListener('click', () => {
    tileDiv.classList.add('expanded', 'full-viewport');
    tilesContainer.style.opacity = '0'; // Make Tiles invisible

    setTimeout(() => {
      tileDiv.classList.remove('expanded', 'full-viewport');
      tilesContainer.style.opacity = '1'; // Make Tiles visible again
    }, 300);

    const targetPage = pagesContainer.children[i];
    pagesContainer.scrollTo({ top: targetPage.offsetTop, behavior: 'smooth' });
  });
}

// Measure total scrollable heights
const pagesScrollHeight = pagesContainer.scrollHeight - pagesContainer.clientHeight;
const tilesScrollHeight = tilesContainer.scrollHeight - tilesContainer.clientHeight;
const scrollFactor = tilesScrollHeight / pagesScrollHeight;

// Sync scroll between pages and tiles
pagesContainer.addEventListener('scroll', () => {
  tilesContainer.scrollTop = pagesContainer.scrollTop * scrollFactor;
});

document.querySelectorAll('.close-section').forEach((closeButton, index) => {
  closeButton.addEventListener('click', () => {
    const correspondingTile = tilesContainer.children[index];
    correspondingTile.classList.add('expanded');

    setTimeout(() => {
      tilesContainer.style.opacity = '1'; // Make Tiles visible again
      correspondingTile.classList.remove('expanded');
    }, 300);
  });
});
