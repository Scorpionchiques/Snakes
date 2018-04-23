:: Run gateway
cd %~dp0
start "Gateway" cmd /k node gateway.js
:: Run services
cd services
start "authorization_service" cmd /k node authorization_service.js
start "moving_service" cmd /k node moving_service.js
start "highscore_service" cmd /k node highscore_service.js.js
:: Load web-client
start http://localhost:8080