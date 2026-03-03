import { indexScripts } from "../utils/indexScripts.js";

export const statusTemplate = /*html*/ `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vaultage | Technical Specification</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;700;900&family=JetBrains+Mono&display=swap" rel="stylesheet">
    <style>
      body { font-family: 'Public Sans', sans-serif; background-color: #e5e5e1; color: #1a1a1a; }
      .mono { font-family: 'JetBrains Mono', monospace; }
      .tab-content.hidden { display: none; }
      .paper-texture { background-color: #f4f4f0; background-image: url("https://www.transparenttextures.com/patterns/natural-paper.png"); }
      .custom-scrollbar::-webkit-scrollbar { width: 4px; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; }
      .inverted-v {
        display: inline-flex;
        transform: rotate(180deg) translateY(0.6em);
        margin-left: -0.155em;
        margin-right: -0.05em;
      }
      pre, code { overflow-wrap: break-word; white-space: pre-wrap; }
    </style>
</head>
<body class="p-2 sm:p-4 md:p-10 min-h-screen flex justify-center items-start">
    <div class="max-w-6xl w-full paper-texture border-2 border-[#1a1a1a] p-4 py-6 sm:p-8 md:p-12 shadow-2xl relative overflow-x-hidden">
        
        <div class="flex flex-col md:flex-row justify-between items-start border-b-4 border-[#1a1a1a] pb-8 mb-10 gap-4">
            <div class="flex flex-col">
                <h1 class="text-4xl sm:text-5xl lg:text-7xl font-[900] tracking-tighter leading-none flex items-center select-none">
                    V<span class="inverted-v">V</span>ULTAGE
                </h1>
                <p class="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.4em] mt-3 text-[#b22222]">High-Integrity Recursive File Management // v1.0.0</p>
            </div>
            <div class="md:text-right mono text-[9px] sm:text-[10px] leading-tight opacity-60">
                DATE: 03_MAR_2026<br>
                REF: ARCH_DOC_V1<br>
                STATUS: ENCRYPTED
            </div>
        </div>

        <nav class="flex flex-wrap gap-1 mb-12">
            <button onclick="switchTab('terminal-tab')" id="btn-terminal" class="flex-1 sm:flex-none bg-[#1a1a1a] text-white px-4 sm:px-8 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest border-2 border-[#1a1a1a]">Console</button>
            <button onclick="switchTab('docs-tab')" id="btn-docs" class="flex-1 sm:flex-none bg-transparent text-[#1a1a1a] px-4 sm:px-8 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest border-2 border-[#1a1a1a] hover:bg-[#1a1a1a]/5">Manual</button>
        </nav>

        <div class="mb-16 grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-8" id="manifest">
            <div class="md:col-span-1">
                <h2 class="text-xs font-black uppercase border-b-2 border-[#1a1a1a] pb-1">System_Brief</h2>
            </div>
            <div class="md:col-span-3 text-sm leading-relaxed text-[#1a1a1a]/80">
                Vaultage is a recursive file system built on a <strong class="text-[#1a1a1a]">PostgreSQL core with Prisma ORM</strong>. It utilizes a self-referential <code class="mono font-bold">FolderTree</code> model and Row-Level Security (RLS) to ensure cryptographic-grade user isolation.
            </div>
        </div>

        <div id="terminal-tab" class="tab-content">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                <div class="lg:col-span-8">
                    <div id="terminal" class="bg-white border-2 border-[#1a1a1a] h-[300px] sm:h-[400px] overflow-y-auto custom-scrollbar p-4 sm:p-6 shadow-inner">
                        <pre id="output" class="mono text-[10px] sm:text-sm text-[#1a1a1a]/60 font-medium">// Ready for command input...</pre>
                    </div>
                </div>
                <div class="lg:col-span-4 flex flex-col gap-2">
                    <button onclick="login()" class="w-full bg-[#1a1a1a] text-white p-3 text-[10px] font-black uppercase border-2 border-[#1a1a1a] hover:bg-[#b22222]">01 Init_Auth</button>
                    <button onclick="runTest('/folders/content', 'GET_ROOT')" class="w-full bg-white text-[#1a1a1a] p-3 text-[10px] font-black uppercase border-2 border-[#1a1a1a]">02 Read_Root</button>
                    <button onclick="runTest('/folders/content?folderId=cmlw75s560001mfjnk36olrvw', 'GET_CHILD')" class="w-full bg-white text-[#1a1a1a] p-3 text-[10px] font-black uppercase border-2 border-[#1a1a1a]">03 Drill_Node</button>
                    <button onclick="runTest('/files/cmlw7trh50005qzl39g410bat/download-url', 'GET_FILE')" class="w-full bg-white text-[#1a1a1a] p-3 text-[10px] font-black uppercase border-2 border-[#1a1a1a]">04 Pull_Link</button>
                    <button onclick="logout()" class="w-full bg-transparent text-[#b22222] p-3 text-[10px] font-black uppercase border-2 border-[#b22222] mt-4 lg:mt-auto">05 Terminate</button>
                </div>
            </div>
            <div id="explorer-view" class="mt-10 p-4 border-2 border-[#1a1a1a] bg-white shadow-xl min-h-[160px]">...</div>
        </div>

        <div id="docs-tab" class="tab-content hidden">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 border-t-4 border-[#1a1a1a] pt-12">
                
                <div class="space-y-12">
                    <section>
                        <h3 class="text-xl sm:text-2xl font-black uppercase tracking-tighter mb-4 flex items-baseline gap-2">
                            <span class="text-xs sm:text-sm font-normal mono opacity-30">01.</span> Auth_Gateway
                        </h3>
                        <p class="text-xs/6 mb-4 opacity-80">**POST /auth/[register|login]** initializes identity. Login transmits a stateless JWT via <code>Set-Cookie</code>.</p>
                        <div class="bg-white border border-[#1a1a1a] p-3 mono text-[9px] mb-4">
                            <span class="opacity-30 block mb-1 uppercase font-black">// Login_Schema</span>
                            { "email": "dev@example.com", "password": "••••••••" }
                        </div>
                        <div class="p-4 bg-[#b22222]/5 border-l-4 border-[#b22222] text-[10px] sm:text-[11px] leading-relaxed italic">
                            <strong>Protocol Note:</strong> Sessions utilize **Server-Side JWTs** in HttpOnly cookies to neutralize XSS vectors.
                        </div>
                    </section>

                    <section>
                        <h3 class="text-xl sm:text-2xl font-black uppercase tracking-tighter mb-4 flex items-baseline gap-2">
                            <span class="text-xs sm:text-sm font-normal mono opacity-30">02.</span> Security_Protocol
                        </h3>
                        <p class="text-xs/7 opacity-80 bg-white border border-[#1a1a1a] p-4">
                            All requests are gated by a custom middleware verifying the JWT signature. The <code>ownerId</code> is extracted server-side, preventing IDOR (Insecure Direct Object Reference) attacks.
                        </p>
                    </section>

                    <section>
                        <h3 class="text-xl sm:text-2xl font-black uppercase tracking-tighter mb-4 flex items-baseline gap-2">
                            <span class="text-xs sm:text-sm font-normal mono opacity-30">03.</span> Data_Fidelity
                        </h3>
                        <div class="bg-[#1a1a1a] text-white p-5 shadow-[6px_6px_0px_0px_rgba(178,34,34,1)]">
                            <span class="block font-black uppercase text-[10px] opacity-40 mb-1 tracking-[0.2em]">Storage_Key pattern</span>
                            <code class="mono text-[#b22222] font-bold text-xs bg-white px-1">/u102/b8_2f9a.bin</code>
                            <p class="mt-4 text-[11px] leading-relaxed opacity-70">Immutable UUID pointers to S3. Renaming metadata does not orphan physical blobs.</p>
                        </div>
                    </section>
                </div>

                <div class="space-y-12">
                    <section>
                        <h3 class="text-xl sm:text-2xl font-black uppercase tracking-tighter mb-4 flex items-baseline gap-2">
                            <span class="text-xs sm:text-sm font-normal mono opacity-30">04.</span> I/O_Endpoints
                        </h3>
                        <div class="space-y-6">
                            <div class="border-b border-[#1a1a1a]/20 pb-4">
                                <span class="text-[10px] font-black uppercase text-[#b22222]">GET /folders/content</span>
                                <p class="text-xs opacity-70 italic">Recursive tree resolver. ?folderId for children.</p>
                            </div>
                            <div class="border-b border-[#1a1a1a]/20 pb-4">
                                <span class="text-[10px] font-black uppercase text-[#b22222]">POST /folders</span>
                                <div class="bg-white border border-[#1a1a1a] p-3 mono text-[9px] mt-1">
                                    { "name": "Assets_2026", "parentId": "uuid" }
                                </div>
                            </div>
                            <div class="pb-4">
                                <span class="text-[10px] font-black uppercase text-[#b22222]">POST /files</span>
                                <div class="bg-white border border-[#1a1a1a] p-3 mono text-[9px] mt-2">
                                    <span class="opacity-30 block mb-1 uppercase font-black">// Upload_Protocol_Schema</span>
                                    { "fileName": "sys.dwg", "fileSize": 5242880, "folderId": "uuid_789" }
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 class="text-xl sm:text-2xl font-black uppercase tracking-tighter mb-4 flex items-baseline gap-2">
                            <span class="text-xs sm:text-sm font-normal mono opacity-30">05.</span> UI_Mapping
                        </h3>
                        <p class="text-xs/6 opacity-80 mb-4">Uses **Event Delegation**. Maps UUIDs to <code>data-uuid</code> attributes.</p>
                        <div class="bg-white border-2 border-double border-[#1a1a1a] p-4 mono text-[10px]">
                            &lt;button class="file-item" <strong>data-uuid="cmlw7trh50005qzl39g410bat"</strong>&gt;<br>
                            &nbsp;&nbsp;📄 system_schematic.pdf<br>
                            &lt;/button&gt;
                        </div>
                    </section>
                </div>
            </div>
        </div>

        <footer class="mt-12 border-t-4 border-[#1a1a1a] pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[9px] font-black uppercase tracking-[0.4em]">
            <p>VAULTAGE STORAGE PROTOCOL // 2026</p>
            <button onclick="location.reload()" id="reset-button" class="underline hover:text-[#b22222]">Reset_System</button>
        </footer>
    </div>

    <script>
      function switchTab(tabId) {
          const isDocs = tabId === 'docs-tab';
          document.querySelectorAll('.tab-content').forEach(t => t.classList.toggle('hidden', t.id !== tabId));
          const tBtn = document.getElementById('btn-terminal');
          const dBtn = document.getElementById('btn-docs');
          if (isDocs) {
              dBtn.classList.replace('bg-transparent', 'bg-[#1a1a1a]'); dBtn.classList.replace('text-[#1a1a1a]', 'text-white');
              tBtn.classList.replace('bg-[#1a1a1a]', 'bg-transparent'); tBtn.classList.replace('text-white', 'text-[#1a1a1a]');
          } else {
              tBtn.classList.replace('bg-transparent', 'bg-[#1a1a1a]'); tBtn.classList.replace('text-[#1a1a1a]', 'text-white');
              dBtn.classList.replace('bg-[#1a1a1a]', 'bg-transparent'); dBtn.classList.replace('text-white', 'text-[#1a1a1a]');
          }
          document.getElementById('reset-button').classList.toggle('invisible', isDocs);
      }
      ${indexScripts}
    </script>
</body>
</html>
`;