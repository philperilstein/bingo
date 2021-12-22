const { PDFDocument, StandardFonts, rgb } = window.PDFLib

/**
 * Function to generate a PDF of Bingo Cards
 * @param {Array.<String>} cardsToPrint An ordered array of bingo card numbers
 * @param {Array.<String>} players An ordered array of players of bingo cards
 * @param {String} [fileName] The name of the file to save as (defaults to BINGO)
 */
async function generatePDF(cardsToPrint, players, fileName = 'BINGO') {
    const cardData = await loadCardData(cardsToPrint);
    // PDF Creation
    const pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    
    for (let i = 0; i < cardData.length; i++) {
      const cardDatum = cardData[i];
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      const fontSize = 50;
      const freeSpaceFontSize = 30;
      const squareSize = 100;

      // MarginLeft is the width of the page - (number of squares * size of squares) divided by 2 so equal margins left and right
      const marginLeft = (width - (5 * squareSize)) / 2;
      
      const cardName = `Card-${cardsToPrint[i]}`;
      page.drawText(cardName, {
        x: (width / 2) - (timesRomanFont.widthOfTextAtSize(cardName, freeSpaceFontSize) / 2), 
        y: height - 100 + (timesRomanFont.heightAtSize(freeSpaceFontSize)),
        size: freeSpaceFontSize,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });

      if (players[i] && players[i] !== '') {
        page.drawText(players[i], {
          x: (width / 2) - (timesRomanFont.widthOfTextAtSize(players[i], 20) / 2), 
          y: height - 110 + (timesRomanFont.heightAtSize(20)),
          size: 20,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
      }

      const footer = 'Want to host your own virtual BINGO game?  HostVirtualBingo.com';
      page.drawText(footer, {
        x: (width / 2) - (timesRomanFont.widthOfTextAtSize(footer, 12) / 2), 
        y: 100 + (timesRomanFont.heightAtSize(12)),
        size: 12,
        font: timesRomanFont,
        color: rgb(0, 0, 0),
      });
      
      const drawData = [['B','I','N','G','O']];
      drawData.push(...cardDatum);
      for (let row = 0; row < drawData.length; row++) {
        for (let column = 0; column < drawData[0].length; column++) {
          const cell = drawData[row][column];
          page.drawSquare({
            x: marginLeft + (squareSize * column) + (column * 2),
            y: height - 200 - (squareSize * row) - (row * 2),
            size: squareSize,
            borderWidth: 1,
            borderColor: rgb(0,0,0),
            color: rgb(1, 1, 1),
            opacity: 0.5,
            borderOpacity: 0.75,
          });
          if (cell === 'FREE SPACE') {
            page.drawText('FREE', {
              x: marginLeft + (squareSize * column) + (column * 2) + (squareSize / 2) - (timesRomanFont.widthOfTextAtSize('FREE', freeSpaceFontSize) / 2), 
              y: height - 200 - (squareSize * row) - (row * 2) + (squareSize / 2) + (timesRomanFont.heightAtSize(freeSpaceFontSize) / 2),
              size: freeSpaceFontSize,
              font: timesRomanFont,
              color: rgb(0, 0, 0),
            });
            page.drawText('SPACE', {
              x: marginLeft + (squareSize * column) + (column * 2) + (squareSize / 2) - (timesRomanFont.widthOfTextAtSize('SPACE', freeSpaceFontSize) / 2), 
              y: height - 200 - (squareSize * row) - (row * 2) + (squareSize / 2) - (timesRomanFont.heightAtSize(freeSpaceFontSize)),
              size: freeSpaceFontSize,
              font: timesRomanFont,
              color: rgb(0, 0, 0),
            });
          }
          else {
            page.drawText(cell, {
              x: marginLeft + (squareSize * column) + (column * 2) + (squareSize / 2) - (timesRomanFont.widthOfTextAtSize(cell, fontSize) / 2), 
              y: height - 200 - (squareSize * row) - (row * 2) + (squareSize / 2) - (timesRomanFont.heightAtSize(fontSize) / 2),
              size: fontSize,
              font: timesRomanFont,
              color: rgb(0, 0, 0),
            });
          }
        }
      }
    }
    const pdfBytes = await pdfDoc.save();
    savePDF(fileName, pdfBytes);
}


/**
 * Function to handle saving of the PDF data
 * @param {String} filename The filename with the .pdf extension 
 * @param {*} pdfBytes The PDF data
 */
function savePDF(filename, pdfBytes) {
  var bytes = new Uint8Array(pdfBytes); // pass your byte response to this constructor

  var blob=new Blob([bytes], {type: "application/pdf"});// change resultByte to bytes

  var link=document.createElement('a');
  link.href=window.URL.createObjectURL(blob);
  link.download=`${filename}.pdf`;
  link.click();
}

/**
 * Function to assemble an array of card data
 * @param {Array.<String>} cardNumbers the card numbers
 * @returns {Array.<Object>} An array of card data json objects
 */
async function loadCardData(cardNumbers) {
  let allCardData = [];
  try {
    for (let card of cardNumbers) {
      await loadFile(`card_data/bingo-${card}.json`, function(jsonFile) {
         allCardData.push(JSON.parse(jsonFile.response));
      });
    }
  }
  catch (err) {
    console.log(err);
  }
  return allCardData;
}

/**
 * Function to make HTTP call to get the card json
 * @param {String} file the name of the file to request 
 * @param {Function} callback the callback function to handle the json file
 * @throws {Error} throws an error if it does not get a 200 response
 * @private
 */
async function loadFile(file, callback) {
    return new Promise(function (resolve, reject) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                resolve(callback(this));
            }
            else if (this.readyState === 4 && this.status !== 200) {
                reject(new Error(`Failed to load ${file} status code: ${this.status} ${this.statusText}`));
            }
        };
        xhttp.open("GET", file, true);
        xhttp.send();
    });
}