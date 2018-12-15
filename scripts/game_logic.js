// This file does not interact with the DOM.
// It only houses the game's logic.
// And any future machine learning frontend/data-processing/endpoint functions

class Node {
    constructor(value, prev, next) {
        this.value = value;
        this.prev = prev;
        this.next = next;
    }
}

class FixedSizeLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.CURR_SIZE = 0;
        this.MAX_SIZE = 12;
        this.LIMIT_REACHED = false;
    }

    push(newRound) {
        if(this.CURR_SIZE == 0) {
            this.head = new Node(newRound, null, null);
            this.tail = this.head;
            this.CURR_SIZE++;
        } else {
            let toInsert = new Node(newRound, this.tail, null);
            this.tail.next = toInsert;
            this.tail = toInsert;
            if(this.CURR_SIZE == this.MAX_SIZE) {
                let newHead = this.head.next;
                this.head = newHead;
                this.LIMIT_REACHED = true;
            } else {
                this.CURR_SIZE++;
            }
        }
    }

    getLatestRound() {
        return this.tail ? this.tail.value : null;
    }

    getFormattedResults() {
        let toPrintArr = [];
        let curr = this.head;
        while(curr !== null) {
            toPrintArr.push(curr.value);
            curr = curr.next;
        }
        return toPrintArr;
    }
}

const game_matrix = new Array(5);
const mapping = new Map();

const choices = ["rock", "paper", "scissors", "lizard", "spock"];


// Create a separate function for now to in-house possible future strategies? Isnt that a backend thing idk how this works.
function generateComputerChoice() {
    return choices[Math.floor(Math.random()*5)];
}

function determineRoundWinner(user_choice, computer_choice) {
    user_result = game_matrix[mapping.get(user_choice)][mapping.get(computer_choice)];

    console.log(game_matrix);
    
    round = {
        user_choice: user_choice,
        computer_choice: computer_choice,
        round_result: user_result 
    }
    currentGame.push(round);

    return user_result;
}

// First script to run on page and last function to be on this page
function init() {
    console.log("running init");

    for(let i = 0; i < 5; i++) {
        mapping.set(choices[i], i);
    }

    for(let a = 0; a < 5; a++) {
        game_matrix[a] = new Array(5);
    }

    for(let i = 0; i < 5; i++) {
        let counter = 0;
        for(let j = 0; j < 5; j++) {
            if(i == j) {
                game_matrix[i][j] = 0;
            } else if(i < 3) {
                game_matrix[i][j] = i % 2 === 0 ? counter > 0 && counter < 3 ? 1 : -1 : counter > 0 && counter < 3 ? -1 : 1;
                counter++;
            } else {
                game_matrix[i][j] = i % 2 == 0 ? counter % 2 == 0 ? 1 : -1 : counter % 2 == 0 ? -1 : 1;
                counter++;
            }
        }
    }
}

// The fun lies in figuring out whether the human bias lies.