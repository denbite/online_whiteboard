FROM python:3.7

WORKDIR /app

COPY requirements.txt .
RUN pip3 install -r requirements.txt

RUN export PYTHONPATH='${PYTHONPATH}:/app'

COPY . .

CMD python3 server.py