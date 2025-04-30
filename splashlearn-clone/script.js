
    // Enhanced Game State
    const gameState = {
      score: 0,
      correctStreak: 0,
      wrongStreak: 0,
      difficulty: "medium",
      wizardHealth: 100,
      maxWizardHealth: 100,
      monsterHealth: 150,
      maxMonsterHealth: 150,
      currentLevel: 1,
      gameActive: false,
      timeLeft: 30,
      timerInterval: null,
      elements: {
        FIRE: { 
          name: "Api", 
          emoji: "🔥", 
          color: "#ff416c",
          weakTo: 'WATER', 
          strongAgainst: 'NATURE',
          projectile: 'fireball'
        },
        WATER: { 
          name: "Air", 
          emoji: "💧", 
          color: "#1a8cff",
          weakTo: 'NATURE', 
          strongAgainst: 'FIRE',
          projectile: 'waterball'
        },
        NATURE: { 
          name: "Alam", 
          emoji: "🌿", 
          color: "#4CAF50",
          weakTo: 'FIRE', 
          strongAgainst: 'WATER',
          projectile: 'natureball'
        }
      },
      activeElement: 'FIRE',
      currentQuestion: null,
      correctAnswer: null,
      questionHistory: [],
      comboTimeLeft: 0,
      maxComboTime: 5,
      comboMultiplier: 1
    };

    // DOM Elements
    const elements = {
      startScreen: document.getElementById('start-screen'),
      gameScreen: document.getElementById('game-screen'),
      wizard: document.getElementById('wizard'),
      monster: document.getElementById('monster'),
      fireball: document.getElementById('fireball'),
      waterball: document.getElementById('waterball'),
      natureball: document.getElementById('natureball'),
      questionText: document.getElementById('question-text'),
      answerInput: document.getElementById('answer-input'),
      submitBtn: document.getElementById('submit-answer'),
      scoreValue: document.getElementById('score-value'),
      streakValue: document.getElementById('streak-value'),
      levelValue: document.getElementById('level-value'),
      wizardHealth: document.querySelector('#wizard-health .health-fill'),
      monsterHealth: document.querySelector('#monster-health .health-fill'),
      startBtn: document.getElementById('start-btn'),
      fireBtn: document.getElementById('fire-btn'),
      waterBtn: document.getElementById('water-btn'),
      natureBtn: document.getElementById('nature-btn'),
      difficultyBtns: document.querySelectorAll('.difficulty-btn'),
      mobileAttackBtn: document.getElementById('mobile-attack'),
      timer: document.getElementById('timer'),
      comboFill: document.getElementById('combo-fill'),
      victoryModal: document.getElementById('victory-modal'),
      gameoverModal: document.getElementById('gameover-modal'),
      finalScore: document.getElementById('final-score span'),
      gameoverScore: document.getElementById('gameover-score span'),
      nextLevelBtn: document.getElementById('next-level-btn'),
      restartBtn: document.getElementById('restart-btn'),
      tryAgainBtn: document.getElementById('try-again-btn')
    };

    // Audio
    const audio = {
      shoot: new Howl({ src: ['https://www.soundjay.com/mechanical/sounds/laser-01.mp3'] }),
      hit: new Howl({ src: ['https://www.soundjay.com/mechanical/sounds/explosion-01.mp3'] }),
      win: new Howl({ src: ['https://www.soundjay.com/misc/sounds/magic-chime-02.mp3'] }),
      lose: new Howl({ src: ['https://www.soundjay.com/mechanical/sounds/explosion-02.mp3'] }),
      bgm: new Howl({ 
        src: ['https://www.soundjay.com/misc/sounds/magic-chime-01.mp3'],
        loop: true,
        volume: 0.3
      }),
      correct: new Howl({ src: ['https://www.soundjay.com/buttons/sounds/button-09.mp3'] }),
      wrong: new Howl({ src: ['https://www.soundjay.com/buttons/sounds/button-10.mp3'] }),
      elementChange: new Howl({ src: ['https://www.soundjay.com/mechanical/sounds/sci-fi-01.mp3'], volume: 0.5 })
    };

    // Initialize Game
    function initGame() {
      // Initialize particles
      particlesJS('particles-js', {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: "#8f94fb" },
          shape: { type: "circle" },
          opacity: { value: 0.5, random: true },
          size: { value: 3, random: true },
          line_linked: { enable: true, distance: 150, color: "#8f94fb", opacity: 0.4, width: 1 },
          move: { enable: true, speed: 2, direction: "none", random: true, straight: false, out_mode: "out" }
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: true, mode: "repulse" },
            onclick: { enable: true, mode: "push" }
          }
        }
      });

      // Event Listeners
      elements.startBtn.addEventListener('click', startGame);
      elements.submitBtn.addEventListener('click', checkAnswer);
      elements.answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAnswer();
      });
      elements.mobileAttackBtn.addEventListener('click', checkAnswer);
      
      // Element Selection
      elements.fireBtn.addEventListener('click', () => changeElement('FIRE'));
      elements.waterBtn.addEventListener('click', () => changeElement('WATER'));
      elements.natureBtn.addEventListener('click', () => changeElement('NATURE'));
      
      // Difficulty Selection
      elements.difficultyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          gameState.difficulty = btn.dataset.difficulty;
          elements.difficultyBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        });
      });
      
      // Modal Buttons
      elements.nextLevelBtn.addEventListener('click', nextLevel);
      elements.restartBtn.addEventListener('click', restartGame);
      elements.tryAgainBtn.addEventListener('click', restartGame);
      
      // Set default difficulty
      document.querySelector('.difficulty-btn.medium').classList.add('active');
      
      // Initialize UI
      updateHealthBars();
      updateStats();
    }

    // Start Game
    function startGame() {
      elements.startScreen.style.display = 'none';
      elements.gameScreen.style.display = 'block';
      gameState.gameActive = true;
      
      // Reset game state
      gameState.score = 0;
      gameState.correctStreak = 0;
      gameState.wrongStreak = 0;
      gameState.wizardHealth = gameState.maxWizardHealth;
      gameState.monsterHealth = gameState.maxMonsterHealth;
      gameState.currentLevel = 1;
      gameState.timeLeft = 30;
      gameState.comboTimeLeft = 0;
      gameState.comboMultiplier = 1;
      
      // Start background music
      audio.bgm.play();
      
      // Start timer
      startTimer();
      
      // Generate first question
      generateQuestion();
      
      // Update UI
      updateStats();
      updateHealthBars();
      updateComboMeter();
    }

    // Game Timer
    function startTimer() {
      clearInterval(gameState.timerInterval);
      gameState.timeLeft = 30;
      updateTimerDisplay();
      
      gameState.timerInterval = setInterval(() => {
        gameState.timeLeft--;
        updateTimerDisplay();
        
        if (gameState.timeLeft <= 0) {
          clearInterval(gameState.timerInterval);
          handleTimeOut();
        }
      }, 1000);
    }

    function updateTimerDisplay() {
      elements.timer.textContent = gameState.timeLeft;
      
      // Visual feedback when time is running out
      if (gameState.timeLeft <= 10) {
        elements.timer.style.color = 'var(--danger)';
        if (gameState.timeLeft <= 5) {
          gsap.to(elements.timer, { 
            scale: 1.2, 
            duration: 0.3, 
            yoyo: true, 
            repeat: 1 
          });
        }
      } else {
        elements.timer.style.color = 'white';
      }
    }

    function handleTimeOut() {
      showFeedback("Waktu Habis!", false);
      handleWrongAnswer();
      startTimer(); // Reset timer for next question
    }

    // Element System
    function changeElement(element) {
      if (!gameState.gameActive) return;
      
      gameState.activeElement = element;
      audio.elementChange.play();
      
      // Update active button
      elements.fireBtn.classList.remove('active');
      elements.waterBtn.classList.remove('active');
      elements.natureBtn.classList.remove('active');
      
      const activeBtn = elements[`${element.toLowerCase()}Btn`];
      activeBtn.classList.add('active');
      
      // Visual feedback
      gsap.to(activeBtn, {
        scale: 1.2,
        duration: 0.3,
        yoyo: true,
        repeat: 1
      });
      
      showFeedback(`Elemen ${gameState.elements[element].name} Aktif!`, true);
    }

    // Generate Math Question
    function generateQuestion() {
      let num1, num2, operator, answer;
      const operators = ['+', '-', '*', '/'];
      
      // Generate question based on difficulty and level
      switch(gameState.difficulty) {
        case 'easy':
          num1 = Math.floor(Math.random() * (5 + gameState.currentLevel * 2)) + 1;
          num2 = Math.floor(Math.random() * (5 + gameState.currentLevel * 2)) + 1;
          operator = operators[Math.floor(Math.random() * 2)]; // + or -
          break;
        case 'medium':
          num1 = Math.floor(Math.random() * (10 + gameState.currentLevel * 3)) + 1;
          num2 = Math.floor(Math.random() * (10 + gameState.currentLevel * 3)) + 1;
          operator = operators[Math.floor(Math.random() * 3)]; // +, -, or *
          break;
        case 'hard':
          num1 = Math.floor(Math.random() * (15 + gameState.currentLevel * 5)) + 1;
          num2 = Math.floor(Math.random() * (10 + gameState.currentLevel * 3)) + 1;
          operator = operators[Math.floor(Math.random() * 4)]; // +, -, *, or /
          break;
      }
      
      // Ensure division problems result in whole numbers
      if (operator === '/') {
        const product = num1 * num2;
        num1 = product;
        answer = num2;
      } else {
        answer = eval(`${num1} ${operator} ${num2}`);
      }
      
      // Format question text
      let questionText;
      if (operator === '*') {
        questionText = `Berapakah ${num1} × ${num2}?`;
      } else if (operator === '/') {
        questionText = `Berapakah ${num1} ÷ ${num2}?`;
      } else {
        questionText = `Berapakah ${num1} ${operator} ${num2}?`;
      }
      
      elements.questionText.textContent = questionText;
      gameState.correctAnswer = answer;
      
      // Reset timer for this question
      resetTimer();
      
      return answer;
    }

    // Check Answer
    function checkAnswer() {
      if (!gameState.gameActive) return;
      
      const userAnswer = parseFloat(elements.answerInput.value);
      
      if (isNaN(userAnswer)) {
        showFeedback("Masukkan jawaban yang valid!", false);
        elements.answerInput.classList.add('wrong');
        setTimeout(() => elements.answerInput.classList.remove('wrong'), 500);
        return;
      }
      
      // Check if answer is correct (with tolerance for floating point)
      const isCorrect = Math.abs(userAnswer - gameState.correctAnswer) < 0.0001;
      
      if (isCorrect) {
        handleCorrectAnswer();
      } else {
        handleWrongAnswer();
      }
      
      // Clear input
      elements.answerInput.value = '';
      elements.answerInput.focus();
    }

    function handleCorrectAnswer() {
      gameState.correctStreak++;
      gameState.wrongStreak = 0;
      gameState.score += 5 * gameState.currentLevel * gameState.comboMultiplier;
      
      // Update combo
      updateCombo(true);
      
      // Play correct sound
      audio.correct.play();
      
      // Update UI
      updateStats();
      showFeedback("BENAR!", true);
      
      // Attack monster
      attackMonster();
      
      // Generate new question
      generateQuestion();
      
      // Check for victory
      if (gameState.correctStreak >= 5) {
        defeatMonster();
      }
    }

    function handleWrongAnswer() {
      gameState.wrongStreak++;
      gameState.correctStreak = 0;
      gameState.score = Math.max(0, gameState.score - 2);
      
      // Reset combo
      updateCombo(false);
      
      // Play wrong sound
      audio.wrong.play();
      
      // Update UI
      updateStats();
      showFeedback("SALAH!", false);
      
      // Monster counterattack
      if (gameState.wrongStreak >= 3) {
        monsterAttack();
      }
      
      // Generate new question
      generateQuestion();
    }

    // Combo System
    function updateCombo(isCorrect) {
      if (isCorrect) {
        gameState.comboTimeLeft = gameState.maxComboTime;
        gameState.comboMultiplier = 1 + Math.floor(gameState.correctStreak / 3);
      } else {
        gameState.comboTimeLeft = 0;
        gameState.comboMultiplier = 1;
      }
      updateComboMeter();
    }

    function updateComboMeter() {
      const percentage = (gameState.comboTimeLeft / gameState.maxComboTime) * 100;
      elements.comboFill.style.width = `${percentage}%`;
      
      // Visual feedback for combo
      if (gameState.comboMultiplier > 1) {
        elements.comboFill.style.background = `linear-gradient(90deg, var(--primary), var(--secondary))`;
        elements.streakValue.style.color = 'var(--secondary)';
        elements.streakValue.style.textShadow = '0 0 10px var(--secondary)';
      } else {
        elements.comboFill.style.background = `linear-gradient(90deg, var(--primary), var(--primary-dark))`;
        elements.streakValue.style.color = 'var(--primary)';
        elements.streakValue.style.textShadow = 'none';
      }
    }

    // Combat Functions
    function attackMonster() {
      const element = gameState.elements[gameState.activeElement];
      const projectile = elements[element.projectile];
      
      // Play shoot sound
      audio.shoot.play();
      
      // Animate projectile
      gsap.fromTo(projectile, 
        { x: 200, y: 0, opacity: 1, display: 'block' },
        {
          x: 700,
          duration: 0.5,
          ease: "power1.out",
          onComplete: () => {
            projectile.style.display = 'none';
            
            // Play hit sound
            audio.hit.play();
            
            // Calculate damage with element advantage
            let damage = 10 + (gameState.correctStreak * 2) * gameState.comboMultiplier;
            
            // Element advantage system
            const monsterElement = Object.keys(gameState.elements)[Math.floor(Math.random() * 3)];
            
            if (element.strongAgainst === monsterElement) {
              damage *= 1.5;
              showDamageIndicator(damage, "CRITICAL!", "#FFD700");
            } else if (element.weakTo === monsterElement) {
              damage *= 0.75;
              showDamageIndicator(damage, "WEAK!", "#AAAAAA");
            } else {
              showDamageIndicator(damage, "", element.color);
            }
            
            // Deal damage
            gameState.monsterHealth = Math.max(0, gameState.monsterHealth - damage);
            updateHealthBars();
            
            // Shake monster
            gsap.to(elements.monster, { 
              x: 10,
              duration: 0.1,
              yoyo: true,
              repeat: 5,
              onComplete: () => {
                gsap.to(elements.monster, { x: 0, duration: 0.1 });
              }
            });
            
            // Check if monster is defeated
            if (gameState.monsterHealth <= 0) {
              defeatMonster();
            }
          }
        }
      );
    }

    function monsterAttack() {
      // Shake wizard
      gsap.to(elements.wizard, { 
        x: 10,
        duration: 0.1,
        yoyo: true,
        repeat: 5,
        onComplete: () => {
          gsap.to(elements.wizard, { x: 0, duration: 0.1 });
        }
      });
      
      // Calculate damage
      const damage = 15 + (gameState.currentLevel * 2);
      showDamageIndicator(damage, "", "#FF0000", true);
      
      // Deal damage
      gameState.wizardHealth = Math.max(0, gameState.wizardHealth - damage);
      updateHealthBars();
      
      // Play hit sound
      audio.hit.play();
      
      // Check if wizard is defeated
      if (gameState.wizardHealth <= 0) {
        defeatWizard();
      }
    }

    function showDamageIndicator(amount, text, color, isWizard = false) {
      const indicator = document.createElement('div');
      indicator.className = 'damage-indicator';
      indicator.textContent = `${text} ${Math.round(amount)}`;
      indicator.style.color = color;
      indicator.style.left = isWizard ? '150px' : '650px';
      indicator.style.bottom = '250px';
      document.getElementById('game-screen').appendChild(indicator);
      
      // Animate
      setTimeout(() => {
        indicator.remove();
      }, 1000);
    }

    // Game State Updates
    function updateStats() {
      elements.scoreValue.textContent = gameState.score;
      elements.streakValue.textContent = gameState.correctStreak;
      elements.levelValue.textContent = gameState.currentLevel;
    }

    function updateHealthBars() {
      const wizardPercentage = (gameState.wizardHealth / gameState.maxWizardHealth) * 100;
      const monsterPercentage = (gameState.monsterHealth / gameState.maxMonsterHealth) * 100;
      
      elements.wizardHealth.style.width = `${wizardPercentage}%`;
      elements.monsterHealth.style.width = `${monsterPercentage}%`;
      
      // Color feedback
      if (wizardPercentage < 30) {
        elements.wizardHealth.style.background = 'linear-gradient(90deg, #f00, #ff5e00)';
      } else if (wizardPercentage < 60) {
        elements.wizardHealth.style.background = 'linear-gradient(90deg, #ff5e00, #ff0)';
      }
      
      if (monsterPercentage < 30) {
        elements.monsterHealth.style.background = 'linear-gradient(90deg, #f00, #ff5e00)';
      } else if (monsterPercentage < 60) {
        elements.monsterHealth.style.background = 'linear-gradient(90deg, #ff5e00, #ff0)';
      }
    }

    function resetTimer() {
      gameState.timeLeft = 30;
      updateTimerDisplay();
    }

    // Feedback Functions
    function showFeedback(message, isCorrect) {
      const feedback = document.createElement('div');
      feedback.textContent = message;
      feedback.style.position = 'absolute';
      feedback.style.left = '50%';
      feedback.style.top = '30%';
      feedback.style.transform = 'translateX(-50%)';
      feedback.style.fontSize = '2.5rem';
      feedback.style.fontWeight = 'bold';
      feedback.style.color = isCorrect ? 'var(--success)' : 'var(--danger)';
      feedback.style.textShadow = '0 0 10px rgba(0, 0, 0, 0.8)';
      feedback.style.zIndex = '20';
      feedback.style.pointerEvents = 'none';
      document.getElementById('game-screen').appendChild(feedback);
      
      // Animate feedback
      gsap.fromTo(feedback,
        { y: 0, opacity: 1, scale: 0.8 },
        {
          y: -50,
          opacity: 0,
          scale: 1.2,
          duration: 1,
          ease: "power1.out",
          onComplete: () => feedback.remove()
        }
      );
      
      // Additional effects for correct answers
      if (isCorrect) {
        createConfetti();
      }
    }

    function createConfetti() {
      const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
      
      for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = `${Math.random() * 100}%`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        document.getElementById('game-screen').appendChild(confetti);
        
        // Animate confetti
        gsap.to(confetti, {
          y: `+=${Math.random() * 200 + 100}`,
          x: `+=${(Math.random() - 0.5) * 200}`,
          opacity: 0,
          duration: 1 + Math.random(),
          ease: "power1.out",
          onComplete: () => confetti.remove()
        });
      }
    }

    // End Game Functions
    function defeatMonster() {
      gameState.gameActive = false;
      clearInterval(gameState.timerInterval);
      audio.win.play();
      
      // Animate monster defeat
      gsap.to(elements.monster, {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power1.in",
        onComplete: showVictory
      });
      
      // Victory effects
      createConfetti();
    }

    function defeatWizard() {
      gameState.gameActive = false;
      clearInterval(gameState.timerInterval);
      audio.lose.play();
      
      // Animate wizard defeat
      gsap.to(elements.wizard, {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power1.in",
        onComplete: showGameOver
      });
    }

    function showVictory() {
      elements.finalScore.textContent = gameState.score;
      elements.victoryModal.classList.add('active');
    }

    function showGameOver() {
      elements.gameoverScore.textContent = gameState.score;
      elements.gameoverModal.classList.add('active');
    }

    function nextLevel() {
      elements.victoryModal.classList.remove('active');
      
      // Increase level
      gameState.currentLevel++;
      
      // Increase monster health
      gameState.maxMonsterHealth += 50;
      gameState.monsterHealth = gameState.maxMonsterHealth;
      
      // Reset streaks
      gameState.correctStreak = 0;
      gameState.wrongStreak = 0;
      
      // Reset wizard health
      gameState.wizardHealth = gameState.maxWizardHealth;
      
      // Start game again
      gameState.gameActive = true;
      startTimer();
      generateQuestion();
      updateStats();
      updateHealthBars();
      
      // Show level up message
      showFeedback(`LEVEL ${gameState.currentLevel}!`, true);
    }

    // Restart Game
    function restartGame() {
      elements.victoryModal.classList.remove('active');
      elements.gameoverModal.classList.remove('active');
      
      // Reset game state
      gameState.score = 0;
      gameState.correctStreak = 0;
      gameState.wrongStreak = 0;
      gameState.wizardHealth = gameState.maxWizardHealth;
      gameState.monsterHealth = gameState.maxMonsterHealth;
      gameState.currentLevel = 1;
      gameState.timeLeft = 30;
      gameState.comboTimeLeft = 0;
      gameState.comboMultiplier = 1;
      gameState.gameActive = true;
      
      // Reset UI
      updateStats();
      updateHealthBars();
      updateComboMeter();
      
      // Show characters
      elements.wizard.style.opacity = '1';
      elements.wizard.style.transform = 'translateY(0)';
      elements.monster.style.opacity = '1';
      elements.monster.style.transform = 'translateY(0)';
      
      // Start timer
      startTimer();
      
      // Generate new question
      generateQuestion();
    }

    // Initialize the game when loaded
    window.addEventListener('DOMContentLoaded', initGame);
