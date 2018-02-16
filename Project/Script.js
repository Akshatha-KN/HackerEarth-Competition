// JavaScript source code
(function () {
    var projects;
    var getJSON = function (url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = function () {
            var status = xhr.status;
            if (status === 200) {
                callback(null, xhr.response);
            } else {
                callback(status, xhr.response);
            }
        };
        xhr.send();
    };
    getJSON('http://starlord.hackerearth.com/kickstarter',
        function (err, data) {
            if (err !== null) {
                alert('Something went wrong: ' + err);
            } else {
                localStorage["data"] = JSON.stringify(data);
                localStorage["searchResult"] = '';
                $('#form1').on('submit', searchName);
                displayHeader();
                displayGrid();
                

            }
        });
    
    function clearGrid() {
        document.querySelector('#projectList > tbody').innerHTML = "";
    }
    function displayHeader() {
        var data = JSON.parse( localStorage["data"]);
        var headingEle = document.querySelector('#projectList > thead > tr');
        var headingsList = data[0];
        for (let item in data[0]) {
            let newHeading = document.createElement('th');

            if (item == 'end.time') {
                newHeading.innerHTML = item.replace('.', ' ').toUpperCase() + '<i class="fa fa-sort-asc"  id="sortEndTime"></i>';


            }
            else if (item == 'percentage.funded') {
                newHeading.innerHTML = item.replace('.', ' ').toUpperCase() + '<i class="fa fa-sort-asc"  id="sortPercentage"></i>';
            }
            else {
                newHeading.innerHTML = item.replace('.', ' ').toUpperCase();
            }
            headingEle.appendChild(newHeading);

        }
        $('#sortEndTime,#sortPercentage').on('click', function () {
            var sortedData;
            if ($(this).hasClass('fa-sort-asc')) {
                $(this).removeClass('fa-sort-asc').addClass('fa-sort-desc');
                if ($(this).attr('id') == 'sortEndTime') {
                    sortedData = data.sort(function (a, b) {
                        return new Date(a["end.time"]) - new Date(b["end.time"]);
                    });
                }
                else if ($(this).attr('id') == 'sortPercentage') {
                    sortedData = data.sort(function (a, b) {
                        return a['percentage.funded'] - b['percentage.funded'];
                    });
                }

            }
            else if ($(this).hasClass('fa-sort-desc')) {
                $(this).removeClass('fa-sort-desc').addClass('fa-sort-asc');
                if ($(this).attr('id') == 'sortEndTime') {
                    sortedData = data.sort(function (a, b) {
                        return new Date(b["end.time"]) - new Date(a["end.time"]);
                    });
                }
                else if ($(this).attr('id') == 'sortPercentage') {
                    sortedData = data.sort(function (a, b) {
                        return b['percentage.funded'] - a['percentage.funded'];
                    });
                }
            }
            localStorage["data"] = JSON.stringify( sortedData);
            clearGrid();
            displayGrid();
        });
    }
    function displayGrid() {
        var data;
        if (localStorage["searchResult"] != '') {
            data = JSON.parse( localStorage["searchResult"]);
            localStorage["searchResult"] = '';
        }
        else {
            data = JSON.parse(  localStorage["data"]);
        }
        document.querySelector('#projectList').append(document.createElement('tbody'));
        data.forEach(function (val, index, arr) {
            let newRow = document.createElement('tr');
            for (let [k, v] of Object.entries(val)) {
                let newCell = document.createElement('td');
                let textNode = document.createTextNode(v);
                newCell.appendChild(textNode);
                newRow.appendChild(newCell);

            };
            document.querySelector('#projectList > tbody').appendChild(newRow);
        });
    }
    function searchName(e) {
        var name = new RegExp( form1.searchName.value,'i');
        this.innerHTML = "";
        var data = JSON.parse(localStorage["data"]);
        var result = $.grep(data, function (e) {
            return e.title.search(name)>=0;
        });
        localStorage["searchResult"] = JSON.stringify(result);
        clearGrid();
        displayGrid();
    }
})();