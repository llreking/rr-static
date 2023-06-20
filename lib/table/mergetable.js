function mergeall(tableId, startRow, endRow, col) {
    var tb = document.getElementById(tableId);
    if (col >= tb.rows[0].cells.length) {
        return;
    }
    if (endRow == 0) { endRow = tb.rows.length - 1; }
    for (var i = startRow; i < endRow; i++) {
        if (tb.rows[startRow].cells[col].innerHTML == tb.rows[i + 1].cells[0].innerHTML) {
            tb.rows[i + 1].removeChild(tb.rows[i + 1].cells[0]);
            tb.rows[startRow].cells[col].rowSpan = (tb.rows[startRow].cells[col].rowSpan | 0) + 1;
            if (i == endRow - 1 && startRow != endRow) {
                mergeall(tableId, startRow, endRow, col + 1);
            }
        } else {
            mergeall(tableId, startRow, i + 0, col + 1);
            startRow = i + 1;
        }
    }
}
function mergecol(tableId,startRow,endRow,col) {
    var tb = document.getElementById(tableId);
    if (col >= tb.rows[0].cells.length) {
        return;
    }
    if (endRow == 0) { endRow = tb.rows.length - 1; }
    for (var i = startRow; i < endRow; i++) {
        if (tb.rows[startRow].cells[col].innerHTML == tb.rows[i + 1].cells[col].innerHTML) {
            tb.rows[i + 1].removeChild(tb.rows[i + 1].cells[col]);
            tb.rows[startRow].cells[col].rowSpan = (tb.rows[startRow].cells[col].rowSpan | 0) + 1;
        } else {
            startRow = i + 1;
        }
    }
}
function mergecols(tableId, startRow, endRow, cols) {
    if (cols instanceof Array) {
        cols.sort();
        for (var i = cols.length - 1; i >= 0; i--) {
            mergecol(tableId,startRow,endRow,cols[i]);
        }
    }
}
