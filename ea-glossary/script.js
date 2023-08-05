d3.csv("https://docs.google.com/spreadsheets/d/1FPOw1raQDn3xXmr2ejbYrUr8U_ZtxalJjB3pdNBvyUQ/export?format=csv&gid=0")
    .then(function(data) {
        var container = d3.select("#data-container");
        var currentTable;
        data.forEach(function(d) {
            if(d['Topic'] !== '') {
                var div = container.append('div').attr('id', d['slug']);
                div.append('img')
                    .attr('src', window.location.origin + window.location.pathname + '/imgs/' + d['Image URL'])
                    .attr('alt', d['Label'])
                    .classed('image-container', true);
                div.append('h2')
                    .text(d['Topic'])
                    .classed('table-title', true);
                var table = div.append('table');
                currentTable = table.append('tbody');
            } 
            var row = currentTable.append('tr').attr('id', d['slug']);
            row.append('td').text(d['Number']);
            row.append('td').text(d['Label']);
            row.append('td').html(d['Description']);
            MathJax.typeset(); 
        });
    })
    .catch(function(error){
        console.log(error);
    });
