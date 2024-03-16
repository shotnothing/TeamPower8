run:
	python manage.py runserver

build:
ifeq ($(OS),Windows_NT)
	venv\Scripts\activate
else
	source venv/Scripts/activate
endif
	pip install -r requirements.txt

deploy_build:
	pip install -r requirements.txt

deploy_start:
	python -m gunicorn mysite.asgi:application -k uvicorn.workers.UvicornWorker