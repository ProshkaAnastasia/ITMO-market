# ITMO-market
Этот проект представляет собой сервер на Spring, позволяющий выполнять HTTP-запросы для интернет магазина.

## Содержание

- [Стек используемых технологий](#стек-используемых-технологий)
- [Инструкция к сборке](#инструкция-к-сборке)
- [Инструкция по установке переменных окружения](#инструкция-по-установке-переменных-окружения)
- [Настройка Workspace в Visual Studio Code](#настройка-workspace-в-visual-studio-code)

## Стек используемых технологий

## Настройка Workspace в Visual Studio Code

В Visual Studio Code могут возникнуть проблемы с автоподсветкой из-за возможного несовпадения версий JVM, используемых VSCode и в самом проекте. Поскольку в нашем проекте используется ```Java 21```, необходимо указать путь к ней в файлах окружения ```.vscode```.

<b>launch.json</b>
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "kotlin",
            "request": "launch",
            "name": "Kotlin Application",
            "projectRoot": "${workspaceFolder}",
            "mainClass": "itmo.market.MarketApplicationKt"
        }
    ]
}
```

<b>settings.json</b>
```json
{
    "java.configuration.updateBuildConfiguration": "automatic",
    "kotlin.compiler.jvm.target": "21",
    "java.configuration.runtimes": [
        {
            "name": "JavaSE-<your-jdk-version>",
            "path": "<path-to-your-jdk>", 
            "default": true
        }
    ]
}
```

Путь к своему JDK можно получить, исполнив команду ```/usr/libexec/java_home```.

## Инструкция к сборке

Рекомендуется запускать проект в docker-контейнере.

Для этого следует вызвать ```docker compose up``` из корневой директории проекта. 

При этом логи всех используемых контейнеров будут видны в терминале. Отдельный контейнер можно запустить через ```docker compose up <service-name>```. 

Имя сервиса следует брать из файла ```docker-compose.yml``` (на данный момент существуют два сервиса: ```postgres``` и ```market```).

Для остановки контейнера необходимо вызвать ```docker compose down [<container-name or ID>]```.

Важное замечание: для контейнера ```postgres``` создается volume, который не удаляется при удалении контейнера. В случае, если нужно заново создать кластер postgres, сначала необходимо вызвать ```docker volume rm market_postgres_data``` и только после этого вызывать ```docker compose up```.

Для запуска контейнеров в фоновом режиме следует вызывать команду ```docker compose up [<service-name>] -d```. Информация о сборке будет отображена в терминале.

## Инструкция по установке переменных окружения

В проекте используются следующие переменные по умолчанию:

- POSTGRES_DB
- POSTGRES_USER
- POSTGRES_PASSWORD
- POSTGRES_PORT
- SERVER_PORT
- APP_NAME

Для изменения их значений необходимо создать файл ```.env``` в корневой директории проекта и переопределить их значения в формате ```<variable_name>=<variable_value>```. Кавычки для строковых значений ставить не нужно.


