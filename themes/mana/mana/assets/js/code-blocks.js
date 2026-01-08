/**
 * Initialize code blocks with a fixed Header Bar
 */
function initCollapsibleCodeBlocks() {
  const postContent = document.querySelector(".post-content-main");
  if (!postContent) return;

  const highlightBlocks = postContent.querySelectorAll(".highlight");
  const standalonePreBlocks = Array.from(postContent.querySelectorAll("pre")).filter(
    (pre) => !pre.closest(".highlight"),
  );

  const codeBlocks = [...highlightBlocks, ...standalonePreBlocks];

  codeBlocks.forEach((block) => {
    // 1. Setup Wrapper
    let wrapper = block.closest(".code-block-wrapper");
    if (!wrapper) {
      wrapper = document.createElement("div");
      wrapper.className = "code-block-wrapper";
      block.parentNode.insertBefore(wrapper, block);
    }

    // 2. Setup Header (The Title Bar)
    let header = wrapper.querySelector(".code-block-header");
    if (!header) {
      header = document.createElement("div");
      header.className = "code-block-header";
      // Ensure header is always the first element in wrapper
      wrapper.prepend(header);
    }

    // 3. Add Language Title to Header
    if (!header.querySelector(".code-block-title")) {
      const title = document.createElement("span");
      title.className = "code-block-title";
      
      let langLabel = "Code";
      const codeElement = block.querySelector("code") || block;
      const allClasses = [...(codeElement.classList || []), ...(block.classList || [])];
      const langClass = allClasses.find(cls => cls.startsWith('language-'));
      
      if (langClass) {
        langLabel = langClass.replace('language-', '');
        if (langLabel.length <= 3) {
             langLabel = langLabel.toUpperCase();
        } else {
             langLabel = langLabel.charAt(0).toUpperCase() + langLabel.slice(1);
        }
      }
      title.textContent = langLabel;
      header.appendChild(title);
    }

    // 4. Add Copy Button to Header (Fixed: Appends to Header, not Wrapper)
    let copyButton = header.querySelector(".code-block-copy");
    if (!copyButton) {
      copyButton = document.createElement("button");
      copyButton.className = "code-block-copy";
      copyButton.setAttribute("aria-label", "Copy code");
      copyButton.innerHTML = `
        <svg class="copy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
        </svg>
        <svg class="checkmark-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16" style="display: none;">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span class="copy-text">Copy</span>
        <span class="copied-text" style="display: none;">Copied!</span>
      `;
      header.appendChild(copyButton); // <--- Key fix here

      // Copy Event
      copyButton.addEventListener("click", async (e) => {
        e.stopPropagation();
        const codeElement = block.querySelector("code") || block;
        const codeText = codeElement.textContent || codeElement.innerText || "";
        const isMobile = window.innerWidth <= 768;

        try {
          await navigator.clipboard.writeText(codeText);
          showCopyFeedback(copyButton, isMobile);
        } catch (err) {
          fallbackCopyText(codeText, copyButton, isMobile);
        }
      });
    }

    // 5. Wrap Content (Ensure code is separate from header)
    let content = wrapper.querySelector(".code-block-content");
    if (!content) {
      content = document.createElement("div");
      content.className = "code-block-content";
      wrapper.appendChild(content);
      content.appendChild(block);
    }
  });
}

// Helpers
function showCopyFeedback(button, isMobile) {
    const copyText = button.querySelector(".copy-text");
    const copiedText = button.querySelector(".copied-text");
    const copyIcon = button.querySelector(".copy-icon");
    const checkmarkIcon = button.querySelector(".checkmark-icon");

    button.classList.add("copied");
    copyIcon.style.display = "none";
    checkmarkIcon.style.display = "block";

    if (!isMobile) {
        copyText.style.display = "none";
        copiedText.style.display = "inline";
    }

    setTimeout(() => {
        checkmarkIcon.style.display = "none";
        copyIcon.style.display = "block";
        if (!isMobile) {
            copiedText.style.display = "none";
            copyText.style.display = "inline";
        }
        button.classList.remove("copied");
    }, 2000);
}

function fallbackCopyText(text, button, isMobile) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand("copy");
        showCopyFeedback(button, isMobile);
    } catch (err) { console.error(err); }
    document.body.removeChild(textArea);
}

// Init
(function () {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCollapsibleCodeBlocks);
  } else {
    initCollapsibleCodeBlocks();
  }
})();