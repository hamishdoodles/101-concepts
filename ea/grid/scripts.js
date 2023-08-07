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
}

// Measure total scrollable heights
const pagesScrollHeight = pagesContainer.scrollHeight - pagesContainer.clientHeight;
const tilesScrollHeight = tilesContainer.scrollHeight - tilesContainer.clientHeight;
const scrollFactorPagesToTiles = tilesScrollHeight / pagesScrollHeight;
const scrollFactorTilesToPages = pagesScrollHeight / tilesScrollHeight;

let activeScrollContainer = null; // Keep track of the active scroll container

// Sync scroll from pages to tiles
pagesContainer.addEventListener('scroll', () => {
  if (activeScrollContainer !== pagesContainer) return;
  tilesContainer.scrollTop = pagesContainer.scrollTop * scrollFactorPagesToTiles;
});

// Sync scroll from tiles to pages
tilesContainer.addEventListener('scroll', () => {
  if (activeScrollContainer !== tilesContainer) return;
  pagesContainer.scrollTop = tilesContainer.scrollTop * scrollFactorTilesToPages;
});

// Determine the active scroll container on mouseover
pagesContainer.addEventListener('mouseover', () => {
  activeScrollContainer = pagesContainer;
});

tilesContainer.addEventListener('mouseover', () => {
  activeScrollContainer = tilesContainer;
});
