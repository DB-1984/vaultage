export const indexScripts = /*js*/ `

const updateScroll = () => {
  const term = document.getElementById("terminal");
  if (term) term.scrollTop = term.scrollHeight;
};

const renderVisualizer = (data) => {
  const explorer = document.getElementById("explorer-view");
  if (!explorer) return;

  // 1. Folders/Files logic (Directory view)
  let items = [];
  if (data.folders || data.files) {
    items = [...(data.folders || []), ...(data.files || [])];
  }

  // 2. SMART LINK DETECTION - Added 'signedUrl'
  const downloadUrl = data.signedUrl;

  // 3. CASE: We have a directory
  if (items.length > 0) {
    explorer.classList.remove('hidden');
    explorer.innerHTML = items.map(item => {
      const isFolder = !item.storageKey; 
      const icon = isFolder ? '📁' : '📄';
      const label = isFolder ? 'NAV_TO_' + item.name : 'GET_LINK';
      const route = isFolder ? '/folders/content?folderId=' : '/files';
      
      return '<div class="flex flex-col items-center justify-center p-4 border border-black/10 hover:border-black cursor-pointer group transition-all bg-white shadow-sm" onclick="runTest(\\'' + route + '\\', \\'' + label + '\\', \\'' + item.id + '\\')">' +
             '<span class="text-3xl mb-2 group-hover:scale-110 transition-transform">' + icon + '</span>' +
             '<span class="text-[10px] font-black uppercase tracking-tight truncate w-full text-center">' + item.name + '</span>' +
             '</div>';
    }).join('');
  } 
  
  // 4. CASE: We have a single file link
  else if (downloadUrl) {
    explorer.classList.remove('hidden');
    explorer.innerHTML = '<div class="col-span-full flex flex-col items-center justify-center p-8 border-2 border-black relative">' +
                         '<div class="flex gap-4">' +
                           '<a href="' + downloadUrl + '" target="_blank" class="bg-black text-white px-6 py-2 tracking-tighter text-sm font-bold hover:underline">' +
                           '📄' + ' DOWNLOAD_FILE</a>'
                         '</div>' +
                         '</div>';
  }

  // 5. CASE: Empty or error
  else {
    explorer.classList.add('hidden');
  }
};

async function runTest(url, label, uuid = null) {
  const output = document.getElementById("output");
  let finalUrl = url;
  
  if (uuid) { // if not a query, then a file path
    finalUrl = url.includes('?') ? url + uuid : url + '/' + uuid + '/download-url';
  }

  output.innerText += "\\n> " + label + " EXEC_CALL: " + finalUrl + "\\n";
  updateScroll();

  try {
    const res = await fetch(finalUrl);
    const data = await res.json();
    console.log(data);
    
    if (!res.ok) throw new Error(data.message || "Unauthorized");

    output.innerText += JSON.stringify(data, null, 2) + "\\n";
    renderVisualizer(data);

  } catch (err) {
    output.innerText += "!! ERROR: " + err.message + "\\n";
    const explorer = document.getElementById("explorer-view");
    if (explorer) explorer.classList.add('hidden');
  }
  updateScroll();
}

async function login() {
  const output = document.getElementById("output");
  output.innerText += "\\n> AUTHENTICATING...\\n";
  try {
    const res = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com", password: "00000000" }),
    });
    if (res.ok) output.innerText += "AUTH_SUCCESS.\\n";
    else throw new Error("Rejected");
  } catch (err) {
    output.innerText += "AUTH_ERROR: " + err.message + "\\n";
  }
  updateScroll();
}

async function logout() {
  const output = document.getElementById("output");
  output.innerText += "\\n> TERMINATING SESSION...\\n";
  try {
    await fetch("/auth/logout", { method: "POST" });
    output.innerText += "SUCCESS.\\n";
    const explorer = document.getElementById("explorer-view");
    if (explorer) {
        explorer.classList.add('hidden');
        explorer.innerHTML = "";
    }
  } catch (err) {
    output.innerText += "ERROR: " + err.message + "\\n";
  }
  updateScroll();
}
`;
