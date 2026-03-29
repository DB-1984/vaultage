/**
 * Vaultage UI Logic | src/utils/explorer.js
 */

const updateScroll = () => {
    const term = document.getElementById("output");
    if (term) term.scrollTop = term.scrollHeight;
};

// --- TAB NAVIGATION ---
// Used by: [01_Console] and [02_Manual] nav buttons
export function switchTab(tabId) {
    const isDocs = tabId === 'docs-tab';
    document.querySelectorAll('.tab-content').forEach(t => {
        t.classList.toggle('hidden', t.id !== tabId);
    });
    
    const tBtn = document.getElementById('btn-terminal');
    const dBtn = document.getElementById('btn-docs');
    if (!tBtn || !dBtn) return;

    const active = "bg-[#ffffff] text-[#2d0a4e] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest";
    const inactive = "bg-transparent text-[#ffffff] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest font-light-weight hover:bg-white/5 transition-all";

    tBtn.className = isDocs ? inactive : active;
    dBtn.className = isDocs ? active : inactive;
}

// --- [BUTTON 01: INIT_AUTH] ---
// Activated by: "Login_Test"
export async function login() {
    const output = document.getElementById("output");
    const explorer = document.getElementById("explorer-view");
    output.innerText += "\n> AUTHENTICATING...\n";
    updateScroll();

    try {
        const res = await fetch("/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "test@example.com", password: "00000000" }),
        });

        if (res.ok) {
            output.innerText += "AUTH_SUCCESS.\n";
            explorer.innerHTML = `<div class="bg-black/20 p-6 rounded-xl border border-white/10 w-full max-w-sm text-left">
                <span class="text-[#e6195e] block mb-2 uppercase font-bold text-[10px] mono">// Identity_Confirmed</span>
                <pre class="text-white/60 text-[10px]">{ "user": "test@example.com", "status": "active" }</pre>
            </div>`;
        } else {
            throw new Error("Rejected");
        }
    } catch (err) {
        output.innerText += "AUTH_ERROR: " + err.message + "\n";
    }
    updateScroll();
}

// --- [BUTTON 02 & 03: READ_ROOT & DRILL_NODE] ---
// Activated by: "Resolve_Tree" and "Navigate_Folder"
// Also handles the dynamic "Drill" clicks inside the Explorer View
export async function runTest(url, label, uuid = null) {
    const output = document.getElementById("output");
    let finalUrl = url;
    
    // Logic for appending UUIDs for nested folders or specific file lookups
    if (uuid) {
        finalUrl = url.includes('?') ? url + uuid : url + '/' + uuid + '/download-url';
    }

    output.innerText += "\n> " + label + " EXEC_CALL: " + finalUrl + "\n";
    updateScroll();

    try {
        const res = await fetch(finalUrl);
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.message || "Unauthorized");

        output.innerText += JSON.stringify(data, null, 2) + "\n";
        renderVisualizer(data); // Updates the bottom GUI grid

    } catch (err) {
        output.innerText += "!! ERROR: " + err.message + "\n";
    }
    updateScroll();
}

// --- [BUTTON 04: PULL_LINK] ---
// Note: This button effectively uses the 'runTest' logic above with a specific UUID.
// It renders the S3 Download Link in the 'renderVisualizer' helper below.

const renderVisualizer = (data) => {
    const explorer = document.getElementById("explorer-view");
    if (!explorer) return;

    let items = [];
    if (data.folders || data.files) items = [...(data.folders || []), ...(data.files || [])];

    if (items.length > 0) {
        explorer.className = "mt-8 p-6 glass-panel rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-4 mono text-[10px]";
        explorer.innerHTML = items.map(item => {
            const isFolder = !item.storageKey; 
            const route = isFolder ? '/folders/content?folderId=' : '/files';
            return `<div class="flex flex-col items-center p-4 border border-white/10 hover:border-[#e6195e] cursor-pointer bg-white/5 rounded-lg" onclick="runTest('${route}', 'NAV_TO', '${item.id}')">
                <span class="text-2xl mb-2">${isFolder ? '📁' : '📄'}</span>
                <span class="text-white/70 truncate w-full text-center">${item.name}</span>
            </div>`;
        }).join('');
    } 
    else if (data.signedUrl) {
        // This is the visual output of BUTTON 04
        explorer.innerHTML = `<a href="${data.signedUrl}" target="_blank" class="bg-white text-[#2d0a4e] px-8 py-4 rounded-full font-black">📄 DOWNLOAD_FILE</a>`;
    }
};

// --- [BUTTON 05: PUSH_BLOB] ---
// Activated by: "Stage_Upload"
export function showUploadUI() {
    const explorer = document.getElementById('explorer-view');
    explorer.className = "mt-8 p-10 glass-panel rounded-2xl min-h-[160px] flex items-center justify-center";
    explorer.innerHTML = `
        <div class="w-full flex flex-col items-center gap-6 animate-pulse">
            <div class="border-2 border-dashed border-white/20 rounded-2xl p-8 w-full flex flex-col items-center cursor-pointer" onclick="simulateUpload()">
                <div class="text-4xl mb-2">📁</div>
                <p class="text-white text-sm font-bold">CLICK_TO_SIMULATE_S3_UPLOAD</p>
            </div>
            <div id="upload-progress" class="w-full hidden">
                <div class="flex justify-between mono text-[9px] mb-2"><span>UPLOADING...</span><span id="upload-perc">0%</span></div>
                <div class="w-full bg-white/10 h-1 rounded-full overflow-hidden"><div id="progress-bar" class="bg-[#e6195e] h-full w-0 transition-all"></div></div>
            </div>
        </div>`;
}

// Internal simulation logic for the Upload UI
export function simulateUpload() {
    const progressDiv = document.getElementById('upload-progress');
    const bar = document.getElementById('progress-bar');
    const percText = document.getElementById('upload-perc');
    if (!progressDiv) return;

    progressDiv.classList.remove('hidden');
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            document.getElementById("output").innerText += "\n// SUCCESS: BLOB_STAGED_TO_S3";
        }
        bar.style.width = progress + "%";
        percText.innerText = progress + "%";
    }, 100);
}

// --- GLOBAL BINDING ---
// Ties the Module functions to the Window for the HTML onclick handlers
window.switchTab = switchTab;
window.login = login;
window.runTest = runTest;
window.showUploadUI = showUploadUI;
window.simulateUpload = simulateUpload;
window.logout = async () => { /* Logic to clear session */ };