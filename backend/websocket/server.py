import asyncio
import logging
from json import loads

import websockets

logging.basicConfig(level=logging.INFO)


class Server:
    """
    Implement WebSocket Protocol with rooms.

    Attributes:
        clients (dict of set): All clients divided by rooms.

    """

    def __init__(self):
        """Init clients as empty dict."""
        self.clients = {}

    async def register(self, ws, room_id):
        """
        Add new client to the room.

        Args:
            ws (websockets.WebSocketServerProtocol): Client instance.
            room_id (str): Room identifier.

        """
        # check if exists this room
        if room_id not in self.clients:
            self.clients[room_id] = set()

        self.clients[room_id].add(ws)
        logging.info(f"{ws.remote_address} connected")

    async def unregister(self, ws, room_id):
        """
        Remove client from the room.

        Args:
            ws (websockets.WebSocketServerProtocol): Client instance.
            room_id (str): Room identifier.

        """
        await ws.close()

        self.clients[room_id].remove(ws)
        logging.info(f"{ws.remote_address} disconnected")

        # if room is empty -> delete it
        if not self.clients[room_id]:
            self.clients.pop(room_id)

    async def main_handler(self, ws, url):
        """
        Handle the lifecycle of a WebSocket client connection.

        Args:
            ws (websockets.WebSocketServerProtocol): Client instance.
            url (str): Url query.

        """
        logging.info(f"url: {url} handled from {ws.remote_address}")

        # checks if url is correct
        if not url.startswith("/board/"):
            await ws.close()

        # get room_id from url query
        room_id = url[7:]

        await self.register(ws, room_id)

        try:
            await self.distribute(ws, room_id)
        except Exception as err:
            logging.info(f"ERROR on main_handler: {str(err)}")
        finally:
            await self.unregister(ws, room_id)

    async def distribute(self, ws, room_id):
        """
        Wait for new messages and then distribute it.

        Args:
            ws (websockets.WebSocketServerProtocol): Client instance.
            room_id (str): Room identifier.

        """
        async for message in ws:
            logging.info(
                f"received message: {message[:100]} from {ws.remote_address}"
            )

            try:
                if self._validate_message(message):
                    await self._send_to_clients(message, ws, room_id)
            except Exception as err:
                logging.info(f"ERROR on distribute: {str(err)}")

    def _validate_message(self, message: str) -> bool:
        """
        Validate structure of received message.

        Args:
            message (str): Received data from client.

        Returns:
            bool: True if OK, otherwise False

        """
        # convert stringified json to dict
        data = loads(message)

        # check message structure
        if "action" not in data or data["action"] not in [
            "saveLastPic",
            "clearBoard",
        ]:
            return False

        if data["action"] == "saveLastPic":
            # check data when action 'saveLastPic'
            if (
                "pic" in data
                and "brush" in data
                and "color" in data["brush"]
                and "width" in data["brush"]
            ):
                return True

        elif data["action"] == "clearBoard":
            return True

        return False

    async def _send_to_clients(self, message, current_ws, room_id):
        """
        Distribute messages to clients.

        Send messages to all clients in such room except sender.

        Args:
            message (str): Received data from client.
            current_ws (websockets.WebSocketServerProtocol): Sender
                client instance.
            room_id (str): Room identifier.

        """
        # check if client exist to send messages
        if (
            room_id in self.clients
            and self.clients[room_id]
            and len(self.clients[room_id]) > 1
        ):
            # send messages to all clients in this room except sender
            await asyncio.wait(
                [
                    client.send(message)
                    for client in self.clients[room_id]
                    if client != current_ws
                ]
            )


def start():
    """Launch server."""
    server = Server()
    start_server = websockets.serve(server.main_handler, "127.0.0.1", 8001)
    loop = asyncio.get_event_loop()
    loop.run_until_complete(start_server)
    loop.run_forever()


if __name__ == "__main__":
    start()
