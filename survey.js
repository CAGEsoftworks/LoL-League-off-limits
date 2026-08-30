document.addEventListener("DOMContentLoaded", () => {
  const nextBtn = document.getElementById('nextBtn');
  const rows = document.querySelectorAll('.option-row');
  const counterText = document.getElementById('counterText');
  const counterJoke = document.getElementById('counterJoke');

  // Fetch attempt count to determine audio and messaging
  chrome.storage.local.get({ temptationCount: 1 }, (data) => {
    const count = data.temptationCount;
    counterText.innerText = `Temptation Counter: ${count} Attempt${count > 1 ? 's' : ''}`;

    // Audio files swapped: audio2.ogg for 1-4, audio.ogg for 5+
    const audioPath = count < 5 ? "audio/audio2.ogg" : "audio/audio.ogg";
    const audioUrl = chrome.runtime.getURL(audioPath);
    const voiceLine = new Audio(audioUrl);

    voiceLine.play().catch(() => {
      document.addEventListener('click', () => voiceLine.play(), { once: true });
    });

    // Escalating messages
    if (count === 1) {
      counterJoke.innerText = "Are you doing alright today? Take a breath before clicking install.";
    } else if (count === 2) {
      counterJoke.innerText = "Hey... are you sure about this? You set up this blocker for a reason.";
    } else if (count === 3) {
      counterJoke.innerText = "I'm genuinely getting worried about you. Is everything okay?";
    } else if (count === 4) {
      counterJoke.innerText = "Please stop and think. This game isn't going to make you feel any better right now.";
    } else if (count === 5) {
      counterJoke.innerText = "WARNING: Severe mental tilt detected. SERIOUSLY, GO OUTSIDE.";
    } else {
      counterJoke.innerText = `ATTEMPT #${count}: WE WILL OUTLAST YOU. YOU ARE NOT INSTALLING THIS GAME.`;
    }
  });

  rows.forEach(row => {
    row.addEventListener('click', () => {
      const radio = row.querySelector('input[type="radio"]');
      radio.checked = true;
      
      rows.forEach(r => r.style.borderColor = '#30363d');
      row.style.borderColor = '#f85149';
      
      nextBtn.disabled = false;
      nextBtn.style.backgroundColor = '#f85149';
      nextBtn.style.color = '#ffffff';
      nextBtn.style.borderColor = '#f85149';
      nextBtn.style.cursor = 'pointer';
    });
  });

  nextBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "closeRiotTabs" }, () => {
      window.location.href = chrome.runtime.getURL("loading.html");
    });
  });
});