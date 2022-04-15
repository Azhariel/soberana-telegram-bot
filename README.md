# Soberana Telegram Bot
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

Servidor do Bot de Telegram do coletivo marxista-leninista Soberana.
O objetivo do bot é postar em um canal de anúncios do Telegram, servindo como um agregador
de informações. O bot deve postar quando membros iniciam lives na Twitch e postam vídeos no Youtube e TikTok,
além de postar diariamente as lives e eventos agendadas para aquele dia a partir do Google Calendar.

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
- [ ] Integração com Twitch
  - [ ] Ativar quando um canal entrar ao vivo
  - [ ] Formatar o nome do canal, título da live e link
  - [ ] Enviar no telegram

![TikTok](https://img.shields.io/badge/TikTok-%23000000.svg?style=for-the-badge&logo=TikTok&logoColor=white)
- [ ] Integração com TikTok
  - [ ] Ativar quando um novo vídeo for postado
  - [ ] Receber o nome do vídeo (?), canal e link
  - [ ] Enviar no telegram

# Links Úteis
- [Telegram API](https://core.telegram.org/bots)
- [YouTube Webhooks](https://developers.google.com/youtube/v3/guides/push_notifications)
- [TikTok API](https://developers.tiktok.com/doc)
- [Google Calendar API](https://developers.google.com/calendar/api/v3/reference)
- [Twitch API](https://dev.twitch.tv/docs/api)
