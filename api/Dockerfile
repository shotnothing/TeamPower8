FROM python:3
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /volume
COPY requirements.txt /volume/
RUN pip install -r requirements.txt
COPY . /volume/