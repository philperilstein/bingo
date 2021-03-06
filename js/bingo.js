import BingoGame from './BingoGame.js';


export async function init() {
    let cardNumbers = getCardNumbers();
    if (cardNumbers.length > 10) {
        alert('Error: Invalid URL');
        return;
    }
    let bingoGame = new BingoGame(cardNumbers);
    await bingoGame.init();
}

/**
* Get the card numbers from the URL
* @return {String[]} an array of the card numbers
*/
function getCardNumbers() {
    var href = window.location.href;
    var reg = new RegExp( '[?&]' + 'card' + '=([^&#]*)', 'i' );
    var string = reg.exec(href);
    return string ? string[1].split(',') : null;
}
