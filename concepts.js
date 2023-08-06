// Renders the glossary from the given CSV URL
function renderFromSpreadsheet(csvUrl, containerId) {
    d3.csv(csvUrl)
        .then(function(data) {
            console.table(data);
            var labelToSlug = createCrossReferenceMapping(data);
            buildGlossary(containerId, data, labelToSlug);
            scrollToAnchor();
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
        if (d['Topic'] !== '') {
            currentTable = createTopicSection(container, d);
        }
        createTableEntry(currentTable, d, labelToSlug);
    });
}

// Creates a new topic section
function createTopicSection(container, d) {
    var div = container.append('div').attr('id', d['slug']);
    div.append('img')
        .attr('src', window.location.origin + window.location.pathname + '/imgs/' + d['Image URL'])
        .attr('alt', d['Label'])
        .classed('image-container', true);
    div.append('h2')
        .text(d['Topic'])
        .classed('table-title', true);
    var table = div.append('table');
    return table.append('tbody');
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
