import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Settings as SettingsIcon, Save, Eye, EyeOff } from 'lucide-react';
import { getDefaultWebhookUrl, saveWebhookUrl } from '@/services/webhook';

const Settings = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [showUrl, setShowUrl] = useState(false);

  useEffect(() => {
    setWebhookUrl('https://script.google.com/macros/s/AKfycbxahI34UIWkNVYuiqu77uqnwl10wW_mq8Si6KiVoYQ8I2jbNQZ6FVOB4v6pUo_MwMF-/exec');
  }, []);

  const handleSave = () => {
    if (!webhookUrl.trim()) {
      toast.error('Por favor, insira uma URL válida');
      return;
    }

    try {
      new URL(webhookUrl);
      saveWebhookUrl(webhookUrl);
      toast.success('Configurações salvas com sucesso!');
    } catch {
      toast.error('URL inválida. Verifique e tente novamente.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="card-elevated animate-fade-in">
          <div className="mb-8 flex items-center gap-3">
            <SettingsIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              Configurações do Formulário
            </h1>
          </div>

          <div className="space-y-8">
            {/* Webhook Configuration */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  URL do Webhook
                </h2>
                <p className="text-muted-foreground">
                  Configure o endpoint para onde os dados do formulário serão enviados.
                </p>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <Input
                    type={showUrl ? 'text' : 'password'}
                    placeholder="https://seu-webhook.com/endpoint"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="form-input text-base pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowUrl(!showUrl)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showUrl ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                <Button
                  onClick={handleSave}
                  className="btn-primary"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Configurações
                </Button>
              </div>
            </div>

            {/* Instructions */}
            <div className="p-6 bg-secondary/50 rounded-lg space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                📝 Como configurar o Webhook
              </h3>
              
              <div className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground mb-1">Google Sheets (Apps Script):</p>
                  <ol className="list-decimal list-inside space-y-1 pl-2">
                    <li>Abra uma planilha do Google Sheets</li>
                    <li>Vá em Extensões → Apps Script</li>
                    <li>Cole o código de webhook (disponível na documentação)</li>
                    <li>Deploy como Web App e copie a URL</li>
                  </ol>
                </div>

                <div>
                  <p className="font-medium text-foreground mb-1">n8n ou Make (Integromat):</p>
                  <ol className="list-decimal list-inside space-y-1 pl-2">
                    <li>Crie um novo workflow</li>
                    <li>Adicione um trigger do tipo Webhook</li>
                    <li>Copie a URL do webhook gerada</li>
                    <li>Configure as ações desejadas (salvar em CRM, enviar email, etc)</li>
                  </ol>
                </div>

                <div>
                  <p className="font-medium text-foreground mb-1">Zapier:</p>
                  <ol className="list-decimal list-inside space-y-1 pl-2">
                    <li>Crie um novo Zap</li>
                    <li>Escolha "Webhooks by Zapier" como trigger</li>
                    <li>Selecione "Catch Hook" e copie a URL</li>
                    <li>Configure as ações (Google Sheets, CRM, Email, etc)</li>
                  </ol>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="font-medium text-foreground mb-2">
                  📊 Dados enviados pelo formulário:
                </p>
                <code className="block p-3 bg-background rounded text-xs">
                  {`{
  "name": "Nome do usuário",
  "phone": "11999999999",
  "email": "usuario@email.com",
  "course": "Nome do curso",
  "utmParams": {
    "utm_source": "...",
    "utm_medium": "...",
    "gclid": "..."
  },
  "timestamp": "2025-10-28T..."
}`}
                </code>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="w-full"
            >
              Voltar ao Formulário
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
