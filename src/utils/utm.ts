/**
 * Captura todos os parâmetros UTM e de rastreamento da URL
 */
export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  [key: string]: string | undefined;
}

export const captureUTMParams = (): UTMParams => {
  const params = new URLSearchParams(window.location.search);
  const utmParams: UTMParams = {};

  // Lista de parâmetros para capturar
  const paramsToCapture = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'gclid',
    'fbclid',
  ];

  paramsToCapture.forEach(param => {
    const value = params.get(param);
    if (value) {
      utmParams[param] = value;
    }
  });

  return utmParams;
};

/**
 * Salva os parâmetros UTM no sessionStorage para persistência
 */
export const saveUTMParams = (params: UTMParams): void => {
  sessionStorage.setItem('utm_params', JSON.stringify(params));
};

/**
 * Recupera os parâmetros UTM salvos no sessionStorage
 */
export const getSavedUTMParams = (): UTMParams => {
  const saved = sessionStorage.getItem('utm_params');
  return saved ? JSON.parse(saved) : {};
};
