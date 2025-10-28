import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import ProgressBar from './ProgressBar';
import FormStep from './FormStep';
import { applyPhoneMask, isValidPhone, removePhoneMask } from '@/utils/phoneMask';
import { captureUTMParams, saveUTMParams, getSavedUTMParams } from '@/utils/utm';
import { sendToWebhook, getDefaultWebhookUrl } from '@/services/webhook';

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form data
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('');
  
  // Validation states
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Captura UTM params quando o componente monta
  useEffect(() => {
    const utmParams = captureUTMParams();
    if (Object.keys(utmParams).length > 0) {
      saveUTMParams(utmParams);
    }
  }, []);

  const totalSteps = 4;

  const courses = [
    'Marketing Digital',
    'Gestão de Tráfego',
    'Copywriting',
    'Design Gráfico',
    'Desenvolvimento Web',
    'E-commerce',
    'Gestão de Redes Sociais',
    'Outro',
  ];

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = applyPhoneMask(e.target.value);
    setPhone(masked);
    if (errors.phone) {
      setErrors({ ...errors, phone: '' });
    }
  };

  const handleNext = () => {
    // Validação por etapa
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!name.trim()) {
        newErrors.name = 'Por favor, digite seu nome';
      } else if (name.trim().length < 2) {
        newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
      }
    }

    if (currentStep === 2) {
      if (!phone.trim()) {
        newErrors.phone = 'Por favor, digite seu telefone';
      } else if (!isValidPhone(phone)) {
        newErrors.phone = 'Telefone inválido. Use o formato (99) 99999-9999';
      }
      
      if (!email.trim()) {
        newErrors.email = 'Por favor, digite seu e-mail';
      } else if (!validateEmail(email)) {
        newErrors.email = 'E-mail inválido';
      }
    }

    if (currentStep === 3) {
      if (!course) {
        newErrors.course = 'Por favor, selecione um curso';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setCurrentStep(currentStep + 1);

    // Se chegou na última etapa, processa o envio
    if (currentStep === 3) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const formData = {
      name: name.trim(),
      phone: removePhoneMask(phone),
      email: email.trim(),
      course,
      utmParams: getSavedUTMParams(),
      timestamp: new Date().toISOString(),
    };

    // Tenta enviar para o webhook
    const webhookUrl = getDefaultWebhookUrl();
    
    if (webhookUrl) {
      const success = await sendToWebhook(formData, webhookUrl);
      
      if (success) {
        console.log('Dados enviados com sucesso para o webhook');
      } else {
        console.error('Falha ao enviar dados para o webhook');
        toast.error('Erro ao enviar dados. Por favor, tente novamente.');
        setIsSubmitting(false);
        return;
      }
    } else {
      // Se não há webhook configurado, apenas loga os dados
      console.log('Dados do formulário (webhook não configurado):', formData);
    }

    // Simula processamento
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Redireciona para página de obrigado com parâmetros
      const params = new URLSearchParams({
        nome: name,
        curso: course,
      });
      
      window.location.href = `/obrigado?${params.toString()}`;
    }, 2000);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <FormStep
            title="👋 Para começar, me diga o seu nome."
            description="Vamos iniciar sua jornada de aprendizado!"
          >
            <div>
              <Input
                type="text"
                placeholder="Digite seu nome completo"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                className={`form-input text-lg ${errors.name ? 'form-input-error' : ''}`}
                autoFocus
              />
              {errors.name && (
                <p className="text-destructive text-sm mt-2">{errors.name}</p>
              )}
            </div>
          </FormStep>
        );

      case 2:
        return (
          <FormStep
            title={`Prazer, ${name.split(' ')[0]}! 📱`}
            description="Agora preciso do seu contato para continuarmos"
          >
            <div>
              <Input
                type="tel"
                placeholder="(99) 99999-9999"
                value={phone}
                onChange={handlePhoneChange}
                className={`form-input text-lg ${errors.phone ? 'form-input-error' : ''}`}
                autoFocus
              />
              {errors.phone && (
                <p className="text-destructive text-sm mt-2">{errors.phone}</p>
              )}
            </div>
            <div>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                className={`form-input text-lg ${errors.email ? 'form-input-error' : ''}`}
              />
              {errors.email && (
                <p className="text-destructive text-sm mt-2">{errors.email}</p>
              )}
            </div>
          </FormStep>
        );

      case 3:
        return (
          <FormStep
            title="Perfeito! 🎯"
            description="Qual curso você tem interesse?"
          >
            <div>
              <Select value={course} onValueChange={(value) => {
                setCourse(value);
                if (errors.course) setErrors({ ...errors, course: '' });
              }}>
                <SelectTrigger className={`form-input text-lg ${errors.course ? 'form-input-error' : ''}`}>
                  <SelectValue placeholder="Selecione o curso" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {courses.map((c) => (
                    <SelectItem key={c} value={c} className="cursor-pointer">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.course && (
                <p className="text-destructive text-sm mt-2">{errors.course}</p>
              )}
            </div>
          </FormStep>
        );

      case 4:
        return (
          <FormStep
            title="Tudo pronto! ✨"
            description="Estamos processando suas informações..."
          >
            <div className="flex flex-col items-center justify-center py-8 space-y-6">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-16 w-16 text-primary animate-spin" />
                  <p className="text-lg text-muted-foreground animate-pulse">
                    Aguarde um momento...
                  </p>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-16 w-16 text-accent animate-bounce-in" />
                  <p className="text-lg text-foreground font-medium">
                    Dados enviados com sucesso!
                  </p>
                </>
              )}
            </div>
          </FormStep>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="card-elevated animate-fade-in">
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
          
          {renderStep()}

          {currentStep < 4 && (
            <div className="mt-8">
              <Button
                onClick={handleNext}
                className="w-full btn-primary py-6 text-lg font-semibold group"
                size="lg"
              >
                {currentStep === 3 ? 'Finalizar' : 'Continuar'}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Seus dados estão seguros e protegidos 🔒
        </p>
      </div>
    </div>
  );
};

export default MultiStepForm;
