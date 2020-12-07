const colorObj = {
    red: "#dc3545",
    blue: "#007bff",
    green: "#28a745",
    yellow: "#ffc107"
}

const colorArr = ["red", "yellow", "blue", "green"];



// loading screen based on session storage data availability
$(window).on('load', () => {
    let sessionVal = JSON.parse(sessionStorage.getItem('ludo'));
    if (sessionVal) {
        $('#label_for_playerCount').hide().next().hide().next().show();
        $('#reset').removeClass('d-none');
        let playerCount = sessionVal.playerCount;
        $('#playerCount').val(playerCount);
        loadPlayerInps();
    }
})





// loading input boxes based on the player count and generating random colors for tokens
function loadPlayerInps() {
    $('#choose_color > div:not(:first-child)').remove();
    let playerCount = parseInt($('#playerCount').val());
    let color = [...colorArr];
    let dataObj = JSON.parse(sessionStorage.getItem("ludo"));

    let ifVal = (dataObj.players == undefined);

    if (ifVal)
        dataObj.players = {};

    for (let i = 0; i < playerCount; i++) {
        let cloned = $('#choose_color > div:first-child').clone();

        // showing previously added player names if present in sessionstorage
        let inpVal = (dataObj.playerNames) ? (dataObj.playerNames["player" + (i + 1)]) : ("Player " + (i + 1));
        cloned.find('input').val(inpVal).attr("id", "player" + (i + 1));
        cloned.removeClass('d-none');


        // showing previously generated colors if present in session storage
        let player;
        if (ifVal) {
            let randomInd = Math.floor(Math.random() * color.length);
            player = color[randomInd];
            color.splice(randomInd, 1);
        }
        else
            player = dataObj.players["player" + (i + 1)]

        cloned.find('svg').attr("fill", colorObj[player]);

        dataObj.players["player" + (i + 1)] = player;

        $('#choose_color').append(cloned);
    }

    sessionStorage.setItem('ludo', JSON.stringify(dataObj));
}





// click event for continue button
$('#continue').click(() => {
    var $choose_color = $('#choose_color');
    if (!$choose_color.is(':visible')) {
        $('#playerCount, #label_for_playerCount').fadeOut("slow", () => {
            loadPlayerInps();
            $('#reset').removeClass('d-none');
            $choose_color.fadeIn("slow");
        });

        let dataObj = { playerCount: $('#playerCount').val() };
        sessionStorage.setItem("ludo", JSON.stringify(dataObj));
    }
    else {
        saveNames();
        location.replace('./game');
    }
})





// saves playernames in local storage before redirection
function saveNames() {
    let dataObj = JSON.parse(sessionStorage.getItem('ludo'));
    dataObj.playerNames = {};

    let inps = $('#choose_color > div:not(:first-child) input');
    inps.each((ind, item) => {
        dataObj.playerNames[$(item).attr("id")] = $(item).val().trim();
    })
    sessionStorage.setItem('ludo', JSON.stringify(dataObj));
}





// reset button
$('#reset').click(()=>{
    sessionStorage.clear();
    location.reload();
})