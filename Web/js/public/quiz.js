function checkAnswers() {
  let score = 0;

  let answers = {
    q1: "b",
    q2: "b",
    q3: "a",
    q4: "c",
    q5: "a",
    q6: "b",
    q7: "b"
  };

  
  for (let q in answers) {
    let selected = document.querySelector(`input[name=${q}]:checked`);
    if (selected && selected.value === answers[q]) {
      score++;
    }
  }

  
  let resultBox = document.getElementById("result");
  resultBox.style.display = "block";

  if (score === 7) {
    resultBox.innerHTML = `🎉 Perfect! You scored ${score}/7`;
    resultBox.style.background = "#d4edda";
    resultBox.style.color = "#155724";
  } else if (score >= 4) {
    resultBox.innerHTML = `👍 Good job! You scored ${score}/7`;
    resultBox.style.background = "#fff3cd";
    resultBox.style.color = "#856404";
  } else {
    resultBox.innerHTML = `⚠ Keep Learning! You scored ${score}/7`;
    resultBox.style.background = "#f8d7da";
    resultBox.style.color = "#721c24";
  }
}
