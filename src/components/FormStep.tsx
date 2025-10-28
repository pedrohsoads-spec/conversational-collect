import { ReactNode } from 'react';

interface FormStepProps {
  children: ReactNode;
  title: string;
  description?: string;
}

const FormStep = ({ children, title, description }: FormStepProps) => {
  return (
    <div className="animate-slide-up">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          {title}
        </h2>
        {description && (
          <p className="text-muted-foreground text-lg">
            {description}
          </p>
        )}
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};

export default FormStep;
