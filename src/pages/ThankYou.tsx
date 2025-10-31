import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ExternalLink } from 'lucide-react';

const ThankYou = () => {
  const [searchParams] = useSearchParams();
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');

  useEffect(() => {
    setName(searchParams.get('nome') || 'Cliente');
    setCourse(searchParams.get('curso') || 'nosso curso');
  }, [searchParams]);

  // URL do WhatsApp (personalizável)
  const whatsappNumber = '5531989236061'; // Altere para seu número
  const whatsappMessage = `Olá! Acabei de me cadastrar no formulário. Meu nome é ${name} e tenho interesse em ${course}.`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="card-elevated text-center animate-fade-in">
          <div className="mb-8">
            <CheckCircle2 className="h-24 w-24 text-accent mx-auto mb-6 animate-bounce-in" />
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Obrigado, {name}! 🎉
            </h1>
            <p className="text-xl text-muted-foreground mb-2">
              Recebemos suas informações com sucesso!
            </p>
            <p className="text-lg text-muted-foreground">
              Em breve entraremos em contato sobre <strong>{course}</strong>.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => window.open(whatsappUrl, '_blank')}
              className="w-full btn-accent py-6 text-lg font-semibold"
              size="lg"
            >
              Falar no WhatsApp agora
              <ExternalLink className="ml-2 h-5 w-5" />
            </Button>

            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="w-full py-6 text-lg"
              size="lg"
            >
              Voltar ao início
            </Button>
          </div>

          <div className="mt-8 p-6 bg-secondary/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              📧 Também enviamos um e-mail de confirmação.<br />
              Verifique sua caixa de entrada (e spam, só por precaução).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
