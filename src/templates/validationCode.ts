import { EmailPayload } from '../interfaces/email';

interface CreateEmailPayloadParams {
    toEmail: string;
    code: string;
    subject: string;
}

export const validationCodeTemplate = ({ toEmail, code, subject }: CreateEmailPayloadParams): EmailPayload => ({
  data: [
    {
      emailTemplate: {
        ccAddresses: [ 'laldanat99@outlook.com' ],
        sandbox: false,
        senderEmail: 'auth@gmail.com',
        senderName: 'Auth',
        subject: subject,
        templateName: 'templateTest',
        toAddresses: [ 'laldanat99@outlook.com' ],
        toEmail: toEmail,
      },
      templateData: {
        code: code,
        logo: 'https://static.vecteezy.com/system/resources/previews/009/973/924/original/cute-kitty-cat-head-cartoon-element-free-png.png',
        message: 'Use este código hasta máximos dentro de los próximos 5 minutos',
        socialNetworks: [
          {
            link: '#',
            title: 'facebook',
            url: 'https://usndw.stripocdn.email/content/assets/img/social-icons/logo-black/facebook-logo-black.png',
          },
          {
            link: '#',
            title: 'X',
            url: 'https://usndw.stripocdn.email/content/assets/img/social-icons/logo-black/twitter-logo-black.png',
          },
          {
            link: '#',
            title: 'instagram',
            url: 'https://usndw.stripocdn.email/content/assets/img/social-icons/logo-black/instagram-logo-black.png',
          },
          {
            link: '#',
            title: 'youtube',
            url: 'https://usndw.stripocdn.email/content/assets/img/social-icons/logo-black/youtube-logo-black.png',
          },
        ],
        title: 'Código de activación de cuenta',
        titleImage: 'https://usndw.stripocdn.email/content/guids/CABINET_a3448362093fd4087f87ff42df4565c1/images/78501618239341906.png',
        unsuscribeLink: '#',
      },
    },
  ],
});