  var questions = [
    { q: "Which keyword is used to declare a variable in JavaScript?",          opts: ["var","let","const","all of the above"],                       ans: 3 },
    { q: "Which of the following is the correct way to print output in the browser console?",            opts: ["console.log()","console.print()","console.write()","console.display()"],                                   ans: 0 },
    { q: "Which symbol is used for single-line comments in JavaScript?",        opts: ["//","/*","*/","<!--"],                                 ans: 0 },
    { q: "Which operator is used for strict equality (checks both value and data type)?",                        opts: ["==","===","=","!=="], ans: 1 },
    { q: "Which loop is guaranteed to execute at least once?",        opts: ["for","while","do-while","foreach"],    ans: 2 },
    { q: "Which function is used to display a popup message?",   opts: ["alert()","prompt()","confirm()","message()"],                        ans: 0 },
    { q: "Which of the following is used to store multiple values in a single variable?",               opts: ["Array","Object","String","Number"],                             ans: 0 },
    { q: "What is the index of the first element in a JavaScript array?",               opts: ["0","1","2","3"],                                         ans: 0 },
    { q: "Which keyword is used to define a function?",                     opts: ["function","def","func","procedure"],                     ans: 0 },
    { q: "Which of the following is NOT a JavaScript data type?",   opts: ["Number","String","Boolean","Matrix"],         ans: 3 },
  ];
  var currentQ = 0;
  var score    = 0;
  var wrong    = 0;
  var skipped  = 0;
  var answered = false;
  var timeLeft = 15;
  var timer    = null;

  function showScreen(id) {
    document.getElementById('startScreen').classList.remove('active');
    document.getElementById('quizScreen').classList.remove('active');
    document.getElementById('resultScreen').classList.remove('active');
    document.getElementById(id).classList.add('active');
  }

  function closePopup(id) {
    document.getElementById(id).classList.remove('show');
  }

  function getHigh() { return parseInt(localStorage.getItem('quizHigh') || '0'); }

  function saveHigh(s) {
    if (s > getHigh()) { localStorage.setItem('quizHigh', s); return true; }
    return false;
  }

  function goHome() {
    clearInterval(timer);
    var hs = getHigh();
    document.getElementById('hsHome').textContent = hs > 0 ? 'Best score: ' + hs + ' / 10' : '';
    showScreen('startScreen');
  }

  function startQuiz() {
    clearInterval(timer);
    currentQ = 0; score = 0; wrong = 0; skipped = 0;
    closePopup('restartOverlay');
    showScreen('quizScreen');
    loadQuestion();
  }

  function confirmRestart() {
    clearInterval(timer);
    document.getElementById('restartOverlay').classList.add('show');
  }

  function doRestart() {
    closePopup('restartOverlay');
    startQuiz();
  }

  function loadQuestion() {
    answered = false;
    timeLeft = 15;
    clearInterval(timer);

    var q     = questions[currentQ];
    var total = questions.length;

    document.getElementById('qProgress').textContent    = 'Question ' + (currentQ + 1) + ' of ' + total;
    document.getElementById('scoreShow').textContent    = 'Score: ' + score;
    document.getElementById('progressFill').style.width = (((currentQ + 1) / total) * 100) + '%';
    document.getElementById('questionEl').textContent   = q.q;
    document.getElementById('feedbackEl').textContent   = '';
    document.getElementById('nextBtn').style.display    = 'none';
    document.getElementById('skipBtn').style.display    = 'inline-block';

    var tc = document.getElementById('timerEl');
    tc.textContent = 15;
    tc.className   = 'timer-circle';

    var grid = document.getElementById('optionsEl');
    grid.innerHTML = '';
    for (var i = 0; i < q.opts.length; i++) {
      var btn = document.createElement('button');
      btn.className     = 'option-btn';
      btn.textContent   = q.opts[i];
      btn.dataset.index = i;
      btn.onclick = function() { pickAnswer(parseInt(this.dataset.index)); };
      grid.appendChild(btn);
    }

    timer = setInterval(function() {
      timeLeft--;
      tc.textContent = timeLeft;
      if (timeLeft <= 5)      tc.className = 'timer-circle danger';
      else if (timeLeft <= 8) tc.className = 'timer-circle warn';
      if (timeLeft <= 0) { clearInterval(timer); timeOut(); }
    }, 1000);
  }

  function showNextBtn() {
    var isLast = (currentQ === questions.length - 1);
    document.getElementById('nextBtn').textContent   = isLast ? 'Finish' : 'Next';
    document.getElementById('nextBtn').style.display = 'inline-block';
    document.getElementById('skipBtn').style.display = 'none';
  }

  function goNext() {
    document.getElementById('nextBtn').style.display = 'none';
    currentQ++;
    if (currentQ >= questions.length) showResult();
    else loadQuestion();
  }

  function pickAnswer(idx) {
    if (answered) return;
    answered = true;
    clearInterval(timer);

    var q    = questions[currentQ];
    var btns = document.querySelectorAll('.option-btn');
    var fb   = document.getElementById('feedbackEl');

    for (var i = 0; i < btns.length; i++) btns[i].disabled = true;
    btns[q.ans].classList.add('correct');

    if (idx === q.ans) {
      score++;
      fb.textContent = 'Correct!';
      fb.style.color = 'green';
    } else {
      btns[idx].classList.add('wrong');
      wrong++;
      fb.textContent = 'Wrong!';
      fb.style.color = 'red';
    }

    document.getElementById('scoreShow').textContent = 'Score: ' + score;
    showNextBtn();
  }

  function skipQuestion() {
    if (answered) return;
    answered = true;
    clearInterval(timer);
    skipped++;

    var btns = document.querySelectorAll('.option-btn');
    for (var i = 0; i < btns.length; i++) btns[i].disabled = true;

    var fb = document.getElementById('feedbackEl');
    fb.textContent = 'Skipped!';
    fb.style.color = '#888';

    showNextBtn();
  }

  function timeOut() {
    if (answered) return;
    answered = true;
    skipped++;
    var btns = document.querySelectorAll('.option-btn');
    for (var i = 0; i < btns.length; i++) btns[i].disabled = true;
    btns[questions[currentQ].ans].classList.add('correct');
    var fb = document.getElementById('feedbackEl');
    fb.textContent = "Time's up!";
    fb.style.color = 'orange';
    showNextBtn();
  }

  function showResult() {
    clearInterval(timer);
    showScreen('resultScreen');

    var total = questions.length;
    var pct   = Math.round((score / total) * 100);

    document.getElementById('bigScore').textContent   = pct + '%';
    document.getElementById('smallScore').textContent = score + ' out of ' + total + ' correct';
    document.getElementById('statC').textContent      = score;
    document.getElementById('statW').textContent      = wrong;
    document.getElementById('statT').textContent      = skipped;

    var emoji, title, msg;
    if      (pct >= 90) { emoji = '🏆'; title = 'Outstanding!'; msg = 'You crushed it. Amazing work!'; }
    else if (pct >= 70) { emoji = '🎉'; title = 'Great Job!';   msg = 'Really solid. Well done!'; }
    else if (pct >= 50) { emoji = '👍'; title = 'Not Bad!';     msg = 'Good attempt. Keep practising!'; }
    else                { emoji = '😅'; title = 'Keep Trying!'; msg = 'Practice makes perfect!'; }

    document.getElementById('resultEmoji').textContent = emoji;
    document.getElementById('resultTitle').textContent = title;
    document.getElementById('resultMsg').textContent   = msg;

    var isNew = saveHigh(score);
    var note  = document.getElementById('highNote');
    if (isNew)              note.textContent = 'New high score: ' + score + '/' + total + '!';
    else if (getHigh() > 0) note.textContent = 'Your best: ' + getHigh() + '/' + total;
    else                    note.textContent = '';
  }

  goHome();
