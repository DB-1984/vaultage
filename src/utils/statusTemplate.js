import { indexScripts } from "../utils/indexScripts.js";
export const statusTemplate = /*html*/ `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vaultage | API OS</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&family=JetBrains+Mono&display=swap" rel="stylesheet">
    <style>
      body { font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
      .mono { font-family: 'JetBrains Mono', monospace; }
      .custom-scrollbar::-webkit-scrollbar { width: 3px; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: #000; }
      .tab-content.hidden { display: none; }
      .border-heavy { border-width: 2px; }
    </style>
</head>
<body class="bg-[#F5F5F5] text-black p-6 md:p-12 flex justify-center items-center min-h-screen">
    <div class="max-w-4xl w-full">
        
        <header class="flex flex-col md:flex-row justify-between items-baseline mb-12 border-b-2 border-black pb-4">
            <h1 class="text-5xl font-black tracking-tight flex items-center">
                V<span class="-ml-2.5 -mr-1 inline-block transform scale-y-[-1] leading-none select-none">V</span>ultage
            </h1>            
            <div class="flex space-x-6 mt-4 md:mt-0">
                <button onclick="switchTab('terminal-tab')" id="btn-terminal" class="text-sm font-bold uppercase tracking-tight border-b-2 border-black pb-1 transition-all">Console</button>
                <button onclick="switchTab('docs-tab')" id="btn-docs" class="text-sm font-bold uppercase tracking-tight border-b-2 border-transparent pb-1 opacity-40 hover:opacity-100 transition-all">Manual</button>
            </div>
        </header>

        <div id="terminal-tab" class="tab-content">
            <div id="terminal" class="bg-white h-full overflow-y-auto custom-scrollbar mb-16 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
                <pre id="output" class="mono text-xs md:text-sm leading-relaxed whitespace-pre-wrap text-black/80">// Awaiting System Commands...</pre>
            </div>

            <div id="explorer-view" class="md:grid grid-cols-4 gap-4 mb-16 p-6 border-2 border-black bg-white min-h-[140px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            </div>
        

            <div class="w-full flex justify-center p-4"> 
    
            <div class="flex flex-col md:grid md:grid-cols-5 border-heavy border-black bg-black w-full max-w-xs md:max-w-4xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                
                <button onclick="login()" class="bg-white hover:bg-black hover:text-white p-4 text-sm font-black uppercase border-b md:border-b-0 md:border-r border-black transition-all text-left md:text-center">01 Auth</button>
                
                <button onclick="runTest('/folders/content', 'GET_ROOT')" class="bg-white hover:bg-black hover:text-white p-4 text-sm font-black uppercase border-b md:border-b-0 md:border-r border-black transition-all text-left md:text-center">02 Root</button>
                
                <button onclick="runTest('/folders/content?folderId=cmlw75s560001mfjnk36olrvw', 'GET_CHILD')" class="bg-white hover:bg-black hover:text-white p-4 text-sm font-black uppercase border-b md:border-b-0 md:border-r border-black transition-all text-left md:text-center">03 Child</button>
                
                <button onclick="runTest('/files/cmlw7trh50005qzl39g410bat/download-url', 'GET_FILE')" class="bg-white hover:bg-black hover:text-white p-4 text-sm font-black uppercase border-b md:border-b-0 md:border-r border-black transition-all text-left md:text-center">04 Link</button>
                
                <button onclick="logout()" class="bg-white hover:bg-red-500 hover:text-white p-4 text-sm font-black uppercase transition-all text-left md:text-center">05 Exit</button>
                
            </div>
        </div>

        </div>

        <div id="docs-tab" class="tab-content hidden">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-12">
                
                <div class="md:col-span-6 space-y-8">
                <section>
                <div class="flex items-center justify-between border-b-2 border-black pb-2 mb-6">
                    <h3 class="text-xl font-black uppercase tracking-tight mb-2 border-black/10">POST /auth/[register|login]</h3>
                    <span class="text-[9px] font-800 px-2 mb-2 py-0.5 border border-black uppercase">Public_Route</span>
                </div>
                <p class="text-xs/7 font-light tracking-tight mb-6">
                    Entry point for the system. **Register** creates a new user record with a Bcrypt-hashed password. **Login** validates credentials and initializes a stateless session via a signed JWT.
                </p>

                

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-white border border-black p-4 mono text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <span class="text-black/40 block mb-2 uppercase font-black text-xs">// Register_Schema</span>
                        {<br>
                        &nbsp;&nbsp;"email": "dev@example.com",<br>
                        &nbsp;&nbsp;"password": "••••••••",<br>
                        }
                    </div>
                    <div class="bg-white border border-black p-4 mono text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <span class="text-black/40 block mb-2 uppercase font-black text-xs">// Login_Schema</span>
                        {<br>
                        &nbsp;&nbsp;"email": "dev@example.com",<br>
                        &nbsp;&nbsp;"password": "••••••••"<br>
                        }
                    </div>
                </div>

                <div class="mt-6 p-4 bg-black/5 border-l-4 border-black tracking-tight text-xs/7">
                    <strong>Protocol:</strong> Upon successful validation, the server sends a <code class="mono font-bold text-xs">Set-Cookie</code> header. The client is not required to store tokens in local storage, simplifying the frontend state and hardening the security surface.
                </div>
            </section>
                    <section>
                        <h2 class="text-xl font-black uppercase mb-2 tracking-tight">Data_Fidelity</h2>
                        <p class="text-xs/7 mb-4">
                            To ensure system integrity, Vaultage separates <strong>Identity</strong> from <strong>Storage</strong>. We never use filenames as primary keys.
                        </p>
                        <div class="bg-black text-white p-4 text-xs space-y-4">
                            <div>
                                <span class="block font-black uppercase text-sm/6 mb-1">Storage_Key Pattern</span>
                                <code class="mono text-green-400">/u102/b8_2f9a.bin</code>
                            </div>
                            <p class="leading-relaxed">
                                The <code class="mono text-white bg-white/20 px-1 italic font-bold">storageKey</code> is an immutable UUID pointer to S3. Renaming a file in the DB updates the metadata alias without risking orphaned blobs or naming collisions.
                            </p>
                        </div>
                    </section>
                    
                    <section>
                        <h2 class="text-xl font-black uppercase tracking-tight mb-4 border-black/10 pb-2">Security_Protocol</h2>
                        <p class="text-xs/7 leading-relaxed bg-white border border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            Sessions are verified via <strong>Server-Side JWTs</strong>. Tokens are stored in HttpOnly cookies, rendering them invisible to client-side <code>document.cookie</code> calls and neutralizing XSS.
                        </p>
                    </section>
                </div>

                <div class="md:col-span-6 space-y-12">
                    <section>
                        <div class="flex items-center justify-between border-b-2 border-black pb-2 mb-6">
                            <h3 class="text-xl font-black uppercase tracking-tight border-black/10 pb-2">GET /folders/content</h3>
                            <span class="text-[9px] font-800 px-2 py-0.5 border mb-2 border-black uppercase">Auth Required</span>
                        </div>
                        <p class="text-xs/7 mb-4">Returns recursive file/folder tree. Pass <code class="mono font-bold italic">?folderId</code> for sub-directories.</p>
                    </section>

                    <section>
                        <div class="flex items-center justify-between border-b-2 border-black pb-2 mb-6">
                            <h3 class="text-xl font-black uppercase tracking-tight mb-2 border-black/10">POST /folders</h3>
                            <span class="text-[9px] font-800 px-2 py-0.5 border border-black uppercase bg-black text-white mb-2">Write_Method</span>
                        </div>
                        <p class="text-xs/7 mb-6">Required for defining new directory containers or nested children.</p>
                        <div class="bg-white border border-black p-4 mono text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <span class="text-black/30 block mb-2">// Request Body</span>
                            {<br>
                            &nbsp;&nbsp;"name": "Client_Assets_2026",<br>
                            &nbsp;&nbsp;"parentId": "uuid_string" <span class="text-black/30">// Optional for nesting</span><br>
                            }
                        </div>
                    </section>

                    <section>
                        <div class="flex items-center justify-between border-b-2 border-black pb-2 mb-6">
                            <h3 class="text-xl font-black uppercase tracking-tight mb-2 border-black/10">POST /files</h3>
                            <span class="text-[9px] font-800 px-2 py-0.5 border border-black uppercase bg-black text-white mb-2">Write_Method</span>
                        </div>
                        <p class="text-xs/7 mb-6">Stateless pattern: Generates a signed S3 upload link (TTL: 60s) for direct-to-bucket transmission.</p>
                        <div class="bg-white border border-black p-4 mono text-xs/4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <span class="text-black block mb-2">// Upload Protocol Schema</span>
                            {<br>
                            &nbsp;&nbsp;"fileName": "system_schematic.dwg",<br>
                            &nbsp;&nbsp;"fileSize": 5242880,<br>
                            &nbsp;&nbsp;"mimeType": "application/acad",<br>
                            &nbsp;&nbsp;"folderId": "uuid_789"<br>
                            }
                        </div>
                    </section>
                    <section>
                    <div class="flex items-center justify-between border-b-2 border-black pb-2 mb-6">
                        <h3 class="text-xl font-black tracking-tight uppercase">Declarative_UI_Mapping</h3>
                        <span class="text-[9px] font-800 px-2 py-0.5 border border-black uppercase bg-black text-white italic">Frontend_Strategy</span>
                    </div>
                    <p class="text-xs/7 mb-6">
                        The UI utilizes **Event Delegation**. By mapping database UUIDs to <code class="mono font-bold text-black text-[10px]">data-uuid</code> attributes, a single controller can resolve infinite resource paths without unique logic for every element.
                    </p>

                    <div class="bg-white border-2 border-black p-4 mono text-xs shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                        <span class="text-black/30 block mb-2">// Rendered HTML Example</span>
                        &lt;button <br>
                        &nbsp;&nbsp;class="file-item"<br>
                        &nbsp;&nbsp;<strong>data-uuid="cmlw7trh50005qzl39g410bat"</strong><br>
                        &nbsp;&nbsp;onclick="runTest('/files', 'GET_LINK', this.dataset.uuid)"&gt;<br>
                        &nbsp;&nbsp;📄 system_schematic.pdf<br>
                        &lt;/button&gt;
                    </div>
                </section>
                </div>
            </div>
        </div>

        <footer class="mt-20 flex justify-between items-center text-xs font-semibold uppercase tracking-tighter">
            <p>Vaultage Storage System // Build_2026</p>
            <button onclick="location.reload()" id="reset-button" class="border-2 border-black p-1 hover:bg-red-500 hover:text-white ">Reset_Terminal</button>
        </footer>
    </div>

    <script>
      function switchTab(tabId) {
    // 1. Toggle visibility of the content areas
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
    document.getElementById(tabId).classList.remove('hidden');
    
    // 2. Define our state
    const isDocs = tabId === 'docs-tab';
    const resetBtn = document.getElementById('reset-button');
    const tBtn = document.getElementById('btn-terminal');
    const dBtn = document.getElementById('btn-docs');

    // 3. Handle the Reset Button visibility
    // If isDocs is true, 'hidden' is added. If false, it's removed.
    resetBtn.classList.toggle('hidden', isDocs);

    // 4. Handle Tab Button Styling
    tBtn.style.borderBottomColor = isDocs ? 'transparent' : 'black';
    tBtn.style.opacity = isDocs ? '0.4' : '1';
    dBtn.style.borderBottomColor = isDocs ? 'black' : 'transparent';
    dBtn.style.opacity = isDocs ? '1' : '0.4';
}

      ${indexScripts}
    </script>
</body>
</html>
`;
