export default class Sudoku {
    // difficulty goes from 0 to 4 for easy, medium, hard, insane
    constructor(difficulty) {
        this.board = new Array(81).fill(0);
        this.difficulty = difficulty;
        this.solve(0);
        this.solved_board = [...this.board];
        this.generate();
    }

    // eslint-disable-next-line
    removePossibleValueFromSquare(index, possibleValues) {
        let firstSquareIndex = (Math.floor(Math.floor(index / 9) / 3) * 27) + (Math.floor((index % 9) / 3) * 3);

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                possibleValues.delete(this.getCellAt(firstSquareIndex));
                firstSquareIndex += 1;
            }
            firstSquareIndex += 6;
        }
    }

    // eslint-disable-next-line
    removePossibleValueFromRow(index, possibleValues) {
        let firstRowIndex = Math.floor(index / 9) * 9;

        for (let i = 0; i < 9; i++) {
            possibleValues.delete(this.getCellAt(firstRowIndex));
            firstRowIndex += 1;
        }
    }

    // eslint-disable-next-line
    removePossibleValueFromColumn(index, possibleValues) {
        let firstColumnIndex = index % 9;

        for (let i = 0; i < 9; i++) {
            possibleValues.delete(this.getCellAt(firstColumnIndex));
            firstColumnIndex += 9;
        }
    }

    getPossibleValueAt(index, forbiddenIndex, forbiddenValue) {
        const possibleValues = new Set([1,2,3,4,5,6,7,8,9]);

        this.removePossibleValueFromSquare(index,possibleValues);
        this.removePossibleValueFromRow(index, possibleValues);
        this.removePossibleValueFromColumn(index,possibleValues);

        if (index === forbiddenIndex) { possibleValues.delete(forbiddenValue) }

        return Array.from(possibleValues);
    }

    getCellAt(index) {
        return this.board[index];
    }

    setCell(index, value) {
        this.board[index] = value;
    }

    removeCell(index) {
        this.board[index] = 0;
    }

    getRandomFromArray(array) {
        return Math.floor(Math.random() * array.length);
    }

    getRandomFromArrayAndRemoveIt(array) {
        if (array.length <= 0) { return -1 }
        const random = this.getRandomFromArray(array);
        const value = array[random];
        array.splice(random, 1);
        return value;
    }

    solve(index, forbiddenIndex, forbiddenValue) {
        if (81 <= index) { return true }
        const possibleValues = this.getPossibleValueAt(index, forbiddenIndex, forbiddenValue);

        const originalValue = this.getCellAt(index);

        for (let value; (value = this.getRandomFromArrayAndRemoveIt(possibleValues)) !== -1;) {
            this.setCell(index, value);
            if (this.solve(index + 1, forbiddenIndex, forbiddenValue)) { return true }
        }

        this.setCell(index, originalValue);

        return false;
    }

    generate() {
        let numberToRemove;
        switch (this.difficulty) {
            case 1:
                numberToRemove = 17;
                break;
            case 2:
                numberToRemove = 23;
                break;
            case 3: 
                numberToRemove = 30;
                break;
            default:
                numberToRemove = 10;
        }
        for (; numberToRemove > 0;) {
            let randomIndex = this.getRandomFromArray(this.board);
            if (this.board[randomIndex] !== 0) {
                let originalValue = this.removeCell(randomIndex);
                if (this.solve(0, randomIndex, originalValue)) {
                    this.setCell(randomIndex, originalValue);
                } else {
                    numberToRemove -= 1;
                }
            }
        }
    }
}