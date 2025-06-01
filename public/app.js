function autoLinkURLs(text) {
  // Convert plain URLs to clickable links if not already markdown links
  const urlRegex = /(https?:\/\/[^\s<>"'`.,;!)\]]+)/g;

  return text.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });
}

async function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;
  input.value = "";

  const chat = document.getElementById("chat");
  chat.innerHTML += `<p><strong class="speaker-you">You:</strong> ${message}</p>`;
  chat.scrollTop = chat.scrollHeight;
  input.disabled = true;

  function cleanDeepSeekReply(text) {
    return text.replace(/<think>.*?<\/think>\n?/gs, "");
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
      chat.innerHTML += `<p><strong>Error:</strong> ${
        data.error || "Something went wrong!"
      }</p>`;
      input.disabled = false;
      input.focus();
      return;
    }

    let reply = cleanDeepSeekReply(data.reply);

    // Normalize whitespace/newlines
    reply = reply.trim().replace(/\n{2,}/g, "\n");

    // Format bold and numbered lists
    reply = formatBoldAndLists(reply);

    // Replace markdown links with <a>
    reply = reply.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g,
      (_, text, url) =>
        `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`
    );

    // Replace inline code marked with backticks with <code>
    // To avoid interference, do this AFTER markdown links
    reply = reply.replace(/`([^`\n]+)`/g, (_, code) => `<code>${code}</code>`);

    // Replace plain URLs not already linked
    reply = autoLinkURLs(reply);

    // Replace newlines with <br>
    reply = reply.replace(/\n/g, "<br>");

    chat.innerHTML += `<p><strong class="speaker-deepseek">Chat-DVB:</strong> ${reply}</p>`;

    chat.scrollTop = chat.scrollHeight;
  } catch (error) {
    chat.innerHTML += `<p><strong>Error:</strong> ${error.message}</p>`;
  }

  input.disabled = false;
  input.focus();
}
