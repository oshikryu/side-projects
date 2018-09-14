function makeSmallCircle(b_data, r_data, g_data) {
    var svg = d3.select('#content').append('svg')

    var drag = d3.behavior.drag()
        .on('drag', function () {
            d3.select(this).attr('transform', function () {
                // console.log(d3.event);
                updateCoords(this.childNodes[0].id, d3.event);
                var post_data = JSON.stringify({'params': {"id": this.childNodes[0].id, "x":d3.event.x, "y":d3.event.y}});
                // ajax post
                sendToDB(post_data);
                return "translate(" + [d3.event.x, d3.event.y] + ")"
            });
        });


    var blue = {'id':'blueCircle', 'color':'#08c', 'x':b_data.x, 'y':b_data.y};
    var red = {'id':'redCircle', 'color':'#e35b4b', 'x':r_data.x, 'y':r_data.y};
    var green = {'id':'greenCircle', 'color':'#8cb169', 'x':g_data.x, 'y':g_data.y};
    var colors = [blue,red,green];
    //crosshair length
    var clen = 10;

    var groups = svg.selectAll('g')
        .data(colors)
        .enter()
        .append('g')
        .each( function (d, i) {
            makeCircle(i, this) 
            makeVertCross(i,this)
            makeHorzCross(i,this)
        })
        .attr('transform', function (d, i) {
            console.log(colors[i].x + " " + colors[i].y);
            return "translate(" + [(colors[i].x),(colors[i].y)] + ")"
        })
        .call(drag);


    function makeCircle (iter, el) {
        var curGroup = d3.select(el);
        // console.log(curGroup);
        curGroup
            .data(colors, iter[0])
            .append('circle')
            .attr('id', colors[iter].id)
            .attr('r', 50)
            .style('stroke', colors[iter].color);
    }


    function makeVertCross (iter, el) {
        var curGroup = d3.select(el);
        // console.log(curGroup);
        curGroup
            .data(colors, iter[0])
            .append('line')
            .attr('x1', 0)
            .attr('y1', -clen)
            .attr('x2', 0)
            .attr('y2', clen)
            .style('stroke', colors[iter].color);
    }


    function makeHorzCross (iter, el) {
        var curGroup = d3.select(el);
        // console.log(curGroup);
        curGroup
            .data(colors, iter[0])
            .append('line')
            .attr('x1', -clen)
            .attr('y1', 0)
            .attr('x2', clen)
            .attr('y2', 0)
            .style('stroke', colors[iter].color);
    }

}


function makeSuperCircle (x,y,r, area) {
    var superCanvas = d3.select('svg');
    var curEl = superCanvas
        .append('g')
        .attr('id', 'superCanvas')

    curEl
        .append('circle')
        .attr('id', 'supercircle')
        .attr('r', r)
        .style('stroke', 'black')
        .attr('transform', function () {
            return "translate(" + [x,y] + ")"
        })

    // update supercircle table vals
    $('#superCoords td')[1].innerText = x;
    $('#superCoords td')[2].innerText = y;
    $('#superCoords td')[3].innerText = r;
    $('#superCoords td')[4].innerText = area;
}


function updateCoords (id, targetInfo) {
  var field, coords;
  switch (id) {
    case "blueCircle":
      field = document.getElementById('blueCoords');
      coords = field.getElementsByTagName('td');
    break;

    case "redCircle":
      field = document.getElementById('redCoords');
      coords = field.getElementsByTagName('td');
    break;

    case "greenCircle":
      field = document.getElementById('greenCoords');
      coords = field.getElementsByTagName('td');
    break;
  }
  // console.log(coords[0].innerText);
  coords[1].innerText = targetInfo.x;
  coords[2].innerText = targetInfo.y;
}


function sendToDB (post_data) {
    $.ajax({
        type:"POST",
        url:"/",
        data:post_data,
        success: function(data) {
            rsp = data['$set'];
            makeSuperCircle(rsp.c[0], rsp.c[1], rsp.r, rsp.area);
            $('g#superCanvas:not(:last)').remove();
        },
        error:   function() {
            console.log('error');
        }
    });
}

// initialize table of coordinates
function initializeTable (blue, red, green, sc) {
    $('#blueCoords td')[1].innerText = blue.x;
    $('#blueCoords td')[2].innerText = blue.y;

    $('#redCoords td')[1].innerText = red.x;
    $('#redCoords td')[2].innerText = red.y;

    $('#greenCoords td')[1].innerText = green.x;
    $('#greenCoords td')[2].innerText = green.y;

    $('#superCoords td')[1].innerText = sc.x;
    $('#superCoords td')[2].innerText = sc.y;
    $('#superCoords td')[3].innerText = sc.r;
    $('#superCoords td')[4].innerText = sc.area;    

}


$(function () {
    // get initial circle values
    $.ajax({
        type:"GET",
        url:"/initialize",
        success: function(data) {
            rsp = data['supercircle'];
            initializeTable(data.blueCircle, data.redCircle, data.greenCircle, rsp);
            makeSmallCircle(data.blueCircle, data.redCircle, data.greenCircle);
            makeSuperCircle(rsp['x'], rsp['y'], rsp['r'], rsp['area']);
        },
        error: function(e) {
            console.log(e);
            console.log('supercircle draw error');
        }
    })
});

