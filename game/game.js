const colorObj = {
    red: "#dc3545",
    blue: "#007bff",
    green: "#28a745",
    yellow: "#ffc107"
}

const colorArr = Object.values(JSON.parse(sessionStorage.getItem('ludo')).players);


$(window).on('load', () => {
    let dataObj = JSON.parse(sessionStorage.getItem('ludo'));
    if (dataObj)
        setup(dataObj);
    else
        location.replace('./../');
})



function setup(dataObj) {
    let playerCount = dataObj.playerCount;
    $(colorArr).each((ind, item) => {
        let box = $('#' + item + '_box');
        box.find('.token_home > div').html('<div class="rounded-circle m-auto border token token_' + item + '"></div>');
    })
}