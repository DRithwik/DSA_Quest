import Docker from 'dockerode';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const docker = new Docker();

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  runtime: number; 
  memory: number; 
}

export class SandboxService {
  static async execute(code: string, language: string, testCases: any[]): Promise<ExecutionResult> {
    const id = uuidv4();
    const tempDir = path.join(__dirname, `../../temp/${id}`);
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    let fileName = '';
    let image = '';
    let cmd = [];

    switch (language) {
      case 'python':
        fileName = 'solution.py';
        image = 'python:3.9-slim';
        cmd = ['python', '/app/solution.py'];
        break;
      case 'javascript':
        fileName = 'solution.js';
        image = 'node:16-slim';
        cmd = ['node', '/app/solution.js'];
        break;
      case 'cpp':
        fileName = 'solution.cpp';
        image = 'gcc:latest';
        cmd = ['sh', '-c', 'g++ /app/solution.cpp -o /app/solution && /app/solution'];
        break;
      default:
        throw new Error('Unsupported language');
    }

    fs.writeFileSync(path.join(tempDir, fileName), code);

    try {
      const container = await docker.createContainer({
        Image: image,
        Cmd: cmd,
        HostConfig: {
          Binds: [`${tempDir}:/app`],
          Memory: 128 * 1024 * 1024, // 128MB
          CpuPeriod: 100000,
          CpuQuota: 50000, // 0.5 CPU
          NetworkMode: 'none' // Security
        },
        Tty: false,
      });

      const startTime = Date.now();
      await container.start();
      
      // Wait for completion with timeout
      const waitPromise = container.wait();
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000));
      
      await Promise.race([waitPromise, timeoutPromise]);
      const runtime = Date.now() - startTime;

      const stdoutBuffer = await container.logs({ stdout: true, stderr: false });
      const stderrBuffer = await container.logs({ stdout: false, stderr: true });

      await container.remove();
      fs.rmSync(tempDir, { recursive: true, force: true });

      return {
        stdout: stdoutBuffer.toString('utf8'),
        stderr: stderrBuffer.toString('utf8'),
        runtime,
        memory: 0 // In a production system, we'd use `container.stats()`
      };
    } catch (err: any) {
      return {
        stdout: '',
        stderr: err.message,
        runtime: 0,
        memory: 0
      };
    }
  }
}
