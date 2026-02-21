import { indexScripts } from "../utils/indexScripts.js";

export const statusTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vaultage OS | Interactive API</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      .custom-scrollbar::-webkit-scrollbar { width: 4px; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      .tab-content.hidden { display: none; }
    </style>
</head>
<body class="bg-slate-900 text-slate-200 font-mono p-4 flex flex-col items-center justify-center min-h-screen">
    <div class="max-w-2xl w-full p-6 border border-slate-700 rounded-lg bg-slate-800 shadow-2xl">
        
        <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-3">
                <div class="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                <h1 class="text-lg font-bold tracking-tight text-white text-sm md:text-base">VAULTAGE_API_OS v1.0</h1>
            </div>
            <span class="text-[10px] bg-slate-700 px-2 py-1 rounded text-slate-300">READ_ONLY_MODE</span>
        </div>

        <div class="flex space-x-4 mb-4 border-b border-slate-700">
            <button onclick="switchTab('terminal-tab')" id="btn-terminal" class="pb-2 text-[10px] font-bold uppercase tracking-widest border-b-2 border-green-500 text-white transition-all">Interactive Terminal</button>
            <button onclick="switchTab('docs-tab')" id="btn-docs" class="pb-2 text-[10px] font-bold uppercase tracking-widest border-b-2 border-transparent text-slate-500 hover:text-slate-300 transition-all">API Documentation</button>
        </div>
        
        <div id="terminal-tab" class="tab-content">
            <div id="terminal" class="bg-black rounded p-4 h-64 overflow-y-auto custom-scrollbar mb-6 text-xs md:text-sm text-green-500 border border-slate-700">
                <p class="text-slate-500 mb-2">// System initialized. Awaiting command...</p>
                <pre id="output" class="whitespace-pre-wrap"></pre>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <button onclick="login()" class="bg-green-900/40 hover:bg-green-800/60 p-2 rounded text-[11px] uppercase border border-green-700 transition font-bold text-green-400">1. System Auth</button>
                <button onclick="runTest('/folders/content', '2. GET_ROOT')" class="bg-slate-700 hover:bg-slate-600 p-2 rounded text-[11px] uppercase border border-slate-600 transition">View Root</button>
                <button onclick="runTest('/folders/content?folderId=cmlw75s560001mfjnk36olrvw', '3. GET_NESTED')" class="bg-slate-700 hover:bg-slate-600 p-2 rounded text-[11px] uppercase border border-slate-600 transition text-slate-400 italic">View Folder</button>
                <button onclick="runTest('/files/cmlw7trh50005qzl39g410bat/download', '4. GET_DL_LINK')" class="bg-blue-900/40 hover:bg-blue-800/60 p-2 rounded text-[11px] uppercase border border-blue-700 transition">Get Download URL</button>
                <button onclick="logout()" class="bg-red-900/40 hover:bg-red-800/60 p-2 rounded text-[11px] uppercase border border-red-700 transition text-red-400">5. Logout</button>
            </div>
        </div>

        <div id="docs-tab" class="tab-content hidden h-[450px] overflow-y-auto custom-scrollbar pr-2">
            <div class="space-y-8">
                
                <section>
                    <h2 class="text-white text-xs font-bold uppercase tracking-tighter mb-2 italic">// System_Concepts</h2>
                    <p class="text-[11px] text-slate-400 leading-relaxed">
                        Vaultage is a secure cloud-storage API built with <span class="text-slate-200">Express.js</span> and <span class="text-slate-200">Prisma</span>. It implements a hierarchical file system architecture where every asset is linked to a user-owned folder. Authentication is handled via <span class="text-slate-200">JWT</span> stored in <span class="text-slate-200">HttpOnly cookies</span> to mitigate XSS risks.
                    </p>
                </section>

                <hr class="border-slate-700/50">

                <section>
                    <h3 class="text-amber-500 text-[10px] font-bold uppercase mb-2 flex items-center">
                        <span class="bg-amber-500/10 px-2 py-0.5 rounded mr-2 border border-amber-500/20">POST</span> /auth/login
                    </h3>
                    <p class="text-[11px] text-slate-400 mb-2">Validates credentials and initializes the secure session. In this demo, the 'System Auth' button automates this for the test user.</p>
                    <div class="bg-black/40 rounded p-2 text-[10px] border border-slate-700/50 mb-2">
                        <code class="text-blue-400">{ "email": "test@example.com", "password": "..." }</code>
                    </div>
                </section>

                <section>
                    <h3 class="text-green-500 text-[10px] font-bold uppercase mb-2 flex items-center">
                        <span class="bg-green-500/10 px-2 py-0.5 rounded mr-2 border border-green-500/20">GET</span> /folders/content
                    </h3>
                    <p class="text-[11px] text-slate-400 mb-2">Fetches the directory tree. If no <code class="text-slate-300">folderId</code> is provided, the root level is returned. Assets include metadata and file IDs.</p>
                </section>

                <section>
                    <h3 class="text-blue-500 text-[10px] font-bold uppercase mb-2 flex items-center">
                        <span class="bg-blue-500/10 px-2 py-0.5 rounded mr-2 border border-blue-500/20">GET</span> /files/:id/download
                    </h3>
                    <p class="text-[11px] text-slate-400 mb-2">Integrates with <span class="text-slate-200">Supabase Storage</span>. Instead of streaming raw bytes, this endpoint returns a pre-signed URL with a 60-second expiry for secure, performant downloads.</p>
                </section>

                <div class="p-3 bg-slate-900/80 rounded border border-slate-700 text-[10px] text-slate-500">
                    <span class="text-slate-300 font-bold block mb-1">SECURITY NOTE:</span>
                    CORS is restricted to same-origin for this dashboard. File access is protected by Row Level Security (RLS) in the database.
                </div>
            </div>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-700 flex justify-between items-center">
            <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">test@example.com logged_in</p>
            <button onclick="location.reload()" class="text-[10px] text-slate-400 hover:text-white underline">Clear Terminal</button>
        </div>
    </div>

    <script>
      function switchTab(tabId) {
          document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
          document.getElementById(tabId).classList.remove('hidden');
          
          const isDocs = tabId === 'docs-tab';
          document.getElementById('btn-terminal').className = isDocs 
              ? "pb-2 text-[10px] font-bold uppercase tracking-widest border-b-2 border-transparent text-slate-500 transition-all" 
              : "pb-2 text-[10px] font-bold uppercase tracking-widest border-b-2 border-green-500 text-white transition-all";
          document.getElementById('btn-docs').className = isDocs 
              ? "pb-2 text-[10px] font-bold uppercase tracking-widest border-b-2 border-green-500 text-white transition-all" 
              : "pb-2 text-[10px] font-bold uppercase tracking-widest border-b-2 border-transparent text-slate-500 transition-all";
      }

      ${indexScripts}
    </script>
</body>
</html>
`;
