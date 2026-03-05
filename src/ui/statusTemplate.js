import { indexScripts } from "../utils/indexScripts.js";

export const statusTemplate = /*html*/ `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vaultage | Technical Spec v1.0.0</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&family=JetBrains+Mono&display=swap" rel="stylesheet">
    <style>
      body { 
        font-family: 'Inter', sans-serif; 
        background: linear-gradient(135deg, #5bbad3 0%, #45587d 50%, #a2c7b5 100%);
        color: #ffffff;
        min-height: 100vh;
      }
      .mono { font-family: 'JetBrains Mono', monospace; }
      .tab-content.hidden { display: none; }
      .font-light-weight { font-weight: 300; opacity: 0.8; }
      .logo-font { font-weight: 900; letter-spacing: -0.05em; }
      .glass-panel {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      .custom-scrollbar::-webkit-scrollbar { width: 4px; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); }
      button { transition: all 0.3s ease-in-out; }
    </style>
</head>
<body class="p-4 md:p-12">
    <div class="max-w-7xl mx-auto flex flex-col gap-10">
        
        <header class="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
                <h1 class="text-6xl lg:text-8xl logo-font tracking-tighter uppercase select-none mb-1">Vaultage</h1>
                <p class="mono text-[11px] uppercase tracking-widest font-light-weight">Recursive_File_Storage // v1.0.0</p>
            </div>
            <div class="mono text-[10px] text-right font-light-weight">
                DATE: 05_MAR_2026<br>
                REF: ARCH_DOC_V1<br>
                STATUS: ENCRYPTED
            </div>
        </header>

        <div class="glass-panel p-8 rounded-2xl">
            <h2 class="mono text-xs font-bold uppercase tracking-widest text-[#e6195e] mb-2">// System_Manifest</h2>
            <p class="text-3xl font-light-weight leading-tight">Vaultage is a recursive file system built on a PostgreSQL core. It ensures <span class="font-bold">cryptographic-grade</span> user isolation.</p>
        </div>

        <nav class="flex gap-2">
            <button onclick="switchTab('terminal-tab')" id="btn-terminal" class="bg-[#ffffff] text-[#2d0a4e] px-10 py-3 rounded-full text-xs font-bold uppercase tracking-widest">01_Console</button>
            <button onclick="switchTab('docs-tab')" id="btn-docs" class="bg-transparent text-[#ffffff] px-10 py-3 rounded-full text-xs font-bold uppercase tracking-widest font-light-weight hover:bg-white/5 transition-all">02_Manual</button>
        </nav>

        <main>
            <div id="terminal-tab" class="tab-content">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div class="lg:col-span-8">
                        <div class="glass-panel p-6 rounded-2xl">
                            <h3 class="mono text-xs text-white/50 uppercase tracking-widest mb-4">Core_I/O_Output</h3>
                            <pre id="output" class="mono text-xs sm:text-sm text-white/70 h-[400px] overflow-y-auto custom-scrollbar font-medium opacity-60 bg-black/30 p-4 rounded-lg">// Ready for instruction...</pre>
                        </div>
                    </div>
                    <div class="lg:col-span-4 flex flex-col gap-3">
                        <button onclick="login()" class="p-4 text-left rounded-xl glass-panel group">
                            <span class="mono text-[9px] text-[#e6195e] font-bold block mb-1">01_INIT_AUTH</span>
                            <span class="text-xs font-bold uppercase text-white group-hover:underline">Login_Test</span>
                        </button>
                        <button onclick="runTest('/folders/content', 'GET_ROOT')" class="p-4 text-left rounded-xl glass-panel group">
                            <span class="mono text-[9px] text-[#e6195e] font-bold block mb-1">02_READ_ROOT</span>
                            <span class="text-xs font-bold uppercase text-white group-hover:underline">Resolve_Tree</span>
                        </button>
                        <button onclick="runTest('/folders/content?folderId=cmlw75s560001mfjnk36olrvw', 'GET_CHILD')" class="p-4 text-left rounded-xl glass-panel group">
                            <span class="mono text-[9px] text-[#e6195e] font-bold block mb-1">03_DRILL_NODE</span>
                            <span class="text-xs font-bold uppercase text-white group-hover:underline">Navigate_Folder</span>
                        </button>
                        <button onclick="runTest('/files', 'GET_FILE_LINK', 'cmlw7trh50005qzl39g410bat')" class="p-4 text-left rounded-xl glass-panel group border border-[#e6195e]/30">
                            <span class="mono text-[9px] text-[#e6195e] font-bold block mb-1">04_PULL_LINK</span>
                            <span class="text-xs font-bold uppercase text-white group-hover:underline">Generate_S3_Url</span>
                        </button>
                        <button onclick="logout()" class="mt-auto p-4 text-center rounded-xl border border-red-500 text-red-500 font-black uppercase text-xs hover:bg-red-500/10 transition-all">Terminate_Session</button>
                    </div>
                </div>
                <div id="explorer-view" class="mt-8 p-10 glass-panel rounded-2xl min-h-[160px] mono text-[11px] font-bold tracking-widest text-center text-white/40 flex items-center justify-center uppercase">
                    Explorer_View_Idle...
                </div>
            </div>

            <div id="docs-tab" class="tab-content hidden space-y-8">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div class="space-y-8">
                        <section class="glass-panel p-8 rounded-2xl">
                            <h2 class="text-2xl font-black uppercase tracking-tighter mb-4 text-[#e6195e]">01_Auth_Gateway</h2>
                            <p class="text-sm font-light-weight leading-relaxed mb-4">Stateless JWT sessions transmitted via <code>Set-Cookie</code>. Identity is initialized via POST /auth.</p>
                            <div class="bg-black/40 p-4 rounded-xl mono text-[10px] text-white/60">{ "email": "dev@example.com", "password": "••••••••" }</div>
                        </section>
                        <section class="glass-panel p-8 rounded-2xl">
                            <h2 class="text-2xl font-black uppercase tracking-tighter mb-4 text-[#e6195e]">02_Security_Flow</h2>
                            <p class="text-sm font-light-weight leading-relaxed">Middleware verifies JWT signature. The <code>ownerId</code> is extracted server-side, preventing IDOR attacks at the database root.</p>
                        </section>
                        <section class="glass-panel p-8 rounded-2xl">
                            <h2 class="text-2xl font-black uppercase tracking-tighter mb-4 text-[#e6195e]">03_Recursion_Logic</h2>
                            <p class="text-sm font-light-weight leading-relaxed mb-4">Self-referential models enable infinite nesting via the <code>parentId</code> field. Renaming metadata does not orphan physical blobs.</p>
                        </section>
                    </div>
                    <div class="space-y-8">
                        <section class="glass-panel p-8 rounded-2xl">
                            <h2 class="text-2xl font-black uppercase tracking-tighter mb-4 text-[#e6195e]">04_I/O_Endpoints</h2>
                            <div class="space-y-4">
                                <div class="border-b border-white/10 pb-2">
                                    <span class="mono text-[10px] text-[#e6195e] font-bold">GET /folders/content</span>
                                    <p class="text-xs font-light-weight mt-1">Recursive tree resolver.</p>
                                </div>
                                <div class="border-b border-white/10 pb-2">
                                    <span class="mono text-[10px] text-[#e6195e] font-bold">GET /files/:id/download-url</span>
                                    <p class="text-xs font-light-weight mt-1">Generates a time-limited S3 signed URL.</p>
                                </div>
                            </div>
                        </section>
                        <section class="glass-panel p-8 rounded-2xl">
                            <h2 class="text-2xl font-black uppercase tracking-tighter mb-4 text-[#e6195e]">05_UI_Mapping</h2>
                            <p class="text-sm font-light-weight leading-relaxed mb-4">Uses Event Delegation. Maps database UUIDs to <code>data-uuid</code> attributes for seamless interaction.</p>
                            <div class="bg-black/40 p-4 rounded-xl mono text-[10px] text-white/40 italic">&lt;button data-uuid="uuid_string"&gt; 📄 doc_ref.pdf &lt;/button&gt;</div>
                        </section>
                    </div>
                </div>
            </div>
        </main>

        <footer class="mt-12 text-[10px] mono font-black uppercase tracking-[0.4em] text-white/30 text-center flex flex-col items-center gap-2">
            <button onclick="location.reload()" id="reset-button" class="underline hover:text-white border border-red-500 p-2 text-red-500">Reset</button>
            <p>VAULTAGE CORE_FILE_SYSTEM_PROTOCOL // 2026</p>
        </footer>
    </div>

    <script>
      function switchTab(tabId) {
          const isDocs = tabId === 'docs-tab';
          document.querySelectorAll('.tab-content').forEach(t => t.classList.toggle('hidden', t.id !== tabId));
          const tBtn = document.getElementById('btn-terminal');
          const dBtn = document.getElementById('btn-docs');
          if (isDocs) {
              dBtn.className = "bg-[#ffffff] text-[#2d0a4e] px-10 py-3 rounded-full text-xs font-bold uppercase tracking-widest";
              tBtn.className = "bg-transparent text-[#ffffff] px-10 py-3 rounded-full text-xs font-bold uppercase tracking-widest font-light-weight hover:bg-white/5 transition-all";
          } else {
              tBtn.className = "bg-[#ffffff] text-[#2d0a4e] px-10 py-3 rounded-full text-xs font-bold uppercase tracking-widest";
              dBtn.className = "bg-transparent text-[#ffffff] px-10 py-3 rounded-full text-xs font-bold uppercase tracking-widest font-light-weight hover:bg-white/5 transition-all";
          }
      }
      ${indexScripts}
    </script>
</body>
</html>
`;
