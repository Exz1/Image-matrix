const errorHanlder = ({srcElement}) => {
    srcElement.src = 'https://www.placecage.com/300/200';
}

export const BUTTONS_CODE = {
    RIGHT: 'ArrowRight',
    LEFT: 'ArrowLeft',
    UP: 'ArrowUp',
    DOWN: 'ArrowDown',
};

export const makeMatrix = (size) => {
    if (!size || !size.length) return;

    const [rows, columns] = size;
    const totalMatrix = [];
    let elementCounter = 0;

    function makeMatrixRow(lastIndex) {
        const row = [];
        for (let i = 0; i < columns; i++) {
            row.push(lastIndex + i);   
        }
        return row;
    };

    for (let i = 0; i < rows; i++) {
        const row = makeMatrixRow(elementCounter);
        totalMatrix.push(row);
        elementCounter += columns;
    }

    return totalMatrix;
}

export const getRow = ({ row, first, last, matrixLenght }) => {
    if (last < first) {
        const firstPart = row.slice(first, matrixLenght);
        const lastPart = row.slice(0, last);
        return firstPart.concat(lastPart);
    }
    return row.slice(first, last);    
}

export const makeImage = (index) => {
    const imageNode = document.createElement('img');
    const url = `https://i.picsum.photos/id/${index}/300/200.jpg`;
    imageNode.src = url;
    imageNode.alt = url;
    imageNode.dataset.index = index;
    imageNode.onerror = errorHanlder;
    return imageNode;
};
