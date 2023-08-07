const colors = ["#38a8cc", "#004444", "#884444", "#555588", "#a84466"];

const pagesContainer = document.getElementById('pages');
const tilesContainer = document.getElementById('tiles');

function addCard(i, title) {
  const color = colors[i % colors.length];

  const pageDiv = document.createElement('div');
  pageDiv.className = 'page';
  pageDiv.style.backgroundColor = color;
  pageDiv.innerHTML = `<div class="close-section">&times;</div>${i+1} ${title}`;
  pagesContainer.appendChild(pageDiv);

  const tileDiv = document.createElement('div');
  tileDiv.className = 'tile';
  tileDiv.style.backgroundColor = color;
  tileDiv.textContent = `${i+1} ${title}`;
  tilesContainer.appendChild(tileDiv);

  // Add click event to jump to corresponding element in Pages
  tileDiv.addEventListener('click', () => {
    tilesContainer.classList.add('invisible');

    const targetPage = pagesContainer.children[i];
    pagesContainer.scrollTo({ top: targetPage.offsetTop, behavior: 'smooth' });
  });
}


renderFromSpreadsheet("https://docs.google.com/spreadsheets/d/1FPOw1raQDn3xXmr2ejbYrUr8U_ZtxalJjB3pdNBvyUQ/export?format=csv&gid=0", "#data-container");

// Renders the glossary from the given CSV URL
function renderFromSpreadsheet(csvUrl, containerId) {
    d3.csv(csvUrl)
        .then(function(data) {
            console.table(data);
            var labelToSlug = createCrossReferenceMapping(data);
            buildGlossary(containerId, data, labelToSlug);
            activateScroll();
            scrollToAnchor();
            activateCloseButtons();
        })
        .catch(function(error) {
            console.log(error);
        });
}

// Creates a mapping like 'Concept 1' → '#concept-1' and 'Concept 1 alias' → '#concept-1'
function createCrossReferenceMapping(data) {
    var labelToSlug = {};
    data.forEach(function(d) {
        labelToSlug[d['Label'].trim()] = d['slug'];
        d['aka'].trim() && d['aka'].split(',').forEach(alias => labelToSlug[alias.trim()] = d['slug']);
    });
    return labelToSlug;
}

// Builds the entire glossary
function buildGlossary(containerId, data, labelToSlug) {
    var container = d3.select(containerId);
    var currentTable;

    data.forEach(function(d) {
        /*
        if (d['Topic'] !== '') {
            // currentTable = createTopicSection(container, d);
            addCard(d['Number'], d['Label'])
        }
        */
        addCard(parseInt(d['Number'])-1, d['Label'])
        /* createTableEntry(currentTable, d, labelToSlug); */
    });
}

// Creates a new topic section
function createTopicSection(container, d) {
    var div = container.append('div').attr('id', d['slug']);
    div.append('img')
        .attr('src', window.location.origin + window.location.pathname + '/imgs/' + d['Image URL'])
        .attr('alt', d['Label'])
        .classed('image-container', true)
        .classed('breathe-image', true);
    div.append('h2')
        .text(d['Topic'])
        .classed('table-title', true);
    return div
}

// Creates a table entry for a single row
function createTableEntry(currentTable, d, labelToSlug) {
    d['Description'] = insertCrossReferences(d['Description'], labelToSlug);
    var row = currentTable.append('tr').attr('id', d['slug']);
    row.append('td').text(d['Number']);
    row.append('td').text(d['Label']);
    row.append('td').html(d['Description']);
    MathJax.typeset();
}

// Replaces instances of "Concept 1" with "<a href='#concept-1'>Concept 1</a>"
function insertCrossReferences(description, labelToSlug) {
    Object.keys(labelToSlug).forEach(function(label) {
        var re = new RegExp('\\b' + escapeRegExp(label) + '\\b', 'gi'); // Match whole word, case-insensitive
        description = description.replace(re, '<a href="#' + labelToSlug[label] + '">' + label + '</a>');
    });
    return description;
}

// If the page was loaded with "url/#concept", then this will scroll to #concept
function scrollToAnchor() {
    let hash = window.location.hash;
    if (hash) {
        let element = document.querySelector(hash);
        if (element) {
            element.scrollIntoView();
        }
    }
}

// Escapes special characters for use in a regular expression
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function activateScroll() {
  // Measure total scrollable heights
  const pagesScrollHeight = pagesContainer.scrollHeight - pagesContainer.clientHeight;
  const tilesScrollHeight = tilesContainer.scrollHeight - tilesContainer.clientHeight;
  const scrollFactor = tilesScrollHeight / pagesScrollHeight;
  
  // Sync scroll between pages and tiles
  pagesContainer.addEventListener('scroll', () => {
    tilesContainer.scrollTop = pagesContainer.scrollTop * scrollFactor;
  });
}

function activateCloseButtons() {
  document.querySelectorAll('.close-section').forEach((closeButton, index) => {
    console.log('close', index);
    closeButton.addEventListener('click', () => {
      const correspondingTile = tilesContainer.children[index];
      tilesContainer.classList.remove('invisible');
    });
  });
}
