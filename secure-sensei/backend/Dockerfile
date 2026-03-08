FROM python:3.11-slim

WORKDIR /app

# Install system dependencies (needed for compiling some python packages if any)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

RUN mkdir -p /Users/attachatchannakorn/secure-sensei/data

COPY . .

EXPOSE 8000

# Start script
CMD ["python", "api_server.py"]
