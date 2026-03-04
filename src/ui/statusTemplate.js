import { indexScripts } from "../utils/indexScripts.js";

export const statusTemplate = /*html*/ `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VAULTAGE // FULL_TECHNICAL_SPEC</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@900&family=JetBrains+Mono:wght@500;800&display=swap" rel="stylesheet">
    <style>
      :root { --bg-color: #2fcbff; --text-color: #000000; }
      body { font-family: 'Inter', sans-serif; background-color: var(--bg-color); color: var(--text-color); }
      .mono { font-family: 'JetBrains Mono', monospace; }
      .tab-content.hidden { display: none; }
      .brutal-border { border: 4px solid var(--text-color); }
      .logo-font { font-weight: 900; font-variant-ligatures: none; font-feature-settings: "liga" 0; }
      .dot-grid { background-image: radial-gradient(rgba(0,0,0,0.15) 1px, transparent 1px); background-size: 25px 25px; }
      pre, code { overflow-wrap: break-word; white-space: pre-wrap; }
      .custom-scrollbar::-webkit-scrollbar { width: 8px; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: #000; }
      
      .inverted-v {
        display: inline-flex;
        transform: rotate(180deg) translateY(0.005em);
        margin-left: -0.055em;
        margin-right: -0.05em;
        font-size: 99%;
      }
    </style>
</head>
<body class="p-2 sm:p-4 md:p-12 dot-grid min-h-screen">
    <div class="max-w-6xl mx-auto bg-[var(--bg-color)] brutal-border p-6 md:p-16 relative shadow-[16px_16px_0px_0px_#000]">
        
        <header class="flex flex-col md:flex-row justify-between items-start border-b-4 border-black pb-8 mb-10 gap-4">
            <div class="flex flex-col">
                <h1 class="text-5xl lg:text-8xl logo-font leading-[0.8] tracking-tighter uppercase select-none">
                    V<span class="inverted-v">V</span>ULTAGE
                </h1>
                <p class="text-[10px] font-bold uppercase tracking-[0.4em] mt-6">High-Integrity Recursive File Management // v1.0.0</p>
            </div>
            <div class="md:text-right mono text-[10px] leading-tight font-bold opacity-60">
                DATE: 03_MAR_2026<br>
                REF: ARCH_DOC_V1<br>
                STATUS: ENCRYPTED
            </div>
        </header>

        <div class="mb-16 grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-8 border-b-4 border-black pb-12" id="manifest">
            <div class="md:col-span-1">
                <h2 class="text-sm font-black uppercase border-b-2 border-black pb-1">System_Brief</h2>
            </div>
            <div class="md:col-span-3 text-lg leading-tight font-bold">
                Vaultage is a recursive file system built on a <span class="bg-black text-[var(--bg-color)] px-1">PostgreSQL core with Prisma ORM</span>. It utilizes a self-referential <code class="mono">FolderTree</code> model and Row-Level Security (RLS) to ensure cryptographic-grade user isolation.
            </div>
        </div>

        <nav class="flex gap-0 mb-12 border-4 border-black bg-black">
            <button onclick="switchTab('terminal-tab')" id="btn-terminal" 
                class="flex-1 bg-[var(--bg-color)] text-black py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all">
                01_Console
            </button>
            <button onclick="switchTab('docs-tab')" id="btn-docs" 
                class="flex-1 bg-transparent text-[#2fcbff] opacity-50 py-5 text-[10px] font-black uppercase tracking-[0.2em] border-l-4 border-black hover:opacity-100 transition-all">
                02_Manual
            </button>
        </nav>

        <div id="terminal-tab" class="tab-content">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-0 border-4 border-black">
                <div class="lg:col-span-8 p-6 bg-white/90 border-r-4 border-black min-h-[400px]">
                    <pre id="output" class="mono text-xs sm:text-sm text-black leading-tight font-medium opacity-60">// Ready for command input...</pre>
                </div>
                <div class="lg:col-span-4 flex flex-col bg-black">
                    <button onclick="login()" class="p-4 text-left text-[var(--bg-color)] font-black uppercase text-[10px] border-b border-[var(--bg-color)]/20 hover:bg-[var(--bg-color)] hover:text-black">01 Init_Auth</button>
                    <button onclick="runTest('/folders/content', 'GET_ROOT')" class="p-4 text-left text-[var(--bg-color)] font-black uppercase text-[10px] border-b border-[var(--bg-color)]/20 hover:bg-[var(--bg-color)] hover:text-black">02 Read_Root</button>
                    <button onclick="runTest('/folders/content?folderId=cmlw75s560001mfjnk36olrvw', 'GET_CHILD')" class="p-4 text-left text-[var(--bg-color)] font-black uppercase text-[10px] border-b border-[var(--bg-color)]/20 hover:bg-[var(--bg-color)] hover:text-black">03 Drill_Node</button>
                    <button onclick="runTest('/files/cmlw7trh50005qzl39g410bat/download-url', 'GET_FILE')" class="p-4 text-left text-[var(--bg-color)] font-black uppercase text-[10px] border-b border-[var(--bg-color)]/20 hover:bg-[var(--bg-color)] hover:text-black">04 Pull_Link</button>
                    <button onclick="logout()" class="mt-auto p-6 text-center text-red-500 font-black uppercase text-[10px] hover:bg-red-500 hover:text-black transition-all">05 Terminate</button>
                </div>
            </div>
            <div id="explorer-view" class="mt-10 p-6 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] min-h-[160px] mono text-[10px] uppercase font-bold tracking-widest text-center flex items-center justify-center">... Explorer_Idle ...</div>
        </div>

        <div id="docs-tab" class="tab-content hidden">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 border-t-4 border-black pt-12">
                <div class="space-y-12">
                    <section>
                        <h3 class="text-3xl font-black uppercase tracking-tighter mb-4"><span class="opacity-20 mono text-sm">01.</span> Auth_Gateway</h3>
                        <p class="text-xs/6 mb-4 font-bold">POST /auth/[register|login] initializes identity. Login transmits a stateless JWT via <code>Set-Cookie</code>.</p>
                        <div class="bg-white border-2 border-black p-4 mono text-[10px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <span class="opacity-30 block mb-1 uppercase font-black">// Login_Schema</span>
                            { "email": "dev@example.com", "password": "••••••••" }
                        </div>
                        <div class="p-4 bg-black text-[var(--bg-color)] mt-4 text-[10px] leading-relaxed italic border-2 border-black">
                            <strong>Protocol Note:</strong> Sessions utilize <strong>Server-Side JWTs</strong> in HttpOnly cookies to neutralize XSS vectors.
                        </div>
                    </section>
                    <section>
                        <h3 class="text-3xl font-black uppercase tracking-tighter mb-4"><span class="opacity-20 mono text-sm">02.</span> Security_Protocol</h3>
                        <p class="text-xs/7 font-bold bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            All requests gated by custom middleware verifying the JWT signature. The <code>ownerId</code> is extracted server-side, preventing IDOR attacks.
                        </p>
                    </section>
                    <section>
                        <h3 class="text-3xl font-black uppercase tracking-tighter mb-4"><span class="opacity-20 mono text-sm">03.</span> Data_Fidelity</h3>
                        <div class="bg-black text-white p-6 border-4 border-black shadow-[6px_6px_0px_0px_#000]">
                            <span class="block font-black uppercase text-[10px] opacity-40 mb-2 tracking-[0.2em]">Storage_Key Pattern</span>
                            <code class="mono text-[var(--bg-color)] font-bold text-xs bg-white/10 px-2 py-1">/u102/b8_2f9a.bin</code>
                            <p class="mt-4 text-[11px] leading-relaxed font-bold">Immutable UUID pointers to S3. Renaming metadata does not orphan physical blobs.</p>
                        </div>
                    </section>
                </div>
                <div class="space-y-12">
                    <section>
                        <h3 class="text-3xl font-black uppercase tracking-tighter mb-4"><span class="opacity-20 mono text-sm">04.</span> I/O_Endpoints</h3>
                        <div class="space-y-6">
                            <div class="border-b-2 border-black pb-4">
                                <span class="text-[10px] font-black uppercase bg-black text-[var(--bg-color)] px-1">GET /folders/content</span>
                                <p class="text-xs font-bold mt-2 italic">Recursive tree resolver. Use ?folderId for children.</p>
                            </div>
                            <div class="border-b-2 border-black pb-4">
                                <span class="text-[10px] font-black uppercase bg-black text-[var(--bg-color)] px-1">POST /folders</span>
                                <div class="bg-white border-2 border-black p-3 mono text-[10px] mt-2 font-bold uppercase">{ "name": "Work", "parentId": "uuid" }</div>
                            </div>
                            <div>
                                <span class="text-[10px] font-black uppercase bg-black text-[var(--bg-color)] px-1">POST /files</span>
                                <div class="bg-white border-2 border-black p-3 mono text-[9px] mt-2 font-bold uppercase">{ "fileName": "sys.dwg", "fileSize": 5242880, "folderId": "uuid" }</div>
                            </div>
                        </div>
                    </section>
                    <section>
                        <h3 class="text-3xl font-black uppercase tracking-tighter mb-4"><span class="opacity-20 mono text-sm">05.</span> UI_Mapping</h3>
                        <p class="text-xs/6 font-bold mb-4">Uses <strong>Event Delegation</strong>. Maps database UUIDs to <code>data-uuid</code> attributes.</p>
                        <div class="bg-white border-4 border-double border-black p-4 mono text-[10px] font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            &lt;button data-uuid="cmlw7tr..."&gt; 📄 doc.pdf &lt;/button&gt;
                        </div>
                    </section>
                </div>
            </div>
        </div>

        <footer class="mt-20 border-t-4 border-black pt-8 flex justify-between items-center text-[10px] font-black uppercase tracking-wide">
            <p>VAULTAGE STORAGE PROTOCOL // 2026</p>
            <button onclick="location.reload()" id="reset-button" class="underline">Reset_System</button>
        </footer>
    </div>

    <script>
      function switchTab(tabId) {
          const isDocs = tabId === 'docs-tab';
          document.querySelectorAll('.tab-content').forEach(t => t.classList.toggle('hidden', t.id !== tabId));
          
          const tBtn = document.getElementById('btn-terminal');
          const dBtn = document.getElementById('btn-docs');

          if (isDocs) {
              dBtn.style.backgroundColor = 'var(--bg-color)';
              dBtn.style.color = 'black';
              dBtn.style.opacity = '1';
              tBtn.style.backgroundColor = 'transparent';
              tBtn.style.color = '#2fcbff';
              tBtn.style.opacity = '0.5';
          } else {
              tBtn.style.backgroundColor = 'var(--bg-color)';
              tBtn.style.color = 'black';
              tBtn.style.opacity = '1';
              dBtn.style.backgroundColor = 'transparent';
              dBtn.style.color = '#2fcbff';
              dBtn.style.opacity = '0.5';
          }
      }
      ${indexScripts}
    </script>
</body>
</html>
`;
