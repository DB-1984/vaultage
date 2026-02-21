import { indexScripts } from "../utils/indexScripts.js";
export const statusTemplate = /*html*/ `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vaultage | API OS</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=JetBrains+Mono&display=swap" rel="stylesheet">
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
        <h1 class="text-5xl font-black tracking-tighter flex items-center">
        V<span class="inline-block transform scale-y-[-1] leading-none select-none">V</span>ultage
    </h1>            <div class="flex space-x-6 mt-4 md:mt-0">
                <button onclick="switchTab('terminal-tab')" id="btn-terminal" class="text-sm font-bold uppercase tracking-tight border-b-2 border-black pb-1">Console</button>
                <button onclick="switchTab('docs-tab')" id="btn-docs" class="text-sm font-bold uppercase tracking-tight border-b-2 border-black pb-1 opacity-40 hover:opacity-100 transition-all">Manual</button>
            </div>
        </header>

        <div id="terminal-tab" class="tab-content">
            <div id="terminal" class="bg-white h-full overflow-y-auto custom-scrollbar mb-16 p-6 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
                <pre id="output" class="mono text-md leading-relaxed whitespace-pre-wrap text-black/80">// Awaiting System Commands...</pre>
            </div>

            <div class="flex flex-col md:grid md:grid-cols-5 border-heavy border-black bg-black max-w-xs md:max-w-full">
            <button onclick="login()" class="bg-white hover:bg-black hover:text-white p-4 text-sm font-black uppercase border-b md:border-b-0 md:border-r border-black transition-all text-left md:text-center">
                01 Auth
            </button>
            
            <button onclick="runTest('/folders/content', 'GET_ROOT')" class="bg-white hover:bg-black hover:text-white p-4 text-sm font-black uppercase border-b md:border-b-0 md:border-r border-black transition-all text-left md:text-center">
                02 Root
            </button>
            
            <button onclick="runTest('/folders/content?folderId=cmlw75s560001mfjnk36olrvw', 'GET_CHILD')" class="bg-white hover:bg-black hover:text-white p-4 text-sm font-black uppercase border-b md:border-b-0 md:border-r border-black transition-all text-left md:text-center">
                03 Child
            </button>
            
            <button onclick="runTest('/files/cmlw7trh50005qzl39g410bat/download', 'GET_FILE')" class="bg-white hover:bg-black hover:text-white p-4 text-sm font-black uppercase border-b md:border-b-0 md:border-r border-black transition-all text-left md:text-center">
                04 Link
            </button>
            
            <button onclick="logout()" class="bg-white hover:bg-red-500 hover:text-white p-4 text-sm font-black uppercase transition-all text-left md:text-center">
                05 Exit
            </button>
        </div>
        </div>

        <div id="docs-tab" class="tab-content hidden">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-12">
                
                <div class="md:col-span-4 space-y-8">
                    <section>
                        <h2 class="text-md font-black uppercase tracking-tight mb-4 border-b border-black/10 pb-2">Core_Philosophy</h2>
                        <p class="text-sm leading-loose opacity-70">
                            Vaultage is a stateless cloud-storage API designed for high-security asset management. It abstracts complex <strong>S3 storage interactions</strong> into a familiar, hierarchical folder structure.
                        </p>
                    </section>
                    
                    <section>
                        <h2 class="text-md font-black uppercase tracking-tight mb-4 border-b border-black/10 pb-2">Tech_Stack</h2>
                        <ul class="text-xs mono space-y-2 opacity-70">
                            <li>- Node.js / Express</li>
                            <li>- Prisma (PostgreSQL)</li>
                            <li>- Supabase Storage (S3)</li>
                            <li>- JWT / HttpOnly Cookies</li>
                        </ul>
                    </section>

                    <section class="bg-black text-white p-4">
                        <h2 class="text-md font-black uppercase tracking-tight mb-2">Security_Protocol</h2>
                        <p class="text-xs leading-relaxed opacity-80">
                            Sessions are verified via <strong>Server-Side JWTs</strong>. Client-side JS cannot access the session token, effectively neutralizing XSS-based token theft.
                        </p>
                    </section>
                </div>

                <div class="md:col-span-8 space-y-12">
                    <section>
                        <div class="flex items-center justify-between border-b-2 border-black pb-2 mb-6">
                            <h3 class="mono text-sm font-800">POST /auth/login</h3>
                            <span class="text-[9px] font-800 px-2 py-0.5 border border-black uppercase">Auth Required: No</span>
                        </div>
                        <p class="text-xs opacity-60 mb-6">Validates credentials and issues a secure cookie. The system expects a 1:1 match against stored hashed passwords.</p>
                        <div class="bg-white border border-black p-4 mono text-[10px]">
                            <span class="text-black/30 block mb-2">// Request Schema</span>
                            {<br>
                            &nbsp;&nbsp;"email": "user@example.com",<br>
                            &nbsp;&nbsp;"password": "strong_password"<br>
                            }
                        </div>
                    </section>

                    <section>
                        <div class="flex items-center justify-between border-b-2 border-black pb-2 mb-6">
                            <h3 class="mono text-sm font-800">GET /folders/content</h3>
                            <span class="text-[9px] font-800 px-2 py-0.5 border border-black uppercase">Auth Required: Yes</span>
                        </div>
                        <p class="text-xs opacity-60 mb-4">Retrieves the directory listing. If <code class="mono bg-black/5 px-1 font-bold">folderId</code> is null, the API defaults to the user's root directory.</p>
                        <p class="text-[11px] font-bold opacity-80 underline">Query Parameters:</p>
                        <ul class="text-[11px] opacity-70 mt-2 space-y-1">
                            <li><strong class="mono">folderId</strong> (UUID): Targeted sub-directory.</li>
                        </ul>
                    </section>

                    <section>
                        <div class="flex items-center justify-between border-b-2 border-black pb-2 mb-6">
                            <h3 class="mono text-sm font-800">GET /files/:id/download</h3>
                            <span class="text-[9px] font-800 px-2 py-0.5 border border-black uppercase">Auth Required: Yes</span>
                        </div>
                        <p class="text-xs opacity-60 mb-4">Leverages S3 Pre-signed URLs. The API communicates with the storage bucket to generate a temporary link (TTL: 60s), ensuring file paths are never exposed publicly.</p>
                    </section>
                </div>
            </div>
        </div>

        <footer class="mt-20 flex justify-between items-center text-xs font-black uppercase tracking-tight">
            <p>Vaultage Storage System // Build_2026</p>
            <button onclick="location.reload()" class="hover:text-black underline">Reset_Terminal</button>
        </footer>
    </div>

    <script>
      function switchTab(tabId) {
          document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
          document.getElementById(tabId).classList.remove('hidden');
          
          const isDocs = tabId === 'docs-tab';
          const tBtn = document.getElementById('btn-terminal');
          const dBtn = document.getElementById('btn-docs');

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
