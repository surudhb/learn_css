const theme_button = document.getElementById("theme-button");
const body = document.body;
const score_template = document.getElementById("score-template");
const user_score = document.getElementById("user-score");
const comp_score = document.getElementById("computer-score");

const round_announcenment = document.getElementById("round-announcement");

const game_control = document.getElementById("game-control");

// Theme management
function changeTheme() {
    body.className === "lightmode" ? body.className = "nightmode" : body.className = "lightmode";
    theme_button.innerText === "Night Mode" ? theme_button.innerText = "Light Mode" : theme_button.innerText = "Night Mode";
}

// Helper function to handle game start
function startGame() {

}

// Helper function to handle game end
function endGame() {
    
}


// Game management
function handleGame() {
    game_control.removeAttribute("class");
    if(game_control.innerText === "Begin") {
        game_control.innerText = "End";
        game_control.setAttribute("class", "end");
    } else {
        game_control.innerText = "Begin";
        game_control.setAttribute("class", "begin");
    }
}


theme_button.onclick = changeTheme;
game_control.onclick = handleGame;


// First script to run on page
function init() {
    // TODO: Adding gridiron style templated scorboards for user and computer

    // const clone = score_template.content.cloneNode(true);
    // body.appendChild(clone);
    // user_score.appendChild(score_template);
    // comp_score.appendChild(score_template);
}