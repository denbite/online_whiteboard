import asyncio
import websockets
import logging
from websockets import WebSocketServerProtocol

logging.basicConfig(level=logging.INFO)


class Server:

    """
    Implementation of storage with clients, methods for working with them and requests handler
    """

    def __init__(self):
        """
        self.clients = {
            'board_url': set(...),
            'board_url2': set(...),
        }
        """
        self.clients = {}

    async def register(self, ws: WebSocketServerProtocol, board_url: str) -> None:
        if board_url not in self.clients:
            self.clients[board_url] = set()

        self.clients[board_url].add(ws)
        logging.info("{} connected".format(ws.remote_address))

    async def unregister(self, ws: WebSocketServerProtocol, board_url: str) -> None:
        await ws.close()
        self.clients[board_url].remove(ws)
        logging.info("{} disconnected".format(ws.remote_address))

        if not self.clients[board_url]:
            self.clients.pop(board_url)

    async def main_handler(self, ws: WebSocketServerProtocol, uri: str) -> None:

        logging.info("uri: {} handled from {}".format(uri, ws.remote_address))

        if not uri.startswith("/board/"):
            await ws.close()

        board_url = uri[7:]

        if ws not in self.clients:
            await self.register(ws, board_url)

        try:
            await self.distribute(ws, board_url)
        except:
            pass
        finally:
            await self.unregister(ws, board_url)

    async def distribute(self, ws: WebSocketServerProtocol, board_url: str) -> None:
        async for message in ws:
            await self._send_to_clients(message, ws, board_url)
            logging.info(
                "received message: {} from {}".format(message, ws.remote_address)
            )

    async def _send_to_clients(
        self, message: str, current_ws: WebSocketServerProtocol, board_url: str
    ) -> None:
        if (
            board_url in self.clients
            and self.clients[board_url]
            and len(self.clients[board_url]) > 1
        ):
            await asyncio.wait(
                [
                    client.send(message)
                    for client in self.clients[board_url]
                    if client != current_ws
                ]
            )


def start():
    server = Server()
    start_server = websockets.serve(server.main_handler, "0.0.0.0", 8001)
    loop = asyncio.get_event_loop()
    loop.run_until_complete(start_server)
    loop.run_forever()


if __name__ == "__main__":
    start()