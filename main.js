/**
 * Created at 1398/4/2 (2019/6/23).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 */
'use strict'

const fs = require('fs')
const path = require('path')
const url = require('url')
const http = require('http')

const staticServerPromise = new Promise((resolve, reject) => {
	const staticServer = http.createServer((req, res) => {
		// console.debug(req.method + ' ' + req.url);
		
		try {
			const uri = url.parse(req.url).pathname
			let filePath = path.join(process.cwd(), uri)
			
			e404:{
				if (!fs.existsSync(filePath)) break e404
				
				if (fs.statSync(filePath).isDirectory()) filePath = path.join(filePath, 'index.html')
				
				if (!fs.existsSync(filePath)) break e404
				
				const contentTypesByExtension = {
					'.html': 'text/html',
					'.css': 'text/css',
					'.js': 'text/javascript'
				}
				
				const data = fs.readFileSync(filePath, 'binary')
				
				const headers = {}
				const contentType = contentTypesByExtension[path.extname(filePath)]
				if (contentType) headers['Content-Type'] = contentType
				res.writeHead(200, headers)
				res.write(data, 'binary')
				res.end()
				
				return
			}
			//----------------------------------------------------------/e404:
			
			// noinspection UnreachableCodeJS
			console.error(`File not found: "${filePath}"`)
			res.writeHead(404, {'Content-Type': 'text/plain'})
			res.write('404/ Not Found\n')
			res.end()
			
		} catch (exeption) {
			console.error(e.stack)
			res.writeHead(500, {'Content-Type': 'text/plain'})
			res.write(e.toString())
			res.end()
		}
	})
	
	staticServer.on('error', reject)
	
	staticServer.listen(PORT, () => {
		// noinspection JSUndefinedPropertyAssignment
		global.__STATIC_SERVER__ = staticServer
		
		console.info(`Static file server running at: http://127.0.0.1:${PORT}`)
		resolve()
	})
})
