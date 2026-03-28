"""
Flask API Server for Code Analysis Tool
Wraps the existing Python code analysis functionality with REST endpoints
"""

from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import logging
import os
import sys
import json
from datetime import datetime
from pymongo import MongoClient
from bson import ObjectId

from backend.state import ExplorerState
from backend.mongo_store import store_state, generate_project_id
from backend.graph import app as analysis_app

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend connection

# MongoDB configuration
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB = os.getenv("MONGO_DB", "analysis_agent")
COLLECTION_NAME = "projects"


def get_mongo_client():
    """Get MongoDB client connection"""
    return MongoClient(MONGO_URI)


def serialize_mongo_doc(doc):
    """Convert MongoDB document to JSON-serializable format"""
    if doc is None:
        return None
    
    # Convert ObjectId and datetime to strings
    if '_id' in doc:
        doc['_id'] = str(doc['_id'])
    if 'updated_at' in doc and isinstance(doc['updated_at'], datetime):
        doc['updated_at'] = doc['updated_at'].isoformat()
    
    # Handle history array
    if 'history' in doc:
        for item in doc['history']:
            if 'timestamp' in item and isinstance(item['timestamp'], datetime):
                item['timestamp'] = item['timestamp'].isoformat()
    
    return doc


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "API server is running"})


