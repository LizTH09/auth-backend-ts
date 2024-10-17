export interface SocialNetwork {
    link: string;
    title: string;
    url: string;
}

export interface EmailTemplate {
    ccAddresses: string[];
    sandbox: boolean;
    senderEmail: string;
    senderName: string;
    subject: string;
    templateName: string;
    toAddresses: string[];
    toEmail: string;
}

export interface TemplateData {
    code: string;
    logo: string;
    message: string;
    socialNetworks: SocialNetwork[];
    title: string;
    titleImage: string;
    unsuscribeLink: string;
}

export interface EmailPayload {
    data: Array<{
        emailTemplate: EmailTemplate;
        templateData: TemplateData;
    }>;
}