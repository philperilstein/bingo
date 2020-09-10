
export default class BingoCard {

    /**
     * Constructor for a Bingo Card
     * @param {String} number the number of the bingo card
     */
    constructor(number) {
        this._cardNumber = number;
        this._cardData = undefined;
        this._cookieData = undefined;
    }

    async init() {
        let cardData;
        try {
            await this._loadDoc(`card_data/bingo-${this._cardNumber}.json`, function(jsonFile) {
                cardData = JSON.parse(jsonFile.response);
            });
            this._cardData = cardData;
            this._cookieData = this._getCookie(this._cardNumber).split(',');
        } catch (err) {
            console.log(err);
            throw err;
        }

    }

    /**
     * Helper Function to get a cookie by the name of the file
     * @param {String} cname the cookie name
     * @returns {String} The cookie contents 
     */
    _getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
      }
      

    /**
     * Function to make HTTP call to get the card json
     * @param {String} file the name of the file to request 
     * @param {Function} callback the callback function to handle the json file
     * @throws {Error} throws an error if it does not get a 200 response
     * @private
     */
    async _loadDoc(file, callback) {
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
}