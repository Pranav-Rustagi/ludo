const colorObj = {
    red: "#dc3545",
    blue: "#007bff",
    green: "#28a745",
    yellow: "#ffc107"
}

const colorArr = ["red", "yellow", "blue", "green"];

$(window).on('load', () => {
    let sessionVal = JSON.parse(sessionStorage.getItem('ludo'));
    if (sessionVal) {
        $('#playerCount').hide().next().show();
        let playerCount = sessionVal.playerCount;
        $('#playerCount').val(playerCount);
        loadPlayerInps();
    }
})

function loadPlayerInps() {
    let playerCount = parseInt($('#playerCount').val());
    let $choose_color = $('#choose_color');
    let color = [...colorArr];
    let dataObj = JSON.parse(sessionStorage.getItem("ludo"));
    dataObj.players = {};

    for (let i = 0; i < playerCount; i++) {
        let cloned = $('#choose_color > div:first-child').clone();
        cloned.find('input').val("Player " + (i + 1)).attr("id", "player" + (i + 1));;
        cloned.removeClass('d-none');

        let randomInd = Math.floor(Math.random() * color.length);
        let player = color[randomInd];
        cloned.find('svg').attr("fill", colorObj[player]);
        color.splice(randomInd, 1);

        dataObj.players["player" + (i + 1)] = player;

        $choose_color.append(cloned);
    }

    sessionStorage.setItem('ludo', JSON.stringify(dataObj));
}



$('#continue').click(() => {
    var $choose_color = $('#choose_color');
    if (!$choose_color.is(':visible')) {
        $('#playerCount').fadeOut("slow", () => {
            loadPlayerInps();
            $choose_color.fadeIn("slow");
        });

        let dataObj = { playerCount: $('#playerCount').val() };
        sessionStorage.setItem("ludo", JSON.stringify(dataObj));
    }
    else {
        saveNames();
        location.replace('./game.html');
    }
})


function saveNames(){
    let dataObj = JSON.parse(sessionStorage.getItem('ludo'));
    dataObj.playerNames = {};
    let inps = $('#choose_color > div:not(:first-child) input');
    inps.each((ind, item)=>{
        dataObj.playerNames[$(item).attr("id")] = $(item).val().trim();
    })
    sessionStorage.setItem('ludo', JSON.stringify(dataObj));
}