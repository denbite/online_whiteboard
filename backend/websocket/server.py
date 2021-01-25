import asyncio
import logging
from json import loads

import websockets
from websockets import WebSocketServerProtocol

logging.basicConfig(level=logging.INFO)


class Server:

    """
    Implementation of storage with clients, methods for working with them
    and requests handler
    """

    def __init__(self):
        """
        self.clients = {
            'board_url': set(...),
            'board_url2': set(...),
        }
        """
        self.clients = {}

    async def register(
        self, ws: WebSocketServerProtocol, board_url: str
    ) -> None:
        if board_url not in self.clients:
            self.clients[board_url] = set()

        self.clients[board_url].add(ws)
        logging.info(f"{ws.remote_address} connected")

    async def unregister(
        self, ws: WebSocketServerProtocol, board_url: str
    ) -> None:
        await ws.close()
        self.clients[board_url].remove(ws)
        logging.info(f"{ws.remote_address} disconnected")

        if not self.clients[board_url]:
            self.clients.pop(board_url)

    async def main_handler(
        self, ws: WebSocketServerProtocol, uri: str
    ) -> None:

        logging.info(f"uri: {uri} handled from {ws.remote_address}")

        if not uri.startswith("/board/"):
            await ws.close()

        board_url = uri[7:]

        if ws not in self.clients:
            await self.register(ws, board_url)

        try:
            await self.distribute(ws, board_url)
        except Exception as err:
            logging.info(f"ERROR on main_handler: {str(err)}")
        finally:
            await self.unregister(ws, board_url)

    async def distribute(
        self, ws: WebSocketServerProtocol, board_url: str
    ) -> None:
        async for message in ws:
            logging.info(
                f"received message: {message} from {ws.remote_address}"
            )

            try:
                if self._validate_message(message):
                    await self._send_to_clients(message, ws, board_url)
            except Exception as err:
                logging.info(f"ERROR on validation: {str(err)}")

    def _validate_message(self, message: str) -> bool:

        data = loads(message)

        if "action" not in data or data["action"] not in [
            "saveLastPic",
            "clearBoard",
        ]:
            return False

        if data["action"] == "saveLastPic":
            if (
                "brush" not in data
                or "color" not in data["brush"]
                or "width" not in data["brush"]
                or "pic" not in data
            ):
                return False

        return True

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
    start_server = websockets.serve(server.main_handler, "127.0.0.1", 8001)
    loop = asyncio.get_event_loop()
    loop.run_until_complete(start_server)
    loop.run_forever()


if __name__ == "__main__":
    start()
