document.addEventListener("DOMContentLoaded", () => {
  const statusMsg = document.getElementById("statusMessage");

  const funnyMessages = [
    "Scrubbing Vanguard kernel drivers from your cerebral cortex...",
    "Uninstalling mental tilt... please remain calm.",
    "Sterilizing hard drive from toxic ping spam...",
    "Reconnecting you to grass, sunlight, and inner peace...",
    "Deploying emergency mental health hazmat protocol...",
    "Wiping memories of 'GG EZ' and missed skillshots...",
    "Escorting you safely out of the LP trench...",
    "Purging level 1 invades and missing-pings...",
    "Rinsing away 15-minute FF voting trauma...",
    "Deconstructing toxic lobby chat logs...",
    "Reframing gaming as an enjoyable pastime instead of a job...",
    "Redirecting to games that actually respect your time..."
  ];

  let lastIndex = -1;

  const swapTextWithFade = () => {
    statusMsg.style.opacity = "0";

    setTimeout(() => {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * funnyMessages.length);
      } while (newIndex === lastIndex);
      
      lastIndex = newIndex;
      statusMsg.innerText = funnyMessages[newIndex];
      statusMsg.style.opacity = "1";
    }, 300);
  };

  swapTextWithFade();
  const textRotationInterval = setInterval(swapTextWithFade, 2500);

  // 8-second total loading timer
  setTimeout(() => {
    clearInterval(textRotationInterval);

    // Update status text so the user knows what is happening
    statusMsg.innerText = "Redirecting to Steam... Check 'Always allow' to launch automatically next time.";
    statusMsg.style.color = "#00ff88";

    // Trigger Steam launch
    window.location.href = "steam://store";

    // Extended 10-second window to allow time to click the browser prompt
    setTimeout(() => {
      window.close();
    }, 10000);
  }, 8000);
});