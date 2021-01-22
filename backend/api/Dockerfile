FROM python:3.7

COPY requirements.txt .
RUN pip3 install -r requirements.txt

RUN export PYTHONPATH='${PYTHONPATH}:/app'

CMD python3 entry.py