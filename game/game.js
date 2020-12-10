const colorObj = {
    red: "#dc3545",
    blue: "#007bff",
    green: "#28a745",
    yellow: "#ffc107"
}
const colorArr = [];
const originalColorArr = ["blue", "red", "green", "yellow"];
var turnOf;
var prevTurn = "blue";
var counter;
var angleOfRotation = 0;



// setting up game if session storage available else redirecting to home page

$(window).on('load', () => {
    let dataObj = JSON.parse(sessionStorage.getItem('ludo'));
    if (dataObj && dataObj.playerNames)
        setup(dataObj);
    else
        location.replace('./../');
})



// setting up game board

function setup(dataObj) {

    // filling colorArr with generated colors
    $(Object.values(dataObj.players)).each((ind, item) => {
        colorArr.push(item)
    });

    // placing tokens in corresponding places
    $(colorArr).each((ind, item) => {
        let box = $('#' + item + '_box');
        box.find('.token_home > div').html('<div class="rounded-circle m-auto border token token_' + item + '"></div>');
    })

    // setting random turn
    turnSetter();

    // loading ludo board after setup
    $('#mainContainer').show();
}


// sets turn and rotates board

function turnSetter() {
    counter = (counter === undefined) ? (Math.floor(Math.random() * colorArr.length)) : ((++counter) % colorArr.length);
    turnOf = colorArr[counter];

    if ($(window).width() >= 1024) {
        let curInd = originalColorArr.indexOf(turnOf);
        let prevInd = originalColorArr.indexOf(prevTurn);
        // angleOfRotation -= Math.abs(curInd - prevInd) * (90);
        // $('#ludoBoard').css("transform", "rotateZ(" + angleOfRotation + "deg)");

        // console.log(counter, turnOf, prevTurn, angleOfRotation)

        // prevTurn = turnOf;
    }
}