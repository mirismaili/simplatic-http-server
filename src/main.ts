import fs from 'fs'
import path from 'path'
import url from 'url'
import http from 'http'

import debug from 'debug'

/**
 * Created at 1398/4/2 (2019/6/23).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 */
export default class StaticServer {
	readonly staticServer: http.Server
	
	constructor(public readonly port: number, public readonly servePath = process.cwd()) {
		this.staticServer = http.createServer((req, res) => {
			dbg('%s %s', req.method, req.url)
			
			try {
				const uri = url.parse(req.url!).pathname!
				const filePath = path.join(servePath, uri)!
				
				if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) { // 404:
					err('File not found: %s', filePath)
					res.writeHead(404, {'Content-Type': 'text/plain'})
					res.write('404/ Not Found\n')
					res.end()
					return
				}
				
				dbg(filePath)
				
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
			} catch (exception) {
				console.error(exception.stack)
				res.writeHead(500, {'Content-Type': 'text/plain'})
				res.write(exception.toString())
				res.end()
			}
		})
	}
	
	listen(): Promise<void> {
		return new Promise((resolve, reject) => {
					this.staticServer.on('error', reject)
					
					this.staticServer.listen(this.port, resolve)
				}
		)
	}
	
	shutdown(): Promise<void> {
		return new Promise((resolve, reject) =>
				this.staticServer.close(err => err === undefined ? resolve() : reject(err))
		)
	}
}
//*****************************************************************************************/

const getDebugger = (namespace: string): debug.Debugger => debug(`<@MODULE_NAME@>:${namespace}`)

const trc = getDebugger('I')       // I*: Level I:    Trace+
const dbg = getDebugger('II')      // II*: Level II:   Debug+
const inf = getDebugger('III')     // III*: Level III:  Info+
const wrn = getDebugger('IIIW')    // IIIW*: Level IV:   Warning+
const err = getDebugger('IIIWE')   // IIIWE*: Level V:    Error+
const ftl = getDebugger('IIIWEF')  // IIIWEF : Level VI:   Fatal

const log = getDebugger('II')  // Default level

//debug.log = console.debug.bind(console)

//debug.formatters.c = (f: () => string) => f()

export {debug}