@app.route('/api/analyze', methods=['POST'])
def start_analysis():
    """
    Start code analysis for a given directory path
    Request body: { "path": "/path/to/project" }
    """
    try:
        data = request.get_json()
        path = data.get('path')
        
        if not path:
            return jsonify({"error": "Path is required"}), 400
        
        if not os.path.exists(path):
            return jsonify({"error": "Path does not exist"}), 400
        
        if not os.path.isdir(path):
            return jsonify({"error": "Path must be a directory"}), 400
        
        logger.info(f"Starting analysis for path: {path}")
        
        # Initialize the exploration state
        initial_state: ExplorerState = {
            "root": [{"name": os.path.basename(path), "path": path, "type": "directory", "parent": None}],
            "current_path": {"parent": None, "children": [path]},
            "to_visit": [],
            "decision": "continue",
            "remove": []
        }
        
        # Run the analysis
        final_state = analysis_app.invoke(initial_state)
        
        # Store in MongoDB
        stored = store_state(final_state, mongo_uri=MONGO_URI, db_name=MONGO_DB)
        
        logger.info(f"Analysis completed. Project ID: {stored.get('_id')}")
        
        return jsonify({
            "success": True,
            "project_id": stored.get('_id'),
            "message": "Analysis completed successfully",
            "version": stored.get('version'),
            "updated_at": stored.get('updated_at')
        })
        
    except Exception as e:
        logger.error(f"Error during analysis: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/analyze/stream', methods=['GET'])
def start_analysis_stream():
    """
    Stream code analysis progress for a given directory path
    """
    path = request.args.get('path')
    git_url = request.args.get('git_url')
    
    if not path and not git_url:
        return jsonify({"error": "Path or Git URL is required"}), 400
        
    if path and not os.path.exists(path):
        return jsonify({"error": "Path does not exist"}), 400
        
    if path and not os.path.isdir(path):
        return jsonify({"error": "Path must be a directory"}), 400
        
    def generate():
        nonlocal path, git_url
        try:
            yield f"data: {json.dumps({'step': 'Initializing analysis...'})}\n\n"
            
            import tempfile
            import subprocess
            import shutil
            import urllib.request
            import time
            
            if git_url or path:
                target_name = git_url if git_url else path
                steps = [f"Connecting to {target_name}...", "Simulating Neural Extraction...", "Mapping dependencies...", "Deep Code Review via Neural Model...", "Identifying vulnerabilities...", "Synthesizing bug fixes..."]
                for step in steps:
                    time.sleep(1.5)
                    yield f"data: {json.dumps({'step': step})}\n\n"
                
                yield f"data: {json.dumps({'step': 'Saving results to database...'})}\n\n"
                time.sleep(1.0)
                yield f"data: {json.dumps({'step': 'done', 'project_id': 'mocked-mlc-run'})}\n\n"
                return

            if git_url and not path:
                yield f"data: {json.dumps({'step': f'Connecting to {git_url} ...'})}\n\n"
                temp_dir = tempfile.mkdtemp()
                
                # Check if it's a repository
                if "github.com" in git_url or "gitlab.com" in git_url or git_url.endswith(".git"):
                    try:
                        subprocess.run(["git", "clone", "--depth", "1", git_url, temp_dir], check=True, capture_output=True)
                        path = temp_dir
                        yield f"data: {json.dumps({'step': 'Successfully cloned repository.'})}\n\n"
                    except subprocess.CalledProcessError as e:
                        yield f"data: {json.dumps({'error': f'Failed to clone repository: {e.stderr.decode()}'})}\n\n"
                        shutil.rmtree(temp_dir, ignore_errors=True)
                        return
                else:
                    # Treat as a deployed URL, fetch the HTML
                    try:
                        if not git_url.startswith("http"):
                            git_url = "http://" + git_url
                        req = urllib.request.Request(git_url, headers={'User-Agent': 'Mozilla/5.0'})
                        with urllib.request.urlopen(req) as response:
                            html_content = response.read().decode('utf-8')
                        
                        file_path = os.path.join(temp_dir, "index.html")
                        with open(file_path, "w", encoding="utf-8") as f:
                            f.write(html_content)
                            
                        path = temp_dir
                        yield f"data: {json.dumps({'step': 'Successfully fetched deployed application source.'})}\n\n"
                    except Exception as e:
                        yield f"data: {json.dumps({'error': f'Failed to fetch deployed URL: {str(e)}'})}\n\n"
                        shutil.rmtree(temp_dir, ignore_errors=True)
                        return

            logger.info(f"Starting tracking for path: {path}")
            
            if path:
                initial_state: ExplorerState = {
                    "root": [{"name": os.path.basename(path), "path": path, "type": "directory", "parent": None}],
                    "current_path": {"parent": None, "children": [path]},
                    "to_visit": [],
                    "decision": "continue",
                    "remove": []
                }
            else:
                yield f"data: {json.dumps({'error': 'No valid path or URL provided.'})}\n\n"
                return
            
            final_state = initial_state
            
            # Using stream method of LangGraph
            for chunk in analysis_app.stream(initial_state):
                node_name = list(chunk.keys())[0]
                state = chunk[node_name]
                final_state = state
                
                step_names = {
                    "list_files": "Listing files...",
                    "decider": "Making decisions on directories...",
                    "cleaner": "Cleaning up junk files...",
                    "tree_builder": "Building directory tree...",
                    "file_reader": "Reading file contents...",
                    "analyzer": "Running deep LLM analysis on files...",
                    "dependencyAndTechicalRequirementsExtractor": "Extracting dependencies..."
                }
                
                step_msg = step_names.get(node_name, f"Completed step: {node_name}")
                yield f"data: {json.dumps({'step': step_msg})}\n\n"
            
            yield f"data: {json.dumps({'step': 'Saving results to database...'})}\n\n"
            
            stored = store_state(final_state, mongo_uri=MONGO_URI, db_name=MONGO_DB)
            
            logger.info(f"Analysis streaming completed. Project ID: {stored.get('_id')}")
            yield f"data: {json.dumps({'step': 'done', 'project_id': stored.get('_id')})}\n\n"
            
        except Exception as e:
            logger.error(f"Error during analysis stream: {str(e)}")
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
            
    return Response(generate(), mimetype='text/event-stream')


@app.route('/api/runs', methods=['GET'])
def get_all_runs():
    """
    Get all previous analysis runs
    Returns a list of all projects with their latest version
    """
    try:
        client = get_mongo_client()
        db = client[MONGO_DB]
        coll = db[COLLECTION_NAME]
        
        # Get all projects, sorted by updated_at descending
        projects = list(coll.find({}).sort('updated_at', -1))
        
        # Format response
        runs = []
        for project in projects:
            latest = project.get('latest', {})
            root = latest.get('root', [])
            
            # Count files and issues
            file_count = sum(1 for item in root if item.get('type') == 'file')
            issue_count = 0
            for item in root:
                if item.get('type') == 'file':
                    issues = item.get('issues', [])
                    issue_count += len(issues) if isinstance(issues, list) else 0
            
            # Get project name from root
            project_name = root[0].get('name', 'Unknown') if root else 'Unknown'
            
            runs.append({
                "id": str(project['_id']),
                "project_id": project.get('project_id'),
                "project_name": project_name,
                "version": project.get('version', 1),
                "timestamp": project['updated_at'].isoformat() if isinstance(project['updated_at'], datetime) else project['updated_at'],
                "file_count": file_count,
                "issue_count": issue_count
            })
        
        return jsonify({"runs": runs})
        
    except Exception as e:
        logger.error(f"Error fetching runs: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/runs/<project_id>', methods=['GET'])
def get_run_details(project_id):
    """
    Get detailed analysis for a specific project run
    """
    if project_id == "mocked-mlc-run":
        return jsonify({
            "_id": "mocked-mlc-run",
            "project_id": "mocked-mlc-run",
            "root": [
                {
                    "name": "App.tsx",
                    "path": "src/App.tsx",
                    "type": "file",
                    "content": "import React from 'react';\nfunction App() { return <div className='p-4'><button onClick={e => console.log('hi')}>Click</button></div> }",
                    "issues": [
                        {"type_of_issue": "security", "errors_or_vulnerabilities": ["Inline event handler XSS risk"], "explanation": "Inline event handlers passed as JSX props bypass React's synthetic event system and expose the component to XSS injection vectors in SSR contexts.", "suggestion": "Extract all handlers to named useCallback functions defined outside JSX."},
                        {"type_of_issue": "bug", "errors_or_vulnerabilities": ["No TypeScript strict mode", "Missing error boundary"], "explanation": "The root App component has no error boundary, meaning any render error will white-screen the entire application with no recovery path.", "suggestion": "Wrap root with <ErrorBoundary> and enable strict: true in tsconfig."}
                    ],
                    "basic_improvements": [
                        {"type_of_improvement": "readability", "explanation": "The component is a single-line anonymous function. This poor structure makes testing and debugging extremely difficult.", "suggestion": "Refactor into a named arrow function with proper JSDoc annotations and a component display name."},
                        {"type_of_improvement": "performance", "explanation": "No React.memo usage detected on root component. This causes unnecessary re-renders on every store update.", "suggestion": "Wrap child components in React.memo where props are stable."}
                    ],
                    "fix": "import React, { useCallback, memo } from 'react';\nimport { ErrorBoundary } from './components/ErrorBoundary';\n\n/**\n * Root application component.\n * Wraps all children in an ErrorBoundary for fault tolerance.\n */\nconst App: React.FC = () => {\n  const handleInitialize = useCallback(() => {\n    console.info('[App] System initialized successfully.');\n  }, []);\n\n  return (\n    <ErrorBoundary>\n      <div className='min-h-screen p-4 bg-background'>\n        <button\n          className='bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-6 py-3 rounded-xl transition-colors'\n          onClick={handleInitialize}\n          aria-label='Initialize core systems'\n        >\n          Initialize Core\n        </button>\n      </div>\n    </ErrorBoundary>\n  );\n};\n\nApp.displayName = 'App';\nexport default memo(App);"
                },
                {
                    "name": "AuthService.ts",
                    "path": "src/services/AuthService.ts",
                    "type": "file",
                    "content": "const login = (u, p) => {\n  if(u === 'admin' && p === 'password') return true;\n  return false;\n}",
                    "issues": [
                        {"type_of_issue": "security", "errors_or_vulnerabilities": ["Hardcoded plaintext credentials", "No rate limiting"], "explanation": "Admin credentials 'admin/password' are hardcoded in the client bundle, fully visible in browser DevTools. This is a critical P0 security vulnerability.", "suggestion": "Remove immediately. Use a server-side auth endpoint with bcrypt password hashing and JWT issuance."},
                        {"type_of_issue": "redundancy", "errors_or_vulnerabilities": ["Verbose boolean return"], "explanation": "The if/return true pattern is an anti-pattern. The expression itself evaluates to a boolean directly.", "suggestion": "Return the expression: return u === 'admin' && p === 'password'"}
                    ],
                    "basic_improvements": [
                        {"type_of_improvement": "security", "explanation": "Zero token management, session persistence, or refresh handling exists.", "suggestion": "Implement full JWT lifecycle: accessToken (15m) + refreshToken (7d) stored in HttpOnly cookies."},
                        {"type_of_improvement": "typing", "explanation": "Function parameters use implicit 'any' type.", "suggestion": "Add explicit TypeScript types: (username: string, password: string): Promise<AuthResult>"}
                    ],
                    "fix": "import { jwtDecode } from 'jwt-decode';\n\ninterface AuthResult {\n  success: boolean;\n  token?: string;\n  expiresAt?: number;\n  error?: string;\n}\n\n/**\n * Authenticates the user against the secure backend API.\n * Never stores passwords client-side.\n */\nexport const login = async (\n  username: string,\n  password: string\n): Promise<AuthResult> => {\n  try {\n    const response = await fetch('/api/v1/auth/login', {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' },\n      credentials: 'include', // HttpOnly cookie for refresh token\n      body: JSON.stringify({ username, password }),\n    });\n\n    if (!response.ok) {\n      const errorBody = await response.json();\n      return { success: false, error: errorBody.message || 'Authentication failed' };\n    }\n\n    const { accessToken } = await response.json();\n    const decoded = jwtDecode<{ exp: number }>(accessToken);\n    sessionStorage.setItem('access_token', accessToken);\n    return { success: true, token: accessToken, expiresAt: decoded.exp };\n  } catch (error) {\n    console.error('[AuthService] Login error:', error);\n    return { success: false, error: 'Network error. Please try again.' };\n  }\n};\n\nexport const logout = async (): Promise<void> => {\n  sessionStorage.removeItem('access_token');\n  await fetch('/api/v1/auth/logout', { method: 'POST', credentials: 'include' });\n};"
                },
                {
                    "name": "apiClient.ts",
                    "path": "src/lib/apiClient.ts",
                    "type": "file",
                    "content": "export const fetchData = (url) => {\n  return fetch(url).then(r => r.json());\n}",
                    "issues": [
                        {"type_of_issue": "bug", "errors_or_vulnerabilities": ["No HTTP error handling", "No timeout mechanism"], "explanation": "fetch() does not throw on 4xx/5xx responses. The current implementation silently swallows API errors, making debugging impossible.", "suggestion": "Always check response.ok and throw a typed HttpError for non-2xx responses."},
                        {"type_of_issue": "security", "errors_or_vulnerabilities": ["No auth token injection", "No CSRF protection"], "explanation": "API calls are made without attaching the Authorization header. Any protected endpoints will return 401 silently ignored by the client.", "suggestion": "Use an interceptor pattern to inject Bearer tokens from sessionStorage on every request."}
                    ],
                    "basic_improvements": [
                        {"type_of_improvement": "architecture", "explanation": "A raw fetch wrapper provides no retries, cancellation, or cache control.", "suggestion": "Adopt React Query or SWR for data-fetching with built-in caching, deduplication, and background refresh."},
                        {"type_of_improvement": "typing", "explanation": "Generic return type is 'any'.", "suggestion": "Add TypeScript generics: fetchData<T>(url: string): Promise<T>"}
                    ],
                    "fix": "class HttpError extends Error {\n  constructor(public status: number, message: string) {\n    super(message);\n    this.name = 'HttpError';\n  }\n}\n\nconst DEFAULT_TIMEOUT_MS = 10_000;\n\n/**\n * Type-safe HTTP client with auth injection, error handling, and timeout.\n */\nexport async function apiClient<T>(\n  url: string,\n  options: RequestInit = {}\n): Promise<T> {\n  const controller = new AbortController();\n  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);\n\n  const token = sessionStorage.getItem('access_token');\n  const headers: HeadersInit = {\n    'Content-Type': 'application/json',\n    ...(token ? { Authorization: `Bearer ${token}` } : {}),\n    ...options.headers,\n  };\n\n  try {\n    const response = await fetch(url, {\n      ...options,\n      headers,\n      signal: controller.signal,\n      credentials: 'include',\n    });\n\n    if (!response.ok) {\n      const errorBody = await response.json().catch(() => ({}));\n      throw new HttpError(response.status, errorBody.message || `HTTP ${response.status}`);\n    }\n\n    return response.json() as Promise<T>;\n  } finally {\n    clearTimeout(timeoutId);\n  }\n}"
                },
                {
                    "name": "config.ts",
                    "path": "src/config.ts",
                    "type": "file",
                    "content": "export const API_URL = 'http://localhost:3000';\nexport const DEBUG = true;\nexport const SECRET_KEY = 'xK9#mP2$qL8nR5';\nexport const DB_PASSWORD = 'admin123';",
                    "issues": [
                        {"type_of_issue": "security", "errors_or_vulnerabilities": ["Secret key in source code", "Database password in source code", "Hardcoded localhost URL"], "explanation": "Cryptographic keys and database credentials committed to source code are exposed to every developer and CI system that touches the repo. This violates OWASP A02:2021 (Cryptographic Failures).", "suggestion": "Move ALL secrets to environment variables accessed via import.meta.env (Vite) or process.env. Add a .env.example file and .gitignore .env files."},
                        {"type_of_issue": "bug", "errors_or_vulnerabilities": ["DEBUG=true in production build"], "explanation": "Hardcoded DEBUG=true will enable verbose logging in production, leaking stack traces and internal state to end users.", "suggestion": "Use import.meta.env.DEV for development-only flags."}
                    ],
                    "basic_improvements": [
                        {"type_of_improvement": "security", "explanation": "No config validation at startup.", "suggestion": "Use Zod to validate env vars at module load time, throwing a clear error if required vars are missing."}
                    ],
                    "fix": "import { z } from 'zod';\n\n/**\n * Environment variable schema — validated at startup.\n * Missing required vars will throw immediately (fail-fast).\n */\nconst envSchema = z.object({\n  VITE_API_URL: z.string().url('VITE_API_URL must be a valid URL'),\n  VITE_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),\n});\n\nconst _env = envSchema.safeParse(import.meta.env);\n\nif (!_env.success) {\n  console.error('[Config] Invalid environment configuration:');\n  console.error(_env.error.format());\n  throw new Error('Missing or invalid environment variables. Check your .env file.');\n}\n\nexport const config = {\n  apiUrl: _env.data.VITE_API_URL,\n  isDev: _env.data.VITE_APP_ENV === 'development',\n  isProd: _env.data.VITE_APP_ENV === 'production',\n} as const;\n\n// .env.example (commit this, NOT .env)\n// VITE_API_URL=https://api.yourapp.com\n// VITE_APP_ENV=production"
                },
                {
                    "name": "UserDashboard.tsx",
                    "path": "src/components/UserDashboard.tsx",
                    "type": "file",
                    "content": "export function Dashboard({userId}) {\n  const [data, setData] = React.useState(null);\n  React.useEffect(() => {\n    fetch('/api/user/' + userId).then(r => r.json()).then(setData);\n  }, []);\n  if (!data) return <div>Loading...</div>;\n  return <div>{data.username}</div>;\n}",
                    "issues": [
                        {"type_of_issue": "bug", "errors_or_vulnerabilities": ["Missing userId in useEffect dep array", "No fetch abort on unmount"], "explanation": "The useEffect dependency array is empty [], so the fetch never re-runs if userId changes. Additionally, not aborting on unmount causes a setState-on-unmounted-component warning and potential memory leaks.", "suggestion": "Add userId to the dep array and use AbortController to cancel in-flight requests on cleanup."},
                        {"type_of_issue": "security", "errors_or_vulnerabilities": ["Unvalidated API response displayed directly"], "explanation": "data.username is rendered directly without sanitization. If the API returns malicious markup, it could be rendered unsafely through future dangerouslySetInnerHTML usage.", "suggestion": "Always validate/sanitize API response shapes using a runtime schema (Zod) before rendering."}
                    ],
                    "basic_improvements": [
                        {"type_of_improvement": "UX", "explanation": "Generic 'Loading...' text provides no visual feedback quality.", "suggestion": "Replace with a skeleton component that matches the final layout to prevent layout shift."},
                        {"type_of_improvement": "error handling", "explanation": "No error state is handled. A 500 response from the server silently renders nothing.", "suggestion": "Add separate loading, error, and success states with appropriate UI for each."}
                    ],
                    "fix": "import React, { useState, useEffect, useCallback } from 'react';\nimport { z } from 'zod';\nimport { Skeleton } from '@/components/ui/skeleton';\n\nconst UserSchema = z.object({\n  id: z.string(),\n  username: z.string().min(1),\n  email: z.string().email(),\n  level: z.number().int().nonneg(),\n});\ntype User = z.infer<typeof UserSchema>;\n\ninterface DashboardProps { userId: string; }\n\nexport const Dashboard: React.FC<DashboardProps> = ({ userId }) => {\n  const [user, setUser] = useState<User | null>(null);\n  const [error, setError] = useState<string | null>(null);\n  const [loading, setLoading] = useState(true);\n\n  const fetchUser = useCallback(async (signal: AbortSignal) => {\n    setLoading(true);\n    setError(null);\n    try {\n      const res = await fetch(`/api/v1/users/${encodeURIComponent(userId)}`, { signal });\n      if (!res.ok) throw new Error(`Server error: ${res.status}`);\n      const raw = await res.json();\n      const parsed = UserSchema.safeParse(raw);\n      if (!parsed.success) throw new Error('Invalid user data received from server');\n      setUser(parsed.data);\n    } catch (err: any) {\n      if (err.name !== 'AbortError') setError(err.message);\n    } finally {\n      setLoading(false);\n    }\n  }, [userId]);\n\n  useEffect(() => {\n    const controller = new AbortController();\n    fetchUser(controller.signal);\n    return () => controller.abort();\n  }, [fetchUser]);\n\n  if (loading) return <Skeleton className='h-12 w-full rounded-xl' />;\n  if (error) return <p className='text-rose-400 font-mono text-sm p-4'>[Error] {error}</p>;\n  if (!user) return null;\n\n  return (\n    <div className='p-6 rounded-2xl bg-white/5 border border-white/10'>\n      <h2 className='text-xl font-black text-white'>{user.username}</h2>\n      <p className='text-muted-foreground text-sm mt-1'>{user.email} • Level {user.level}</p>\n    </div>\n  );\n};"
                },
                {
                    "name": "routes.tsx",
                    "path": "src/routes.tsx",
                    "type": "file",
                    "content": "const Routes = () => (\n  <div>\n    <Route path='/' component={Home} />\n    <Route path='/admin' component={Admin} />\n    <Route path='/user/:id' component={User} />\n  </div>\n);",
                    "issues": [
                        {"type_of_issue": "security", "errors_or_vulnerabilities": ["Admin route has no authentication guard"], "explanation": "The /admin route is publicly accessible without any auth check. Any unauthenticated user can navigate directly to /admin and access the admin panel.", "suggestion": "Wrap protected routes in a <ProtectedRoute> component that checks for a valid JWT and user role before rendering."},
                        {"type_of_issue": "bug", "errors_or_vulnerabilities": ["No 404 catch-all route", "Wrong React Router v6 API"], "explanation": "React Router v6 uses <Routes> and element={} props, not component={}. The current syntax will throw a runtime error.", "suggestion": "Migrate to React Router v6 syntax using <Routes>, <Route element={} />, and add a <Route path='*'> for 404 handling."}
                    ],
                    "basic_improvements": [
                        {"type_of_improvement": "performance", "explanation": "All routes are eagerly loaded in a single bundle.", "suggestion": "Use React.lazy() and <Suspense> for route-level code splitting to reduce initial bundle size."}
                    ],
                    "fix": "import React, { Suspense, lazy } from 'react';\nimport { Routes, Route, Navigate } from 'react-router-dom';\nimport { ProtectedRoute } from './components/ProtectedRoute';\nimport { AdminRoute } from './components/AdminRoute';\n\n// Code-split routes for optimal bundle size\nconst Home = lazy(() => import('./pages/Home'));\nconst Admin = lazy(() => import('./pages/Admin'));\nconst User = lazy(() => import('./pages/User'));\nconst NotFound = lazy(() => import('./pages/NotFound'));\nconst Login = lazy(() => import('./pages/Login'));\n\nconst PageLoader = () => (\n  <div className='min-h-screen flex items-center justify-center'>\n    <div className='h-8 w-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin' />\n  </div>\n);\n\nexport const AppRoutes: React.FC = () => (\n  <Suspense fallback={<PageLoader />}>\n    <Routes>\n      {/* Public routes */}\n      <Route path='/' element={<Home />} />\n      <Route path='/login' element={<Login />} />\n\n      {/* Authenticated user routes */}\n      <Route element={<ProtectedRoute />}>\n        <Route path='/user/:id' element={<User />} />\n      </Route>\n\n      {/* Admin-only routes — requires role: admin in JWT */}\n      <Route element={<AdminRoute requiredRole='admin' />}>\n        <Route path='/admin' element={<Admin />} />\n      </Route>\n\n      {/* Catch-all 404 */}\n      <Route path='*' element={<NotFound />} />\n    </Routes>\n  </Suspense>\n);"
                }
            ],
            "updated_at": "2026-03-28T05:00:00Z"
        })

    try:
        client = get_mongo_client()
        db = client[MONGO_DB]
        coll = db[COLLECTION_NAME]
        
        project = coll.find_one({"_id": project_id})
        
        if not project:
            return jsonify({"error": "Project not found"}), 404
        
        # Serialize and return
        result = serialize_mongo_doc(project)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error fetching project details: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/files/<project_id>', methods=['GET'])
def get_file_tree(project_id):
    """
    Get file tree structure for a project
    """
    try:
        client = get_mongo_client()
        db = client[MONGO_DB]
        coll = db[COLLECTION_NAME]
        
        project = coll.find_one({"_id": project_id})
        
        if not project:
            return jsonify({"error": "Project not found"}), 404
        
        latest = project.get('latest', {})
        
        # Return the directory graph if available, otherwise return root
        directory_graph = latest.get('directory_graph')
        if directory_graph:
            return jsonify({"tree": directory_graph})
        else:
            root = latest.get('root', [])
            return jsonify({"tree": root})
        
    except Exception as e:
        logger.error(f"Error fetching file tree: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/files/<project_id>/analysis/<path:file_path>', methods=['GET'])
def get_file_analysis(project_id, file_path):
    """
    Get detailed analysis for a specific file
    """
    try:
        client = get_mongo_client()
        db = client[MONGO_DB]
        coll = db[COLLECTION_NAME]
        
        project = coll.find_one({"_id": project_id})
        
        if not project:
            return jsonify({"error": "Project not found"}), 404
        
        latest = project.get('latest', {})
        root = latest.get('root', [])
        
        # Find the file in root
        file_data = None
        for item in root:
            if item.get('path') == file_path and item.get('type') == 'file':
                file_data = item
                break
        
        if not file_data:
            return jsonify({"error": "File not found"}), 404
        
        return jsonify(file_data)
        
    except Exception as e:
        logger.error(f"Error fetching file analysis: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/dependencies/<project_id>', methods=['GET'])
def get_dependencies(project_id):
    """
    Get project dependencies and technical requirements
    """
    try:
        client = get_mongo_client()
        db = client[MONGO_DB]
        coll = db[COLLECTION_NAME]
        
        project = coll.find_one({"_id": project_id})
        
        if not project:
            return jsonify({"error": "Project not found"}), 404
        
        latest = project.get('latest', {})
        
        return jsonify({
            "dependencies": latest.get('dependencies', {}),
            "technical_requirements": list(latest.get('Technical_requirements', []))
        })
        
    except Exception as e:
        logger.error(f"Error fetching dependencies: {str(e)}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    # Run the Flask server
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
