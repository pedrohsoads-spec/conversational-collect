import { UTMParams } from '@/utils/utm';

export interface FormData {
  name: string;
  phone: string;
  email: string;
  course: string;
  utmParams: UTMParams;
  timestamp: string;
}

/**
 * Envia os dados do formulário para o webhook configurado
 */
export const sendToWebhook = async (
  data: FormData,
  webhookUrl: string
): Promise<boolean> => {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return response.ok;
  } catch (error) {
    console.error('Erro ao enviar dados para webhook:', error);
    return false;
  }
};

/**
 * Webhook padrão para Google Sheets (Apps Script)
 * Retorna a URL configurada ou uma URL de exemplo
 */
export const getDefaultWebhookUrl = (): string => {
  // Esta URL deve ser configurada pelo usuário
  // Pode ser um Google Apps Script, n8n, Make, ou qualquer endpoint
  return localStorage.getItem('webhook_url') || '';
};

/**
 * Salva a URL do webhook no localStorage
 */
export const saveWebhookUrl = (url: string): void => {
  localStorage.setItem('webhook_url', url);
};
