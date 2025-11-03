async function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;
  input.value = "";

  const chat = document.getElementById("chat");
  chat.innerHTML += `<p><strong class="speaker-you">You:</strong> ${message}</p>`;
  chat.scrollTop = chat.scrollHeight;
  input.disabled = true;

  const loader = document.createElement("p");
  loader.id = "loading-indicator";
  loader.innerHTML = `<strong class="speaker-deepseek">Chat-DVB:</strong> <span class="loading-dots">Thinking</span>`;
  chat.appendChild(loader);
  chat.scrollTop = chat.scrollHeight;

  let dotCount = 0;
  const loadingInterval = setInterval(() => {
    dotCount = (dotCount + 1) % 4;
    const span = loader.querySelector(".loading-dots");
    if (span) span.textContent = "Thinking" + ".".repeat(dotCount);
    chat.scrollTop = chat.scrollHeight;
  }, 500);

  function cleanDeepSeekReply(text) {
    return text.replace(/<think>.*?<\/think>\n?/gs, "");
  }

  function autoLinkURLs(text) {
    const urlRegex = /(https?:\/\/[^\s<>"]+)(?![^<>]*>|[^<>]*<\/a>)/g;
    return text.replace(
      urlRegex,
      (url) =>
        `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
    );
  }

  function formatBoldAndLists(text) {
    let formatted = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    formatted = formatted.replace(/(\d+)\.\s+/g, "<br>$1. ");
    return formatted;
  }

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();

    if (!res.ok) {
      clearInterval(loadingInterval);
      loader.remove();
      chat.innerHTML += `<p><strong>Error:</strong> ${
        data.error || "Something went wrong!"
      }</p>`;
      input.disabled = false;
      input.focus();
      return;
    }

    let reply = cleanDeepSeekReply(data.reply);
    reply = reply.trim().replace(/\n{2,}/g, "\n");

    reply = formatBoldAndLists(reply);

    reply = reply.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g,
      (_, text, url) =>
        `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`
    );

    reply = reply.replace(/`([^`\n]+)`/g, (_, code) => `<code>${code}</code>`);

    reply = autoLinkURLs(reply);

    reply = reply.replace(/\n/g, "<br>");

    clearInterval(loadingInterval);
    loader.remove();

    chat.innerHTML += `<p><strong class="speaker-deepseek">Chat-DVB:</strong> ${reply}</p>`;
    chat.scrollTop = chat.scrollHeight;
  } catch (error) {
    clearInterval(loadingInterval);
    loader.remove();
    chat.innerHTML += `<p><strong>Error:</strong> ${error.message}</p>`;
  } finally {
    input.disabled = false;
    input.focus();
  }
}
