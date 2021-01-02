const colorObj = {
    red: "#dc3545",
    blue: "#007bff",
    green: "#28a745",
    yellow: "#ffc107"
}
const colorArr = [];
const originalColorArr = ["blue", "red", "green", "yellow"];
const diceStates = ["one", "two", "three", "four", "five", "six"];
var curTurn;
var prevTurn = "blue";
var counter;
var angleOfRotation = 0;
var dice = $('#dice');




/**********************************************************************************\
|*** setting up game if session storage available else redirecting to home page ***|
\**********************************************************************************/

$(window).on('load', () => {
    let dataObj = JSON.parse(sessionStorage.getItem('ludo'));
    (dataObj && dataObj.playerNames) ? setup(dataObj) : location.replace('./../');
})




/************************************************\
|*** setting up game board and other elements ***|
\************************************************/

function setup(dataObj) {

    // subtracting browser addressbar height in mobile view
    if ($(window).width() < $(window).height()) {
        let browserAddressbarSize = parseFloat(getComputedStyle(document.documentElement).height) - document.documentElement.clientHeight;
        $('.fullScreen').height($('.fullScreen').height() - browserAddressbarSize);
    }


    // populating colorArr with generated colors
    let tempArr = Object.values(dataObj.players);
    $(originalColorArr).each((ind, item) => {
        if (tempArr.includes(item))
            colorArr.push(item);
    })


    // placing tokens in corresponding places
    $(colorArr).each((ind, item) => {
        let box = $('#' + item + '_box');
        box.find('.token_home > div').html('<div class="rounded-circle m-auto border token token_' + item + '"></div>');
    })


    // setting random turn
    turnSetter();


    // loading ludo board after setup
    $('#mainContainer').removeClass('d-none');
}




/***********************************\
|*** sets turn and rotates board ***|
\***********************************/

function turnSetter() {

    let playerCount = colorArr.length;
    counter = (counter === undefined) ? (Math.floor(Math.random() * playerCount)) : ((++counter) % playerCount);
    curTurn = colorArr[counter];

    if ($(window).width() >= 1024) {
        let curInd = originalColorArr.indexOf(curTurn);
        let prevInd = originalColorArr.indexOf(prevTurn);

        while (prevInd != curInd) {
            angleOfRotation -= 90;
            prevInd = (++prevInd) % originalColorArr.length;
        }
        $('#ludoBoard').css("transform", "rotateZ(" + angleOfRotation + "deg)");

        prevTurn = curTurn;
    }

    resetDice();

    // binding events to dice
    diceEventBinder();
}




/**********************\
|*** event for dice ***|
\**********************/

function diceEventBinder() {
    dice.on("click", () => {
        let randomRoll = Math.floor(Math.random() * 6) + 1;
        resetDice("dice-active-" + diceStates[randomRoll - 1]);

        unbindEvents(true);

        tokenEventBinder();
    });
}




/******************************\
|*** Binds events to tokens ***|
\******************************/

function tokenEventBinder() {
    let tokens = tokensValid();
    (tokens.length) ? tokenEvent(tokens) : setTimeout(turnSetter, 1200);
}




/**************************************\
|*** Returns tokens with valid move ***|
\**************************************/

function tokensValid(tokens) {
    let diceClass = dice.attr("class").split(" ").filter((item) => item.includes("dice-active"))[0];
    let stateNo = diceStates.indexOf(diceClass.split("-")[2]) + 1;

    tokens = $(".token_" + curTurn).filter((ind, item) => {
        item = $(item);
        if (item.parent().parent().hasClass('token_home'))
            return (stateNo === 6);
        else {
            let tempInd = item.parent().data("index");
            let el;
            for (let i = 0; i < stateNo; i++) {
                tempInd = (el && el[0].hasAttribute("data-" + curTurn)) ? el.data(curTurn) : (++tempInd);
                el = $('[data-index=' + tempInd + ']');
            }
            console.log(el[0]);
            return el.length;
        }
    });

    return tokens;
}




/************************\
|*** Event for tokens ***|
\************************/

function tokenEvent(tokens) {
    let diceClass = dice.attr("class").split(" ").filter((item) => item.includes("dice-active"))[0];
    let stateNo = diceStates.indexOf(diceClass.split("-")[2]) + 1;

    tokens.on("click", function () {
        let token = $(this);
        if (token.closest('.token_home')) {
            if (stateNo === 6) {
                token = token.remove();
                setTimeout(() => {
                    $('[' + curTurn + '-start-box]').append(token);
                    diceEventBinder();
                }, 50);
            }
        }

        unbindEvents(false);
    })
}




/*****************************************************\
|*** Unbinds the click events from dice and tokens ***|
|************ true - Dice , false - Token ************|
\*****************************************************/

function unbindEvents(isDice) {
    (isDice) ? $('#dice').off("click") : $('.token').off("click");
}




/****************************************\
|*** Resets dice to its initial state ***|
\****************************************/

function resetDice(diceState) {
    unbindEvents(false);
    dice.removeClass("dice-active-one dice-active-two dice-active-three dice-active-four dice-active-five dice-active-six").addClass("dice-transition");
    if (diceState)
        dice.addClass(diceState);
}




/****************************\
|*** handles resize event ***|
\****************************/

var timeOutVar;
$(window).resize(() => {
    clearTimeout(timeOutVar);
    timeOutVar = setTimeout(() => {
        alert("The page needs to be refreshed!");
        location.reload();
    }, 250);
})