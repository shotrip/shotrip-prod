FROM public.ecr.aws/lambda/python:3.12

ENV POETRY_VERSION=2.0.0 \
    POETRY_VIRTUALENVS_CREATE=false \
    POETRY_NO_INTERACTION=1

RUN pip install "poetry==$POETRY_VERSION"

COPY pyproject.toml poetry.lock ${LAMBDA_TASK_ROOT}/
RUN poetry install --no-root --only main
RUN mkdir -p /opt/db/
COPY root.crt /opt/db/root.crt
RUN chmod 644 /opt/db/root.crt

COPY src/main.py ${LAMBDA_TASK_ROOT}/

CMD [ "main.lambda_handler" ]