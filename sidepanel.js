(async function() {
  let analyticsData = {
      timeSpent: 0,
      interactions: {
          takeaways: 0,
          memoryCues: 0,
          relatedConcepts: 0,
          quizQuestions: 0
      }
  };

  let startTime;

  function startTimer() {
      startTime = new Date();
  }

  function stopTimer() {
      const endTime = new Date();
      analyticsData.timeSpent += (endTime - startTime) / 1000; // Time in seconds
  }

  function trackInteraction(section) {
      if (analyticsData.interactions[section] !== undefined) {
          analyticsData.interactions[section]++;
      }
  }

  function displayAnalytics() {
      const analyticsElement = document.getElementById('reading-analytics');
      analyticsElement.innerHTML = `
          <h3>Reading Analytics</h3>
          <p>Time Spent Reading: ${analyticsData.timeSpent.toFixed(2)} seconds</p>
          <p>Key Takeaways Interactions: ${analyticsData.interactions.takeaways}</p>
          <p>Memory Cues Interactions: ${analyticsData.interactions.memoryCues}</p>
          <p>Related Concepts Interactions: ${analyticsData.interactions.relatedConcepts}</p>
          <p>Quiz Questions Interactions: ${analyticsData.interactions.quizQuestions}</p>
      `;
  }
    async function chromeAISummarizeText(textToSummarize) {
        if (!textToSummarize) {
            document.getElementById('summarization-text').innerText = "No text selected.";
            return;
        }

        document.getElementById('summarization-text').innerText = "Summarizing...";
        try {
            const summarizerCapabilities = await ai.summarizer.capabilities();
            if (summarizerCapabilities.available === 'no') {
                document.getElementById('summarization-text').innerText = "Summarizer API not supported.";
                return;
            }

            const summarizer = await ai.summarizer.create({ type: 'key-points', format: 'plain-text' });
            const summary = await summarizer.summarize(textToSummarize);


            if (summary) {
                document.getElementById('summarization-text').innerText = summary;
                saveSummary(summary);
                analyzeEmotion(summary);
                generateResearchLinks(summary);

            // New: Extract and display key takeaways
                const takeaways = extractKeyTakeaways(summary);
                displayKeyTakeaways(takeaways);

            // New: Generate and display memory cues
                const memoryCues = generateMemoryCues(summary);
                displayMemoryCues(memoryCues);

            // New: Fetch and display related concepts
                const relatedConcepts = await fetchRelatedConcepts(summary);
                displayRelatedConcepts(relatedConcepts);

            // New: Generate and display quiz questions
              const quizQuestions = generateQuizQuestions(summary);
              displayQuiz(quizQuestions);
           } else {
            document.getElementById('summarization-text').innerText = "No summary generated.";
        }
  
  function extractKeyTakeaways(summary) {
        const sentences = summary.split('.').filter(sentence => sentence.trim() !== '');
        const keyTakeaways = sentences.slice(0, 3);
        return keyTakeaways;
    }

  function displayKeyTakeaways(takeaways) {
        const takeawaysElement = document.getElementById('key-takeaways');
        takeawaysElement.innerHTML = '';

        takeaways.forEach(takeaway => {
            const li = document.createElement('li');
            li.innerText = takeaway;
            takeawaysElement.appendChild(li);
        });
    }

  function generateMemoryCues(summary) {
        const cues = [];
        const keywords = ['neuroplasticity', 'photosynthesis', 'quantum mechanics'];

        keywords.forEach(keyword => {
            if (summary.includes(keyword)) {
                cues.push(`Remember: ${keyword} is like Play-Doh; it changes shape with learning!`);
            }
        });

        return cues;
    }

  function displayMemoryCues(cues) {
        const cuesElement = document.getElementById('memory-cues');
        cuesElement.innerHTML = '';

        cues.forEach(cue => {
            const li = document.createElement('li');
            li.innerText = cue;
            cuesElement.appendChild(li);
        });
    }

  function generateQuizQuestions(summary) {
        // Example logic to create quiz questions based on the summary
        const questions = [
            { question: "What is neuroplasticity?", answer: "The brain's ability to reorganize itself." },
            { question: "What is photosynthesis?", answer: "The process by which plants convert sunlight into energy." }
        ];
        return questions;
    }

  function displayRelatedConcepts(concepts) {
        const conceptsElement = document.getElementById('related-concepts');
        conceptsElement.innerHTML = '';

        concepts.forEach(concept => {
            const li = document.createElement('li');
            li.innerText = concept;
            conceptsElement.appendChild(li);
        });
    }

  function displayQuiz(questions) {
        const quizElement = document.getElementById('quiz-questions');
        quizElement.innerHTML = '';

        questions.forEach((q, index) => {
            const li = document.createElement('li');
            li.innerText = `${index + 1}. ${q.question}`;
            quizElement.appendChild(li);
        });
    }
// Generate Research Links
  function generateQuiz(questions) {
      const quizContainer = document.getElementById('quiz-container');
      quizContainer.innerHTML = ''; // Clear previous quiz
      generateQuiz(questions);  
  } 
  function generateQuizeScore(questions) {  
      const quizScore = document.getElementById('quiz-score');
      generateQuizeScore(questions);  
  } 

  function saveSummary(summary) {
    chrome.storage.local.get({ notes: [] }, (data) => {
        const updatedNotes = [...data.notes, summary].slice(-5); // Last 5 summaries
        chrome.storage.local.set({ notes: updatedNotes });
        document.getElementById('notes-textarea').value = updatedNotes.join("\n\n");
   });
  }

  function analyzeEmotion(text) {
      const positiveWords = ['happy', 'great', 'excellent'];
      const negativeWords = ['sad', 'bad', 'terrible'];

      let score = 0;
      text.split(' ').forEach(word => {
        if (positiveWords.includes(word)) score++;
        if (negativeWords.includes(word)) score--;
    });

    const emotionElement = document.getElementById('emotion-analysis');
    if (score > 0) {
        emotionElement.innerText = "Positive";
        emotionElement.style.color = "green";
    } else if (score < 0) {
        emotionElement.innerText = "Negative";
        emotionElement.style.color = "red";
    } else {
        emotionElement.innerText = "Neutral";
    }
  }

  function generateResearchLinks(text) {
      const researchSection = document.getElementById('research-links');
      researchSection.innerHTML = '';

      const googleLink = `https://www.google.com/search?q=${encodeURIComponent(text)}`;
      const wikiLink = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(text)}`;

      researchSection.innerHTML = `
        <li><a href="${googleLink}" target="_blank">Google</a></li>
        <li><a href="${wikiLink}" target="_blank">Wikipedia</a></li>
    `;
  }
  // Wrap this in async to call it when the page loads
  async function initializeSummarization() {
      chrome.storage.local.get('lastTextToSummarize', async ({ lastTextToSummarize }) => {
      if (lastTextToSummarize) {
          await chromeAISummarizeText(lastTextToSummarize);
      }
    });
  }

  function displayKeyTakeaways(takeaways) {
      const takeawaysElement = document.getElementById('key-takeaways');
      takeawaysElement.innerHTML = takeaways.map(t => `<li>${t}</li>`).join('');
  }

  function generateMemoryCues(text) {
  // Placeholder for a lightweight NLP-based mnemonic generator
      const cues = [
    "Think of your brain as Play-Doh—it molds and changes with learning.",
    // Add more cues based on keywords in the text
    ];
  displayMemoryCues(cues);
  }

  function displayMemoryCues(cues) {
      const cuesElement = document.getElementById('memory-cues');
      cuesElement.innerHTML = cues.map(c => `<li>${c}</li>`).join('');
  }

  async function fetchRelatedConcepts(text) {
      const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(text)}&format=json`);
      const data = await response.json();
      displayRelatedConcepts(data.query.search);
  }

  function displayRelatedConcepts(relatedConcepts) {
      const conceptsElement = document.getElementById('related-concepts');
      conceptsElement.innerHTML = relatedConcepts.map(c => `<li>${c.title}</li>`).join('');
  }

  function generateQuiz(questions) {
    // Generate quiz questions based on the summary
      const quizElement = document.getElementById('quiz-section');
      quizElement.innerHTML = questions.map(q => `<li>${q.question}</li>`).join('');
  }

    chrome.storage.local.get('lastTextToSummarize', ({ lastTextToSummarize }) => {
      if (lastTextToSummarize) chromeAISummarizeText(lastTextToSummarize);
  });

    chrome.storage.local.onChanged.addListener((changes) => {
      if (changes['lastTextToSummarize']) {
          chromeAISummarizeText(changes['lastTextToSummarize'].newValue);
      }
  });
    let readingStartTime = Date.now();

 window.addEventListener('scroll', () => {
    const currentTime = Date.now();
    const timeSpent = (currentTime - readingStartTime) / 1000; // in seconds
    // Logic to track scroll depth and time spent
    if (timeSpent > 1200) { // If more than 20 minutes
      alert("Consider taking a break!");
    }
  }); 

 initializeSummarization();
 document.getElementById('notes-textarea').addEventListener('input', () => {
    chrome.storage.local.set({ notes: document.getElementById('notes-textarea').value.split('\n\n') });
  
    await initializeSummarization();
})();
