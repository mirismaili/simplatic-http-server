import fs from 'fs'
import path from 'path'
import url from 'url'
import http from 'http'

/**
 * Created at 1398/4/2 (2019/6/23).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 */
export default class StaticServer {
	readonly staticServer: http.Server
	
	constructor(public readonly port: number, public readonly servePath = '') {
		this.staticServer = http.createServer((req, res) => {
			console.debug(req.method + ' ' + req.url)
			
			try {
				const uri = url.parse(req.url!).pathname!
				let filePath = path.join(servePath === '' ? process.cwd() : servePath, uri)!
				
				e404:{
					if (!fs.existsSync(filePath)) break e404
					console.debug(filePath)
					
					if (fs.statSync(filePath).isDirectory()) filePath = path.join(filePath, 'index.html')
					console.debug(filePath)
					
					if (!fs.existsSync(filePath)) break e404
					
					const contentTypesByExtension: { [key: string]: string } = {
						'.html': 'text/html',
						'.css': 'text/css',
						'.js': 'text/javascript'
					}
					
					const data = fs.readFileSync(filePath, 'binary')
					
					const headers: { [key: string]: string } = {}
					const contentType = contentTypesByExtension[path.extname(filePath)]
					if (contentType !== undefined) headers['Content-Type'] = contentType
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
				console.error(exeption.stack)
				res.writeHead(500, {'Content-Type': 'text/plain'})
				res.write(exeption.toString())
				res.end()
			}
		})
	}
	
	listen(): Promise<void> {
		return new Promise((resolve, reject) => {
					this.staticServer.on('error', reject)
					
					this.staticServer.listen(this.port, () => resolve())
				}
		)
	}
	
	shutdown(): Promise<void> {
		return new Promise((resolve, reject) =>
				this.staticServer.close(err => err === undefined ? resolve() : reject(err))
		)
	}
}
