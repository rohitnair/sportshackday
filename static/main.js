
var FIELD_MIN_Y = 0;
var FIELD_MAX_X = 1024;
var FIELD_MAX_Y = 500;
var FIELD_MIN_X = 0;

var PLAY_MIN_X = 12;
var PLAY_MAX_X = FIELD_MAX_X - PLAY_MIN_X;

var FIELD_LINE_COLOR = '#005500';

var $xml = "";
var $xmlPlays = "";
var xmlPlaysPos = 0;

var home = [];
var away = [];

var context = {};

function drawText(context, text, x, y) {
    context.fillStyle = '#000000';
    context.font= '24px Arial';
    context.fillText(text, x, y); //, context.measureText(text).width,  context.measureText(text).height

}

function drawLine(context, x1, y1, x2, y2, style) {
    context.strokeStyle = style;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.closePath();
    context.stroke();
}

function getYardXPosition(yards, side) {
    if(side=='away') yards = 100 - yards;
    return 10*yards+PLAY_MIN_X;
}

function drawYardLine(context, yards, side, style) {
    yardsPos = getYardXPosition(yards, side);
    drawLine(context, yardsPos, FIELD_MIN_Y, yardsPos, FIELD_MAX_Y, style);
}

function drawField(context) {
    context.fillStyle = '#00AA00';
    context.fillRect(FIELD_MIN_X, FIELD_MIN_Y, FIELD_MAX_X, FIELD_MAX_Y);

    var lineText = ['', '10', '20', '30', '40', '50', '40', '30', '20', '10', ''];

    drawLine(context, PLAY_MIN_X, 1, PLAY_MAX_X, 1, FIELD_LINE_COLOR);
    drawLine(context, PLAY_MIN_X, FIELD_MAX_Y-1, PLAY_MAX_X, FIELD_MAX_Y-1, FIELD_LINE_COLOR);

    for(var i=0;i<=10;i++) {
        drawYardLine(context, i*10, 'home', FIELD_LINE_COLOR);
        drawYardLine(context, i*10, 'away', FIELD_LINE_COLOR);
        drawText(context, lineText[i], 100*i-14+PLAY_MIN_X, 30+FIELD_MIN_Y);
        drawText(context, lineText[i], 100*i-14+PLAY_MIN_X,-10+FIELD_MAX_Y);
    }
    context.fillStyle = '#005500';
    context.fillRect(FIELD_MIN_X, (FIELD_MAX_Y-FIELD_MIN_Y)/2-70, PLAY_MIN_X, 140);
    context.fillRect(PLAY_MAX_X, (FIELD_MAX_Y-FIELD_MIN_Y)/2-70, PLAY_MIN_X, 140);
}

//function populateTeamStats(var team, team)

function drawArrow(yardLine, side) {

    sign = side == 'home' ? 1 : -1;

    fromx = getYardXPosition(yardLine, side) - 50 * sign;
    tox = getYardXPosition(yardLine, side) - 20 * sign;
    fromy = toy = (FIELD_MAX_Y-FIELD_MIN_Y)/2;

    var headlen = 10;   // length of head in pixels
    var angle = Math.atan2(toy-fromy,tox-fromx);
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.lineTo(tox-headlen*Math.cos(angle-Math.PI/6),toy-headlen*Math.sin(angle-Math.PI/6));
    context.moveTo(tox, toy);
    context.lineTo(tox-headlen*Math.cos(angle+Math.PI/6),toy-headlen*Math.sin(angle+Math.PI/6));
    context.stroke();
}

function updateUIWithPlay() {
    $('#eventMessage').text($($xmlPlays[xmlPlaysPos]).find('summary').text());

    var cur_play = $($xmlPlays[xmlPlaysPos]);

    var type = cur_play.attr('type');
    var side = cur_play.attr('side');
    var yard_line = parseInt(cur_play.attr('yard_line'));
    var down = cur_play.attr('down');
    var yfd = parseInt(cur_play.attr('yfd'));
    var formation = cur_play.attr('formation');
    var direction = cur_play.attr('direction');
    var distance = cur_play.attr('distance');

    $('#playMessage').text('side - '+ side+ ' Yard line - ' + yard_line + ' Down - ' + down + ' Type - ' + type + " Direction - " + direction + " Distance - " + distance);

    drawField(context);

    var homeOrAway = side == home.id ? 'home' : 'away';
    context.lineWidth = 4;
    drawYardLine(context, yard_line, homeOrAway, '#FFFFAA');
    drawYardLine(context, yard_line+yfd, homeOrAway, '#FFFF00');
    drawArrow(yard_line, homeOrAway);
    context.lineWidth = 2;

    var clock1 = $($xmlPlays[xmlPlaysPos]).attr('clock');
    var clock2 = $($xmlPlays[xmlPlaysPos+1]).attr('clock');

    if(clock1 && clock2) {
        clock1 = parseInt(clock1.split(':')[0]*60) + parseInt(clock1.split(':')[1]);
        clock2 = parseInt(clock2.split(':')[0]*60) + parseInt(clock2.split(':')[1]);

        xmlPlaysPos = xmlPlaysPos+1;
        $('#yes').html('0');
        chart.series[0].data[0].update(0);
        $('#no').html('0');
        chart.series[0].data[1].update(0);
        $.ajax({
            type: "POST",
          url: "api/play",
          success: function(res) {
            console.log(res);
          }
        });
        setTimeout(updateUIWithPlay, Math.min((clock1-clock2)*45000, 5000));
    }
}

function processPlayByPlayXml(xml) {
    $xml = $(xml);

    home.id = $xml.find('game').attr('home');
    away.id = $xml.find('game').attr('away');

    home.points = $xml.find('game summary home').attr('points');
    away.points = $xml.find('game summary away').attr('points');
    home.remaining_challenges = $xml.find('game summary home').attr('remaining_challenges');
    away.remaining_challenges = $xml.find('game summary away').attr('remaining_challenges');
    home.remaining_timeouts = $xml.find('game summary home').attr('remaining_timeouts');
    away.remaining_timeouts = $xml.find('game summary away').attr('remaining_timeouts');

    $("#myPara").text(home.id + ' - ' + home.points + ' vs ' + away.id + ' - ' + away.points);

    $xmlPlays = $xml.find('play');
    updateUIWithPlay();
}

$(function() {
    context = document.getElementById('myCanvas').getContext('2d');

    drawField(context);

    $.ajax({
        type: "GET",
    	url: "playbyplay.xml",
    	dataType: "xml",
    	success: function(xml) {
            processPlayByPlayXml(xml);
    	}
    });
});

