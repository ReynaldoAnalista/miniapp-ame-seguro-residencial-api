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
	@echo '=========== Building miniapp-ame-seguro-residencial-api ==========='
	yarn

runserver: build	commithash
	@echo '=========== Starting miniapp-ame-seguro-residencial-api ==========='
	COMMIT_HASH="$(COMMIT_HASH)" APPLICATION_NAME='miniapp-ame-seguro-residencial-api' DEBUG=miniapp-ame-seguro-residencial-api:* yarn run dev

debugserver: build	commithash
	@echo '=========== Starting miniapp-ame-seguro-residencial-api ==========='
	COMMIT_HASH="$(COMMIT_HASH)" APPLICATION_NAME='miniapp-ame-seguro-residencial-api' DEBUG=miniapp-ame-seguro-residencial-api:* yarn run debug
