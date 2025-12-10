// ========================================
// FILE: extension.js
// ========================================
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const http = require('http');

let server;

function activate(context) {
    console.log('QuizzKit Sync Extension đã kích hoạt!');

    // Command 1: Bật server
    let startServer = vscode.commands.registerCommand('quizzkit.startServer', function () {
        if (server) {
            vscode.window.showInformationMessage('Server đã chạy trên cổng 3000!');
            return;
        }

        server = http.createServer((req, res) => {
            // Cho phép CORS
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

            if (req.method === 'OPTIONS') {
                res.writeHead(200);
                res.end();
                return;
            }

            if (req.method === 'POST' && req.url === '/save-questions') {
                let body = '';
                
                req.on('data', chunk => {
                    body += chunk.toString();
                });

                req.on('end', () => {
                    try {
                        const data = JSON.parse(body);
                        
                        // Lấy workspace folder hiện tại
                        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
                        if (!workspaceFolder) {
                            res.writeHead(400);
                            res.end(JSON.stringify({ error: 'Không tìm thấy workspace folder' }));
                            return;
                        }

                        // Đường dẫn file questions.json
                        const filePath = path.join(workspaceFolder.uri.fsPath, 'questions.json');

                        // Ghi file
                        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');

                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ 
                            success: true, 
                            message: 'Đã lưu vào ' + filePath 
                        }));

                        vscode.window.showInformationMessage('✅ Đã lưu questions.json!');
                    } catch (error) {
                        res.writeHead(500);
                        res.end(JSON.stringify({ error: error.message }));
                        vscode.window.showErrorMessage('❌ Lỗi: ' + error.message);
                    }
                });
            } else {
                res.writeHead(404);
                res.end('Not Found');
            }
        });

        server.listen(3000, () => {
            vscode.window.showInformationMessage('✅ QuizzKit Server đã chạy trên http://localhost:3000');
        });
    });

    // Command 2: Tắt server
    let stopServer = vscode.commands.registerCommand('quizzkit.stopServer', function () {
        if (server) {
            server.close();
            server = null;
            vscode.window.showInformationMessage('⛔ Đã dừng QuizzKit Server');
        } else {
            vscode.window.showInformationMessage('Server chưa chạy');
        }
    });

    context.subscriptions.push(startServer);
    context.subscriptions.push(stopServer);
}

function deactivate() {
    if (server) {
        server.close();
    }
}

module.exports = {
    activate,
    deactivate
};