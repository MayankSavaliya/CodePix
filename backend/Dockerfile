# Use a base image with Python
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Copy only requirements first (to leverage Docker layer caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install -r requirements.txt

# Copy the rest of your app files
COPY . .

# Start the Flask app (server.py contains the app)
CMD ["python", "server.py"]
