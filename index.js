import { 
    BUTTONS_CODE, 
    makeMatrix, 
    makeImage,
    getRow,
} from './utils.js';

class ImageMatrix {
    constructor(matrix, imageContainer, totalMatrixSize) {
        const [rows, columns] = totalMatrixSize;
        this._totalRows = rows;
        this._totalRowElements = columns;
        this._totalMatrix = matrix;
        this._visibilityMatrix = [];
        this._imageContainer = imageContainer;
        this._pointers = {};
        document.addEventListener('keydown', this.keyDownControl.bind(this));
    }

    makeVisibilityMatrix() {
        const visibilityMatrix = [];
        let {
            left: [firstRow, firstColumn],
            right: [lastRow, lastColumn]
        } = this._pointers;
        const { _totalRows: matrixLenght } = this;
        let visibilityRows;

        if (lastRow < firstRow) {
            const firstPart = this._totalMatrix.slice(firstRow, matrixLenght);
            const lastPart = this._totalMatrix.slice(0, lastRow);
            visibilityRows = firstPart.concat(lastPart);
        } else {
            visibilityRows = this._totalMatrix.slice(firstRow, lastRow);
        }

        visibilityRows.forEach(row => {
            visibilityMatrix.push(getRow({
                row, 
                first: firstColumn, 
                last: lastColumn,
                matrixLenght,
            }));
        });

        return visibilityMatrix;
    }

    makeVisibilityImages() {
        const images = [];
        for (let i = 0; i < this._visibilityMatrix.length; i++) {
            const row = this._visibilityMatrix[i];
            const rowImages = row.map(index => makeImage(index));
            images.push(rowImages);
        }
        return images;
    }
 
    renderImages() {      
        this._visibilityMatrix = this.makeVisibilityMatrix();
        const images = this.makeVisibilityImages();
        this._imageContainer.innerHTML = '';
        images.forEach(row => this._imageContainer.append(...row));
    }

    swipeNext(code) {
        let {
            left: [startRow, startColumn],
            right: [lastRow, lastColumn],
        } = this._pointers;
        const { 
            _totalRowElements: rowLenght,
            _totalRows: matrixLenght,
        } = this;

        if (code === BUTTONS_CODE.RIGHT) {
            startColumn = startColumn === rowLenght ? 1 : startColumn + 1;
            lastColumn = lastColumn === rowLenght ? 1 : lastColumn + 1;
        }

        if (code === BUTTONS_CODE.DOWN) {
            startRow = startRow === matrixLenght ? 1 : startRow +1;
            lastRow = lastRow === matrixLenght ? 1 : lastRow + 1 ;
        }

        this._pointers = {
            left: [startRow, startColumn],
            right: [lastRow, lastColumn],
        };
        this.renderImages();
    }

    swipePrev(code) {
        let {
            left: [startRow, startColumn],
            right: [lastRow, lastColumn],
        } = this._pointers;
        const { 
            _totalRowElements: rowLenght,
            _totalRows: matrixLenght,
        } = this;

        if (code === BUTTONS_CODE.UP) {
            startRow -=1;
            lastRow -=1;
        }

        if (code === BUTTONS_CODE.LEFT) {
            startColumn -=1;
            lastColumn -=1;
        }
        startRow = startRow < 0 ? matrixLenght - Math.abs(startRow) : startRow;
        lastRow =  lastRow < 0 ? matrixLenght - Math.abs(lastRow) : lastRow;
        startColumn = startColumn < 0 ? rowLenght - Math.abs(startColumn) : startColumn;
        lastColumn = lastColumn < 0 ? rowLenght - Math.abs(lastColumn) : lastColumn;

        this._pointers = {
            left: [startRow, startColumn],
            right: [lastRow, lastColumn],
        };
        this.renderImages();
    }


    keyDownControl ({code}) {
        event.preventDefault();

        switch(code) {
            case BUTTONS_CODE.RIGHT:
                this.swipeNext(code);
                break;
            case BUTTONS_CODE.LEFT:
                this.swipePrev(code);
                break;
            case BUTTONS_CODE.DOWN:
                this.swipeNext(code);
                break;
            case BUTTONS_CODE.UP:
                this.swipePrev(code);
                break;
            default: return;
        }
    }

    get pointers() {
        return this._pointers;
    }
    
    set pointers(pointers) {
        this._pointers = pointers;
    }
}

const imageContainer = document.querySelector('.image-container');
const totalMatrixSize = [20, 15];
const totalMatrix = makeMatrix(totalMatrixSize);
const imageMatrix = new ImageMatrix(totalMatrix, imageContainer, totalMatrixSize);
imageMatrix.pointers = {
    left: [0, 0],
    right: [4, 6],
};
imageMatrix.renderImages();
