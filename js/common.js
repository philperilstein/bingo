/**
 * Function to overwrite default alert and create a custom alert modal
 * @param {String} [title] the title for the alert, if not truthy, then no header will be displayed
 * @param {String|Object} [content] the string or HTML DOM content 
 * @param {String|Object} [footerContent] the optional string or HTML DOM Object for the footer
 */
function alert(title, content, footerContent) {
    let modalsDiv = document.createElement("DIV");
    modalsDiv.className = "modal fade right";
    let modalId = uuid();
    modalsDiv.id = modalId;
    modalsDiv.tabindex = "-1";
    modalsDiv.role = "dialog";
    modalsDiv.setAttribute('aria-hidden', "true");

    let modalsDiv2 = document.createElement("DIV");
    modalsDiv2.className = "modal-dialog-full-width modal-dialog momodel modal-fluid";
    modalsDiv2.role = "document";
    modalsDiv.appendChild(modalsDiv2);

    let modalContent = document.createElement("DIV");
    modalContent.className = "modal-content-full-width modal-content";
    modalsDiv2.appendChild(modalContent);

    if (title) {
        let modalHeader = document.createElement("DIV");
        modalHeader.className = "modal-header-full-width modal-header";
        let headerText = document.createElement("H5");
        headerText.className = "modal-title w-100";
        headerText.innerHTML = title;
        let x = document.createElement("BUTTON");
        x.type = "button";
        x.className = "close";
        x.dataset.dismiss = "modal";
        x.setAttribute('aria-label', "close");
        x.innerHTML = '<span style="font-size: 1.3em;" aria-hidden="true">&#xD7;</span>';
        modalHeader.appendChild(x);
        modalHeader.appendChild(headerText);
        modalContent.appendChild(modalHeader);
    }
    
    if (content) {
        let modalBody = document.createElement("DIV");
        modalBody.className = "modal-body";
        if (typeof content === "string") {
            modalBody.innerHTML = content;
        }
        else if (typeof content === "object") {
            modalBody.appendChild(content);
        }
        modalContent.appendChild(modalBody);     
    }       

    if (footerContent) {
        let modalFooter = document.createElement("DIV");
        modalFooter.className = "modal-footer-full-width  modal-footer";
        if (typeof footerContent === "string") {
            modalFooter.innerHTML = footerContent;
        }
        else if (typeof footerContent === "object") {
            modalFooter.appendChild(footerContent);
        }
        modalContent.appendChild(modalFooter);
    }
    document.body.appendChild(modalsDiv);

    // On close of the modal, remove all this modal stuff from the DOM
    $(`#${modalId}`).on('hidden.bs.modal', function () {
        document.body.removeChild(modalsDiv);
    });

    // Toggle the modal on
    $(`#${modalId}`).modal('toggle');
}

/**
 * Helper function to create a unique ID
 * @returns {String} a unique id
 */
function uuid(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

/**
 * Helper function to not return the promise for specified milliseconds
 * @param {Number} ms number of miliseconds to wait before resolving the promise
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

/**
 * Common function to save a cookie
 * @param {String} cname the name of the cookie 
 * @param {String} cvalue the value of the cookie 
 * @param {Number} exdays the number of days until the cookie expires 
 */
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

/**
 * Helper Function to get a cookie by the name of the file
 * @param {String} cname the cookie name
 * @returns {String} The cookie contents 
 */
function getCookie(cname) {
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
 * Common function to delete a cookie
 * @param {String} cname the name of the cookie to delete 
 */
function deleteCookie(cname) {
    document.cookie = `${cname}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}