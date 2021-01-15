import asyncio
import websockets
import logging
from websockets import WebSocketServerProtocol

logging.basicConfig(level=logging.INFO)


class Server:
    clients = set()

    async def register(self, ws: WebSocketServerProtocol) -> None:
        self.clients.add(ws)
        logging.info("{} connected".format(ws.remote_address))

    async def unregister(self, ws: WebSocketServerProtocol) -> None:
        await ws.close()
        self.clients.remove(ws)
        logging.info("{} disconnected".format(ws.remote_address))

    async def main_handler(self, ws: WebSocketServerProtocol, uri: str) -> None:

        logging.info("uri: {} handled from {}".format(uri, ws.remote_address))
        if uri != "/board":
            await ws.close()

        if ws not in self.clients:
            await self.register(ws)

        try:
            await self.distribute(ws)
        except:
            pass
        finally:
            await self.unregister(ws)

    async def distribute(self, ws: WebSocketServerProtocol) -> None:
        async for message in ws:
            await self.send_to_clients(message, ws)
            logging.info(
                "received message: {} from {}".format(message, ws.remote_address)
            )

    async def send_to_clients(
        self, message: str, current_ws: WebSocketServerProtocol
    ) -> None:
        if self.clients and len(self.clients) > 1:
            await asyncio.wait(
                [
                    client.send(message)
                    for client in self.clients
                    if client != current_ws
                ]
            )


server = Server()
start_server = websockets.serve(server.main_handler, "0.0.0.0", 8001)
loop = asyncio.get_event_loop()
loop.run_until_complete(start_server)
loop.run_forever()