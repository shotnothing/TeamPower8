# Use the official Python 3 image as base
FROM python:3

# Set environment variables to optimize Python environment
ENV PYTHONDONTWRITEBYTECODE=1  
ENV PYTHONUNBUFFERED=1         

# Set the working directory inside the container
WORKDIR /volume

# Copy the requirements.txt file from the local filesystem into the container's working directory
COPY requirements.txt /volume/

# Install Python dependencies from requirements.txt using pip
RUN pip install -r requirements.txt

# Copy the rest of the application files from the local filesystem into the container's working directory
COPY . /volume/