ECS_FILE ?= ecs-container-definition.json

aws_credentials:
	aws configure

nodemoninstall:
	yarn add nodemon -g

commithash:
	@echo '=========== Generating commit hash ==========='
	$(eval COMMIT_HASH=`git log --oneline | awk '{print $$1; exit}' | cut -d' ' -f1`)

build:
	clear
	@echo '=========== Building ame-seguro-residencial ==========='
	yarn

runserver: build	commithash
	@echo '=========== Starting ame-seguro-residencial ==========='
	COMMIT_HASH="$(COMMIT_HASH)" APPLICATION_NAME='ame-seguro-residencial' DYNAMODB_ENV='stag' DEBUG=ame-seguro-residencial:* yarn run dev

runhomolog: build	commithash
	@echo '=========== Starting ame-seguro-residencial HOMOLOG ==========='
	COMMIT_HASH="$(COMMIT_HASH)" DYNAMODB_HOST='http://localhost:8000' APPLICATION_NAME='ame-seguro-residencial' DYNAMODB_ENV='stag' DEBUG=ame-seguro-residencial:* yarn run dev

runtest:
	@echo '=========== Testing ame-seguro-residencial ==========='
	APPLICATION_NAME='ame-seguro-residencial' DEBUG=ame-seguro-residencial:* yarn test HealthCareProposalService --watch

debugserver: build	commithash
	@echo '=========== Starting ame-seguro-residencial ==========='
	COMMIT_HASH="$(COMMIT_HASH)" APPLICATION_NAME='ame-seguro-residencial' DEBUG=ame-seguro-residencial:* yarn run debug
