const http = require('http')
const io = require('socket.io')
const sockets = []
let ioServer = undefined
let itemCount = 0

const initNamespaceMock = (ioServer) => {
	const namespace = 'mock'
	const mockNamespaceServer = ioServer.of(`/${ namespace }`)

	// on connection, wire up handlers		
	mockNamespaceServer.on('connection', (socket) => {
		console.log(`${ namespace }: someone connected`)

		setInterval(() => {
			socket.emit('server-message', {
				type: 'item',
				data: {
					id: ++itemCount,
					name: `${ itemCount } this is from server socket`,
					selected: false
				}
			})
		}, 1000)

		setInterval(() => {
			const items = [1,2,3,4,5].map((d) => {
				return {
					id: d,
					name: `${ d } some queue job`,
					status: 1
				}
			})

			socket.emit('server-message', {
				type: 'queue',
				data: {
					name: 'Some job queue',
					items: items
				}
			})
		}, 7000)
	})
}

module.exports = class WebpackPluginMockSocketServer {
	// Define `apply` as its prototype method which is supplied with compiler as its argument
	apply(compiler) {
		// Specify the event hook to attach to
		compiler.hooks.emit.tapAsync(
			'WebpackPluginMockSocketServer',
			(compilation, callback) => {

				if (!ioServer) {
					ioServer = io.listen(3100)

					initNamespaceMock(ioServer)

					ioServer.on('connection', (socket) => {
						console.log('root: someone connected')
						sockets.push(socket)

						socket.on('disconnect', () => {
							console.log('disconnected')
							sockets.splice(sockets.indexOf(socket), 1)
						})
					})
				}

				callback();
			}
		);
	}
}
