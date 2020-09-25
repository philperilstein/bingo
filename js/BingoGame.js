
import BingoCard from './BingoCard.js';

export default class BingoGame {

    /**
     * Constructor for a Bingo Game
     * @param cardNumbers the bingo card numbers from the URL
     */
    constructor(cardNumbers) {
        this._bingoCards = [];
        this._cardNumbers = Array.isArray(cardNumbers) ? cardNumbers : [cardNumbers];
    }

    async init() {
        for (let cardNumber of this._cardNumbers) {
            try {
                let bingoCard = new BingoCard(cardNumber);
                await bingoCard.init();
                this.renderBingoCard(bingoCard);
                this.renderSelected(bingoCard);
                this.renderBingoCardThumb(bingoCard);
                this._bingoCards.push(bingoCard);
            }
            catch(err) {
                console.log(`Failed to load BingoCard: ${cardNumber}`);
                console.log(err);
            }
        }
        // Remove example code
        let modalExample = document.getElementById('exampleModalPreview');
        modalExample.remove();
    }

    /**
     * Function that creates the thead element that holds the BINGO headers
     * @returns tHead
     * @private
     */
    _getHeaderRow() {
        let tHead = document.createElement("THEAD");
        let row = document.createElement("TR");
        let header = ['B', 'I', 'N', 'G', 'O'];
        for (let letter of header) {
            let td = document.createElement("TD");
            td.className = "header";
            td.innerHTML = `<div class="content">${letter}</div>`;
            row.appendChild(td);
        }
        tHead.appendChild(row);
        return tHead;
    }

    /**
     * Helper function to generate the card level buttons
     * @param {String} cardNumber the card number to generate buttons for
     * @returns {HTML} HTML elements for the button-group 
     */
    _getCardButtons(cardNumber) {
        let buttonGroup = document.createElement("DIV");
        let clearBoardButton = document.createElement("BUTTON");
        clearBoardButton.className = "btn btn-default";
        clearBoardButton.innerHTML = "<span class=\"glyphicon glyphicon-refresh\"></span> Clear Board";
        clearBoardButton.addEventListener("click", function() {
            clearBoard(cardNumber);
        });
        buttonGroup.appendChild(clearBoardButton);
        return buttonGroup;
        // <div class="btn-group">
        // <button type="button" class="btn btn-default" onclick="clearBoard()"><span class="glyphicon glyphicon-refresh"></span> Clear Board</button>
        // <button type="button" class="btn btn-default" onclick="printBoard()"><span class="glyphicon glyphicon-print"></span> Print Board</button>
        // <button type="button" class="btn btn-default" onclick="window.open('rules.html')"><span class="glyphicon glyphicon-question-sign"></span> Rules</button>
        // </div>
    }

    renderModal(bingoCard) {
        let modalExample = document.getElementById('exampleModalPreview');
        let modalClone = modalExample.cloneNode(true);
        modalClone.id = `modal_${bingoCard._cardNumber}`;
        let modalBody = modalClone.getElementsByClassName("modal-body")[0];
        modalBody.innerHTML = '';
        let modalHeader = modalClone.getElementsByClassName("modal-title w-100")[0];
        modalHeader.innerHTML = `Card-${bingoCard._cardNumber}`;
        let modalFooter = modalClone.getElementsByClassName("modal-footer-full-width  modal-footer")[0];
        modalFooter.appendChild(this._getCardButtons(bingoCard._cardNumber));
        let modalsContainer = document.getElementById('modals');
        modalsContainer.appendChild(modalClone);
        // let modalButton = document.getElementById('modalActivate');
        // let modalButtonClone = modalButton.cloneNode(true);
        // modalButtonClone.id = `modalButton_${bingoCard._cardNumber}`;
        // modalButtonClone.dataset.target = `#modal_${bingoCard._cardNumber}`;
        // modalButtonClone.textContent = `Card-${bingoCard._cardNumber}`;
        // let modalButtonsContainer = document.getElementById('modalButtons');
        // modalButtonsContainer.appendChild(modalButtonClone);
        return modalBody;
    }

