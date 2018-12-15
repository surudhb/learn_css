const theme_button = document.getElementById("theme-button");
const body = document.body;

const user_score = document.getElementById("user-score");
const comp_score = document.getElementById("comp-score");
const user_score_label = document.getElementById("user-score-label");
const comp_score_label = document.getElementById("comp-score-label");

const gameplay_column = document.getElementById("gameplay");
const final_choice_wrapper = document.getElementsByClassName("final-choice-wrapper")[0];
const user_final_choice = document.getElementById("user-final-choice");
const comp_final_choice = document.getElementById("comp-final-choice");

const round_announcement = document.getElementById("round-announcement");
const history_div = document.getElementsByClassName("history")[0];

const begin_game = document.getElementById("begin");
const end_game = document.getElementById("end");

const choice_buttons = document.getElementsByClassName("choice-border");
const user_choices = document.getElementsByClassName("user-choices")[0];

let currentGame = null;
let animationRanCounter = 0;

function disableButton(toDisable) {
    toDisable.removeAttribute("enabled");
    toDisable.setAttribute("disabled",true);
}

function enableButton(toEnable) {
    toEnable.removeAttribute("disabled");
    toEnable.setAttribute("enabled", true);
}

// Helper function to handle game start
function startGame() {
    disableButton(begin_game);
    enableButton(end_game);

    for(let i = 0; i < choice_buttons.length; i++) {
        enableButton(choice_buttons[i]);
    }
    
    gameplay_column.style.opacity = 1;

    currentGame = new FixedSizeLinkedList();
}

// Helper function to reset scoreboard
function resetScore() {
    user_score.innerHTML = 0;
    comp_score.innerHTML = 0;
}

// Helper function to handle game end
function endGame() {
    disableButton(end_game);
    enableButton(begin_game);

    for(let i = 0; i < choice_buttons.length; i++) {
        disableButton(choice_buttons[i]);
    }

    displayChoiceMade("rock", user_final_choice);
    displayChoiceMade("rock", comp_final_choice);

    gameplay_column.style.opacity = 0;

    clearVisualHistory();
    resetScore();
    currentGame = null;
}

function roundWon(winnerID) {
    let toUpdate = winnerID.toString().includes("user") ? user_score_label : comp_score_label;
    console.log("update made to label: " + toUpdate);
}

function createTemplateHistoryItemDiv({user_choice, computer_choice, round_result}) {
    let history_item = document.createElement("div");
    history_item.classList.add("history-item");

    let history_choices = document.createElement("div");
    history_choices.classList.add("history-choices");

    let user_choice_wrapper = document.createElement("div");
    user_choice_wrapper.classList.add(...[user_choice, "user-choice", "choice-border"]);
    user_choice_wrapper.id = "user-display-choice";

    let comp_choice_wrapper = document.createElement("div");
    comp_choice_wrapper.classList.add(...[computer_choice, "user-choice", "choice-border"]);
    comp_choice_wrapper.id = "comp-display-choice";

    let user_final_icon = document.createElement("i");
    user_final_icon.classList.add(...["choice", "fas", "fa-hand-" + user_choice]);

    let comp_final_icon = document.createElement("i");
    comp_final_icon.classList.add(...["choice", "fas", "fa-hand-" + computer_choice]);

    let winner_label_wrapper = document.createElement("div");
    let winner_label_span = document.createElement("span");

    let winner_wrapper_classes = ["history-winner-box"];
    let winner_inner_text = "";

    if(round_result == 1) {
        winner_wrapper_classes.push("user-winner");
        winner_inner_text = "user";
    } else if(round_result == -1) {
        winner_wrapper_classes.push("comp-winner");
        winner_inner_text = "comp";
    } else {
        winner_wrapper_classes.push("no-winner");
        winner_inner_text = "tie";
    }
    winner_label_wrapper.classList.add(...winner_wrapper_classes);
    winner_label_span.innerHTML = winner_inner_text;

    // create the hierarchy
    history_item.appendChild(history_choices);
    history_choices.appendChild(user_choice_wrapper);
    history_choices.appendChild(comp_choice_wrapper);
    user_choice_wrapper.appendChild(user_final_icon);
    comp_choice_wrapper.appendChild(comp_final_icon);
    history_item.appendChild(winner_label_wrapper);
    winner_label_wrapper.appendChild(winner_label_span);

    return history_item;
}

// This function displays currentGame
function updateVisualHistory() {
    if(currentGame.LIMIT_REACHED) { history_div.removeChild(history_div.firstChild); }
    let newHistoryItem = createTemplateHistoryItemDiv(currentGame.getLatestRound());
    history_div.appendChild(newHistoryItem);
}

// Cleans up dom elements
function clearVisualHistory() {
    while(history_div.hasChildNodes()) {
        history_div.removeChild(history_div.firstChild);
    }
}

function animatePlayRound() {
    displayChoiceMade("rock", user_final_choice);
    displayChoiceMade("rock", comp_final_choice);
    user_final_choice.classList.add("user-final-animate");
    comp_final_choice.classList.add("comp-final-animate");
}

function resetAnimationRound(user_choice, computer_choice) {
    user_final_choice.addEventListener("animationiteration", () => {
        if(animationRanCounter == 1) {
            animationRanCounter = 0;
            user_final_choice.addEventListener("animationend", () => {
                user_final_choice.classList.remove("user-final-animate");
                displayChoiceMade(user_choice, user_final_choice);
            });
            comp_final_choice.addEventListener("animationend", () => {
                comp_final_choice.classList.remove("comp-final-animate");
                displayChoiceMade(computer_choice, comp_final_choice);
            });
        } else {
            animationRanCounter++;
        }
    });
}

function displayChoiceMade(choice_made, parent_node) {
    let child_node = parent_node.children[0];
    let newcChildClassString = "fa-hand-" + choice_made;
    child_node.className = child_node.className.replace(/fa-hand-.*/g, newcChildClassString);
    let toReplaceInParent = parent_node.className.split(" ")[0];
    parent_node.className = parent_node.className.replace(toReplaceInParent, choice_made);
}

function updateAndDisplayScores(roundResult) {
    console.log("playing round " + roundResult);
    if(roundResult == 1) {
        user_score.innerHTML = (parseInt(user_score.innerHTML) + 1).toString();
        roundWon(user_score_label.id);
    } else if(roundResult == -1) {
        comp_score.innerHTML = (parseInt(comp_score.innerHTML) + 1).toString();
        roundWon(comp_score_label.id);
    } else {
        // tie game
    }
}

function playRound(e) {
    if(e.target !== e.currentTarget) {
        let user_choice = e.target.className.split(" ")[0];
        let computer_choice = generateComputerChoice();
        let round_result = determineRoundWinner(user_choice, computer_choice);

        animatePlayRound();
        resetAnimationRound(user_choice, computer_choice);

        updateAndDisplayScores(round_result);
        updateVisualHistory();
    }
}

begin_game.onclick = startGame;
end_game.onclick = endGame;
user_choices.onclick = playRound;