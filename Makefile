MAKEFLAGS = --no-print-directory --always-make --silent
MAKE = make $(MAKEFLAGS)

NODE_BIN = node_modules/.bin
NODEMON = $(NODE_BIN)/nodemon

.PHONY: \
	dev-server \
	db-migrate \
	db-rollback

dev-server:
	@echo "Starting backend dev-server..."
	$(NODEMON) --exec node -- src/index.js

db-migrate:
	@echo "Migrating to latest"
	knex migrate:latest --knexfile src/knexfile.js

db-rollback:
	@echo "Rolling back to previous"
	knex migrate:rollback --knexfile src/knexfile.js
