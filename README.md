# Soberana Telegram Bot
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

Servidor do Bot de Telegram do coletivo marxista-leninista Soberana.
O objetivo do bot é postar em um canal de anúncios do Telegram, servindo como um agregador
de informações. O bot deve postar quando membros iniciam lives na Twitch e postam vídeos no Youtube e TikTok,
além de postar diariamente as lives e eventos agendadas para aquele dia a partir do Google Calendar.

# Table of Contents
- [To Do](#to-do)
- [Desafios](#desafios)
  - [Google e OAuth2](#google-e-oauth2)
  - [Twitch e SSL](#twitch-e-ssl)
  - [Twitch e Subscribed Events](#twitch-e-subscribed-events)
- [Links Úteis](#links-úteis)

# To do
![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)
- [x] Enviar mensagens para um canal especificado no Telegram
  - [ ] Enviar mensagens a partir de estímulo externo (api/webhook)

![Google](https://img.shields.io/badge/google-4285F4?style=for-the-badge&logo=google&logoColor=white)
- [ ] Integração com Google Calendar
  - [x] Acessar o calendário Soberana
  - [x] Retornar as lives do dia
  - [x] Formatar as lives do dia
  - [x] Enviar a agenda diária no telegram
  - [ ] .. automaticamente
  - [ ] Guardar os tokens (access e refresh) e renova-los conforme necessário

![YouTube](https://img.shields.io/badge/YouTube-%23FF0000.svg?style=for-the-badge&logo=YouTube&logoColor=white)
- [ ] Integração com Youtube
  - [ ] Ativar quando um novo vídeo for postado em algum canal da Soberana
  - [ ] Retornar o título, canal e link
  - [ ] Formatar as informações e postar no Telegram

![Twitch](https://img.shields.io/badge/Twitch-%239146FF.svg?style=for-the-badge&logo=Twitch&logoColor=white)
- [x] Integração com Twitch
  - [x] Ativar quando um canal entrar ao vivo
  - [x] Formatar o nome do canal, título da live e link
  - [x] Enviar no telegram

![TikTok](https://img.shields.io/badge/TikTok-%23000000.svg?style=for-the-badge&logo=TikTok&logoColor=white)
- [ ] Integração com TikTok
  - [ ] Ativar quando um novo vídeo for postado
  - [ ] Receber o nome do vídeo (?), canal e link
  - [ ] Enviar no telegram

# Desafios
## Google e OAuth2
As APIs da Google utilizam OAuth2 para autorização, que envolvem um método manual para autorização inicial e a manutenção de um token de acesso com um token de atualização (access token e refresh token respectivamente). Atualmente, ambos tokens são hardcoded em variáveis de ambiente (`.env`), o que não é uma solução a longo prazo, pois mesmo podendo conseguir 'infinitos' tokens de acesso através do token de atualização, eventualmente o token de atualização também expira e deve ser renovado.

O servidor precisa, de alguma forma segura, armazenar ambos os tokens e atualiza-los no banco de dados quando os mesmos são atualizados pela lógica do servidor.

## Twitch e SSL
Dada a mudança no sistema de webhooks da Twitch (utilizando agora os endpoints `EventSub`), há obrigatoriedade do servidor utilizar o protocolo SSL - o que, por sua vez, requer que o domínio possua o devido certificado de autoridade. Em fase de testes, estou utilizando [ngrok](https://ngrok.com/), que cria uma URL temporária com o devido certificado, mas essa solução é inviável a nível de produção - tanto por não rodar mais em localhost, quanto por a URL externa ser temporária na versão gratuita.

Uma das alternativas, que exigem mais estudo, é alguma forma de hospedar na AWS com suporte a certificado SSL, mas não possuo expierência nesse tipo de deploy.

## Twitch e Subscribed Events
Para subscrever a eventos na Twitch, é enviado uma requisição POST incluindo a URL de callback para esses eventos. Enquanto se utilizar URL variável para expor o servidor via ngrok, mesmo implementada através do próprio node.js (e, portanto, atualizável na lógica do código), a mudança de URL deve também pegar todos eventos já subscritos, desescrever-se e reescrever-se passando a nova URL. Todas essas funções já estão implementadas em algum nível no código, mas é necessário criar essa linha de ligação entre elas. 

# Links Úteis
- [Telegram API](https://core.telegram.org/bots)
- [YouTube Webhooks](https://developers.google.com/youtube/v3/guides/push_notifications)
- [TikTok API](https://developers.tiktok.com/doc)
- [Google Calendar API](https://developers.google.com/calendar/api/v3/reference)
- [Twitch API](https://dev.twitch.tv/docs/api)
