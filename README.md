# dc-error-reporting-js-sdk
SDK para integrar o sistema de alerta de erros com Javascript

O sistema irá notificar os analistas da DC

## Instalação

   1. Usando o npm, execute o seguinte comando:
      
      ```
      npm install https://github.com/repodc/dc-error-reporting-js-sdk.git
      ```

  Na necessidade de atualizar o pacote, rode o seguinte comando:
  
  ```
  npm update dc-error-reporting-js-sdk
  ```
   

## Passo a Passo para Integrar com Node Express

1. Variáveis de ambiente (.env)

   É necessário ter as seguintes variáveis de ambiente configuradas:
   ```properties
   APP_ENV=homologation # Se o valor for "local" não será enviado as notificações
   DC_ERROR_REPORTING_TOKEN="token_de_acesso" # Pegue o token de acesso com o staff da DC
   ```

   **IMPORTANTE:** durante o desenvolvimento local sempre deixe o valor de **APP_ENV** igual à **"local"** para não enviar notificações ao ocorrer erros.
   

2. Adicionar error handler no projeto

   Gere uma instância da classe **DcErrorReportingSdk** e execute o método **send()**. No express o melhor lugar para fazer isso é no middleware para erros:

   ```js
    app.use((err, req, res, next) => {
        const statusCode = err.statusCode || 500;
        const errorMessage = err.message || 'Internal Server Error';

        const DcErrorReportingSdk = require('dc-error-reporting-js-sdk');
        const dcErrorReportingSdk = new DcErrorReportingSdk('Nome do Sistema', process.env.APP_ENV, process.env.DC_ERROR_REPORTING_TOKEN);
        dcErrorReportingSdk.send(err, req.protocol + '://' + req.get('host') + req.originalUrl);

        res.status(statusCode).json({ error: errorMessage });
    });
   ```

   Ao instanciar a classe **DcErrorReportingSdk** informe o nome do sistema corretamente no primeiro parâmetro.
   Observe que o segundo parâmetro do método **send()** é a url requesitada, esse parâmetro é opcional mas é recomendado sempre incluir ele.

4. Caso haja a necessidade de reportar erros que estão contidos em um bloco de **try ... catch** basta instanciar a classe novamente, ou importar de algum modulo/contexto global

   ```php
   try {
      //code...
   } catch (e) {
       const DcErrorReportingSdk = require('dc-error-reporting-js-sdk');
       const dcErrorReportingSdk = new DcErrorReportingSdk('Nome do Sistema', process.env.APP_ENV, process.env.DC_ERROR_REPORTING_TOKEN);
       dcErrorReportingSdk.send(err, req.protocol + '://' + req.get('host') + req.originalUrl);
   }
   ```


E é isso, após configurado, qualquer erro / exceção não tratado pelo sistema será notificado aos analistas da DC

## Visualizar log de erros

Para acessar o log com os erros ocorridos, visite a url https://dc-error-reporting.dctec.dev/api/error_report/slug-sistema

Substitua slug-sistema pelo nome do sistema no formato slug (letras minúsculas, sem caracteres especiais e substituindo espaço por "-")

Exemplo: o nome do sistema é **Bablepet ERP (API)** então o slug ficará **bablepet-erp-api**

## Testes

Ao realizar os testes do SDK durante o desenvolvimento, altere o valor da variável de ambiente **APP_ENV** para "test":

Dessa forma nenhum analista será notificado quando houver erro, mas o log do erro aparecerá em https://dc-error-reporting.dctec.dev/api/error_report/slug-sistema/test

Note que ao final da url foi adicionado o **/test**, neste endpoint será mostrado apenas os erros do ambiente de teste.