    /**
     * Function that renders the bingo card on inside the modal
     * @param {Object} bingoCard the bingo card data to render
     */
    renderBingoCard(bingoCard) {
        let modalContainer = this.renderModal(bingoCard);
        let cardTable = document.createElement("TABLE");
        // cardTable.className = "table headerStyle bodyStyle table-bordered";
        cardTable.appendChild(this._getHeaderRow());
        
        let cardBody = document.createElement("TBODY");
        cardBody.id = bingoCard._cardNumber;
        cardTable.appendChild(cardBody);

        let cardData = bingoCard._cardData;
        for (let row = 0; row < cardData.length; row++) {
          let tr = document.createElement("TR");
          for (let column = 0; column < cardData[row].length; column++) {
            let td = document.createElement("TD");
            td.innerHTML = `<div class="content">${cardData[row][column]}</div>`;
            td.id = `${bingoCard._cardNumber}-${row}-${column}`;
            td.className = "unselected";
            td.addEventListener("click", function() {
              toggleSelect(td, bingoCard._cardNumber);
            });
            tr.appendChild(td); 
          }
          cardBody.appendChild(tr);
        }

        let cardDiv = document.createElement("DIV");

        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;

        let divWidth;
        if (windowWidth > windowHeight) {
            divWidth = `${windowHeight}px`;
        }
        cardDiv.style.maxWidth = divWidth;
        cardDiv.className = "modal-table-div";
        cardDiv.style.textAlign = "center";
        cardDiv.style.margin = "auto";
        cardDiv.appendChild(cardTable);
        modalContainer.appendChild(cardDiv);
    }

    /**
     * Render the bingo boxes as selected or unselected
     * @param {Object} bingoCard the BingoCard object 
     */
    renderSelected(bingoCard) {
        let board = bingoCard._cookieData;
        let cardBody = document.getElementById(bingoCard._cardNumber);
        let rows = cardBody.childNodes;
        let i = 0;
        for (let row of rows) {
            let cells = row.childNodes;
            for (let cell of cells) {
                cell.className = board[i] === '1' ?  'selected' : 'unselected';
                i++;
            }
        }
    }

    /**
     * Function that renders the bingo card on the page
     * @param {Object} bingoCard the bingo card data to render
     */
    renderBingoCardThumb(bingoCard) {
        let cardThumbContainer = document.getElementById('cardThumbsContainer');
        let rows = cardThumbContainer.getElementsByClassName('row');
        let finalRow = rows[rows.length-1];
        let cards = finalRow.getElementsByClassName('col-3 p-1');
        if (cards.length === 4) {
            let newRow = document.createElement("DIV");
            newRow.className = "row";
            cardThumbContainer.appendChild(newRow);
            finalRow = newRow;
        }
        let newCard = document.createElement("DIV");
        newCard.dataset.target = `#modal_${bingoCard._cardNumber}`;
        newCard.dataset.toggle = "modal";
        newCard.className = "col-3 p-1";
        newCard.innerHTML = `Card-${bingoCard._cardNumber}`;
        finalRow.appendChild(newCard);

        let cardTable = document.createElement("TABLE");
        let cardData = bingoCard._cardData;
        let headerRow = document.createElement("TR");
        let BINGO = ['B','I','N','G','O'];
        for (let letter of BINGO) {
            let td = document.createElement("TD");
            td.innerHTML = `<div class="content">${letter}</div>`;
            td.className = "unselected";
            headerRow.appendChild(td);
        }
        cardTable.appendChild(headerRow);

        let board = bingoCard._cookieData;
        let i = 0;
        for (let row = 0; row < cardData.length; row++) {
          let tr = document.createElement("TR");
          for (let column = 0; column < cardData[row].length; column++) {
            let td = document.createElement("TD");
            td.innerHTML = `<div class="content"></div>`;
            td.id = `thumb-${bingoCard._cardNumber}-${row}-${column}`;
            td.className = board[i] === '1' ?  'selected' : 'unselected';
            tr.appendChild(td);
            i++;
          }
          cardTable.appendChild(tr);
        }
        newCard.appendChild(cardTable);
    }
}

function toggleSelect(cell, cardNumber) {
    let thumb = document.getElementById(`thumb-${cell.id}`);
    if (cell.className === "unselected") {
        cell.className = "selected";
        thumb.className = "selected";
    }
    else {
        cell.className = "unselected";
        thumb.className = "unselected";
    }
    saveBoard(cardNumber);

}

function saveBoard(cardNumber) {
    let board = [];
    let cardBody = document.getElementById(cardNumber);
    let rows = cardBody.childNodes;
    for (let row of rows) {
        let cells = row.childNodes;
        for (let cell of cells) {
            board.push(cell.className === 'selected' ? 1 : 0);
        }
    }
    setCookie(cardNumber, board.join(','), 30);
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function deleteCookie(cname) {
    document.cookie = `${cname}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

function clearBoard(cardNumber) {
    let cardBody = document.getElementById(cardNumber);
    if (cardBody) {
        let rows = cardBody.childNodes;
        for (let row of rows) {
            let cells = row.childNodes;
            for (let cell of cells) {
                cell.className = "unselected";
                let thumb = document.getElementById(`thumb-${cell.id}`);
                thumb.className = "unselected";
            }
        }
        deleteCookie(cardNumber);
    }
}