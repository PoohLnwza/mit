# Use Python 3.10 or later
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies (needed for compiling some python packages if any)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create data directory so insert_knowledge.py has a place to look if needed
RUN mkdir -p /Users/attachatchannakorn/secure-sensei/data

# Copy the rest of the backend code
COPY . .

# Expose FastAPI port
EXPOSE 8000

# Start script
CMD ["/app/start.sh"]
