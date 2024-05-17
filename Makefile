#
# Configuration & Defaults
#

# Project Version
version?=1.0.0
help:
	@clear
	@echo ""
	@echo "---------------------"
	@echo "React Boilerplate"
	@echo "Version: ${version}"
	@echo "---------------------"
	@echo ""
	@echo "Backend Commands:"
	@echo " 1) make boot ................. Starts the services & initializes the project"
	@echo " 2) make down ................. Stops the services and cleans up the local state"
	@echo " 3) make start ................ Starts the services"
	@echo " 4) make stop ................. Stops the services"
	@echo " 5) make logs ................. Connects to the docker compose logs"
	@echo "                                and initializes the project"
	@echo ""
	@echo "Frontend Commands:"
	@echo "(this runs on host's NodeJS, not Docker)"
	@echo " 6) make react ................ Starts React dev server"
	@echo "    make react.reset .......... Reinstall & Restart"
	@echo ""
	@echo "    General Utilities"
	@echo "-----------------------------"
	@echo "00) make reset ................ Cleans & reboots the Project"
	@echo ""


# Whatever can be checked before starting the project
_check_boot:
	@if [ ! -f .env ]; then echo "\n\n====== WARNING ======\nLocal '.env' file not found;\nPlease create a '.env' file using the template from '.env.example'\n\n\n"; fi

# Waiting for services to come to life
_check_healthz:
	@until curl -s http://localhost:8080/healthz > /dev/null; do sleep 1; done


# Start all the services binding ports on your machine
# > http://localhost:3000 - Start working on your App
start: _check_boot
	@echo "Starting the Project on Docker..."
	@docker compose up -d
# @$(MAKE) -s -f Makefile _check_healthz

stop:
	@echo "Stopping the Project..."
	@docker compose down

down:
	@echo "Destroying the Project..."
	@docker compose down -v

# Applies any initial state to the project
# (migrations, configurations, ...)
# NOTE: this command is idempotent
# _init:
# 	@echo "Nothing to init."
# init:
# 	@clear
# 	@echo "\n# Initializing...\n"
# 	@$(MAKE) -s -f Makefile _init

# Removes all the application's state
# think twice before running this, but run this as often as possible
# 🔥 like every morning or in between branch switching 🔥
_clear:
	@echo "Nothing to clear."
clear:
	@clear
	@echo "\n# Resetting App State...\n"
	@$(MAKE) -s -f Makefile _clear

# Forces a rebuild of any artifact
build:
	@echo "Pulling Docker images..."
	@docker compose pull
	@echo "Building Docker images..."
	@docker compose build --no-cache

logs:
	@docker compose logs -f

restart: stop start
reset: down build boot
boot: start #init
reboot: down boot


#
# Frontend Only
#

react: react.install react.start

react.install:
	@if [ ! -d ./webapp/node_modules ]; then \
		echo "Installing node_modules..." ; \
		(npm install) ; \
	fi ;

react.start:
	@echo "Starting the Frontend App on local NodeJS..." ;
	(npm run dev) ;

react.clean:
	@echo "Cleaning up frontend dependencies..."
	@rm package-lock.json
	@rm -rf ./node_modules

react.reset: react.clean react










#
# Numeric API
#

1: boot
2: down
3: start
4: stop
5: logs
6: react
00: reset
h: help
