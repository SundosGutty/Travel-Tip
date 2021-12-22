export const utilsService = {
    makeId
}



function makeId(length = 7) {
    var txt = '';
    var digits = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        txt += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return txt;
}
