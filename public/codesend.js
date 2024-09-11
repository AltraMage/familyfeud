const ws = new WebSocket(`ws://${location.host}`);

function sendCodeToMainPage(code) {
    ws.send(code);
}

addEventListener('keydown', (event) => {
    console.log(event.key);
    if (event.key === " ") { event.preventDefault(); sendCodeToMainPage("updatePage()"); } 
    else if (event.key == "t") {
      event.preventDefault();
      if (quiz.activeTeamIndex + 1 < quiz.teams.length) {
        console.log(quiz.activeTeamIndex);
        sendCodeToMainPage("quiz.activeTeamIndex++");
      } else {
        sendCodeToMainPage("quiz.activeTeamIndex = 0");
      }
      drawTeams();
    }

    else if (event.key === "Enter") {
    sendCodeToMainPage(`
      event.preventDefault();
      quiz.givePoints(quiz.currentRound().activePoints);
      quiz.currentRound().activePoints = 0;
      drawPoints();
      `);
    }

    else if (event.key === "s") {
      sendCodeToMainPage(`
      event.preventDefault();
      quiz.currentRound().strikes += 1;
      quiz.currentRound().strikes %= 4;
      drawStrikes();
      `);
    }

    // Wholy crap ewan less lines != less better. This is a mess

    // Check to see if the the key is a number
    else if (event.key >= 0 && event.key <= 9) {
      // If key between 1 and 9, reveal the answer at that index
      const answer = (event.key >= 1 && event.key <= 9) ? quiz.currentRound().answers[event.key - 1] : quiz.currentRound().answers[9];
      const index = event.key > 0? event.key - 1:9;
      answer.revealed = !answer.revealed; // Confusing but fewer lines so yay
      if (answer.revealed) { // Now equivalent to !answer.revealed
        sendCodeToMainPage(`
        quiz.addPoints(answer.value)
        // Manipulate the DOM to reveal the answer
        revealAnswer(index < 5? document.getElementById("left-column").children[index]:document.getElementById("right-column").children[index - 5]);
        `);
      } else {
        sendCodeToMainPage(`
        quiz.addPoints(-answer.value)
        drawAnswers(quiz.currentRound());
        `);
      }
    }
  });