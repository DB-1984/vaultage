export const indexScripts = `
const updateScroll = () => {
  const term = document.getElementById("terminal");
  if (term) term.scrollTop = term.scrollHeight;
};

async function runTest(url, label) {
  const output = document.getElementById("output");
  output.innerText += \`\\n> \${label} calling \${url}...\\n\`;
  updateScroll();

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Unauthorized");
    output.innerText += JSON.stringify(data, null, 2) + "\\n";
  } catch (err) {
    output.innerText += "ERROR: " + err.message + "\\n";
  }
  updateScroll();
}

async function login() {
  const output = document.getElementById("output");
  output.innerText += "\\n> AUTHENTICATING AS GUEST_DEV...\\n";
  updateScroll();
  try {
    const res = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com", password: "00000000" }),
    });
    if (res.ok) {
      output.innerText += "AUTH_SUCCESS: Session cookie set.\\n";
    } else {
      const errData = await res.json();
      throw new Error(errData.message || "Credentials rejected.");
    }
  } catch (err) {
    output.innerText += "AUTH_ERROR: " + err.message + "\\n";
  }
  updateScroll();
}

async function logout() {
  const output = document.getElementById("output");
  output.innerText += "\\n> TERMINATING SESSION...\\n";
  updateScroll();
  try {
    const res = await fetch("/auth/logout", { method: "POST" });
    if (res.ok) {
      output.innerText += "SUCCESS: Session terminated.\\n";
    } else {
      throw new Error("Logout failed");
    }
  } catch (err) {
    output.innerText += "ERROR: " + err.message + "\\n";
  }
  updateScroll();
}
`;
