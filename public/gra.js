/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLOBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

var scores, roundScore, activePlayer, gamePlaying;
// var current, winningScore;

init();

document.querySelector('.btn-roll').addEventListener('click', function () {
    if (gamePlaying) {
        // 1. random number
        // var dice = Math.floor(Math.random() * 6) + 1;
        var dice = Math.floor(Math.random() * 6) + 1;
        var dice2 = Math.floor(Math.random() * 6) + 1;

        // if (dice === 6 && current === 6) {
        //     scores[activePlayer] = 0;
        //     document.getElementById(`score-${activePlayer}`).textContent = '0';
        //     nextPlayer();
        //     return;
        // }
        // current = dice;
        // 2. Display the result
        var diceDOM = document.getElementsByClassName('dice');
        diceDOM[0].style.display = 'block';
        diceDOM[0].src = 'dice-' + dice + '.png';
        diceDOM[1].style.display = 'block';
        diceDOM[1].src = 'dice-' + dice2 + '.png';

        moveDices();

        // 3. update the round score if the rolled number wasnt 1
        if (dice !== 1 && dice2 !== 1) {
            roundScore += dice + dice2;
            document.getElementById('current-' + activePlayer).textContent = roundScore;
        }
        else {
            nextPlayer();
        }
    }
});

document.querySelector('.btn-hold').addEventListener('click', function () {
    if (gamePlaying) {
        // add current score to global
        scores[activePlayer] += roundScore

        // update the UI
        document.getElementById('score-' + activePlayer).textContent = scores[activePlayer];
        var winningScore;
        var input = document.querySelector('.final-score').value;

        if (input) {
            var winningScore = input;
        } else {
            winningScore = 100;
        }

        // check if player won the game
        if (scores[activePlayer] >= winningScore) {
            document.getElementById('name-' + activePlayer).textContent = 'Winner!';
            document.querySelector('.dice').style.display = 'none';
			document.querySelector('.dice2').style.display = 'none';
            document.querySelector(`.player-${activePlayer}-panel`).classList.remove('active');
            document.querySelector(`.player-${activePlayer}-panel`).classList.add('winner');
            gamePlaying = false;
        }
        else {
            moveDices();
            nextPlayer();
        }
    }
});

document.querySelector('.btn-new').addEventListener('click', init);

function nextPlayer() {
    roundScore = 0;
    // current = 0;
    activePlayer = activePlayer === 0 ? 1 : 0;
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');
    // document.querySelector('.dice').style.display = 'none';
}

function init() {
    scores = [0, 0];
    roundScore = 0;
    activePlayer = 0;
    gamePlaying = true;
    // current = 0;
    // winningScore = 100;

    document.querySelector('.dice').style.display = 'none';
    document.querySelector('.dice2').style.display = 'none';
    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';
    document.getElementById('name-0').textContent = 'Player 1';
    document.getElementById('name-1').textContent = 'Player 2';
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.add('active');
}

function moveDices() {
    var diceDOM1 = document.querySelector('.dice');
    var diceDOM2 = document.querySelector('.dice2');
    if (activePlayer === 1) {
        diceDOM1.classList.add('dice-1');
        diceDOM2.classList.add('dice-1');
    }
    else {
        diceDOM1.classList.remove('dice-1');
        diceDOM2.classList.remove('dice-1');
    }
}
