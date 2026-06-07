# CampusFlow - Gonçalo Pinto, AMI, ISEL 2026

CampusFlow é um protótipo funcional desenvolvido para a unidade curricular de Aplicações Multimédia Interativas.

A aplicação permite consultar tempos de espera em locais do campus do ISEL, reportar filas, criar alertas e receber notificações quando uma fila baixa abaixo de um limite configurado.

## Tecnologias

- React Native
- Expo
- Expo Router
- TypeScript
- Expo Camera
- Expo Location
- Expo Haptics

## Funcionalidades

- Ecrã inicial com identidade visual da aplicação
- Consulta de tempos de espera em locais do campus
- Filtros por menor espera, proximidade e dados recentes
- Pedido de permissão de localização ao usar o filtro "Mais perto"
- Detalhe de cada local com histórico recente
- Reporte de fila com seleção de local e tempo estimado
- Confirmação do reporte através da câmara e leitura real de QR code
- Criação e cancelamento de alertas
- Alertas ativos, alertas passados e notificações
- Feedback visual, textual e háptico/vibração
- Registo de logs de interação para testes de usabilidade
- Ecrã de estatísticas com dados quantitativos dos testes

## Inputs utilizados

A aplicação usa diferentes formas de input:

- Toque, através de botões, cartões, filtros e opções de escolha
- Câmara, usada para ler QR codes reais no fluxo de reporte
- Localização/GPS, usada no filtro "Mais perto"

No protótipo, qualquer QR code válido confirma o reporte. A localização é pedida e registada, mas a ordenação por proximidade é mantida de forma controlada/simulada.

## Feedback utilizado

- Feedback visual através de cores, cartões, estados e popups
- Feedback textual através de mensagens, estados e notificações
- Feedback háptico/vibração quando um alerta é recebido

## Como correr

Instalar dependências:

```bash
npm install
```

Iniciar o projeto:
```
npx expo start
```

Depois, abrir com:

- Expo Go no telemóvel
- Android Emulator
- iOS Simulator
- Browser, através da opção web do Expo

## Permissões

A aplicação pode pedir permissões para:

- Câmara, para confirmar reportes através de QR code
- Localização, para simular a ordenação por proximidade no campus
